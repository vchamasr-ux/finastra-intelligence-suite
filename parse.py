import json
import re

filepath = r"c:\Users\vcham\Documents\VS Code Programs\Finastra\finastra_deep_research.md"
with open(filepath, "r", encoding="utf-8") as f:
    text = f.read()

# Match tables
lines = text.split('\n')
tables = []
current_table = []
in_table = False

for line in lines:
    if line.strip().startswith('|'):
        in_table = True
        current_table.append(line.strip())
    else:
        if in_table:
            tables.append(current_table)
            current_table = []
            in_table = False
if in_table:
    tables.append(current_table)

def clean_value(val):
    val = val.strip()
    # Remove citations like cite...
    val = re.sub(r'cite[^]*', '', val).strip()
    
    # Extract name from entity tags entity["type","name","desc"] -> name
    def entity_repl(m):
        try:
            arr = json.loads(m.group(1))
            return str(arr[1]) if len(arr) > 1 else str(arr[0])
        except:
            return m.group(0)
    
    val = re.sub(r'entity(.*?)', entity_repl, val).strip()
    
    # Clean up any remaining tags just in case
    val = re.sub(r'[^]*', '', val).strip()
    return val

def parse_table_lines(table_lines):
    if len(table_lines) < 3: return []
    columns = [c.strip() for c in table_lines[0].strip('|').split('|')]
    rows = []
    
    for line in table_lines[2:]:
        if not line.strip() or line.strip('|').count('|') == 0: continue
        # Split by | protecting any escaped \| if they exist (usually not in these MDs)
        cells = [c.strip() for c in line.strip('|').split('|')]
        row_dict = {}
        for i, col in enumerate(columns):
            if not col: continue
            val = cells[i] if i < len(cells) else ""
            row_dict[col] = clean_value(val)
        rows.append(row_dict)
    return rows

data = {
    "products": [],
    "customers": [],
    "useCases": [],
    "competitors": []
}

for t in tables:
    parsed = parse_table_lines(t)
    if not parsed: continue
    
    keys = list(parsed[0].keys())
    
    if "Product/solution" in keys:
        data["products"].extend(parsed)
    elif "Customer" in keys and "Industry" in keys:
        data["customers"].extend(parsed)
    elif "Priority use case" in keys:
        data["useCases"].extend(parsed)
    elif "Domain" in keys and "Finastra focal products" in keys:
        data["competitors"].extend(parsed)

out_path = r"c:\Users\vcham\Documents\VS Code Programs\Finastra\finastra_data.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print(f"Extraction complete! Products: {len(data['products'])}, Customers: {len(data['customers'])}, Use Cases: {len(data['useCases'])}, Competitors: {len(data['competitors'])}")
