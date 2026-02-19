import whisper
import tempfile
import os
import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
import logging
from .supabase_client import download_from_supabase
from pydub import AudioSegment
from urllib.parse import parse_qs
import urllib.parse
import shutil
from django.conf import settings
import wave
import subprocess


logger = logging.getLogger(__name__)

_whisper_model = None

def get_whisper_model():
    global _whisper_model
    if _whisper_model is None:
        logger.info("Loading Whisper tiny model...")
        _whisper_model = whisper.load_model("tiny")
    return _whisper_model

# Load model once at module level
# model = whisper.load_model("tiny")

class LiveTranscriptionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.audio_buffer = bytearray()
        self.chunk_count = 0
        self.temp_dir = tempfile.mkdtemp()
        self.last_transcription = ""
        self.window_size = 10 * 1024 * 1024  # 10MB window
        logger.info("WebSocket connected")

    async def disconnect(self, close_code):
        # Clean up temporary files
        if hasattr(self, 'temp_dir'):
            try:
                for file in os.listdir(self.temp_dir):
                    os.remove(os.path.join(self.temp_dir, file))
                os.rmdir(self.temp_dir)
            except Exception as e:
                logger.error(f"Error cleaning up temp files: {e}")
        logger.info("WebSocket disconnected")

    async def receive(self, text_data=None, bytes_data=None):
        if bytes_data:
            try:
                # Add new audio data to buffer
                self.audio_buffer.extend(bytes_data)
                self.chunk_count += 1
                
                # Maintain sliding window
                if len(self.audio_buffer) > self.window_size:
                    # Keep only recent audio (last 80% of window)
                    keep_size = int(self.window_size * 0.8)
                    self.audio_buffer = self.audio_buffer[-keep_size:]
                
                # Process every few chunks for better performance
                if self.chunk_count % 2 == 0:  # Process every 2nd chunk
                    await self.process_audio()
                    
            except Exception as e:
                logger.error(f"Error processing audio: {e}")
                await self.send(text_data=f"Error: {str(e)}")

    async def process_audio(self):
        if len(self.audio_buffer) < 8192:  # Need reasonable amount of audio
            return
            
        try:
            # Create temp file for current audio window
            temp_file_path = os.path.join(self.temp_dir, f"audio_window_{self.chunk_count}.webm")
            
            # Write current audio window to file
            with open(temp_file_path, 'wb') as f:
                f.write(self.audio_buffer)
            
            # Transcribe in a separate thread
            def transcribe_sync():
                try:
                    model = get_whisper_model()
                    result = model.transcribe(
                        temp_file_path, 
                        fp16=False,
                        language="en",
                        task="transcribe",
                        no_speech_threshold=0.6,
                        logprob_threshold=-1.0,
                        compression_ratio_threshold=2.4
                    )
                    return result.get("text", "").strip()
                except Exception as e:
                    logger.error(f"Transcription error: {e}")
                    return ""
            
            # Run transcription in thread pool
            loop = asyncio.get_event_loop()
            full_transcription = await loop.run_in_executor(None, transcribe_sync)
            
            # Extract only new text (simple approach)
            if full_transcription and len(full_transcription) > 1:
                new_text = self.extract_new_text(full_transcription)
                if new_text:
                    await self.send(text_data=new_text)
                    self.last_transcription = full_transcription
            
            # Clean up temp file
            try:
                os.remove(temp_file_path)
            except:
                pass
                
        except Exception as e:
            logger.error(f"Error in process_audio: {e}")
    
    def extract_new_text(self, current_transcription):
        """Extract only the new part of transcription"""
        if not self.last_transcription:
            return current_transcription
        
        # Simple approach: if current text starts with last text, return the difference
        if current_transcription.startswith(self.last_transcription):
            new_part = current_transcription[len(self.last_transcription):].strip()
            return new_part
        
        # If transcription changed completely, return it (might be correction)
        return current_transcription
    

def download_from_local_or_supabase(file_path, local_destination):
    try:
        local_file_path = os.path.join(settings.MEDIA_ROOT, file_path)
        if os.path.exists(local_file_path):
            shutil.copy2(local_file_path, local_destination)
            print(f"Copied local file: {local_file_path} -> {local_destination}")
            return True
        else:
            print(f"File not found locally, trying Supabase: {file_path}")
            download_from_supabase(file_path, local_destination)
            return True
    except Exception as e:
        raise Exception(f"Failed to get file from local or Supabase: {str(e)}")

    

