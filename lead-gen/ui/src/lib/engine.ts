import { fetchInstitutions, fetchFinancials, fetchHistoricalFinancials } from './fdic_api_client';
import { scoreProduct, type ProductScore } from './scoring/generic_score';
// @ts-ignore
import finastraDataList from './finastra_data.json';
export const competitorsList = finastraDataList.competitors || [];
export const productsList = finastraDataList.products || [];

export interface BankIntel {
  id: number;
  fdicCert: string;
  name: string;
  totalAssets: number;
  primaryEntryPoint: 'lending' | 'payments' | 'dual' | 'ambiguous';
  assetTier: string;
  features: any;
  scores: any;
  productScores: ProductScore[];
  state: string;
}

const ASSET_TIERS = {
  OVER_250B: 'over_250b',
  B250_TO_100B: '250b_100b',
  B100_TO_50B: '100b_50b',
  B50_TO_10B: '50b_10b',
  B10_TO_1B: '10b_1b',
  UNDER_1B: 'under_1b'
};

function determineAssetTier(assets: number) {
  if (assets >= 250_000_000) return ASSET_TIERS.OVER_250B;
  if (assets >= 100_000_000) return ASSET_TIERS.B250_TO_100B;
  if (assets >= 50_000_000) return ASSET_TIERS.B100_TO_50B;
  if (assets >= 10_000_000) return ASSET_TIERS.B50_TO_10B;
  if (assets >= 1_000_000) return ASSET_TIERS.B10_TO_1B;
  return ASSET_TIERS.UNDER_1B;
}

/**
 * Determines the primary sales entry point for a bank based on its financial profile.
 * - lending: High loan-to-deposit ratio or heavy commercial/real-estate book
 * - payments: High fee income relative to assets (treasury / transaction fee services)
 * - dual: Strong signals on both fronts
 * - ambiguous: No clear dominant signal
 */
function determineEntryPoint(
  loanToDepositRatio: number,
  commercialLoanRatio: number,
  feeIncomeRatio: number,
  realEstateRatio: number
): 'lending' | 'payments' | 'dual' | 'ambiguous' {
  // Lending signal: deployed loan book is large relative to deposits, or heavy commercial/RE concentration
  const isLending = loanToDepositRatio > 0.75 || commercialLoanRatio > 0.35 || realEstateRatio > 0.50;
  // Payments signal: meaningful non-interest income (treasury, wire fees, card revenue, trade finance)
  const isPayments = feeIncomeRatio > 0.015; // 1.5% of assets as fee income threshold

  if (isLending && isPayments) return 'dual';
  if (isLending) return 'lending';
  if (isPayments) return 'payments';
  return 'ambiguous';
}

export interface BankFeatures {
  fdicCert: string;
  totalAssets: number;
  totalDeposits: number;
  totalLoans: number;
  loanToDepositRatio: number;
  branchCount: number;
  commercialLoanRatio: number;
  mortgageLoanRatio: number;
  consumerLoanRatio: number;
  netChargeOffsRatio: number;
  feeIncomeRatio: number;
  efficiencyRatio: number | null;
  assetTier: string;
  
  // New KPIs for 6-Gauge alignment
  yieldOnLoans: number;
  realEstateRatio: number;
  netMargin: number;
  nonIntIncome: number;
  nonIntExpense: number;
  roa: number;
  roe: number;
  assetGrowth5Y: number | null;
  depositGrowth5Y: number | null;
  loanGrowth5Y: number | null;
}

/**
 * Builds analytical features directly from Raw FDIC data
 */
function buildBankFeatures(cert: string, inst: any, fin: any, hist: any): BankFeatures {
  const assets = fin.ASSET ?? inst.ASSET;
  if (assets === undefined || assets === null || assets <= 0) {
    throw new Error(`[Data Integrity Error] REQUIRED live metric ASSET is missing or invalid for CERT ${cert}.`);
  }

  const deposits = fin.DEP ?? inst.DEP;
  if (deposits === undefined || deposits === null || deposits < 0) {
    throw new Error(`[Data Integrity Error] REQUIRED live metric DEP is missing or invalid for CERT ${cert}.`);
  }

  const loans = fin.LNLSNET ?? 1;
  const totalLoans = loans;
  
  const commercialLoans = fin.LNCI || 0;
  const mortgageLoans = fin.SZLNRES || 0;
  const consumerLoans = fin.LNCON || 0;
  const netChargeOffs = fin.NTLNLS || 0;
  const noninterestIncome = fin.NONII || 0;
  const efficiencyRatio = fin.EEFFR || 0;
  
  const assetTier = determineAssetTier(assets);

  const calcGrowth = (metricName: string, current: number, past: number | undefined | null): number | null => {
    // Graceful Handling: De Novo or < 5Y banks legitimately lack this data.
    // Throwing an error here would crash the entire dashboard for all banks.
    if (past === undefined || past === null || past <= 0) {
        console.warn(`[Bank Intel] Historical data for ${metricName} is missing or <= 0 (past: ${past}). Bank lacks 5Y history. Setting to null.`);
        return null;
    }
    
    // Fail Loudly: If current live data is somehow 0, that's an integrity violation
    if (current <= 0) {
        throw new Error(`[Data Integrity Error] Current data for ${metricName} is zero or negative (current: ${current}). This violates the Fail Loudly doctrine.`);
    }

    return (Math.pow(current / past, 1 / 5) - 1) * 100;
  };

  const realEstateRatio = fin.LNRE ? (fin.LNRE / totalLoans) : (fin.SZLNRES ? (fin.SZLNRES / totalLoans) : 0);

  return {
    fdicCert: cert,
    totalAssets: assets,
    totalDeposits: deposits,
    totalLoans,
    loanToDepositRatio: totalLoans / deposits,
    branchCount: inst.BRNUM || 0,
    commercialLoanRatio: commercialLoans / totalLoans,
    mortgageLoanRatio: mortgageLoans / totalLoans,
    consumerLoanRatio: consumerLoans / totalLoans,
    netChargeOffsRatio: netChargeOffs / totalLoans,
    feeIncomeRatio: noninterestIncome / assets,
    efficiencyRatio,
    assetTier,
    
    yieldOnLoans: fin.INTINCY || 0,
    realEstateRatio,
    netMargin: fin.NIMY || 0,
    nonIntIncome: fin.NONII ? (fin.NONII / 1000) : 0, // In Millions
    nonIntExpense: fin.NONIX ? (fin.NONIX / 1000) : 0, // In Millions
    roa: fin.ROA || 0,
    roe: fin.ROE || 0,
    assetGrowth5Y: calcGrowth('ASSET', assets, hist.ASSET),
    depositGrowth5Y: calcGrowth('DEP', deposits, hist.DEP),
    loanGrowth5Y: calcGrowth('LNLSNET', loans, hist.LNLSNET)
  };
}

