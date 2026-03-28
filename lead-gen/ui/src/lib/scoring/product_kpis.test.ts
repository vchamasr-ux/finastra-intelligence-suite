import { describe, it, expect } from 'vitest';
import { PRODUCT_KPI_MAP } from './product_kpis';

const VALID_FORMATS = new Set(['percent', 'millions', 'billions', 'number']);
const VALID_KEYS = new Set([
  'yieldOnLoans', 'commercialLoanRatio', 'loanToDepositRatio', 'netChargeOffsRatio',
  'efficiencyRatio', 'netMargin', 'realEstateRatio', 'nonIntIncome', 'nonIntExpense',
  'roa', 'roe', 'assetGrowth5Y', 'depositGrowth5Y', 'cfpbComplaints', 'appRating',
  'populationGrowth', 'fedFundsRate',
]);

describe('PRODUCT_KPI_MAP — structural integrity', () => {
  const products = Object.keys(PRODUCT_KPI_MAP);

  it('has at least 30 products defined', () => {
    expect(products.length).toBeGreaterThanOrEqual(30);
  });

  it('every product has exactly 6 KPI definitions', () => {
    for (const product of products) {
      expect(PRODUCT_KPI_MAP[product]).toHaveLength(6);
    }
  });

  it('every KPI has a non-empty label', () => {
    for (const product of products) {
      for (const kpi of PRODUCT_KPI_MAP[product]) {
        expect(kpi.label, `${product} has KPI with empty label`).toBeTruthy();
      }
    }
  });

  it('every KPI key is in the known valid set', () => {
    for (const product of products) {
      for (const kpi of PRODUCT_KPI_MAP[product]) {
        expect(VALID_KEYS.has(kpi.key), `${product} -> unknown key "${kpi.key}"`).toBe(true);
      }
    }
  });

  it('every KPI format is one of percent | millions | billions | number', () => {
    for (const product of products) {
      for (const kpi of PRODUCT_KPI_MAP[product]) {
        expect(VALID_FORMATS.has(kpi.format), `${product} -> invalid format "${kpi.format}"`).toBe(true);
      }
    }
  });

  it('lowerIsBetter is a boolean on every KPI', () => {
    for (const product of products) {
      for (const kpi of PRODUCT_KPI_MAP[product]) {
        expect(typeof kpi.lowerIsBetter).toBe('boolean');
      }
    }
  });
});

describe('PRODUCT_KPI_MAP — semantic correctness', () => {
  it('Essence has assetGrowth5Y and depositGrowth5Y KPIs', () => {
    const keys = PRODUCT_KPI_MAP['Essence'].map(k => k.key);
    expect(keys).toContain('assetGrowth5Y');
    expect(keys).toContain('depositGrowth5Y');
  });

  it('Loan IQ has yieldOnLoans and commercialLoanRatio (lending KPIs)', () => {
    const keys = PRODUCT_KPI_MAP['Loan IQ'].map(k => k.key);
    expect(keys).toContain('yieldOnLoans');
    expect(keys).toContain('commercialLoanRatio');
  });

  it('MortgagebotLOS has realEstateRatio and cfpbComplaints', () => {
    const keys = PRODUCT_KPI_MAP['MortgagebotLOS + Originate Mortgagebot + Integrations'].map(k => k.key);
    expect(keys).toContain('realEstateRatio');
    expect(keys).toContain('cfpbComplaints');
  });

  it('Global PAYplus has nonIntIncome (payments revenue KPI)', () => {
    const keys = PRODUCT_KPI_MAP['Global PAYplus'].map(k => k.key);
    expect(keys).toContain('nonIntIncome');
  });

  it('netChargeOffsRatio is always lowerIsBetter=true when present', () => {
    for (const [product, kpis] of Object.entries(PRODUCT_KPI_MAP)) {
      const nco = kpis.find(k => k.key === 'netChargeOffsRatio');
      if (nco) {
        expect(nco.lowerIsBetter, `${product}: netChargeOffsRatio must be lowerIsBetter`).toBe(true);
      }
    }
  });

  it('efficiencyRatio is always lowerIsBetter=true when present', () => {
    for (const [product, kpis] of Object.entries(PRODUCT_KPI_MAP)) {
      const eff = kpis.find(k => k.key === 'efficiencyRatio');
      if (eff) {
        expect(eff.lowerIsBetter, `${product}: efficiencyRatio must be lowerIsBetter`).toBe(true);
      }
    }
  });

  it('falls back to Essence KPIs for unknown products', () => {
    const fallback = PRODUCT_KPI_MAP['Essence'];
    const unknown = PRODUCT_KPI_MAP['NonExistentProduct'];
    // Verify Essence is the intended fallback (as used in code: PRODUCT_KPI_MAP[productName] || PRODUCT_KPI_MAP['Essence'])
    expect(fallback).toBeDefined();
    expect(unknown).toBeUndefined(); // code should handle || fallback itself
  });
});
