## Storytracker
---
## UPDATE April 23, 2023
We are no longer maintaining this project and therefore we have shut it down. You can see how it worked here: https://twitter.com/C51Alix/status/1636868425896308737?s=20. DM me on Twitter if you have any questions

The way to compare how news is protrayed on homepages
https://homepage-compare.vercel.app/
<img width="1417" alt="image" src="https://user-images.githubusercontent.com/62365251/222364499-63e159f0-0639-40d7-a3bc-229910690771.png">
## Getting Started

Copy `.env.local` from Notion into parent directory

Install Node modules
```bash
yarn
```

Run the development server:

```bash
yarn dev
```

Install Python dependencies
```bash
pip install -r server/requirements.txt
```

Run the Flask API:
```bash
python server/run.py
```

Endpoints can be reached at `127.0.0.1:8000`
