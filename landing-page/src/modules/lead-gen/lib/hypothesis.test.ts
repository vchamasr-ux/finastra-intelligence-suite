import { describe, it, expect } from 'vitest';
import { buildAccountHypothesis } from './hypothesis';
import type { BankIntel } from './engine';

function makeBank(overrides: Partial<BankIntel> = {}): BankIntel {
  return {
    id: 1,
    fdicCert: '12345',
    name: 'Test National Bank',
    totalAssets: 50_000_000,

    primaryEntryPoint: 'lending',
    assetTier: 'regional',
    state: 'TX',
    features: {
      commercialLoanRatio: 0.25,
      loanToDepositRatio: 0.70,
      feeIncomeRatio: 0.01,
      branchCount: 5,
    },
    scores: {},
    productScores: [],
    ...overrides,
  };
}

describe('buildAccountHypothesis', () => {
  it('generates lending-focused message for lending entry point', () => {
    const hyp = buildAccountHypothesis(makeBank({ primaryEntryPoint: 'lending' }));
    expect(hyp.primaryMessage).toContain('commercial lending');
    expect(hyp.hook).toContain('Test National Bank');
  });

  it('generates payments-focused message for payments entry point', () => {
    const hyp = buildAccountHypothesis(makeBank({ primaryEntryPoint: 'payments' }));
    expect(hyp.primaryMessage).toContain('deposit base');
  });

  it('generates dual message for dual entry point', () => {
    const hyp = buildAccountHypothesis(makeBank({ primaryEntryPoint: 'dual' }));
    expect(hyp.primaryMessage).toContain('multi-front');
  });

  it('generates fallback message for ambiguous entry point', () => {
    const hyp = buildAccountHypothesis(makeBank({ primaryEntryPoint: 'ambiguous' }));
    expect(hyp.primaryMessage).toContain('modernized core infrastructure');
  });

  it('includes commercial concentration fact when ratio > 0.4', () => {
    const bank = makeBank({
      features: { commercialLoanRatio: 0.55, loanToDepositRatio: 0.5, feeIncomeRatio: 0.01, branchCount: 2 },
    });
    const hyp = buildAccountHypothesis(bank);
    expect(hyp.supportingFacts.some(f => f.includes('commercial loan'))).toBe(true);
  });

  it('includes high LDR fact when ratio > 0.8', () => {
    const bank = makeBank({
      features: { commercialLoanRatio: 0.1, loanToDepositRatio: 0.92, feeIncomeRatio: 0.01, branchCount: 2 },
    });
    const hyp = buildAccountHypothesis(bank);
    expect(hyp.supportingFacts.some(f => f.includes('Loan-to-Deposit'))).toBe(true);
  });

  it('includes branch count fact when > 10', () => {
    const bank = makeBank({
      features: { commercialLoanRatio: 0.1, loanToDepositRatio: 0.5, feeIncomeRatio: 0.3, branchCount: 50 },
    });
    const hyp = buildAccountHypothesis(bank);
    expect(hyp.supportingFacts.some(f => f.includes('50 physical branches'))).toBe(true);
  });

  it('always returns non-empty supportingFacts', () => {
    const hyp = buildAccountHypothesis(makeBank());
    expect(hyp.supportingFacts.length).toBeGreaterThan(0);
  });
});
