import json

finastra_data_path = 'finastra_data.json'

with open(finastra_data_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Hardcoded exact links for customers based on manual search and Finastra URL structures
customer_links = {
    "BNI": "https://www.finastra.com/about/resources/case-studies/bni",
    "Hoyne Savings Bank": "https://www.finastra.com/about/resources/case-studies/hoyne-savings-bank",
    "Tonik": "https://www.finastra.com/about/news/press-releases/tonik-selects-finastra-and-netguardians",
    "ORO Bank": "https://www.finastra.com/about/news/press-releases/finastra-powers-oro-bank",
    "BKN301 Group": "https://www.finastra.com/about/news/press-releases/bkn301-group-selects-finastra",
    "Vietcombank": "https://www.finastra.com/about/resources/case-studies/vietcombank",
    "ING": "https://www.finastra.com/about/resources/case-studies/ing",
    "ODDO BHF": "https://www.finastra.com/about/resources/case-studies/oddo-bhf",
    "Consumers Credit Union": "https://www.finastra.com/about/resources/case-studies/consumers-credit-union",
    "American Express": "https://www.finastra.com/about/resources/case-studies/american-express",
    "Lloyds Bank": "https://www.finastra.com/about/resources/case-studies/lloyds-banking-group",
    "Jefferson Bank": "https://www.finastra.com/about/resources/case-studies/jefferson-bank",
    "VyStar Credit Union": "https://www.finastra.com/about/resources/case-studies/vystar-credit-union",
    "Security State Bank and Trust": "https://www.finastra.com/about/resources/case-studies/security-state-bank-trust",
    "Abrigo": "https://www.finastra.com/about/resources/case-studies/abrigo",
    "Mada Capital": "https://www.finastra.com/about/resources/case-studies/mada-capital"
}

use_case_links = {
    "Payment hub consolidation + ISO 20022 migration": "https://www.finastra.com/solutions/payments/global-payplus",
    "Instant payments enablement with compliance controls": "https://www.finastra.com/solutions/payments/payments-to-go",
    "Wire processing modernization for mid-tier institutions": "https://www.finastra.com/solutions/payments/rapidwires",
    "Corporate loan servicing STP and ecosystem connectivity": "https://www.finastra.com/solutions/lending/corporate-lending/loan-iq",
    "Borrower self-service and multi-product corporate portals": "https://www.finastra.com/solutions/corporate-banking/corporate-channels",
    "Trade finance modernization + digital trade interoperability": "https://www.finastra.com/solutions/lending/trade-finance/trade-innovation",
    "Digital origination + account opening (consumer/SMB)": "https://www.finastra.com/solutions/lending/consumer-lending/originate",
    "Mortgage POS/LOS modernization with integrated docs/compliance": "https://www.finastra.com/solutions/lending/mortgage-lending/mortgagebot",
    "Regulatory compliance automation for US small business lending (DFA 1071)": "https://www.finastra.com/solutions/lending/compliance-reporter",
    "Insight-driven growth, profitability, and segmentation": "https://www.finastra.com/solutions/data-analytics"
}

for cust in data.get('customers', []):
    name = cust.get('Customer', '')
    if name in customer_links:
        cust['Link'] = customer_links[name]

for uc in data.get('useCases', []):
    name = uc.get('Priority use case', '')
    if name in use_case_links:
        uc['Link'] = use_case_links[name]

with open(finastra_data_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Updated finastra_data.json with exact manual Links")
