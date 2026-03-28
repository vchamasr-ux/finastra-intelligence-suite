import json
import urllib.parse
import urllib.request
import re
import time
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

data_path = 'finastra_data.json'
with open(data_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

def get_exact_url(query):
    try:
        url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote_plus(query)
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/114.0.0.0 Safari/537.36'}
        )
        time.sleep(1) # rate limiting
        with urllib.request.urlopen(req, context=ctx) as response:
            html = response.read().decode('utf-8')
            
            # Find all absolute URLs to finastra.com that aren't search or contact
            links = re.findall(r'href=[\'"]([^\'"]+finastra\.com[^\'"]+)[\'"]', html)
            for link in links:
                # Need to check if DDG wraps it in a redirect
                if "uddg=" in link:
                    link = urllib.parse.unquote(link.split("uddg=")[1].split("&")[0])
                if 'finastra.com' in link and 'finastra.com/search' not in link and 'finastra.com/contact' not in link:
                    return link
    except Exception as e:
        print(f"Error on {query}: {e}")
    return None

print("Scanning Customers...")
for cust in data.get('customers', []):
    name = cust.get('Customer', '')
    print(f"Scanning {name}...", end=" ", flush=True)
    q = f'site:finastra.com "{name}" "case study"'
    url = get_exact_url(q)
    if url:
        print(f"[FOUND] {url}")
        cust['Link'] = url
        continue
    
    q2 = f'site:finastra.com "{name}" "press release"'
    url2 = get_exact_url(q2)
    if url2:
        print(f"[FOUND PR] {url2}")
        cust['Link'] = url2
    else:
        print(f"[FAILED] Using DDG search URL")
        cust['Link'] = "https://duckduckgo.com/?q=" + urllib.parse.quote_plus(q)

print("\nScanning Use Cases...")
for uc in data.get('useCases', []):
    name = uc.get('Priority use case', '')
    print(f"Scanning {name}...", end=" ", flush=True)
    q = f'site:finastra.com "{name}"'
    url = get_exact_url(q)
    if url:
        print(f"[FOUND] {url}")
        uc['Link'] = url
    else:
        print(f"[FAILED] Using DDG search URL")
        uc['Link'] = "https://duckduckgo.com/?q=" + urllib.parse.quote_plus(q)

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("\nDone!")
