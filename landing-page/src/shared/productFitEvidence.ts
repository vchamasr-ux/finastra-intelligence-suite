export interface ProductFitEvidence {
  productName: string;
  score: number;
  sourcePeriod: string | null;
  drivers: string[];
  ruleExplanation: {
    baseline: string;
    segment: string;
    profitability: string;
    kpis: string;
    finalization: string;
  };
}

export function formatFdicReportPeriod(period: string | null): string {
  if (!period) return "Reporting date unavailable";
  const match = /^(\d{4})(\d{2})(\d{2})$/.exec(period);
  if (!match) return period;

  const [, year, month, day] = match;
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
    .toLocaleDateString("en-US", { timeZone: "UTC" });
}

export function parseProductFitEvidence(value: string | null): ProductFitEvidence | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<ProductFitEvidence>;
    if (
      typeof parsed.productName !== "string" ||
      typeof parsed.score !== "number" ||
      !Number.isFinite(parsed.score) || parsed.score < 0 || parsed.score > 100 ||
      !(typeof parsed.sourcePeriod === "string" || parsed.sourcePeriod === null) ||
      !Array.isArray(parsed.drivers) ||
      !parsed.drivers.every((driver): driver is string => typeof driver === "string") ||
      !parsed.ruleExplanation ||
      !["baseline", "segment", "profitability", "kpis", "finalization"].every(
        (key) => typeof parsed.ruleExplanation?.[key as keyof ProductFitEvidence["ruleExplanation"]] === "string",
      )
    ) return null;

    return {
      productName: parsed.productName,
      score: parsed.score,
      sourcePeriod: parsed.sourcePeriod,
      drivers: parsed.drivers,
      ruleExplanation: parsed.ruleExplanation as ProductFitEvidence["ruleExplanation"],
    };
  } catch {
    return null;
  }
}

export function buildPitchbookUrl(
  baseUrl: string,
  cert: string,
  evidence: ProductFitEvidence,
  origin = "https://finastra.local",
): string {
  const url = new URL(baseUrl, origin);
  url.searchParams.set("cert", cert);
  url.searchParams.set("product", evidence.productName);
  url.searchParams.set("fit", JSON.stringify(evidence));
  return baseUrl.startsWith("/") ? `${url.pathname}${url.search}` : url.toString();
}
