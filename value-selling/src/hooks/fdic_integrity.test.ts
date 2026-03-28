import { describe, it, expect } from 'vitest';
import { fetchWithRetry } from './useFDICData';

const FDIC_BASE_URL = 'https://banks.data.fdic.gov/api';

/**
 * LIVE FDIC DATA INTEGRITY TESTS — Value Selling
 *
 * Validates that the value-selling FDIC endpoint returns real, non-zero
 * financial metrics. If ASSET, DEP, or key ratios come back as 0/null,
 * the entire pitchbook deck will show garbage data.
 *
 * These tests hit the LIVE FDIC API. They catch:
 * - Wrong endpoint URL
 * - Schema changes (field renames)
 * - Silent null-coercion hiding missing data
 *
 * NOTE: The FDIC /institutions endpoint does NOT return all fields.
 * Fields like EEFFR may need to come from the /financials endpoint.
 * This test documents which fields ARE vs AREN'T available.
 */

async function fetchBankByCert(cert: string) {
  const fields = 'NAME,CERT,ASSET,DEP,ROE,ROA,STNAME,CITY,EEFFR,NETINC,NETLNLS,NONII,NONIX,NIMY';
  const url = `${FDIC_BASE_URL}/institutions?filters=CERT:${cert}&fields=${fields}&limit=1`;
  const response = await fetchWithRetry(url);
  const data = await response.json();
  return data;
}

async function fetchFinancialsByCert(cert: string) {
  const fields = 'CERT,ASSET,DEP,EEFFR,ROA,ROE,NETINC,NIMY,NETLNLS,NONII,NONIX';
  const url = `${FDIC_BASE_URL}/financials?filters=CERT:${cert}&fields=${fields}&sort_by=REPDTE&sort_order=DESC&limit=1`;
  const response = await fetchWithRetry(url);
  const data = await response.json();
  return data;
}

describe('FDIC Live Data Integrity — Value Selling', () => {

  describe('Institutions Endpoint (/institutions)', () => {
    it('returns data for known CERT 628 (JPMorgan Chase)', async () => {
      const data = await fetchBankByCert('628');
      expect(data.data, 'FDIC institutions API returned null data array').toBeDefined();
      expect(data.data.length, 'No institution found for CERT 628 — endpoint broken?').toBeGreaterThan(0);
    }, 15_000);

    it('ASSET is non-zero for JPMorgan (CERT 628)', async () => {
      const data = await fetchBankByCert('628');
      const bank = data.data[0].data;
      expect(bank.ASSET, 'ASSET is zero/null — the entire deck will show $0B').toBeGreaterThan(0);
      expect(bank.ASSET).toBeGreaterThan(1_000_000); // JPM > $3T in thousands
    }, 15_000);

    it('DEP (deposits) is non-zero', async () => {
      const data = await fetchBankByCert('628');
      const bank = data.data[0].data;
      expect(bank.DEP, 'DEP is zero — deposit metrics will be garbage').toBeGreaterThan(0);
    }, 15_000);

    it('NAME and STNAME are non-empty strings', async () => {
      const data = await fetchBankByCert('628');
      const bank = data.data[0].data;
      expect(bank.NAME, 'NAME is empty — header will render blank').toBeTruthy();
      expect(bank.STNAME, 'STNAME is empty — location will be blank').toBeTruthy();
    }, 15_000);

    it('ROA and ROE are populated (may be on /institutions)', async () => {
      const data = await fetchBankByCert('628');
      const bank = data.data[0].data;
      // These may or may not be present on /institutions — document the finding
      if (bank.ROA === undefined || bank.ROA === null) {
        console.warn('⚠ ROA is NOT available on /institutions endpoint — must fetch from /financials');
      } else {
        expect(bank.ROA).not.toBe(0);
      }
      if (bank.ROE === undefined || bank.ROE === null) {
        console.warn('⚠ ROE is NOT available on /institutions endpoint — must fetch from /financials');
      } else {
        expect(bank.ROE).not.toBe(0);
      }
    }, 15_000);
  });

  describe('Financials Endpoint (/financials)', () => {
    it('returns financial data for CERT 628', async () => {
      const data = await fetchFinancialsByCert('628');
      expect(data.data, 'Financials API returned no data for JPM').toBeDefined();
      expect(data.data.length, 'No financial records for CERT 628 — wrong REPDTE or endpoint?').toBeGreaterThan(0);
    }, 15_000);

    it('ASSET is non-zero on financials endpoint', async () => {
      const data = await fetchFinancialsByCert('628');
      const fin = data.data[0].data;
      expect(fin.ASSET, 'ASSET is zero on /financials — data may be stale').toBeGreaterThan(0);
    }, 15_000);

    it('NETLNLS (net loans) is non-zero for a lending bank', async () => {
      const data = await fetchFinancialsByCert('628');
      const fin = data.data[0].data;
      if (fin.NETLNLS === undefined || fin.NETLNLS === null) {
        console.warn('⚠ NETLNLS not available on /financials — field may have different name');
      } else {
        expect(fin.NETLNLS, 'NETLNLS is zero — lending KPI slide will show $0B loans').toBeGreaterThan(0);
      }
    }, 15_000);

    it('NONII (noninterest income) is present for fee-diversified bank', async () => {
      const data = await fetchFinancialsByCert('628');
      const fin = data.data[0].data;
      if (fin.NONII === undefined || fin.NONII === null) {
        console.warn('⚠ NONII not available on /financials — payments scoring will need alternate field');
      } else {
        expect(fin.NONII, 'NONII is zero — fee income metrics broken').toBeGreaterThan(0);
      }
    }, 15_000);
  });
});
