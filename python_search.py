import json
import time
from googlesearch import search

data_path = 'finastra_data.json'

with open(data_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

def get_exact_url(query):
    try:
        # Pause to avoid rate limits
        time.sleep(2)
        # Search using python googlesearch
        results = search(query, num_results=3, lang="en")
        for url in results:
            if 'finastra.com' in url and 'finastra.com/search' not in url and 'finastra.com/contact' not in url:
                return url
    except Exception as e:
        print(f"Error on {query}: {e}")
    return None

print("Starting Google Search scraper...")
for i, cust in enumerate(data.get('customers', [])):
    name = cust.get('Customer', '')
    print(f"Scanning {name}... ", end="", flush=True)
    q = f'site:finastra.com "{name}" "case study"'
    url = get_exact_url(q)
    if url:
        print(f"[FOUND] {url}")
        cust['Link'] = url
        continue
    
    print(f"[NOT FOUND] falling back to press release...")
    q2 = f'site:finastra.com "{name}" "press release"'
    url2 = get_exact_url(q2)
    if url2:
        print(f"  -> [FOUND PR] {url2}")
        cust['Link'] = url2
    else:
        print(f"  -> [FAILED] Defaulting to DDG.")
        # We already wrote Duckduckgo search queries to this file previously, but let's be safe.
        import urllib.parse
        cust['Link'] = f"https://duckduckgo.com/?q={urllib.parse.quote_plus(q)}"

print("Scanning Use Cases...")
for i, uc in enumerate(data.get('useCases', [])):
    name = uc.get('Priority use case', '')
    print(f"Scanning {name}... ", end="", flush=True)
    q = f'site:finastra.com "{name}"'
    url = get_exact_url(q)
    if url:
        print(f"[FOUND] {url}")
        uc['Link'] = url
    else:
        print(f"[FAILED] Defaulting to DDG.")

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Data saved.")
