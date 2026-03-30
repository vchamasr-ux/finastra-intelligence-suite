// AUTO-GENERATED: Dynamic KPI Mapping for all Finastra Products (n=31)
// This ensures mathematical parity between the backend Fit Score evaluation and the frontend gauges rendered in BankDetailsModal.tsx & PresentationViewer.tsx

export interface ProductKPIDef {
  key: string;            // The key used in BankFeatures or external properties
  label: string;          // The UI label for the gauge
  format: string;         // 'percent' | 'millions' | 'billions' | 'number'
  lowerIsBetter: boolean; // For inverse calculation rules (e.g., charge-offs, efficiency)
}

export const PRODUCT_KPI_MAP: Record<string, ProductKPIDef[]> = {
  "Essence": [
    {
      "key": "assetGrowth5Y",
      "label": "5-Year Asset Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "depositGrowth5Y",
      "label": "5-Year Deposit Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "populationGrowth",
      "label": "Local Pop Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roe",
      "label": "Return on Equity",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "nonIntExpense",
      "label": "Non-Int Expense (YTD)",
      "format": "millions",
      "lowerIsBetter": true
    }
  ],
  "Essence Analytics": [
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "assetGrowth5Y",
      "label": "5-Year Asset Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roa",
      "label": "Return on Assets",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "nonIntExpense",
      "label": "Non-Int Expense (YTD)",
      "format": "millions",
      "lowerIsBetter": true
    },
    {
      "key": "nonIntIncome",
      "label": "Non-Int Income (YTD)",
      "format": "millions",
      "lowerIsBetter": false
    },
    {
      "key": "roe",
      "label": "Return on Equity",
      "format": "percent",
      "lowerIsBetter": false
    }
  ],
  "Phoenix Banking Core": [
    {
      "key": "yieldOnLoans",
      "label": "Yield on Loans",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "commercialLoanRatio",
      "label": "Commercial Ratio",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "loanToDepositRatio",
      "label": "Loan to Deposit",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "netChargeOffsRatio",
      "label": "Net Charge-Offs",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "assetGrowth5Y",
      "label": "5-Year Asset Growth",
      "format": "percent",
      "lowerIsBetter": false
    }
  ],
  "MalauzAI Digital Banking": [
    {
      "key": "assetGrowth5Y",
      "label": "5-Year Asset Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "depositGrowth5Y",
      "label": "5-Year Deposit Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "populationGrowth",
      "label": "Local Pop Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roe",
      "label": "Return on Equity",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "nonIntExpense",
      "label": "Non-Int Expense (YTD)",
      "format": "millions",
      "lowerIsBetter": true
    }
  ],
  "AnalyzerIQ": [
    {
      "key": "yieldOnLoans",
      "label": "Yield on Loans",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "commercialLoanRatio",
      "label": "Commercial Ratio",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "loanToDepositRatio",
      "label": "Loan to Deposit",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "netChargeOffsRatio",
      "label": "Net Charge-Offs",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "assetGrowth5Y",
      "label": "5-Year Asset Growth",
      "format": "percent",
      "lowerIsBetter": false
    }
  ],
  "Fusion Data Cloud": [
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "assetGrowth5Y",
      "label": "5-Year Asset Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roa",
      "label": "Return on Assets",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "nonIntExpense",
      "label": "Non-Int Expense (YTD)",
      "format": "millions",
      "lowerIsBetter": true
    },
    {
      "key": "nonIntIncome",
      "label": "Non-Int Income (YTD)",
      "format": "millions",
      "lowerIsBetter": false
    },
    {
      "key": "roe",
      "label": "Return on Equity",
      "format": "percent",
      "lowerIsBetter": false
    }
  ],
  "Finastra ECM": [
    {
      "key": "assetGrowth5Y",
      "label": "5-Year Asset Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "depositGrowth5Y",
      "label": "5-Year Deposit Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "populationGrowth",
      "label": "Local Pop Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roe",
      "label": "Return on Equity",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "nonIntExpense",
      "label": "Non-Int Expense (YTD)",
      "format": "millions",
      "lowerIsBetter": true
    }
  ],
  "Loan IQ": [
    {
      "key": "yieldOnLoans",
      "label": "Yield on Loans",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "commercialLoanRatio",
      "label": "Commercial Ratio",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "loanToDepositRatio",
      "label": "Loan to Deposit",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "netChargeOffsRatio",
      "label": "Net Charge-Offs",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "assetGrowth5Y",
      "label": "5-Year Asset Growth",
      "format": "percent",
      "lowerIsBetter": false
    }
  ],
  "Loan IQ Nexus": [
    {
      "key": "yieldOnLoans",
      "label": "Yield on Loans",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "commercialLoanRatio",
      "label": "Commercial Ratio",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "loanToDepositRatio",
      "label": "Loan to Deposit",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "netChargeOffsRatio",
      "label": "Net Charge-Offs",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "assetGrowth5Y",
      "label": "5-Year Asset Growth",
      "format": "percent",
      "lowerIsBetter": false
    }
  ],
  "Loan IQ Build": [
    {
      "key": "yieldOnLoans",
      "label": "Yield on Loans",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "commercialLoanRatio",
      "label": "Commercial Ratio",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "loanToDepositRatio",
      "label": "Loan to Deposit",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "netChargeOffsRatio",
      "label": "Net Charge-Offs",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "assetGrowth5Y",
      "label": "5-Year Asset Growth",
      "format": "percent",
      "lowerIsBetter": false
    }
  ],
  "Loan IQ Transact": [
    {
      "key": "yieldOnLoans",
      "label": "Yield on Loans",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "commercialLoanRatio",
      "label": "Commercial Ratio",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "loanToDepositRatio",
      "label": "Loan to Deposit",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "netChargeOffsRatio",
      "label": "Net Charge-Offs",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "assetGrowth5Y",
      "label": "5-Year Asset Growth",
      "format": "percent",
      "lowerIsBetter": false
    }
  ],
  "Loan Portal": [
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "assetGrowth5Y",
      "label": "5-Year Asset Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roa",
      "label": "Return on Assets",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "nonIntExpense",
      "label": "Non-Int Expense (YTD)",
      "format": "millions",
      "lowerIsBetter": true
    },
    {
      "key": "nonIntIncome",
      "label": "Non-Int Income (YTD)",
      "format": "millions",
      "lowerIsBetter": false
    },
    {
      "key": "roe",
      "label": "Return on Equity",
      "format": "percent",
      "lowerIsBetter": false
    }
  ],
  "Originate (consumer & business loans/deposits)": [
    {
      "key": "assetGrowth5Y",
      "label": "5-Year Asset Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "depositGrowth5Y",
      "label": "5-Year Deposit Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "populationGrowth",
      "label": "Local Pop Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roe",
      "label": "Return on Equity",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "nonIntExpense",
      "label": "Non-Int Expense (YTD)",
      "format": "millions",
      "lowerIsBetter": true
    }
  ],
  "MortgagebotLOS + Originate Mortgagebot + Integrations": [
    {
      "key": "yieldOnLoans",
      "label": "Yield on Loans",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "realEstateRatio",
      "label": "Real Estate Ratio",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "depositGrowth5Y",
      "label": "5-Year Deposit Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "netChargeOffsRatio",
      "label": "Net Charge-Offs",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "cfpbComplaints",
      "label": "CFPB Complaints",
      "format": "number",
      "lowerIsBetter": true
    },
    {
      "key": "populationGrowth",
      "label": "Local Pop Growth",
      "format": "percent",
      "lowerIsBetter": false
    }
  ],
  "LaserPro (platform + modules including Conductor/Evaluate)": [
    {
      "key": "yieldOnLoans",
      "label": "Yield on Loans",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "realEstateRatio",
      "label": "Real Estate Ratio",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "depositGrowth5Y",
      "label": "5-Year Deposit Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "netChargeOffsRatio",
      "label": "Net Charge-Offs",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "cfpbComplaints",
      "label": "CFPB Complaints",
      "format": "number",
      "lowerIsBetter": true
    },
    {
      "key": "populationGrowth",
      "label": "Local Pop Growth",
      "format": "percent",
      "lowerIsBetter": false
    }
  ],
  "Trade Innovation + Trade Portal": [
    {
      "key": "nonIntIncome",
      "label": "Non-Int Income",
      "format": "millions",
      "lowerIsBetter": false
    },
    {
      "key": "fedFundsRate",
      "label": "Fed Funds Rate",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "roa",
      "label": "Return on Assets",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roe",
      "label": "Return on Equity",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "commercialLoanRatio",
      "label": "Commercial Ratio",
      "format": "percent",
      "lowerIsBetter": false
    }
  ],
  "Trade Innovation Nexus": [
    {
      "key": "nonIntIncome",
      "label": "Non-Int Income",
      "format": "millions",
      "lowerIsBetter": false
    },
    {
      "key": "fedFundsRate",
      "label": "Fed Funds Rate",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "roa",
      "label": "Return on Assets",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roe",
      "label": "Return on Equity",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "commercialLoanRatio",
      "label": "Commercial Ratio",
      "format": "percent",
      "lowerIsBetter": false
    }
  ],
  "Corporate Channels + Unified Corporate Portal + Cash/Trade/Loan portals": [
    {
      "key": "nonIntIncome",
      "label": "Non-Int Income (YTD)",
      "format": "millions",
      "lowerIsBetter": false
    },
    {
      "key": "nonIntExpense",
      "label": "Non-Int Expense (YTD)",
      "format": "millions",
      "lowerIsBetter": true
    },
    {
      "key": "cfpbComplaints",
      "label": "CFPB Complaints",
      "format": "number",
      "lowerIsBetter": true
    },
    {
      "key": "depositGrowth5Y",
      "label": "5-Year Deposit Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roa",
      "label": "Return on Assets",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roe",
      "label": "Return on Equity",
      "format": "percent",
      "lowerIsBetter": false
    }
  ],
  "ESG Service": [
    {
      "key": "assetGrowth5Y",
      "label": "5-Year Asset Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "depositGrowth5Y",
      "label": "5-Year Deposit Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "populationGrowth",
      "label": "Local Pop Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roe",
      "label": "Return on Equity",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "nonIntExpense",
      "label": "Non-Int Expense (YTD)",
      "format": "millions",
      "lowerIsBetter": true
    }
  ],
  "DFA 1071 / Compliance Reporter SBDC": [
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "assetGrowth5Y",
      "label": "5-Year Asset Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roa",
      "label": "Return on Assets",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "nonIntExpense",
      "label": "Non-Int Expense (YTD)",
      "format": "millions",
      "lowerIsBetter": true
    },
    {
      "key": "nonIntIncome",
      "label": "Non-Int Income (YTD)",
      "format": "millions",
      "lowerIsBetter": false
    },
    {
      "key": "roe",
      "label": "Return on Equity",
      "format": "percent",
      "lowerIsBetter": false
    }
  ],
  "Fusion CreditQuest": [
    {
      "key": "yieldOnLoans",
      "label": "Yield on Loans",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "commercialLoanRatio",
      "label": "Commercial Ratio",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "loanToDepositRatio",
      "label": "Loan to Deposit",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "netChargeOffsRatio",
      "label": "Net Charge-Offs",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "assetGrowth5Y",
      "label": "5-Year Asset Growth",
      "format": "percent",
      "lowerIsBetter": false
    }
  ],
  "Global PAYplus": [
    {
      "key": "nonIntIncome",
      "label": "Non-Int Income (YTD)",
      "format": "millions",
      "lowerIsBetter": false
    },
    {
      "key": "nonIntExpense",
      "label": "Non-Int Expense (YTD)",
      "format": "millions",
      "lowerIsBetter": true
    },
    {
      "key": "cfpbComplaints",
      "label": "CFPB Complaints",
      "format": "number",
      "lowerIsBetter": true
    },
    {
      "key": "depositGrowth5Y",
      "label": "5-Year Deposit Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roa",
      "label": "Return on Assets",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roe",
      "label": "Return on Equity",
      "format": "percent",
      "lowerIsBetter": false
    }
  ],
  "Payments To Go": [
    {
      "key": "nonIntIncome",
      "label": "Non-Int Income (YTD)",
      "format": "millions",
      "lowerIsBetter": false
    },
    {
      "key": "nonIntExpense",
      "label": "Non-Int Expense (YTD)",
      "format": "millions",
      "lowerIsBetter": true
    },
    {
      "key": "cfpbComplaints",
      "label": "CFPB Complaints",
      "format": "number",
      "lowerIsBetter": true
    },
    {
      "key": "depositGrowth5Y",
      "label": "5-Year Deposit Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roa",
      "label": "Return on Assets",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roe",
      "label": "Return on Equity",
      "format": "percent",
      "lowerIsBetter": false
    }
  ],
  "Financial Messaging (incl. Total Messaging positioning)": [
    {
      "key": "assetGrowth5Y",
      "label": "5-Year Asset Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "depositGrowth5Y",
      "label": "5-Year Deposit Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "populationGrowth",
      "label": "Local Pop Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roe",
      "label": "Return on Equity",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "nonIntExpense",
      "label": "Non-Int Expense (YTD)",
      "format": "millions",
      "lowerIsBetter": true
    }
  ],
  "Bacsactive-IP": [
    {
      "key": "yieldOnLoans",
      "label": "Yield on Loans",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "commercialLoanRatio",
      "label": "Commercial Ratio",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "loanToDepositRatio",
      "label": "Loan to Deposit",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "netChargeOffsRatio",
      "label": "Net Charge-Offs",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "assetGrowth5Y",
      "label": "5-Year Asset Growth",
      "format": "percent",
      "lowerIsBetter": false
    }
  ],
  "RapidWires": [
    {
      "key": "assetGrowth5Y",
      "label": "5-Year Asset Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "depositGrowth5Y",
      "label": "5-Year Deposit Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "populationGrowth",
      "label": "Local Pop Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roe",
      "label": "Return on Equity",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "nonIntExpense",
      "label": "Non-Int Expense (YTD)",
      "format": "millions",
      "lowerIsBetter": true
    }
  ],
  "ACH Module (modern ACH)": [
    {
      "key": "assetGrowth5Y",
      "label": "5-Year Asset Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "depositGrowth5Y",
      "label": "5-Year Deposit Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "populationGrowth",
      "label": "Local Pop Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roe",
      "label": "Return on Equity",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "nonIntExpense",
      "label": "Non-Int Expense (YTD)",
      "format": "millions",
      "lowerIsBetter": true
    }
  ],
  "Compliance as a Service (instant payments)": [
    {
      "key": "nonIntIncome",
      "label": "Non-Int Income (YTD)",
      "format": "millions",
      "lowerIsBetter": false
    },
    {
      "key": "nonIntExpense",
      "label": "Non-Int Expense (YTD)",
      "format": "millions",
      "lowerIsBetter": true
    },
    {
      "key": "cfpbComplaints",
      "label": "CFPB Complaints",
      "format": "number",
      "lowerIsBetter": true
    },
    {
      "key": "depositGrowth5Y",
      "label": "5-Year Deposit Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roa",
      "label": "Return on Assets",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roe",
      "label": "Return on Equity",
      "format": "percent",
      "lowerIsBetter": false
    }
  ],
  "Total Screening": [
    {
      "key": "assetGrowth5Y",
      "label": "5-Year Asset Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "depositGrowth5Y",
      "label": "5-Year Deposit Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "populationGrowth",
      "label": "Local Pop Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roe",
      "label": "Return on Equity",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "nonIntExpense",
      "label": "Non-Int Expense (YTD)",
      "format": "millions",
      "lowerIsBetter": true
    }
  ],
  "PAYplus for CLS": [
    {
      "key": "nonIntIncome",
      "label": "Non-Int Income (YTD)",
      "format": "millions",
      "lowerIsBetter": false
    },
    {
      "key": "nonIntExpense",
      "label": "Non-Int Expense (YTD)",
      "format": "millions",
      "lowerIsBetter": true
    },
    {
      "key": "cfpbComplaints",
      "label": "CFPB Complaints",
      "format": "number",
      "lowerIsBetter": true
    },
    {
      "key": "depositGrowth5Y",
      "label": "5-Year Deposit Growth",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roa",
      "label": "Return on Assets",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roe",
      "label": "Return on Equity",
      "format": "percent",
      "lowerIsBetter": false
    }
  ],
  "Confirmation Matching Service (CMS)": [
    {
      "key": "nonIntIncome",
      "label": "Non-Int Income",
      "format": "millions",
      "lowerIsBetter": false
    },
    {
      "key": "fedFundsRate",
      "label": "Fed Funds Rate",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "efficiencyRatio",
      "label": "Efficiency Ratio",
      "format": "percent",
      "lowerIsBetter": true
    },
    {
      "key": "roa",
      "label": "Return on Assets",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "roe",
      "label": "Return on Equity",
      "format": "percent",
      "lowerIsBetter": false
    },
    {
      "key": "commercialLoanRatio",
      "label": "Commercial Ratio",
      "format": "percent",
      "lowerIsBetter": false
    }
  ]
};
