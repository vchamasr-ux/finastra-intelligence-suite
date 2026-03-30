import { useState } from 'react';
import invariant from 'tiny-invariant';

// Using 2026 current FDIC BankFind Suite API endpoints
const FDIC_BASE_URL = 'https://api.fdic.gov/banks';

export interface FDICBankRecord {
  ID: string;
  NAME: string;
  CERT: string;
  ASSET: number;
  DEP: number;
  ROE: number;
  ROA: number;
  STNAME: string;
  STALP: string;
  CITY: string;
  // Deep Tailored Metrics
  EEFFR: number; // Efficiency Ratio
  NETINC: number; // Net Income
  NETLNLS?: number; // Net Loans and Leases
  NONII?: number; // Noninterest Income
  NONIX?: number; // Noninterest Expense
  NIMY?: number; // Net Interest Margin YTD
  INTINCY?: number; // Interest Income Yield (proxy for Yield on Loans — YLDLN not returned by FDIC API)
  COSTDEP?: number; // Cost of Deposits (proxy for Cost of Funds)
  NTLNLS?: number; // Net Charge-offs
  LNCI?: number; // Commercial Loans
  LNRE?: number; // Real Estate Loans
  SZLNRES?: number; // Small Business Real Estate Loans
  // 5-Year Growth Metrics
  ASSET5Y_GROWTH?: number;
  DEP5Y_GROWTH?: number;
  NONIX5Y_GROWTH?: number;
}


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchWithRetry = async (url: string, options: RequestInit = {}, maxRetries = 3) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;

      if (response.status === 429 || response.status >= 500) {
        const waitTime = Math.pow(2, attempt) * 1000;
        await delay(waitTime);
        continue;
      }
      throw new Error(`FDIC Client Error: ${response.status} - ${response.statusText}`);
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      const waitTime = Math.pow(2, attempt) * 1000;
      await delay(waitTime);
    }
  }
  throw new Error('Retries exhausted for FDIC API');
};

