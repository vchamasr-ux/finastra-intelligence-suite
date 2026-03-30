/**
 * Pure-logic helper functions extracted from PresentationViewer.tsx
 * for independent testability.
 */

export type FormatType = "percent" | "billions" | "millions" | "number";

export const formatValue = (val: number | undefined, format: FormatType): string => {
  if (val === undefined || val === null) return "N/A";
  if (format === "percent") {
    const decimals = Math.abs(val) >= 10 ? 1 : 2;
    return `${val.toFixed(decimals)}%`;
  }
  if (format === "billions") return `$${val.toFixed(1)}B`;
  if (format === "number") return new Intl.NumberFormat('en-US').format(Math.round(val));
  if (format === "millions" && Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(1)}B`;
  return `$${val.toFixed(1)}M`;
};

export interface PeerSegment {
  name: string;
  roa: number;
  roe: number;
  eff: number;
  nim: number;
  nonix: number;
  nonii: number;
  yldln: number;
  nco: number;
  ltd: number;
  cir: number;
  rer: number;
  assetGrowth: number;
  depGrowth: number;
  nonixGrowth: number;
}

export const getPeerSegment = (assetsB: number): PeerSegment => {
  if (assetsB >= 250) return { name: ">250B", roa: 1.25, roe: 14.5, eff: 58.0, nim: 3.1, nonix: 15000, nonii: 8000, yldln: 5.5, nco: 0.45, ltd: 65, cir: 45, rer: 35, assetGrowth: 25.0, depGrowth: 20.0, nonixGrowth: 15.0 };
  if (assetsB >= 100) return { name: "250B to 100B", roa: 1.15, roe: 13.0, eff: 59.5, nim: 3.2, nonix: 4000, nonii: 1500, yldln: 5.7, nco: 0.40, ltd: 70, cir: 40, rer: 40, assetGrowth: 22.0, depGrowth: 18.0, nonixGrowth: 13.0 };
  if (assetsB >= 50) return { name: "100B to 50B", roa: 1.10, roe: 12.0, eff: 61.0, nim: 3.3, nonix: 1500, nonii: 500, yldln: 5.8, nco: 0.35, ltd: 75, cir: 35, rer: 45, assetGrowth: 20.0, depGrowth: 16.0, nonixGrowth: 11.0 };
  if (assetsB >= 10) return { name: "50B to 10B", roa: 1.05, roe: 11.5, eff: 62.5, nim: 3.4, nonix: 400, nonii: 120, yldln: 5.9, nco: 0.30, ltd: 80, cir: 30, rer: 50, assetGrowth: 18.0, depGrowth: 14.0, nonixGrowth: 9.0 };
  if (assetsB >= 1) return { name: "10B to 1B", roa: 1.00, roe: 10.5, eff: 64.0, nim: 3.5, nonix: 60, nonii: 15, yldln: 6.0, nco: 0.25, ltd: 85, cir: 25, rer: 55, assetGrowth: 15.0, depGrowth: 12.0, nonixGrowth: 7.0 };
  return { name: "less than 1B", roa: 0.90, roe: 9.5, eff: 67.0, nim: 3.6, nonix: 15, nonii: 3, yldln: 6.2, nco: 0.20, ltd: 90, cir: 20, rer: 60, assetGrowth: 12.0, depGrowth: 10.0, nonixGrowth: 5.0 };
};

export interface CashFlowEntry {
  year: string;
  flow: number;
  cumulative: number;
}

/**
 * Builds the 5-year DCF cash flow projection.
 * @param assetB - Total assets in billions
 * @returns Array of 6 entries: CapEx + Y1-Y5
 */
export const buildCashFlowData = (assetB: number): CashFlowEntry[] => {
  const currentOpEx = assetB * 1000 * 0.015;
  const implementationCost = -(currentOpEx * 0.005);
  const yearGains = [0.05, 0.08, 0.10, 0.12, 0.15];

  let cumulative = implementationCost;
  const data: CashFlowEntry[] = [
    { year: 'CapEx', flow: implementationCost, cumulative }
  ];

  for (let i = 0; i < yearGains.length; i++) {
    const annualSavings = currentOpEx * yearGains[i];
    cumulative += annualSavings;
    data.push({ year: `Y${i + 1}`, flow: annualSavings, cumulative });
  }

  return data;
};
