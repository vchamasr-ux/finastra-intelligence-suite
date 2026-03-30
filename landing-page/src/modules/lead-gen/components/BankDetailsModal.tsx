import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import {
  X,
  Activity,
  AlertCircle,
  Building2,
  BarChart3,
  Fingerprint,
  Target,
  Presentation,
} from "lucide-react";
import { formatCurrency } from "../lib/utils";
import type { BankIntel } from "../lib/engine";
import { buildAccountHypothesis } from "../lib/hypothesis";
import { NeedleGauge } from "./NeedleGauge";
import {
  fetchCfpbComplaints,
  fetchAppRating,
  fetchFedFundsRate,
  fetchPopulationGrowth,
} from "../lib/external";
import { PRODUCT_KPI_MAP } from "../lib/scoring/product_kpis";

function formatAssetTier(tier: string) {
  switch (tier?.toLowerCase()) {
    case "over_250b":
      return ">$250B";
    case "250b_100b":
      return "$100B - $250B";
    case "100b_50b":
      return "$50B - $100B";
    case "50b_10b":
      return "$10B - $50B";
    case "10b_1b":
      return "$1B - $10B";
    case "under_1b":
      return "<$1B";
    default:
      return tier?.replace("_", " ").toUpperCase() || "Unknown";
  }
}

interface PeerSegment {
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
  coreDip: number; // Added Core Deposit Profile
}

const getDynamicPeerSegment = (tier: string): PeerSegment => {
  // Default fallback if session storage is empty or fails
  let seg: PeerSegment = {
    name: tier,
    roa: 1.0,
    roe: 10.0,
    eff: 60.0,
    nim: 3.0,
    nonix: 1000,
    nonii: 500,
    yldln: 5.0,
    nco: 0.3,
    ltd: 75,
    cir: 35,
    rer: 45,
    coreDip: 75.0,
  };

  try {
    const raw = sessionStorage.getItem("finastra_lead_gen_v2_cache");
    if (raw) {
      const cached = JSON.parse(raw);
      const banks = ((cached.data as BankIntel[]) || []).filter(
        (b) => b.assetTier === tier,
      );
      if (banks.length > 0) {
        const median = (arr: number[]) => {
          const sorted = arr
            .filter((n) => typeof n === "number" && !isNaN(n))
            .sort((a, b) => a - b);
          if (sorted.length === 0) return 0;
          const mid = Math.floor(sorted.length / 2);
          return sorted.length % 2 !== 0
            ? sorted[mid]
            : (sorted[mid - 1] + sorted[mid]) / 2;
        };

        seg = {
          name: tier,
          roa: median(banks.map((b) => b.features.roa)),
          roe: median(banks.map((b) => b.features.roe)),
          eff: median(banks.map((b) => b.features.efficiencyRatio)),
          nim: median(banks.map((b) => b.features.netMargin)),
          nonix: median(banks.map((b) => b.features.nonIntExpense)),
          nonii: median(banks.map((b) => b.features.nonIntIncome)),
          yldln: median(banks.map((b) => b.features.yieldOnLoans)),
          nco: median(banks.map((b) => b.features.netChargeOffsRatio)) * 100, // Convert to %
          ltd: median(banks.map((b) => b.features.loanToDepositRatio)) * 100, // Convert to %
          cir: median(banks.map((b) => b.features.commercialLoanRatio)) * 100,
          rer: median(banks.map((b) => b.features.realEstateRatio)) * 100,
          coreDip:
            median(
              banks.map(
                (b) =>
                  b.features.totalDeposits /
                  Math.max(b.features.totalAssets, 1),
              ),
            ) * 100,
        };
      }
    }
  } catch (e) {
    console.warn(
      "Failed to dynamically calculate peer medians, using fallback.",
    );
  }
  return seg;
};

const getPeerComplaints = (assetsB: number) => {
  if (assetsB >= 250) return 250000;
  if (assetsB >= 100) return 45000;
  if (assetsB >= 50) return 15000;
  if (assetsB >= 10) return 2500;
  if (assetsB >= 1) return 250;
  return 45;
};

interface BankDetailsModalProps {
  bank: BankIntel | null;
  selectedProduct?: string;
  onClose: () => void;
}