// ─── SessionStorage Cache ──────────────────────────────────────────────────────

const CACHE_KEY = 'finastra_lead_gen_v2_cache';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

interface CachedData {
  timestamp: number;
  data: BankIntel[];
}

function getCachedResults(): BankIntel[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached: CachedData = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    console.info(`[Lead-Gen Engine] Loaded ${cached.data.length} banks from session cache (${Math.round((Date.now() - cached.timestamp) / 60000)}m old).`);
    return cached.data;
  } catch {
    return null;
  }
}

function setCachedResults(data: BankIntel[]): void {
  try {
    const cached: CachedData = { timestamp: Date.now(), data };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cached));
    console.info(`[Lead-Gen Engine] Cached ${data.length} banks to sessionStorage.`);
  } catch {
    // sessionStorage might be full or unavailable — non-critical
    console.warn('[Lead-Gen Engine] Could not write to sessionStorage cache.');
  }
}

// ─── Main Engine ──────────────────────────────────────────────────────────────

/**
 * Orchestrates the full lead generation engine in the browser.
 * Fetches ~350 institutions across 7 asset tiers, scores each against all
 * 31 Finastra products, and returns a sorted leaderboard.
 *
 * Results are cached in sessionStorage for 30 minutes to avoid redundant FDIC calls.
 */
export async function runClientEngine(): Promise<BankIntel[]> {
  // Return cache if fresh
  const cached = getCachedResults();
  if (cached) return cached;

  try {
    // 50 institutions per segment × 7 segments = ~350 banks
    const LIMIT_PER_SEGMENT = 50;
    const segments = [
      'ASSET:[500000000 TO *]',
      'ASSET:[100000000 TO 499999999]',
      'ASSET:[50000000 TO 99999999]',
      'ASSET:[10000000 TO 49999999]',
      'ASSET:[1000000 TO 9999999]',
      'ASSET:[250000 TO 999999]',
      'ASSET:[0 TO 249999]'
    ];
    
    const instPromises = segments.map(seg => fetchInstitutions(LIMIT_PER_SEGMENT, 0, seg));
    const instResults = await Promise.all(instPromises);
    
    const institutions = instResults.flatMap(res => res.data || []);
    console.info(`[Lead-Gen Engine] Fetched ${institutions.length} institutions across ${segments.length} asset tiers.`);
    
    const certs = institutions.map(i => i.data.CERT);
    
    const finData = await fetchFinancials(certs);
    const financials = finData.data || [];
    
    const histData = await fetchHistoricalFinancials(certs);
    const historicals = histData.data || [];
    
    // Map financials by CERT — first record is most recent (sorted DESC by REPDTE)
    const financialsMap = new Map();
    for (const f of financials) {
      if (!financialsMap.has(f.data.CERT)) {
        financialsMap.set(f.data.CERT, f.data);
      }
    }
    
    const historicalMap = new Map();
    for (const h of historicals) {
      historicalMap.set(h.data.CERT, h.data);
    }
    
    const results: BankIntel[] = [];
    
    for (const [idx, inst] of institutions.entries()) {
      const instRecord = inst.data;
      const finRecord = financialsMap.get(instRecord.CERT) || {};
      const histRecord = historicalMap.get(instRecord.CERT) || {};
      
      const features = buildBankFeatures(instRecord.CERT, instRecord, finRecord, histRecord);
      
      // Determine primary sales entry point from live financial signals
      const primaryEntryPoint = determineEntryPoint(
        features.loanToDepositRatio,
        features.commercialLoanRatio,
        features.feeIncomeRatio,
        features.realEstateRatio
      );

      const productScores: ProductScore[] = (finastraDataList.products || []).map((p: any) => scoreProduct(p, features as any));
      // Sort product matches descending
      productScores.sort((a, b) => b.score - a.score);

      results.push({
        id: idx + 1,
        fdicCert: instRecord.CERT,
        name: instRecord.NAME,
        totalAssets: features.totalAssets,
        primaryEntryPoint,
        assetTier: features.assetTier,
        features,
        scores: {},
        productScores,
        state: instRecord.STALP || 'TX'
      });
    }
    
    // Sort by best product score descending
    results.sort((a, b) => (b.productScores[0]?.score || 0) - (a.productScores[0]?.score || 0));

    setCachedResults(results);
    return results;

  } catch (err) {
    throw err;
  }
}

/**
 * Clears the session cache — useful for manual refresh / dev tooling.
 */
export function clearEngineCache(): void {
  sessionStorage.removeItem(CACHE_KEY);
  console.info('[Lead-Gen Engine] Session cache cleared.');
}
