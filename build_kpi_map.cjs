// This script generates the product_kpis.ts dictionary by parsing finastra_data.json
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'finastra_data.json');
const outPathLeadGen = path.join(__dirname, 'lead-gen', 'ui', 'src', 'lib', 'scoring', 'product_kpis.ts');
const outPathPitchbook = path.join(__dirname, 'value-selling', 'src', 'lib', 'scoring', 'product_kpis.ts');

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// 6 KPI configs by theme
const themes = {
  commercial: [
    { key: 'yieldOnLoans', label: 'Yield on Loans', format: 'percent', lowerIsBetter: false },
    { key: 'commercialLoanRatio', label: 'Commercial Ratio', format: 'percent', lowerIsBetter: false },
    { key: 'loanToDepositRatio', label: 'Loan to Deposit', format: 'percent', lowerIsBetter: false },
    { key: 'netChargeOffsRatio', label: 'Net Charge-Offs', format: 'percent', lowerIsBetter: true },
    { key: 'efficiencyRatio', label: 'Efficiency Ratio', format: 'percent', lowerIsBetter: true },
    { key: 'assetGrowth5Y', label: '5-Year Asset Growth', format: 'percent', lowerIsBetter: false }
  ],
  retail: [
    { key: 'yieldOnLoans', label: 'Yield on Loans', format: 'percent', lowerIsBetter: false },
    { key: 'realEstateRatio', label: 'Real Estate Ratio', format: 'percent', lowerIsBetter: false },
    { key: 'depositGrowth5Y', label: '5-Year Deposit Growth', format: 'percent', lowerIsBetter: false },
    { key: 'netChargeOffsRatio', label: 'Net Charge-Offs', format: 'percent', lowerIsBetter: true },
    { key: 'cfpbComplaints', label: 'CFPB Complaints', format: 'number', lowerIsBetter: true },
    { key: 'populationGrowth', label: 'Local Pop Growth', format: 'percent', lowerIsBetter: false }
  ],
  payments: [
    { key: 'nonIntIncome', label: 'Non-Int Income (YTD)', format: 'millions', lowerIsBetter: false },
    { key: 'nonIntExpense', label: 'Non-Int Expense (YTD)', format: 'millions', lowerIsBetter: true },
    { key: 'cfpbComplaints', label: 'CFPB Complaints', format: 'number', lowerIsBetter: true },
    { key: 'depositGrowth5Y', label: '5-Year Deposit Growth', format: 'percent', lowerIsBetter: false },
    { key: 'roa', label: 'Return on Assets', format: 'percent', lowerIsBetter: false },
    { key: 'roe', label: 'Return on Equity', format: 'percent', lowerIsBetter: false }
  ],
  analytics: [
    { key: 'efficiencyRatio', label: 'Efficiency Ratio', format: 'percent', lowerIsBetter: true },
    { key: 'assetGrowth5Y', label: '5-Year Asset Growth', format: 'percent', lowerIsBetter: false },
    { key: 'roa', label: 'Return on Assets', format: 'percent', lowerIsBetter: false },
    { key: 'nonIntExpense', label: 'Non-Int Expense (YTD)', format: 'millions', lowerIsBetter: true },
    { key: 'nonIntIncome', label: 'Non-Int Income (YTD)', format: 'millions', lowerIsBetter: false },
    { key: 'roe', label: 'Return on Equity', format: 'percent', lowerIsBetter: false }
  ],
  core: [
    { key: 'assetGrowth5Y', label: '5-Year Asset Growth', format: 'percent', lowerIsBetter: false },
    { key: 'depositGrowth5Y', label: '5-Year Deposit Growth', format: 'percent', lowerIsBetter: false },
    { key: 'efficiencyRatio', label: 'Efficiency Ratio', format: 'percent', lowerIsBetter: true },
    { key: 'populationGrowth', label: 'Local Pop Growth', format: 'percent', lowerIsBetter: false },
    { key: 'roe', label: 'Return on Equity', format: 'percent', lowerIsBetter: false },
    { key: 'nonIntExpense', label: 'Non-Int Expense (YTD)', format: 'millions', lowerIsBetter: true }
  ],
  treasury: [
    { key: 'nonIntIncome', label: 'Non-Int Income', format: 'millions', lowerIsBetter: false },
    { key: 'fedFundsRate', label: 'Fed Funds Rate', format: 'percent', lowerIsBetter: false },
    { key: 'efficiencyRatio', label: 'Efficiency Ratio', format: 'percent', lowerIsBetter: true },
    { key: 'roa', label: 'Return on Assets', format: 'percent', lowerIsBetter: false },
    { key: 'roe', label: 'Return on Equity', format: 'percent', lowerIsBetter: false },
    { key: 'commercialLoanRatio', label: 'Commercial Ratio', format: 'percent', lowerIsBetter: false }
  ]
};

const productMap = {};

for (const p of data.products) {
  const name = p['Product/solution'];
  const desc = (name + ' ' + p['Concise description']).toLowerCase();
  
  let theme = 'core';
  if (desc.includes('commercial') || desc.includes('syndicated') || name.includes('IQ') || desc.includes('credit')) {
    theme = 'commercial';
  } else if (desc.includes('mortgage') || desc.includes('retail') || desc.includes('laserpro')) {
    theme = 'retail';
  } else if (desc.includes('payment') || desc.includes('payplus') || desc.includes('bacs')) {
    theme = 'payments';
  } else if (desc.includes('analy') || desc.includes('data') || desc.includes('insight') || desc.includes('condition')) {
    theme = 'analytics';
  } else if (desc.includes('treasury') || desc.includes('kondor') || desc.includes('summit') || desc.includes('opics') || desc.includes('trade')) {
    theme = 'treasury';
  } else {
    theme = 'core';
  }
  
  productMap[name] = themes[theme];
}

const fileHeader = `// AUTO-GENERATED: Dynamic KPI Mapping for all Finastra Products (n=${data.products.length})
// This ensures mathematical parity between the backend Fit Score evaluation and the frontend gauges rendered in BankDetailsModal.tsx & PresentationViewer.tsx

export interface ProductKPIDef {
  key: string;            // The key used in BankFeatures or external properties
  label: string;          // The UI label for the gauge
  format: string;         // 'percent' | 'millions' | 'billions' | 'number'
  lowerIsBetter: boolean; // For inverse calculation rules (e.g., charge-offs, efficiency)
}

export const PRODUCT_KPI_MAP: Record<string, ProductKPIDef[]> = ${JSON.stringify(productMap, null, 2)};
`;

fs.mkdirSync(path.dirname(outPathPitchbook), { recursive: true });
fs.writeFileSync(outPathLeadGen, fileHeader);
fs.writeFileSync(outPathPitchbook, fileHeader);
console.log('Successfully generated ' + Object.keys(productMap).length + ' distinct product mappings to duplicate endpoints in lead-gen and value-selling repositories.');

