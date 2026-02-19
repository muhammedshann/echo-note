from supabase import create_client
from django.conf import settings

def get_supabase_client():
    url = settings.SUPABASE_URL
    key = settings.SUPABASE_KEY
    return create_client(url, key)

def download_from_supabase(path: str, local_path: str):
    client = get_supabase_client()
    # download the file
    data = client.storage.from_("media").download(path)
    with open(local_path, "wb") as f:
        f.write(data)
