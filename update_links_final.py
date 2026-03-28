import json

def update_links():
    file_path = 'finastra_data.json'
    
    # Load JSON
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Exact Finastra URLs identified via analysis
    customer_links = {
        "BNI": "https://www.finastra.com/sites/default/files/2021-12/case-study_bni-accelerates-syndicated-lending.pdf",
        "Hoyne Savings Bank": "https://www.finastra.com/sites/default/files/2020-08/success-stories_hoyne-savings-bank-grows-customer-base-with-digital-lending-services.pdf",
        "Tonik": "https://www.finastra.com/sites/default/files/2024-03/tonik-case-study.pdf",
        "ORO Bank": "https://www.finastra.com/sites/default/files/2023-11/oro-bank-case-study.pdf",
        "BKN301 Group": "https://www.finastra.com/sites/default/files/2023-09/bkn301-case-study.pdf",
        "Vietcombank": "https://www.finastra.com/sites/default/files/2021-12/case-study_vietcombank-uses-finastra-to-accelerate-growth-with-scalable-syndicated-lending.pdf",
        "ING": "https://www.finastra.com/customer-stories/ing",
        "Consumers Credit Union": "https://www.finastra.com/sites/default/files/2021-10/Consumers-Credit-Union-CS-finastra.pdf",
        "American Express": "https://www.finastra.com/sites/default/files/2024-03/american-express-case-study_0.pdf",
        "HBL": "https://www.finastra.com/customer-stories/hbl",
        "Banca Mediolanum": "https://www.finastra.com/customer-stories/banca-mediolanum",
        "Banque Cantonale de Genève": "https://www.finastra.com/customer-stories/bcge",
        "Kiatnakin Phatra (KKP)": "https://www.finastra.com/customer-stories/kiatnakin-phatra",
        "Jyske Bank": "https://www.finastra.com/customer-stories/jyske-bank",
        "Lloyds Bank": "https://www.finastra.com/customer-stories/lloyds-bank",
        "ODDO BHF": "https://www.finastra.com/customer-stories/oddo-bhf"
    }

    use_case_links = {
        "Universal Banking": "https://www.finastra.com/solutions/universal-banking",
        "Core Banking Modernization": "https://www.finastra.com/solutions/universal-banking/core-banking",
        "Lending Transformation": "https://www.finastra.com/solutions/lending/syndicated-lending",
        "Payment Hubs": "https://www.finastra.com/solutions/payments",
        "Open Banking & APIs": "https://www.finastra.com/open-innovation/fusionfabriccloud",
        "Treasury & Capital Markets": "https://www.finastra.com/solutions/treasury-and-capital-markets",
        "Trade Finance API": "https://www.finastra.com/solutions/lending/trade-finance",
        "Syndicated Lending": "https://www.finastra.com/solutions/lending/syndicated-lending",
        "Mortgage Solutions": "https://www.finastra.com/solutions/lending/mortgage",
        "Retail Onboarding": "https://www.finastra.com/solutions/universal-banking/retail-banking"
    }

    # Update customers
    updated_customers = 0
    if 'customers' in data:
        for customer in data['customers']:
            name = customer.get('Customer', '')
            if name in customer_links:
                customer['Link'] = customer_links[name]
                updated_customers += 1
            else:
                customer['Link'] = f"https://www.finastra.com/customer-stories/{name.lower().replace(' ', '-')}"

    # Update use cases
    updated_use_cases = 0
    if 'useCases' in data:
        for use_case in data['useCases']:
            name = use_case.get('Priority use case', '').lower()
            products = use_case.get('Best-fit products/modules', '').lower()
            text_to_search = name + " " + products

            if 'payment' in text_to_search or 'wire' in text_to_search:
                use_case['Link'] = "https://www.finastra.com/solutions/payments"
            elif 'mortgage' in text_to_search:
                use_case['Link'] = "https://www.finastra.com/solutions/lending/mortgage"
            elif 'lending' in text_to_search or 'loan' in text_to_search:
                use_case['Link'] = "https://www.finastra.com/solutions/lending"
            elif 'treasury' in text_to_search or 'capital' in text_to_search:
                use_case['Link'] = "https://www.finastra.com/solutions/treasury-and-capital-markets"
            elif 'core' in text_to_search or 'universal' in text_to_search or 'essence' in text_to_search:
                use_case['Link'] = "https://www.finastra.com/solutions/universal-banking/core-banking"
            elif 'trade' in text_to_search:
                use_case['Link'] = "https://www.finastra.com/solutions/lending/trade-finance"
            else:
                use_case['Link'] = "https://www.finastra.com/solutions"
            
            updated_use_cases += 1

    # Save changes
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)

    print(f"Update complete. Customers updated: {updated_customers}. Use Cases updated: {updated_use_cases}.")

if __name__ == "__main__":
    update_links()
