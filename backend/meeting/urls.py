from django.urls import path
from . import views
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('upload/', views.upload_file, name='upload_file'),
    path("api/download-youtube/", views.YouTubeDownloadView.as_view(), name="youtube-download"),
    path('api/download-mp4/', views.VideoFileDownloadView.as_view(), name='download_mp4_video'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