export const useFDICData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBank = async (bankName: string): Promise<FDICBankRecord[]> => {
    if (!bankName.trim()) {
      throw new Error("Bank name cannot be empty");
    }
    
    setLoading(true);
    setError(null);
    try {
      // Encode explicitly and replace spaces with wildcards for Lucene phrase bounds
      const encodedName = encodeURIComponent(bankName.trim().toUpperCase()).replace(/%20/g, '*');
      
      // Step 1: /institutions — demographics only (ratios are NOT here)
      const instUrl = `${FDIC_BASE_URL}/institutions?filters=NAME:*${encodedName}* AND ACTIVE:1&fields=NAME,CERT,ASSET,DEP,STNAME,STALP,CITY&sort_by=ASSET&sort_order=DESC&limit=10`;
      const instResponse = await fetchWithRetry(instUrl);
      const instData = await instResponse.json();

      if (!instData?.data || !Array.isArray(instData.data)) {
        throw new Error("Invalid schema returned from FDIC institutions API");
      }

      // Step 2: /financials — ratios (EEFFR, ROA, ROE, NIMY, etc.)
      const certs = instData.data.map((item: any) => item.data.CERT).filter(Boolean);
      const financialsMap = new Map<string, any>();
      const historicalMap = new Map<string, any>();

      if (certs.length > 0) {
        const certFilter = certs.map((c: string | number) => `CERT:${c}`).join(' OR ');
        const finFields = 'CERT,REPDTE,ASSET,DEP,EEFFR,ROA,ROE,NIMY,NETINC,LNLSNET,NONII,NONIX,INTINCY,COSTDEP,NTLNLS,LNCI,LNRE,SZLNRES';
        const finUrl = `${FDIC_BASE_URL}/financials?filters=(${certFilter})&fields=${finFields}&sort_by=REPDTE&sort_order=DESC&limit=10000`;
        
        const finResponse = await fetchWithRetry(finUrl);
        const finData = await finResponse.json();
        
        if (!finData?.data || !Array.isArray(finData.data)) {
          throw new Error("Invalid schema returned from FDIC financials API");
        }

        let latestRepdte: number | null = null;
        for (const item of finData.data) {
          const cert = String(item.data.CERT);
          if (!financialsMap.has(cert)) {
            financialsMap.set(cert, item.data); // Keep most recent only
            if (!latestRepdte && item.data.REPDTE) {
              latestRepdte = Number(item.data.REPDTE);
            }
          }
        }

        if (!latestRepdte) {
          throw new Error("Failed to determine latest REPDTE from FDIC financials");
        }

        // Step 2b: Fetch 5-year historical financials — graceful degradation
        // REPDTE - 50000 may not exist if the bank joined FDIC recently or has gaps.
        // We degrade to 0% growth rather than crashing the bank search.
        const historicalRepdte = latestRepdte - 50000;
        const histUrl = `${FDIC_BASE_URL}/financials?filters=((${certFilter}) AND REPDTE:${historicalRepdte})&fields=CERT,ASSET,DEP,NONIX&limit=10000`;
        
        try {
          const histResponse = await fetchWithRetry(histUrl);
          const histData = await histResponse.json();
          if (histData?.data && Array.isArray(histData.data)) {
            for (const item of histData.data) {
              historicalMap.set(String(item.data.CERT), item.data);
            }
          }
        } catch {
          // 5Y historical is enrichment-only — pitch deck renders with 0% growth fallback
          console.warn(`FDIC 5Y historical unavailable for REPDTE ${historicalRepdte}`);
        }
      }

      // Step 3: Merge institution demographics + financial ratios
      const results: FDICBankRecord[] = [];
      for (const item of instData.data) {
        try {
          const r = item.data;
          if (!r.NAME || !r.CERT) {
            throw new Error(`Corrupt FDIC record received. Missing NAME or CERT. Raw ID: ${item.data?.ID}`);
          }
          
          const fin = financialsMap.get(String(r.CERT));
          if (!fin) {
            throw new Error(`Current financial data missing for CERT ${r.CERT}`);
          }
          
          const hist = historicalMap.get(String(r.CERT)) || null; // graceful — null = no 5Y data

          const calcGrowth = (current: number | undefined, past: number | undefined) => {
            if (current === undefined || past === undefined || past === 0) return undefined;
            return ((current - past) / Math.abs(past)) * 100;
          };

          const requireNumeric = (val: any, fieldName: string) => {
            invariant(val !== undefined && val !== null && val !== '', `CRITICAL: Missing core FDIC baseline metric [${fieldName}] for bank CERT [${r.CERT}].`);
            const parsed = parseFloat(String(val).replace(/,/g, ''));
            invariant(!isNaN(parsed), `CRITICAL: FDIC baseline metric [${fieldName}] failed numeric parsing for [${r.CERT}].`);
            return parsed;
          };
          
          const parseOptional = (val: any) => {
            if (val === undefined || val === null || val === '') return undefined;
            const parsed = parseFloat(String(val).replace(/,/g, ''));
            return isNaN(parsed) ? undefined : parsed;
          };

          results.push({
            ID: r.ID,
            NAME: r.NAME,
            CERT: r.CERT,
            ASSET: requireNumeric(fin.ASSET || r.ASSET, 'ASSET'),
            DEP: requireNumeric(fin.DEP || r.DEP, 'DEP'),
            ROE: requireNumeric(fin.ROE, 'ROE'),
            ROA: requireNumeric(fin.ROA, 'ROA'),
            STNAME: r.STNAME || '',
            STALP: r.STALP || '',
            CITY: r.CITY || '',
            EEFFR: requireNumeric(fin.EEFFR, 'EEFFR'),
            NETINC: requireNumeric(fin.NETINC, 'NETINC'),
            NETLNLS: parseOptional(fin.LNLSNET),
            NONII: parseOptional(fin.NONII),
            NONIX: parseOptional(fin.NONIX),
            NIMY: parseOptional(fin.NIMY),
            INTINCY: parseOptional(fin.INTINCY),
            COSTDEP: parseOptional(fin.COSTDEP),
            NTLNLS: parseOptional(fin.NTLNLS),
            LNCI: parseOptional(fin.LNCI),
            // Smart fallback for Real Estate using SZLNRES if standard LNRE is missing
            LNRE: parseOptional(fin.LNRE ?? fin.SZLNRES),
            SZLNRES: parseOptional(fin.SZLNRES),
            ASSET5Y_GROWTH: calcGrowth(parseOptional(fin.ASSET || r.ASSET), parseOptional(hist?.ASSET)),
            DEP5Y_GROWTH: calcGrowth(parseOptional(fin.DEP || r.DEP), parseOptional(hist?.DEP)),
            NONIX5Y_GROWTH: calcGrowth(parseOptional(fin.NONIX), parseOptional(hist?.NONIX))
          } as FDICBankRecord);
        } catch (err: any) {
          // Instead of crashing the entire dropdown search, we fail loudly in the console but omit the invalid bank from results
          console.warn(`Bank omitted from search results due to strict data validation failure:`, err.message);
        }
      }

      setLoading(false);
      return results;
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  };

  const searchBankByCert = async (cert: string): Promise<FDICBankRecord | null> => {
    if (!cert.trim()) return null;
    
    setLoading(true);
    setError(null);
    try {
      // Step 1: /institutions — demographics
      const instUrl = `${FDIC_BASE_URL}/institutions?filters=CERT:${cert}&fields=NAME,CERT,ASSET,DEP,STNAME,STALP,CITY&limit=1`;
      const instResponse = await fetchWithRetry(instUrl);
      const instData = await instResponse.json();

      if (!instData?.data || !Array.isArray(instData.data) || instData.data.length === 0) {
        return null;
      }

      const r = instData.data[0].data;
      if (!r.NAME || !r.CERT) {
        throw new Error(`Corrupt FDIC record received. Missing NAME or CERT. Raw ID: ${instData.data[0]?.data?.ID}`);
      }

      // Step 2: /financials — ratios
      let fin: any = null;
      const finFields = 'CERT,REPDTE,ASSET,DEP,EEFFR,ROA,ROE,NIMY,NETINC,LNLSNET,NONII,NONIX,INTINCY,COSTDEP,NTLNLS,LNCI,LNRE,SZLNRES';
      const finUrl = `${FDIC_BASE_URL}/financials?filters=CERT:${cert}&fields=${finFields}&sort_by=REPDTE&sort_order=DESC&limit=1`;
      const finResponse = await fetchWithRetry(finUrl);
      const finData = await finResponse.json();
      
      if (!finData?.data || !Array.isArray(finData.data) || finData.data.length === 0) {
        throw new Error(`Current financial data missing for CERT ${cert}`);
      }
      fin = finData.data[0].data;

      if (!fin.REPDTE) {
        throw new Error(`Failed to determine latest REPDTE from FDIC financials for CERT ${cert}`);
      }

      // Step 2b: /financials — 5-year historical (enrichment only, graceful degradation)
      let hist: any = null;
      const historicalRepdte = Number(fin.REPDTE) - 50000;
      const histUrl = `${FDIC_BASE_URL}/financials?filters=(CERT:${cert} AND REPDTE:${historicalRepdte})&fields=CERT,ASSET,DEP,NONIX&limit=1`;
      try {
        const histResponse = await fetchWithRetry(histUrl);
        const histData = await histResponse.json();
        if (histData?.data && Array.isArray(histData.data) && histData.data.length > 0) {
          hist = histData.data[0].data;
        }
      } catch {
        console.warn(`FDIC 5Y historical unavailable for CERT ${cert} at REPDTE ${historicalRepdte}`);
      }

      const calcGrowth = (current: number | undefined, past: number | undefined) => {
        if (current === undefined || past === undefined || past === 0) return undefined;
        return ((current - past) / Math.abs(past)) * 100;
      };

      const requireNumeric = (val: any, fieldName: string) => {
        invariant(val !== undefined && val !== null && val !== '', `CRITICAL: Missing core FDIC baseline metric [${fieldName}] for bank CERT [${r.CERT}].`);
        const parsed = parseFloat(String(val).replace(/,/g, ''));
        invariant(!isNaN(parsed), `CRITICAL: FDIC baseline metric [${fieldName}] failed numeric parsing for [${r.CERT}].`);
        return parsed;
      };
      
      const parseOptional = (val: any) => {
        if (val === undefined || val === null || val === '') return undefined;
        const parsed = parseFloat(String(val).replace(/,/g, ''));
        return isNaN(parsed) ? undefined : parsed;
      };

      const result = {
        ID: r.ID,
        NAME: r.NAME,
        CERT: r.CERT,
        ASSET: requireNumeric(fin.ASSET || r.ASSET, 'ASSET'),
        DEP: requireNumeric(fin.DEP || r.DEP, 'DEP'),
        ROE: requireNumeric(fin.ROE, 'ROE'),
        ROA: requireNumeric(fin.ROA, 'ROA'),
        STNAME: r.STNAME || '',
        STALP: r.STALP || '',
        CITY: r.CITY || '',
        EEFFR: requireNumeric(fin.EEFFR, 'EEFFR'),
        NETINC: requireNumeric(fin.NETINC, 'NETINC'),
        NETLNLS: parseOptional(fin.LNLSNET),
        NONII: parseOptional(fin.NONII),
        NONIX: parseOptional(fin.NONIX),
        NIMY: parseOptional(fin.NIMY),
        INTINCY: parseOptional(fin.INTINCY),
        COSTDEP: parseOptional(fin.COSTDEP),
        NTLNLS: parseOptional(fin.NTLNLS),
        LNCI: parseOptional(fin.LNCI),
        // Smart fallback for Real Estate using SZLNRES if standard LNRE is missing
        LNRE: parseOptional(fin.LNRE ?? fin.SZLNRES),
        SZLNRES: parseOptional(fin.SZLNRES),
        ASSET5Y_GROWTH: calcGrowth(parseOptional(fin.ASSET || r.ASSET), parseOptional(hist?.ASSET)),
        DEP5Y_GROWTH: calcGrowth(parseOptional(fin.DEP || r.DEP), parseOptional(hist?.DEP)),
        NONIX5Y_GROWTH: calcGrowth(parseOptional(fin.NONIX), parseOptional(hist?.NONIX))
      } as FDICBankRecord;

      setLoading(false);
      return result;
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  };

  return { searchBank, searchBankByCert, loading, error };
};
