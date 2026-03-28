import json
import urllib.parse
import os

finastra_data_path = 'finastra_data.json'

with open(finastra_data_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for cust in data.get('customers', []):
    name = cust.get('Customer', '')
    query = f'site:finastra.com "{name}" "case study" OR "press release"'
    encoded_query = urllib.parse.quote_plus(query)
    cust['Link'] = f"https://duckduckgo.com/?q={encoded_query}"

for uc in data.get('useCases', []):
    name = uc.get('Priority use case', '')
    query = f'site:finastra.com "{name}"'
    encoded_query = urllib.parse.quote_plus(query)
    uc['Link'] = f"https://duckduckgo.com/?q={encoded_query}"

with open(finastra_data_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Updated finastra_data.json with direct DuckDuckGo search links.")
