import json
import urllib.request
import urllib.parse
from html.parser import HTMLParser
import time
import re

class DuckDuckGoParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_result = False
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            attrs_dict = dict(attrs)
            if 'class' in attrs_dict and 'result__url' in attrs_dict['class']:
                href = attrs_dict.get('href', '')
                if href:
                    self.links.append(href)

def search_ddg(query):
    try:
        url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(query)
        req = urllib.request.Request(
            url, 
            data=None, 
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        )
        response = urllib.request.urlopen(req)
        html = response.read().decode('utf-8')
        
        parser = DuckDuckGoParser()
        parser.feed(html)
        
        for link in parser.links:
            # Clean up the link (DuckDuckGo sometimes formats them oddly in html version)
            # Find the actual finastra link
            if 'finastra.com' in link:
                return "https://" + link.strip().replace(' ', '') if not link.startswith('http') else link
                
        # If no link parsed properly, let's just regex finastra.com links
        matches = re.findall(r'href="([^"]*finastra\.com[^"]*)"', html)
        for m in matches:
            if 'uddg=' in m:
                # Decode duckduckgo redirect
                actual = urllib.parse.unquote(m.split('uddg=')[1].split('&')[0])
                return actual
            if m.startswith('http'):
                return m
            
        return ""
    except Exception as e:
        print(f"Error searching for {query}: {e}")
        return ""

finastra_data_path = 'finastra_data.json'
with open(finastra_data_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for cust in data['customers']:
    name = cust['Customer']
    print(f"Searching for {name}...")
    q = f"site:finastra.com/about/resources/case-studies {name}"
    link = search_ddg(q)
    if not link:
        # Fallback to general site search
        q = f"site:finastra.com {name} case study"
        link = search_ddg(q)
        
    if link:
        print(f"Found: {link}")
        cust['Link'] = link
    else:
        print("Not found, using search URL")
        cust['Link'] = f"https://www.finastra.com/search?keys={urllib.parse.quote(name)}"
    time.sleep(1)

for uc in data['useCases']:
    name = uc['Priority use case']
    print(f"Searching for Use Case: {name}...")
    q = f"site:finastra.com {name}"
    link = search_ddg(q)
    
    if link:
        print(f"Found: {link}")
        uc['Link'] = link
    else:
        print("Not found, using search URL")
        uc['Link'] = f"https://www.finastra.com/search?keys={urllib.parse.quote(name)}"
    time.sleep(1)

with open(finastra_data_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Done updating finastra_data.json")
