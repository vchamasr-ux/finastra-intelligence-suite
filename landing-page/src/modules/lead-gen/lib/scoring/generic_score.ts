import type { BankFeatures } from '../engine';
import { PRODUCT_KPI_MAP } from './product_kpis';

export interface ProductScore {
  productName: string;
  score: number;
  reasons: string[];
}

const getPeerSegment = (assetsB: number) => {
  if (assetsB >= 250) return { roa: 1.25, roe: 14.5, eff: 58.0, nim: 3.1, nonix: 15000, nonii: 8000, yldln: 5.5, nco: 0.45, ltd: 65, cir: 45, rer: 35, ast_gr: 15, dep_gr: 12, ln_gr: 14 };
  if (assetsB >= 100) return { roa: 1.15, roe: 13.0, eff: 59.5, nim: 3.2, nonix: 4000, nonii: 1500, yldln: 5.7, nco: 0.40, ltd: 70, cir: 40, rer: 40, ast_gr: 20, dep_gr: 18, ln_gr: 19 };
  if (assetsB >= 50) return { roa: 1.10, roe: 12.0, eff: 61.0, nim: 3.3, nonix: 1500, nonii: 500, yldln: 5.8, nco: 0.35, ltd: 75, cir: 35, rer: 45, ast_gr: 25, dep_gr: 22, ln_gr: 24 };
  if (assetsB >= 10) return { roa: 1.05, roe: 11.5, eff: 62.5, nim: 3.4, nonix: 400, nonii: 120, yldln: 5.9, nco: 0.30, ltd: 80, cir: 30, rer: 50, ast_gr: 30, dep_gr: 28, ln_gr: 29 };
  if (assetsB >= 1) return { roa: 1.00, roe: 10.5, eff: 64.0, nim: 3.5, nonix: 60, nonii: 15, yldln: 6.0, nco: 0.25, ltd: 85, cir: 25, rer: 55, ast_gr: 35, dep_gr: 32, ln_gr: 34 };
  return { roa: 0.90, roe: 9.5, eff: 67.0, nim: 3.6, nonix: 15, nonii: 3, yldln: 6.2, nco: 0.20, ltd: 90, cir: 20, rer: 60, ast_gr: 40, dep_gr: 38, ln_gr: 39 };
};