CHUNK_SECONDS = 30

    
class TranscriptionConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        await self.accept()

        query_params = parse_qs(self.scope["query_string"].decode())
        self.file_path = query_params.get("supabase_path", [None])[0]

        if self.file_path:
            self.file_path = urllib.parse.unquote(self.file_path)

        if not self.file_path:
            await self.send_json({"error": "No file path provided"})
            await self.close()
            return

        self.transcription_task = asyncio.create_task(
            self.run_transcription(self.file_path)
        )

    async def disconnect(self, close_code):
        if hasattr(self, "transcription_task") and not self.transcription_task.done():
            self.transcription_task.cancel()

    async def send_json(self, data):
        await self.send(text_data=json.dumps(data))

    # ✅ Proper ffmpeg subprocess conversion
    def detect_and_convert_audio(self, input_path, output_path):
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"Input file not found: {input_path}")

        command = [
            "ffmpeg",
            "-y",
            "-i", input_path,
            "-ac", "1",
            "-ar", "16000",
            "-f", "wav",
            output_path
        ]

        subprocess.run(command, check=True)

        if not os.path.exists(output_path):
            raise RuntimeError("FFmpeg conversion failed")

    def transcribe_chunk(self, model, file_path):
        return model.transcribe(file_path, language="en", fp16=False)

    async def run_transcription(self, file_path: str):
        try:
            with tempfile.TemporaryDirectory() as tmpdir:

                ext = os.path.splitext(file_path)[-1] or ".tmp"
                local_file = os.path.join(tmpdir, f"input{ext}")

                success = download_from_local_or_supabase(file_path, local_file)
                if not success:
                    await self.send_json({"error": f"File not found: {file_path}"})
                    return

                audio_path = os.path.join(tmpdir, "audio.wav")

                await asyncio.get_event_loop().run_in_executor(
                    None, self.detect_and_convert_audio, local_file, audio_path
                )

                audio = AudioSegment.from_wav(audio_path)
                duration_ms = len(audio)

                if duration_ms == 0:
                    await self.send_json({"error": "Converted audio has no duration"})
                    return

                CHUNK_MS = 30 * 1000
                total_chunks = (duration_ms + CHUNK_MS - 1) // CHUNK_MS

                # ✅ Use global lazy loader (not class-level duplicate)
                model = await asyncio.get_event_loop().run_in_executor(
                    None, get_whisper_model
                )

                for chunk_index in range(total_chunks):

                    start_ms = chunk_index * CHUNK_MS
                    end_ms = min(start_ms + CHUNK_MS, duration_ms)

                    chunk = audio[start_ms:end_ms]
                    chunk_file = os.path.join(tmpdir, f"chunk_{chunk_index}.wav")
                    chunk.export(chunk_file, format="wav")

                    result = await asyncio.get_event_loop().run_in_executor(
                        None, self.transcribe_chunk, model, chunk_file
                    )

                    text = result.get("text", "").strip()

                    if text:
                        progress = round((end_ms / duration_ms) * 100, 2)
                        await self.send_json({
                            "text": text,
                            "progress": progress
                        })

                await self.close()

        except Exception as e:
            await self.send_json({"error": f"Transcription failed: {str(e)}"})
            await self.close()


import yt_dlp
def downloadVideo(url, output_dir="media/downloads"):
    os.makedirs(output_dir, exist_ok=True)
    
    ydl_opts = {
        # CHANGE 1: Use a more flexible format string
        'format': 'm4a/bestaudio/best', 
        'outtmpl': f"{output_dir}/%(id)s.%(ext)s",
        'cookiesfrombrowser': ('chrome',),
        'noplaylist': True,
        # CHANGE 2: Add 'quiet' and 'no_warnings' to keep logs clean
        'quiet': False,
        # CHANGE 3: Add these specific arguments to bypass bot detection
        'nocheckcertificate': True,
        'ignoreerrors': False,
        'logtostderr': False,
        'addheader': [
            'Accept-Language: en-US,en;q=0.9',
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        ],
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        # yt_dlp will have converted it to .mp3 because of the postprocessor
        return os.path.join(output_dir, f"{info['id']}.mp3")