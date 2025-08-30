import whisper
import tempfile
import os
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
import logging

logger = logging.getLogger(__name__)

# Load model once at module level
model = whisper.load_model("base")

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