export function BankDetailsModal({
  bank,
  selectedProduct,
  onClose,
}: BankDetailsModalProps) {
  const [rawData, setRawData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dataWarning, setDataWarning] = useState<string | null>(null);
  const [externalData, setExternalData] = useState<{
    cfpb: number | null;
    itunes: number | null;
    popGrowth: number | null;
    fedFunds: number | null;
  }>({ cfpb: null, itunes: null, popGrowth: null, fedFunds: null });

  useEffect(() => {
    if (!bank) return;

    async function fetchDetails() {
      setLoading(true);
      setDataWarning(null);
      try {
        const fields =
          "CERT,REPDTE,ASSET,DEP,LNLSNET,LNCI,SZLNRES,LNCON,NTLNLS,NONII,NONIX,ERNASTR,EEFFR,ROA,ROE,NIMY,LNRE,INTINCY,COSTDEP";
        const url = `https://api.fdic.gov/banks/financials?filters=CERT:${bank!.fdicCert}&fields=${fields}&limit=21&sort_by=REPDTE&sort_order=DESC`;
        const res = await axios.get(url);
        if (res.data?.data && res.data.data.length > 0) {
          const latestData = res.data.data[0].data;
          const oldestData = res.data.data[res.data.data.length - 1].data;
          let assetGrowth5Y = 0;
          let depGrowth5Y = 0;
          if (oldestData.ASSET > 0)
            assetGrowth5Y =
              ((latestData.ASSET - oldestData.ASSET) / oldestData.ASSET) * 100;
          if (oldestData.DEP > 0)
            depGrowth5Y =
              ((latestData.DEP - oldestData.DEP) / oldestData.DEP) * 100;

          setRawData({
            ...latestData,
            ASSET5Y_GROWTH: assetGrowth5Y,
            DEP5Y_GROWTH: depGrowth5Y,
          });
        }
      } catch (err: any) {
        console.error("FDIC financials fetch failed:", err);
        setDataWarning(
          "FDIC data unavailable — displaying N/A for financial metrics.",
        );
        setLoading(false);
        return;
      }

      // External signals
      const safe = async (fn: () => Promise<any>) => {
        try {
          return await fn();
        } catch {
          return null;
        }
      };

      try {
        const cfpb = await safe(() => fetchCfpbComplaints(bank!.name));
        const itunes = await safe(() =>
          fetchAppRating(bank!.name, bank!.fdicCert),
        );

        // Supplementary signals — degrade gracefully on failure
        const fedFunds = await safe(() => fetchFedFundsRate());
        const popGrowth = await safe(() => fetchPopulationGrowth(bank!.state));

        setExternalData({ cfpb, itunes, fedFunds, popGrowth });
        setLoading(false);
      } catch (err: any) {
        // Log but don't crash — external signals are non-critical
        console.error("External signals fetch error:", err);
        setLoading(false);
      }
    }
    fetchDetails();
  }, [bank]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!bank) return null;

  const getKPIs = () => {
    if (!rawData) return [];

    const assets = rawData.ASSET;
    const deposits = rawData.DEP;
    const totalLoans = rawData.LNLSNET;
    const assetsB = (assets || 1000000) / 1000000;
    const peers = getDynamicPeerSegment(bank.assetTier);

    const productName =
      selectedProduct && selectedProduct !== "all"
        ? selectedProduct
        : bank.productScores[0]?.productName || "Essence";
    const kpis = PRODUCT_KPI_MAP[productName] || PRODUCT_KPI_MAP["Essence"];

    return kpis.map((kpi) => {
      let val: number | undefined = undefined;
      let peerVal = 0;

      switch (kpi.key) {
        case "yieldOnLoans":
          val = rawData.INTINCY ?? undefined;
          peerVal = peers.yldln;
          break;
        case "commercialLoanRatio":
          val =
            rawData.LNCI !== undefined && totalLoans
              ? (rawData.LNCI / totalLoans) * 100
              : undefined;
          peerVal = peers.cir;
          break;
        case "loanToDepositRatio":
          val =
            totalLoans && deposits ? (totalLoans / deposits) * 100 : undefined;
          peerVal = peers.ltd;
          break;
        case "netChargeOffsRatio":
          val =
            rawData.NTLNLS !== undefined && totalLoans
              ? (rawData.NTLNLS / totalLoans) * 100
              : undefined;
          peerVal = peers.nco;
          break;
        case "efficiencyRatio":
          val = rawData.EEFFR ?? undefined;
          peerVal = peers.eff;
          break;
        case "netMargin":
          val = rawData.NIMY ?? undefined;
          peerVal = peers.nim;
          break;
        case "realEstateRatio":
          val =
            rawData.LNRE !== undefined && totalLoans
              ? (rawData.LNRE / totalLoans) * 100
              : rawData.SZLNRES !== undefined && totalLoans
                ? (rawData.SZLNRES / totalLoans) * 100
                : undefined;
          peerVal = peers.rer;
          break;
        case "nonIntIncome":
          val = rawData.NONII !== undefined ? rawData.NONII / 1000 : undefined;
          peerVal = peers.nonii;
          break;
        case "nonIntExpense":
          val = rawData.NONIX !== undefined ? rawData.NONIX / 1000 : undefined;
          peerVal = peers.nonix;
          break;
        case "roa":
          val = rawData.ROA ?? undefined;
          peerVal = peers.roa;
          break;
        case "roe":
          val = rawData.ROE ?? undefined;
          peerVal = peers.roe;
          break;
        case "assetGrowth5Y":
          val = rawData.ASSET5Y_GROWTH ?? undefined;
          peerVal = 15;
          break;
        case "depositGrowth5Y":
          val = rawData.DEP5Y_GROWTH ?? undefined;
          peerVal = 12;
          break;
        case "cfpbComplaints":
          val = externalData.cfpb ?? undefined;
          peerVal = getPeerComplaints(assetsB);
          break;
        case "appRating":
          val = externalData.itunes ?? undefined;
          peerVal = 4.2;
          break;
        case "populationGrowth":
          val = externalData.popGrowth ?? undefined;
          peerVal = 3.5;
          break;
        case "fedFundsRate":
          val = externalData.fedFunds ?? undefined;
          peerVal = 3.5;
          break;
      }

      const minMultiple = kpi.lowerIsBetter ? 0.4 : 0.6;
      const maxMultiple = kpi.lowerIsBetter ? 1.6 : 1.4;

      return {
        label: kpi.label,
        value: val,
        avg: peerVal,
        min: kpi.key === "netChargeOffsRatio" ? 0.1 : peerVal * minMultiple,
        max:
          kpi.key === "netChargeOffsRatio"
            ? peerVal * 2
            : peerVal * maxMultiple,
        format: kpi.format,
        lowerIsBetter: kpi.lowerIsBetter,
      };
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-stretch justify-center bg-slate-950/85 backdrop-blur-sm">
      <div className="bg-[#0d1012] border-x border-slate-800/60 shadow-2xl w-full h-full overflow-hidden flex flex-col relative">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/5 bg-slate-900/40">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <Building2 className="w-5 h-5 text-slate-400" />
              <h2 className="text-2xl font-semibold text-white tracking-tight">
                {bank.name}
              </h2>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
              <span className="flex items-center gap-1">
                <Fingerprint className="w-4 h-4" /> FDIC Cert: {bank.fdicCert}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                {formatAssetTier(bank.assetTier)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                window.open(
                  `${import.meta.env.VITE_PITCHBOOK_URL ?? "/pitchbook"}/?cert=${bank.fdicCert}`,
                  "_blank",
                )
              }
              className="bg-[#c137a2] hover:bg-[#a12a86] text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-[#c137a2]/20"
            >
              <Presentation className="w-4 h-4" />
              Generate Pitchbook
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Soft data warning banner */}
          {dataWarning && (
            <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {dataWarning} Metrics show{" "}
                <span className="text-red-400 font-semibold">N/A</span> where
                data is missing.
              </span>
            </div>
          )}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-finastra-fuchsia border-t-transparent animate-spin mb-4" />
              <p className="text-slate-500 font-medium">
                Extracting deterministic live features from FDIC and Alternative
                Sources...
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Executive Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-panel p-5 rounded-xl border border-white/5 bg-slate-800/20 text-center">
                  <span className="text-sm font-medium text-slate-400 uppercase tracking-widest block mb-1">
                    Total Assets
                  </span>
                  <span className="text-2xl font-bold text-white tracking-tight">
                    {rawData ? (
                      formatCurrency((rawData.ASSET || 0) * 1000)
                    ) : (
                      <span className="text-red-400">N/A</span>
                    )}
                  </span>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-finastra-fuchsia/20 bg-finastra-fuchsia/5 text-center relative z-50 overflow-visible group cursor-help">
                  <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
                    <Target className="w-12 h-12" />
                  </div>
                  <span className="text-sm font-medium text-finastra-fuchsia tracking-widest block mb-1 uppercase">
                    Top Product:{" "}
                    {bank.productScores[0]?.productName || "Unknown"} Fit
                  </span>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-white tracking-tight">
                      {bank.productScores[0]?.score || 0}
                    </span>
                    <span className="text-sm text-finastra-fuchsia font-medium">
                      / 100
                    </span>
                  </div>

                  {/* Tooltip for Score Breakdown */}
                  {bank.productScores[0]?.reasons &&
                    bank.productScores[0].reasons.length > 0 && (
                      <div className="absolute top-[80%] z-50 mt-4 w-72 bg-slate-900 border border-finastra-fuchsia/40 rounded-xl shadow-2xl p-4 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none left-1/2 -translate-x-1/2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-white/10 pb-2 text-left">
                          Score Breakdown
                        </div>
                        <div className="space-y-3">
                          {bank.productScores[0].reasons.map((reason, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 text-xs"
                            >
                              <span className="text-finastra-fuchsia mt-0.5 font-bold">
                                ✓
                              </span>
                              <span className="text-slate-300 text-left leading-relaxed">
                                {reason}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                          <span className="text-white uppercase tracking-wider">
                            Total Match
                          </span>
                          <span className="text-finastra-fuchsia font-mono text-base">
                            {bank.productScores[0]?.score}
                          </span>
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* Deterministic Breakdown */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-slate-300" />
                  <h3 className="text-lg font-medium text-white">
                    Deterministic Scoring Breakdown
                  </h3>
                </div>

                <div className="p-5 rounded-xl border border-violet-500/20 bg-violet-500/5 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-violet-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-violet-300 mb-1">
                        Why this matters
                      </h4>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        This institution was flagged as a highly viable
                        <strong className="text-white mx-1">
                          Product Target
                        </strong>
                        based on exact quarter-end Call Report disclosures
                        submitted to the FDIC. The metrics below outline the
                        specific financial pressures validating this
                        recommendation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {getKPIs().map((kpi, i) => (
                    <NeedleGauge key={i} {...(kpi as any)} />
                  ))}
                </div>
              </div>

              {/* Account Hypothesis */}
              {bank.features && (
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-slate-300" />
                    <h3 className="text-lg font-medium text-white">
                      Outreach Hypothesis
                    </h3>
                  </div>

                  {(() => {
                    const hypothesis = buildAccountHypothesis(bank);
                    return (
                      <div className="p-5 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-4">
                        <div>
                          <h4 className="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-1">
                            Primary Message
                          </h4>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            {hypothesis.primaryMessage}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-1">
                            Cold Email Hook
                          </h4>
                          <p className="text-sm font-medium italic text-white leading-relaxed">
                            "{hypothesis.hook}"
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-1">
                            Supporting Evidence
                          </h4>
                          <ul className="list-disc pl-4 space-y-1">
                            {hypothesis.supportingFacts.map((fact, idx) => (
                              <li key={idx} className="text-xs text-slate-400">
                                {fact}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Alternative Intelligence Signals */}
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-slate-300" />
                  <h3 className="text-lg font-medium text-white">
                    Alternative Intelligence Signals
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="glass-panel p-5 rounded-xl border border-white/5 bg-slate-800/40 text-left flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">
                        CFPB Dissatisfaction
                      </span>
                      <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                        Volumes of consumer complaints filed with CFPB. Serves
                        as a reverse-NPS proxy.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 mt-auto">
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-white tracking-tight">
                          {externalData.cfpb !== null
                            ? externalData.cfpb.toLocaleString()
                            : "-"}
                        </span>
                        <span className="text-sm text-slate-500 font-medium mb-1 border-b border-slate-700 pb-0.5">
                          YTD Complaints
                        </span>
                      </div>
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-400">
                          Est. Tier Benchmark
                        </span>
                        <span className="text-slate-300">
                          {rawData
                            ? getPeerComplaints(
                                (rawData.ASSET || 1000000) / 1000000,
                              ).toLocaleString()
                            : "50"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {externalData.itunes !== null ? (
                    <div className="glass-panel p-5 rounded-xl border border-white/5 bg-slate-800/40 text-left flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">
                          Mobile App Rating
                        </span>
                        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                          Aggregated rating from iTunes. Strong indicator for
                          digital account opening up-sell.
                        </p>
                      </div>
                      <div className="flex flex-col gap-3 mt-auto">
                        <div className="flex items-end gap-2">
                          <span className="text-3xl font-bold text-white tracking-tight">
                            {externalData.itunes.toFixed(1)}
                          </span>
                          <span className="text-sm text-yellow-500 font-medium mb-1">
                            ★ / 5.0
                          </span>
                        </div>
                        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-medium">
                          <span className="text-slate-400">Peer Average</span>
                          <span className="text-slate-300">4.2 ★</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="glass-panel p-5 rounded-xl border border-white/5 bg-slate-800/40 text-left flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">
                          Core Deposit Profile
                        </span>
                        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                          Ratio of total deposits to assets. Stand-in metric
                          prioritizing liquidity and stability.
                        </p>
                      </div>
                      <div className="flex flex-col gap-3 mt-auto">
                        <div className="flex items-end gap-2">
                          <span className="text-3xl font-bold text-white tracking-tight">
                            {(
                              ((rawData?.DEP || 1) / (rawData?.ASSET || 1)) *
                              100
                            ).toFixed(1)}
                          </span>
                          <span className="text-sm text-slate-500 font-medium mb-1 border-b border-slate-700 pb-0.5">
                            % ratio
                          </span>
                        </div>
                        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-medium">
                          <span className="text-slate-400">Peer Median</span>
                          <span className="text-slate-300">
                            {rawData
                              ? getDynamicPeerSegment(
                                  bank.assetTier,
                                ).coreDip.toFixed(1)
                              : "75.0"}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
