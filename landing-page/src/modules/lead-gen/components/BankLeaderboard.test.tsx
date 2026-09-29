// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import type { BankIntel } from "../lib/engine";

vi.mock("./BankDetailsModal", () => ({
  BankDetailsModal: ({ bank }: { bank: { name: string } | null }) => bank
    ? <div role="dialog" aria-label="Bank details">{bank.name}</div>
    : null,
}));

import { BankLeaderboard } from "./BankLeaderboard";

const bank: BankIntel = {
  id: 628,
  fdicCert: "628",
  name: "Example Community Bank",
  totalAssets: 5_000_000,
  primaryEntryPoint: "lending",
  assetTier: "community",
  features: {},
  scores: {},
  productScores: [{
    productName: "Essence",
    score: 92,
    reasons: [],
    drivers: [],
    ruleExplanation: {
      baseline: "Scoring starts at 50 points.",
      segment: "Matching community-scale segment adds 10 points.",
      profitability: "No small-bank profitability penalty.",
      kpis: "No qualifying KPI adjustment.",
      finalization: "Fit is 92/100.",
    },
  }],
  state: "TX",
  sourcePeriod: "20251231",
};

describe("BankLeaderboard selection", () => {
  it("opens the selected bank details from its accessible name button", async () => {
    const user = userEvent.setup();
    render(<BankLeaderboard banks={[bank]} />);

    await user.click(screen.getByRole("button", { name: "View product fit details for Example Community Bank" }));

    expect(screen.getByRole("dialog", { name: "Bank details" })).toHaveTextContent("Example Community Bank");
  });
});
