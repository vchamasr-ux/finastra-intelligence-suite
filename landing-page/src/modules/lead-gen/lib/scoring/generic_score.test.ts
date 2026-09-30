import { describe, expect, it } from "vitest";
import type { BankFeatures } from "../engine";
import { scoreProduct } from "./generic_score";

describe("scoreProduct explanation", () => {
  it("exposes the actual scored adjustments as drivers without changing the score", () => {
    const product = { "Product/solution": "Essence", "Target segments": "Community banks" };
    const features: BankFeatures = {
      fdicCert: "test-bank",
      totalAssets: 5_000_000,
      totalDeposits: 4_000_000,
      totalLoans: 3_000_000,
      branchCount: 1,
      assetTier: "community",
      roe: 8,
      roa: 1,
      assetGrowth5Y: 40,
      depositGrowth5Y: 35,
      efficiencyRatio: 70,
      nonIntExpense: 100,
      nonIntIncome: 50,
      yieldOnLoans: 5,
      commercialLoanRatio: 0.2,
      loanToDepositRatio: 0.8,
      mortgageLoanRatio: 0.2,
      consumerLoanRatio: 0.1,
      netChargeOffsRatio: 0.2,
      feeIncomeRatio: 0.02,
      netMargin: 3,
      realEstateRatio: 0.3,
      loanGrowth5Y: 30,
    };

    const result = scoreProduct(product, features);

    expect(result.score).toBe(92);
    expect(result.drivers).toHaveLength(5);
    expect(result.drivers.every((driver) => driver.includes("pts:"))).toBe(true);
    expect(result.ruleExplanation.segment).toContain("adds 10 points");
    expect(result.ruleExplanation.profitability).toContain("was not triggered");
    expect(result.ruleExplanation.finalization).toContain("92/100");

    const engineTierResult = scoreProduct(product, { ...features, assetTier: "10b_1b" });
    expect(engineTierResult.score).toBe(result.score);
    expect(engineTierResult.ruleExplanation.segment).toContain("adds 10 points");
  });

  it("explains both hard-mismatch branches as immediate zero scores", () => {
    const features: BankFeatures = {
      fdicCert: "test-bank",
      totalAssets: 300_000_000,
      totalDeposits: 250_000_000,
      totalLoans: 150_000_000,
      loanToDepositRatio: 0.6,
      branchCount: 10,
      commercialLoanRatio: 0.4,
      mortgageLoanRatio: 0.2,
      consumerLoanRatio: 0.1,
      netChargeOffsRatio: 0.2,
      feeIncomeRatio: 0.02,
      efficiencyRatio: 60,
      assetTier: "national",
      yieldOnLoans: 5,
      realEstateRatio: 0.3,
      netMargin: 3,
      nonIntIncome: 100,
      nonIntExpense: 100,
      roa: 1,
      roe: 10,
      assetGrowth5Y: 30,
      depositGrowth5Y: 25,
      loanGrowth5Y: 20,
    };
    const communityProduct = { "Product/solution": "Community Core", "Target segments": "community" };
    const enterpriseProduct = { "Product/solution": "Global Payments", "Target segments": "global" };

    const communityMismatch = scoreProduct(communityProduct, features);
    const enterpriseMismatch = scoreProduct(enterpriseProduct, { ...features, assetTier: "community" });

    expect(communityMismatch.score).toBe(0);
    expect(scoreProduct(communityProduct, { ...features, assetTier: "over_250b" }).score).toBe(0);
    expect(scoreProduct(communityProduct, { ...features, assetTier: "250b_100b" }).score).toBe(0);
    expect(communityMismatch.ruleExplanation.segment).toContain("immediately assigns a score of 0");
    expect(communityMismatch.ruleExplanation.finalization).toBe("Hard-mismatch score: 0/100.");
    expect(enterpriseMismatch.score).toBe(0);
    expect(enterpriseMismatch.ruleExplanation.segment).toContain("immediately assigns a score of 0");
  });
});
