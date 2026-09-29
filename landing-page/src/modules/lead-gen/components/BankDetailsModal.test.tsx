// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { BankIntel } from "../lib/engine";
import { parseProductFitEvidence } from "../../../shared/productFitEvidence";

vi.mock("axios", () => ({
  default: { get: vi.fn().mockResolvedValue({ data: { data: [] } }) },
}));
vi.mock("../lib/external", () => ({
  fetchCfpbComplaints: vi.fn().mockResolvedValue(0),
  fetchAppRating: vi.fn().mockResolvedValue(4.1),
  fetchFedFundsRate: vi.fn().mockResolvedValue(3.63),
  fetchPopulationGrowth: vi.fn().mockResolvedValue(6.9),
}));

import { BankDetailsModal } from "./BankDetailsModal";

const bank: BankIntel = {
  id: 33947,
  fdicCert: "33947",
  name: "TD Bank USA, National Association",
  totalAssets: 32_100_000,
  primaryEntryPoint: "lending",
  assetTier: "50b_10b",
  features: {},
  scores: {},
  productScores: [{
    productName: "Fusion Data Cloud",
    score: 98,
    reasons: ["Score is supported by reported assets."],
    drivers: ["Assets: $32.1B"],
    ruleExplanation: {
      baseline: "Baseline factors applied.",
      segment: "Segment: Large bank.",
      profitability: "Profitability: healthy.",
      kpis: "KPIs support fit.",
      finalization: "Final score: 98.",
    },
  }],
  state: "DE",
  sourcePeriod: "20260630",
};

describe("BankDetailsModal fit evidence handoff", () => {
  beforeEach(() => {
    vi.mocked(axios.get).mockReset().mockResolvedValue({ data: { data: [] } } as never);
    vi.spyOn(window, "open").mockImplementation(() => null);
  });

  afterEach(() => vi.restoreAllMocks());

  it("shows the selected score evidence and carries it into Generate Pitchbook", async () => {
    const user = userEvent.setup();
    render(<BankDetailsModal bank={bank} selectedProduct="Fusion Data Cloud" onClose={vi.fn()} />);

    const evidence = screen.getByRole("region", { name: "Selected product fit evidence" });
    expect(evidence).toHaveTextContent("Fusion Data Cloud");
    expect(evidence).toHaveTextContent("98/100");
    expect(evidence).toHaveTextContent("6/30/2026");
    expect(evidence).toHaveTextContent("Segment: Large bank.");
    expect(evidence).toHaveTextContent("Assets: $32.1B");

    await user.click(screen.getByRole("button", { name: "Generate Pitchbook" }));

    const [url, target] = vi.mocked(window.open).mock.calls[0];
    expect(target).toBe("_blank");
    const pitchbook = new URL(url!, "https://finastra.local");
    expect(pitchbook.pathname).toBe("/pitchbook");
    expect(pitchbook.searchParams.get("cert")).toBe("33947");
    expect(pitchbook.searchParams.get("product")).toBe("Fusion Data Cloud");
    expect(parseProductFitEvidence(pitchbook.searchParams.get("fit"))).toEqual({
      productName: "Fusion Data Cloud",
      score: 98,
      sourcePeriod: "20260630",
      drivers: ["Assets: $32.1B"],
      ruleExplanation: bank.productScores[0].ruleExplanation,
    });
  });

  it("does not invent score evidence when the selected product has no score", async () => {
    const user = userEvent.setup();
    render(<BankDetailsModal bank={bank} selectedProduct="Essence" onClose={vi.fn()} />);

    expect(screen.queryByRole("region", { name: "Selected product fit evidence" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Generate Pitchbook" }));

    const [url] = vi.mocked(window.open).mock.calls[0];
    const pitchbook = new URL(url!, "https://finastra.local");
    expect(pitchbook.searchParams.get("cert")).toBe("33947");
    expect(pitchbook.searchParams.has("fit")).toBe(false);
  });
});
