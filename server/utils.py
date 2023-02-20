import os


def load_credentials():
    with open(os.path.join(os.path.join(os.path.dirname(__file__), ".."), ".env.local")) as f:
        next(f)
        supabase_url = f.readline().split("=")[1].strip()
        supabase_key = f.readline().split("=")[1].strip()

    return supabase_url, supabase_key