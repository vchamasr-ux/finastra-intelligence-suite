// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const fdicSearch = vi.hoisted(() => ({ searchBank: vi.fn(), searchBankByCert: vi.fn() }));

vi.mock("../hooks/useFDICData", () => ({
  useFDICData: () => ({ ...fdicSearch, loading: false, error: null }),
}));
vi.mock("../lib/external", () => ({
  fetchCfpbComplaints: vi.fn().mockResolvedValue(0),
  fetchAppRating: vi.fn().mockResolvedValue(4.1),
  fetchFedFundsRate: vi.fn().mockResolvedValue(4.33),
  fetchPopulationGrowth: vi.fn().mockResolvedValue(3.5),
}));

import { PitchbookGenerator } from "./PitchbookGenerator";
import { PresentationProvider, usePresentationStore } from "../stores/PresentationContext";

const evidence = {
  productName: "Essence",
  score: 92,
  sourcePeriod: "20251231",
  drivers: ["+10 pts: Target segment strongly aligns.", "+8 pts: 5-Year Asset Growth (40.0% vs peer 35.0%)."],
  ruleExplanation: {
    baseline: "Scoring starts at 50 points.",
    segment: "Matching community-scale segment adds 10 points.",
    profitability: "The under-$10B negative-ROE/negative-ROA penalty was not triggered.",
    kpis: "Each qualifying KPI adds 8 points.",
    finalization: "The rounded result is bounded from 0 to 100; this fit is 92/100.",
  },
};

const bank = {
  ID: "bank-628",
  NAME: "Example Community Bank",
  CERT: "628",
  ASSET: 5_000_000,
  DEP: 4_000_000,
  ROE: 11,
  ROA: 1.1,
  STNAME: "Texas",
  STALP: "TX",
  CITY: "Dallas",
  EEFFR: 58,
  NETINC: 120_000,
};

function SelectionSnapshot() {
  const { selectedBank, selectedProduct } = usePresentationStore();
  return <output data-testid="selection-snapshot">{selectedBank?.CERT}|{selectedProduct?.["Product/solution"]}</output>;
}

describe("lead-gen pitchbook evidence handoff", () => {
  beforeEach(() => {
    fdicSearch.searchBankByCert.mockReset().mockResolvedValue(bank);
    fdicSearch.searchBank.mockReset();
    window.history.replaceState({}, "", `/pitchbook?cert=628&product=Essence&fit=${encodeURIComponent(JSON.stringify(evidence))}`);
  });

  it("hydrates the same bank, product, and score evidence into the pitchbook flow", async () => {
    render(
      <PresentationProvider>
        <PitchbookGenerator />
        <SelectionSnapshot />
      </PresentationProvider>,
    );

    await waitFor(() => expect(screen.getByTestId("selection-snapshot")).toHaveTextContent("628|Essence"));
    expect(fdicSearch.searchBankByCert).toHaveBeenCalledOnce();
    expect(screen.getByRole("complementary", { name: "Carried product fit evidence" })).toHaveTextContent("Essence · 92/100");
    expect(screen.getByRole("complementary", { name: "Carried product fit evidence" })).toHaveTextContent("12/31/2025");
  });
});
