

const FDIC_BASE_URL = 'https://api.fdic.gov/banks';

/**
 * 2026 Official FDIC Bank Data API Endpoints:
 * - Institutions: https://api.fdic.gov/banks/institutions (Demographics, high-level financials)
 * - Financials: https://api.fdic.gov/banks/financials (Detailed Call Report data, NTLNLS, NONII, ERNASTR)
 */

export interface FdicApiResult {
  data: any[];
  meta: {
    total: number;
    parameters: any;
  };
}

export async function fetchInstitutions(limit: number = 100, offset: number = 0, additionalFilters?: string): Promise<FdicApiResult> {
  const fields = 'CERT,NAME,CITY,STALP,ASSET,DEP';
  let filters = 'ACTIVE:1';
  if (additionalFilters) {
    filters += ` AND ${additionalFilters}`;
  }
  const sort_by = 'ASSET';
  const sort_order = 'DESC';
  const url = `${FDIC_BASE_URL}/institutions?filters=${encodeURIComponent(filters)}&sort_by=${sort_by}&sort_order=${sort_order}&fields=${fields}&limit=${limit}&offset=${offset}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`FDIC API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function fetchFinancials(certs: string[]): Promise<FdicApiResult> {
  const fields = 'CERT,REPDTE,ASSET,DEP,LNLSNET,LNCI,SZLNRES,LNCON,NTLNLS,NONII,ERNASTR,INTINCY,COSTDEP,LNRE,NIMY,NONIX,ROA,ROE,EEFFR';
  const allData: any[] = [];
  
  // Chunk into batches of 20 to avoid URL/Solr limits
  const chunkSize = 20;
  for (let i = 0; i < certs.length; i += chunkSize) {
    const chunk = certs.slice(i, i + chunkSize);
    // Solr explicit OR: CERT:10 OR CERT:100 OR CERT:10002
    const certQuery = chunk.map(c => `CERT:${c}`).join(' OR ');
    let filters = `(${certQuery})`;
    
    // Sort by REPDTE DESC ensures we get the most recent valid financial data for each CERT
    const url = `${FDIC_BASE_URL}/financials?filters=${encodeURIComponent(filters)}&fields=${fields}&sort_by=REPDTE&sort_order=DESC&limit=1000`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`FDIC API Error: ${response.status} ${response.statusText}`);
    }
    const result = await response.json();
    if (result.data) {
      allData.push(...result.data);
    }
  }
  
  return {
    data: allData,
    meta: { total: allData.length, parameters: {} }
  };
}

export async function fetchHistoricalFinancials(certs: string[]): Promise<FdicApiResult> {
  const fields = 'CERT,REPDTE,ASSET,DEP,NONIX,LNLSNET';
  const allData: any[] = [];
  
  const chunkSize = 20;
  for (let i = 0; i < certs.length; i += chunkSize) {
    const chunk = certs.slice(i, i + chunkSize);
    const certQuery = chunk.map(c => `CERT:${c}`).join(' OR ');
    
    // Look exactly 5 years in the past from 2024
    let filters = `(${certQuery}) AND REPDTE:20191231`;
    const url = `${FDIC_BASE_URL}/financials?filters=${encodeURIComponent(filters)}&fields=${fields}&limit=1000`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`FDIC API Error: ${response.status} ${response.statusText}`);
    }
    const result = await response.json();
    if (result.data) {
      allData.push(...result.data);
    }
  }
  
  return {
    data: allData,
    meta: { total: allData.length, parameters: {} }
  };
}
