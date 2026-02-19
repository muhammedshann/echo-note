from django.urls import path, re_path
from . import consumers

websocket_urlpatterns = [
    path('ws/live/', consumers.LiveTranscriptionConsumer.as_asgi()),
    re_path(r'ws/transcription/(?P<room_name>\w+)/$', consumers.TranscriptionConsumer.as_asgi())
]