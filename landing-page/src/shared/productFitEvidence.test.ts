import { describe, expect, it } from "vitest";
import { buildPitchbookUrl, formatFdicReportPeriod, parseProductFitEvidence } from "./productFitEvidence";

const evidence = {
  productName: "Fusion CreditQuest",
  score: 82,
  sourcePeriod: "20251231",
  drivers: ["+8 pts: Yield on Loans (6.1% vs peer 5.9%)."],
  ruleExplanation: {
    baseline: "Scoring starts at 50 points.",
    segment: "No target-segment adjustment applied.",
    profitability: "The under-$10B negative-ROE/negative-ROA penalty was not triggered.",
    kpis: "Each qualifying KPI adds 8 points.",
    finalization: "Fit is 82/100.",
  },
};

describe("product fit evidence handoff", () => {
  it("carries bank identity, selected product, and score evidence into the pitchbook URL", () => {
    const url = new URL(buildPitchbookUrl("/pitchbook", "628", evidence), "https://finastra.local");

    expect(url.searchParams.get("cert")).toBe("628");
    expect(url.searchParams.get("product")).toBe(evidence.productName);
    expect(parseProductFitEvidence(url.searchParams.get("fit"))).toEqual(evidence);
  });

  it("preserves an absolute pitchbook origin and existing query parameters", () => {
    const url = new URL(buildPitchbookUrl("https://pitch.example/pitchbook?theme=bank", "628", evidence));

    expect(url.origin).toBe("https://pitch.example");
    expect(url.searchParams.get("theme")).toBe("bank");
    expect(url.searchParams.get("product")).toBe(evidence.productName);
  });

  it("rejects malformed or out-of-range evidence", () => {
    expect(parseProductFitEvidence("not-json")).toBeNull();
    expect(parseProductFitEvidence(JSON.stringify({ ...evidence, score: 101 }))).toBeNull();
  });

  it("formats the exact FDIC report date and makes missing dates explicit", () => {
    expect(formatFdicReportPeriod("20251231")).toBe("12/31/2025");
    expect(formatFdicReportPeriod(null)).toBe("Reporting date unavailable");
  });
});
