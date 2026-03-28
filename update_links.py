import json
import urllib.parse

finastra_data_path = 'finastra_data.json'

with open(finastra_data_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Specific known links
known_customer_links = {
    "BNI": "https://www.finastra.com/about/resources/case-studies/bni",
    "ING": "https://www.finastra.com/about/resources/case-studies/ing",
    "Vietcombank": "https://www.finastra.com/about/resources/case-studies/vietcombank",
    "ODDO BHF": "https://www.finastra.com/about/resources/case-studies/oddo-bhf",
    "VyStar Credit Union": "https://www.finastra.com/about/resources/case-studies/vystar-credit-union"
}

for cust in data.get('customers', []):
    name = cust.get('Customer', '')
    if name in known_customer_links:
        cust['Link'] = known_customer_links[name]
    else:
        cust['Link'] = f"https://www.finastra.com/search?keys={urllib.parse.quote(name)}"

for uc in data.get('useCases', []):
    name = uc.get('Priority use case', '')
    # Just use search for Use Cases
    uc['Link'] = f"https://www.finastra.com/search?keys={urllib.parse.quote(name)}"

with open(finastra_data_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Updated finastra_data.json with generated Links")
