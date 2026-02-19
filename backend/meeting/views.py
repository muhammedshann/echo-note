# views.py
import os
import time
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import re
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
import yt_dlp
import requests


@csrf_exempt
def upload_file(request):
    if request.method == "POST" and request.FILES.get("file"):
        file_obj = request.FILES["file"]
        
        # Create the same path structure as frontend expects
        timestamp = int(time.time() * 1000)  # JavaScript Date.now() equivalent
        file_name = f"{timestamp}_{file_obj.name}"
        file_path = f"uploads/{file_name}"
        
        print(f"=== UPLOAD DEBUG ===")
        print(f"Original filename: {file_obj.name}")
        print(f"Generated filename: {file_name}")
        print(f"File path: {file_path}")
        print(f"MEDIA_ROOT: {settings.MEDIA_ROOT}")
        
        try:
            # Create uploads directory if it doesn't exist
            upload_dir = os.path.join(settings.MEDIA_ROOT, 'uploads')
            full_file_path = os.path.join(settings.MEDIA_ROOT, file_path)
            
            print(f"Upload directory: {upload_dir}")
            print(f"Full file path: {full_file_path}")
            
            # Create directory
            os.makedirs(upload_dir, exist_ok=True)
            print(f"Upload directory created/exists: {os.path.exists(upload_dir)}")
            
            # Save file locally
            with open(full_file_path, 'wb+') as destination:
                for chunk in file_obj.chunks():
                    destination.write(chunk)
            
            print('-------------------------')
            
            # Verify file was saved
            if os.path.exists(full_file_path):
                file_size = os.path.getsize(full_file_path)
                print(f"File saved successfully: {file_size} bytes")
            else:
                print("ERROR: File was not saved!")
                return JsonResponse({"error": "File was not saved"}, status=500)
            
            file_url = f"{request.build_absolute_uri('/media/')}{file_path}"
            print(f"File URL: {file_url}")
            print(f"Returning path: {file_path}")
            print(f"=== END UPLOAD DEBUG ===")
            
            return JsonResponse({
                "url": file_url, 
                "path": file_path,
                "message": "File uploaded successfully",
                "debug_info": {
                    "full_path": full_file_path,
                    "exists": os.path.exists(full_file_path),
                    "size": os.path.getsize(full_file_path) if os.path.exists(full_file_path) else 0
                }
            })
            
        except Exception as e:
            print(f"Upload error: {str(e)}")
            return JsonResponse({"error": f"Upload failed: {str(e)}"}, status=500)

    return JsonResponse({"error": "No file provided"}, status=400)

class YouTubeDownloadView(APIView):
    def extract_video_id(self, url):
        if not url: return None
        pattern = r'(?:v=|\/|be\/|shorts\/|embed\/)([0-9A-Za-z_-]{11})'
        match = re.search(pattern, str(url))
        return match.group(1) if match else None

    def post(self, request):
        url = request.data.get("url")
        video_id = self.extract_video_id(url)
        
        if not video_id:
            return Response({"error": "Invalid Video ID"}, status=200)

        try:
            # The correct, modern method
            api = YouTubeTranscriptApi()
            transcript_list = api.fetch(video_id)
            
            # FIX: Use dot notation (.text) instead of bracket notation (['text'])
            full_text = " ".join([item.text for item in transcript_list])
            
            return Response({
                "status": "success",
                "text": full_text
            }, status=200)

        except (TranscriptsDisabled, NoTranscriptFound):
            return Response({
                "error": "This video does not have captions enabled. Try a different video."
            }, status=200)
            
        except Exception as e:
            return Response({
                "error": "Transcription failed.",
                "details": str(e)
            }, status=200)
 
class VideoFileDownloadView(APIView):
    def post(self, request):
        url = request.data.get("url")
        if not url:
            return Response({"error": "No URL found"}, status=400)

        # 2026 Optimized configuration
        ydl_opts = {
            # This specific string finds the best single file with both video and audio
            'format': 'best[ext=mp4]/best', 
            'quiet': True,
            'no_warnings': True,
            # 'android' client is the most stable for progressive MP4 URLs
            'extractor_args': {
                'youtube': {
                    'player_client': ['android'],
                    'skip': ['webpage', 'hls', 'dash']
                }
            },
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                # Extracting only the metadata
                info = ydl.extract_info(url, download=False)
                
                # Retrieve the direct URL from the formats list
                direct_url = info.get('url')
                
                # Fallback: find the first format that has a URL
                if not direct_url and 'formats' in info:
                    for f in reversed(info['formats']):
                        if f.get('vcodec') != 'none' and f.get('acodec') != 'none' and f.get('url'):
                            direct_url = f.get('url')
                            break

                if not direct_url:
                    return Response({"error": "Direct Link generation failed."}, status=200)

                return Response({
                    "status": "success",
                    "download_url": direct_url,
                    "title": info.get('title')
                }, status=200)

        except Exception as e:
            # We print the error to your terminal for debugging
            print(f"Download Error: {str(e)}")
            return Response({
                "error": "YouTube blocked the extraction. Try again in a moment.",
                "details": str(e)
            }, status=200)