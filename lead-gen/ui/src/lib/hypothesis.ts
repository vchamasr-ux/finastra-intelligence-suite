import type { BankIntel } from './engine';

export type AccountHypothesis = {
  primaryMessage: string;
  hook: string;
  supportingFacts: string[];
};

export function buildAccountHypothesis(bank: BankIntel): AccountHypothesis {
  const { name, primaryEntryPoint, features } = bank;
  const facts: string[] = [];

  if (features.commercialLoanRatio > 0.4) {
    facts.push(`${Math.round(features.commercialLoanRatio * 100)}% commercial loan concentration.`);
  }
  if (features.loanToDepositRatio > 0.8) {
    facts.push(`High Loan-to-Deposit ratio (${Math.round(features.loanToDepositRatio * 100)}%) indicating liquidity pressures.`);
  }
  if (features.feeIncomeRatio < 0.2) {
    facts.push(`Low non-interest income ratio indicating over-reliance on net interest margin.`);
  }
  if (features.branchCount > 10) {
    facts.push(`Operating ${features.branchCount} physical branches.`);
  }

  if (primaryEntryPoint === 'dual') {
    return {
      primaryMessage: `${name} shows multi-front operational constraints across both lending scale and payment complexity. They are a prime candidate for a comprehensive digital transformation covering both origination and core treasury modernization.`,
      hook: `How is ${name} scaling dual operations without ballooning back-office headcount?`,
      supportingFacts: facts.length > 0 ? facts : ['High asset scale demands robust operational systems.'],
    };
  } else if (primaryEntryPoint === 'lending') {
    return {
      primaryMessage: `${name} exhibits strong commercial lending volume signals but may be constrained by manual origination and servicing workflows.`,
      hook: `Is ${name}'s current lending technology straining under your loan volume?`,
      supportingFacts: facts.length > 0 ? facts : ['Strong active lending portfolio.'],
    };
  } else if (primaryEntryPoint === 'payments') {
    return {
      primaryMessage: `${name} holds a massive deposit base indicating deep treasury management needs, but likely relies on fragmented payment rails.`,
      hook: `How is ${name} optimizing corporate treasury flows across your vast deposit network?`,
      supportingFacts: facts.length > 0 ? facts : ['Significant core deposit volume.'],
    };
  }

  // fallback/neutral
  return {
    primaryMessage: `${name} requires a modernized core infrastructure to remain competitive in their asset tier.`,
    hook: `What systems is ${name} using to manage your current growth trajectory?`,
    supportingFacts: facts.length > 0 ? facts : [`${name} meets baseline regional scale requirements.`],
  };
}
