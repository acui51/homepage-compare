import os


def load_credentials():
    with open(os.path.join(os.path.join(os.path.dirname(__file__), ".."), ".env.local")) as f:
        d = {}
        for line in f:
            if len(line.strip()) == 0 or line.startswith("#"):
                continue
            key, value = line.split("=")
            d[key] = value.strip()

        return d["NEXT_PUBLIC_SUPABASE_URL"], d["NEXT_PUBLIC_SUPABASE_ANON_KEY"]