export function scoreProduct(product: any, features: BankFeatures): ProductScore {
  let score = 50;
  const reasons: string[] = ["Base Score: +50 pts (Starting Baseline)"];
  
  const productName = product["Product/solution"];
  const seg = (product["Target segments"] || "").toLowerCase();

  const assetsB = features.totalAssets / 1_000_000;
  const peers = getPeerSegment(assetsB);

  // Hard Segment adjustments
  if (seg.includes('mid-market') || seg.includes('community') || seg.includes('credit union')) {
    if (features.assetTier === 'national_megabank' || features.assetTier === 'national') {
      return { productName, score: 0, reasons: ["-50 pts: Target segment mismatch (Product is for Community, bank is Mega)."] };
    } else if (features.assetTier === 'community' || features.assetTier === 'micro' || features.assetTier === 'regional') {
      score += 10;
      reasons.push("+10 pts: Target segment strongly aligns with bank's asset tier.");
    }
  } else if (seg.includes('large') || seg.includes('global') || seg.includes('complex')) {
    if (features.assetTier === 'micro' || features.assetTier === 'community') {
      return { productName, score: 0, reasons: ["-50 pts: Target segment mismatch (Product requires enterprise scale)."] };
    } else if (features.assetTier === 'national' || features.assetTier === 'national_megabank') {
      score += 15;
      reasons.push("+15 pts: Product targets enterprise scale matching bank's massive tier.");
    }
  }

  // Hard Gate: Unprofitable Small Banks Penalty
  if (assetsB < 10 && (features.roe < 0 || features.roa < 0)) {
    score -= 40;
    reasons.push("-40 pts: Negative profitability at community scale limits IT CapEx.");
  }

  // Dynamic 6-KPI Extraction
  const kpis = PRODUCT_KPI_MAP[productName] || PRODUCT_KPI_MAP['Essence'];

  const formatVal = (format: string, raw: number): string => {
    if (format === 'millions') {
      const m = raw / 1000;
      return m >= 1000 ? `$${(m / 1000).toFixed(1)}B` : `$${m.toFixed(0)}M`;
    }
    if (format === 'percent') return `${raw.toFixed(1)}%`;
    return raw.toFixed(1);
  };

  for (const kpi of kpis) {
    let val = (features as any)[kpi.key];
    
    if (val === null || val === undefined || Number.isNaN(val)) {
      reasons.push(`+0 pts: ${kpi.label} data is unavailable for peer benchmarking.`);
      continue;
    }

    if (kpi.key === 'commercialLoanRatio' || kpi.key === 'realEstateRatio' || kpi.key === 'loanToDepositRatio' || kpi.key === 'netChargeOffsRatio') {
      val = val * 100;
    }

    let peerVal = 0;
    switch (kpi.key) {
      case 'assetGrowth5Y': peerVal = peers.ast_gr; break;
      case 'depositGrowth5Y': peerVal = peers.dep_gr; break;
      case 'loanGrowth5Y': peerVal = peers.ln_gr; break;
      case 'yieldOnLoans': peerVal = peers.yldln; break;
      case 'commercialLoanRatio': peerVal = peers.cir; break;
      case 'loanToDepositRatio': peerVal = peers.ltd; break;
      case 'netChargeOffsRatio': peerVal = peers.nco; break;
      case 'efficiencyRatio': peerVal = peers.eff; break;
      case 'netMargin': peerVal = peers.nim; break;
      case 'realEstateRatio': peerVal = peers.rer; break;
      case 'nonIntIncome': peerVal = peers.nonii; break;
      case 'nonIntExpense': peerVal = peers.nonix; break;
      case 'roa': peerVal = peers.roa; break;
      case 'roe': peerVal = peers.roe; break;
    }

    const isScaleDriven = 
      product["Product/solution"].includes('Essence') || 
      product["Product/solution"].includes('Core') ||
      (product["Concise description"] || "").toLowerCase().includes('core') ||
      (product["Concise description"] || "").toLowerCase().includes('hub') ||
      (product["Primary use cases"] || "").toLowerCase().includes('modernization');

    if (peerVal > 0) {
      const displayVal = formatVal(kpi.format, val);
      const displayPeer = formatVal(kpi.format, peerVal);
      
      if (kpi.lowerIsBetter) {
        if (val > peerVal * 1.05) {
          score += 8;
          let msg = `Elevated ${kpi.label} (${displayVal} vs peer ${displayPeer}) limits operational efficiency.`;
          if (kpi.key.includes('Expense') || kpi.key.includes('Ratio')) {
            msg = `Bloated ${kpi.label} (${displayVal} vs peer ${displayPeer}) demands immediate cost-takeout automation.`;
          } else if (kpi.key.includes('ChargeOff')) {
            msg = `Elevated ${kpi.label} (${displayVal} vs peer ${displayPeer}) triggers urgent risk-management needs.`;
          }
          reasons.push(`+8 pts: ${msg}`);
        }
      } else {
        if (isScaleDriven) {
          if (val > peerVal * 1.05) {
            score += 8;
            reasons.push(`+8 pts: High-velocity ${kpi.label} (${displayVal} vs peer ${displayPeer}) stresses legacy core scalability.`);
          }
        } else {
          if (val < peerVal * 0.95) {
            score += 8;
            let msg = `Underperforming ${kpi.label} (${displayVal} vs peer ${displayPeer}) uncovers an immediate modernization priority.`;
            if (kpi.key.includes('Ratio') || kpi.key.includes('Deposit')) {
              msg = `Lagging ${kpi.label} (${displayVal} vs peer ${displayPeer}) signals suboptimal balance sheet mix.`;
            } else if (kpi.key.includes('Income') || kpi.key.includes('Margin') || kpi.key.includes('Yield')) {
              msg = `Below-average ${kpi.label} (${displayVal} vs peer ${displayPeer}) exposes core revenue vulnerability.`;
            } else if (kpi.key.includes('Growth')) {
              msg = `Sluggish ${kpi.label} (${displayVal} vs peer ${displayPeer}) indicates market share loss to modern players.`;
            }
            reasons.push(`+8 pts: ${msg}`);
          }
        }
      }
    } else if (kpi.key === 'totalDeposits') {
      if (features.totalDeposits > 5_000_000) {
        score += 8;
        reasons.push(`+8 pts: Massive deposit scale ($${(features.totalDeposits/1_000_000).toFixed(1)}B) aligns perfectly. `);
      }
    } else if (kpi.key === 'totalAssets') {
      if (assetsB > 10) {
        score += 8;
        reasons.push(`+8 pts: Asset scale ($${assetsB.toFixed(1)}B) warrants enterprise infrastructure.`);
      }
    }
  }

  // Clamp
  const finalScore = Math.min(100, Math.max(0, Math.round(score)));
  
  if (reasons.length === 1) {
    reasons.push("0 pts: Standard solution appropriate for current operating profile.");
  }

  return {
    productName,
    score: finalScore,
    reasons: reasons.slice(0, 5) 
  };
}
