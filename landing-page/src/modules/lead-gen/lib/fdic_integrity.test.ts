import { describe, it, expect } from 'vitest';
import { fetchInstitutions, fetchFinancials } from './fdic_api_client';

/**
 * LIVE FDIC DATA INTEGRITY TESTS
 *
 * These tests hit the real FDIC API endpoints to verify:
 * 1. The endpoints we're using actually return data (not empty arrays)
 * 2. Critical financial fields are NON-ZERO for real banks
 * 3. We aren't silently parsing garbage from the wrong endpoint
 *
 * If these tests break, it means either:
 * - The FDIC API schema changed
 * - We're pointing at the wrong endpoint
 * - The reporting period filter is returning stale/empty data
 */

describe('FDIC Live Data Integrity', () => {

  describe('Institutions Endpoint', () => {
    it('returns non-empty data array from /institutions', async () => {
      const result = await fetchInstitutions(5, 0);
      expect(result.data).toBeDefined();
      expect(result.data.length).toBeGreaterThan(0);
    }, 15_000);

    it('every institution has a non-empty NAME and valid CERT', async () => {
      const result = await fetchInstitutions(10, 0);
      for (const item of result.data) {
        const record = item.data;
        expect(record.NAME, `Institution missing NAME`).toBeTruthy();
        expect(record.CERT, `Institution missing CERT`).toBeTruthy();
      }
    }, 15_000);

    it('top 10 institutions by assets all have ASSET > 0', async () => {
      const result = await fetchInstitutions(10, 0);
      for (const item of result.data) {
        const record = item.data;
        expect(record.ASSET, `${record.NAME}: ASSET is zero/null — wrong endpoint or field name?`).toBeGreaterThan(0);
      }
    }, 15_000);

    it('top 10 institutions all have DEP > 0', async () => {
      const result = await fetchInstitutions(10, 0);
      for (const item of result.data) {
        const record = item.data;
        expect(record.DEP, `${record.NAME}: DEP is zero/null — deposits field not returned?`).toBeGreaterThan(0);
      }
    }, 15_000);
  });

  describe('Financials Endpoint', () => {
    it('returns financial data for known large banks', async () => {
      // JPMorgan Chase CERT: 628
      const result = await fetchFinancials(['628']);
      expect(result.data.length, 'No financials returned for JPMorgan (CERT:628) — wrong endpoint or period?').toBeGreaterThan(0);
    }, 15_000);

    it('financial records have non-zero ASSET and LNLSNET (net loans)', async () => {
      // Bank of America CERT: 3510
      const result = await fetchFinancials(['3510']);
      expect(result.data.length).toBeGreaterThan(0);

      const fin = result.data[0].data;
      expect(fin.ASSET, 'ASSET is zero in financials — field name mismatch or wrong period').toBeGreaterThan(0);
      expect(fin.LNLSNET, 'LNLSNET (net loans) is zero — this would corrupt all loan ratios').toBeGreaterThan(0);
    }, 15_000);

    it('financial records have non-null commercial loan field (LNCI)', async () => {
      // Wells Fargo CERT: 3511
      const result = await fetchFinancials(['3511']);
      expect(result.data.length).toBeGreaterThan(0);

      const fin = result.data[0].data;
      // LNCI (commercial & industrial loans) should be present for large banks
      expect(fin.LNCI, 'LNCI is null/zero for a mega bank — scoring engine will undercount commercial focus').not.toBeNull();
    }, 15_000);

    it('NONII (noninterest income) is populated for fee-dependent banks', async () => {
      // Goldman Sachs CERT: 2182
      const result = await fetchFinancials(['2182']);
      if (result.data.length > 0) {
        const fin = result.data[0].data;
        expect(fin.NONII, 'NONII is null — payments scoring will be broken').not.toBeNull();
      }
    }, 15_000);

    it('batch fetch for multiple CERTs returns data for each', async () => {
      const certs = ['628', '3510', '3511']; // JPM, BofA, Wells
      const result = await fetchFinancials(certs);
      
      const returnedCerts = new Set(result.data.map(d => String(d.data.CERT)));
      for (const cert of certs) {
        expect(returnedCerts.has(cert), `Missing financial data for CERT ${cert} — batch query may be truncating`).toBe(true);
      }
    }, 15_000);
  });
});
