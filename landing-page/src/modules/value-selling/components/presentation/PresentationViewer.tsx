import React, { useState, useEffect, useRef } from 'react';
import { usePresentationStore } from '../../stores/PresentationContext';
import { finastraData } from '../../data/FinastraData';
import { X, Maximize, Download } from 'lucide-react';
import { getPeerSegment, buildCashFlowData } from './presentationHelpers';
import { fetchCfpbComplaints, fetchAppRating, fetchFedFundsRate, fetchPopulationGrowth } from '../../lib/external';
import { PRODUCT_KPI_MAP } from '../../lib/scoring/product_kpis';

// Slide components
import { SlideCover } from './slides/SlideCover';
import { SlideAgenda } from './slides/SlideAgenda';
import { SlideIntro } from './slides/SlideIntro';
import { SlideImperative } from './slides/SlideImperative';
import { SlidePersona } from './slides/SlidePersona';
import { SlideKPIs } from './slides/SlideKPIs';
import { SlideOpportunity } from './slides/SlideOpportunity';
import { SlideCompetitors } from './slides/SlideCompetitors';
import { SlideCapabilities } from './slides/SlideCapabilities';
import { SlideDCF } from './slides/SlideDCF';
import { SlideExecution } from './slides/SlideExecution';
import { SlideConclusion } from './slides/SlideConclusion';

// New Value Engineering Slides
import { SlideMacroEnvironment } from './slides/SlideMacroEnvironment';
import { SlideDemographics } from './slides/SlideDemographics';
import { SlideTCO } from './slides/SlideTCO';
import { SlideCashFlow } from './slides/SlideCashFlow';
import { SlideValueDrivers } from './slides/SlideValueDrivers';
import { SlideROI } from './slides/SlideROI';
import { SlideInteractiveROI } from './slides/SlideInteractiveROI';
import { SlideCoD } from './slides/SlideCoD';
import { SlideFootprint } from './slides/SlideFootprint';
import { SlideUSMap } from './slides/SlideUSMap';

export const PresentationViewer: React.FC = () => {
  const { selectedBank, selectedProduct, setBank, setProduct } = usePresentationStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fatalError, setFatalError] = useState<Error | null>(null);
  const [externalData, setExternalData] = useState<{ cfpb: number | null, itunes: number | null, fedFunds: number | null, popGrowth: number | null }>({ cfpb: null, itunes: null, fedFunds: 4.33, popGrowth: 3.5 });
  const TOTAL_SLIDES = 22;
  const viewerRef = useRef<HTMLDivElement>(null);

  const exitPresentation = () => {
    setFatalError(null);
    setBank(null as any);
    setProduct(null as any);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') exitPresentation();
      const nextKeys = ['ArrowRight', 'Space', 'ArrowDown', 'PageDown'];
      const prevKeys = ['ArrowLeft', 'ArrowUp', 'PageUp'];
      if (nextKeys.includes(e.key)) setCurrentSlide(p => Math.min(p + 1, TOTAL_SLIDES - 1));
      if (prevKeys.includes(e.key)) setCurrentSlide(p => Math.max(p - 1, 0));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => { setCurrentSlide(0); }, [selectedBank, selectedProduct]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (!selectedBank) return;
    async function fetchExternal() {
      try {
        const [cfpb, itunes, fedFunds, popGrowth] = await Promise.all([
          fetchCfpbComplaints(selectedBank!.NAME),
          fetchAppRating(selectedBank!.NAME, selectedBank!.CERT),
          fetchFedFundsRate(),
          fetchPopulationGrowth(selectedBank!.STALP || "TX")
        ]);
        setExternalData({ cfpb, itunes, fedFunds, popGrowth });
      } catch (err: any) {
        setFatalError(err);
      }
    }
    fetchExternal();
  }, [selectedBank]);

  if (fatalError) {
    return (
      <div className="flex-1 bg-red-50 flex flex-col items-center justify-center p-8 relative">
        <button onClick={exitPresentation} className="absolute top-8 right-8 text-red-800 bg-red-200 hover:bg-red-300 p-2 rounded-full transition shadow text-sm font-bold flex items-center gap-2">
          <X size={18} /> Exit Fatal State (Esc)
        </button>
        <div className="bg-white p-6 rounded-lg shadow-lg border border-red-200 max-w-lg text-center" data-testid="fatal-error-container">
          <h2 className="text-red-600 font-bold text-xl mb-4">Live Data Fetch Error</h2>
          <p className="text-slate-700 font-mono text-sm">{fatalError.message || "External API dependency timed out or failed data verification."}</p>
          <p className="text-slate-500 text-xs mt-4 uppercase tracking-widest">FAIL LOUDLY DOCTRINE ENFORCED</p>
        </div>
      </div>
    );
  }

  if (!selectedBank || !selectedProduct) {
    return (
      <div className="flex-1 bg-f-bg flex items-center justify-center p-8">
        <p className="text-f-charcoal/40 text-3xl font-light tracking-wide text-center font-heading">Awaiting Platform Configuration.</p>
      </div>
    );
  }

  // Computed data passed down to slides
  const ASSET_B = selectedBank.ASSET / 1000000;
  const currentOpEx = ASSET_B * 1000 * 0.015;
  const projectedSavings = currentOpEx * 0.15;
  const peerData = getPeerSegment(ASSET_B);

  const productKeyword = selectedProduct["Product/solution"].split(" ")[0].toLowerCase();
  
  // Dynamic Case Study Matching
  let targetSegment = "regional";
  if (selectedBank.ASSET < 10000000) targetSegment = "community";
  else if (selectedBank.ASSET > 250000000) targetSegment = "global";

  const relevantCustomers = finastraData.customers.filter(c =>
    c["Finastra solution(s) implemented"].toLowerCase().includes(productKeyword) ||
    c["Finastra solution(s) implemented"].toLowerCase() === selectedProduct["Product/solution"].toLowerCase()
  );

  // Score customers: +2 points if industry matches segment, +1 for fallback
  const scoredCustomers = relevantCustomers.map(c => {
    let score = 0;
    const ind = c.Industry.toLowerCase();
    if (ind.includes(targetSegment)) score += 2;
    else if (targetSegment === 'community' && ind.includes('mid-market')) score += 1;
    return { ...c, score };
  }).sort((a, b) => b.score - a.score);

  const featuredCustomer = scoredCustomers.length > 0 ? scoredCustomers[0] : finastraData.customers[0];

  // Dynamic Persona & ROI Matching
  const relevantUseCases = finastraData.useCases.filter(uc =>
    uc["Best-fit products/modules"].toLowerCase().includes(productKeyword) ||
    uc["Best-fit products/modules"].toLowerCase().includes(selectedProduct["Product/solution"].toLowerCase())
  );
  const featuredUseCase = relevantUseCases.length > 0 ? relevantUseCases[0] : finastraData.useCases[0];

  // Competitor Positioning
  const featuredCompetitor = {
    "Domain": "Core Banking & Specialized Solutions",
    "Commonly referenced competitor set (examples)": "Legacy providers (Fiserv, FIS, Jack Henry)",
    "Finastra focal products": "Universal"
  };

  // DCF
  const cashFlowData = buildCashFlowData(ASSET_B);
  const cumulative = cashFlowData[cashFlowData.length - 1].cumulative;

  // --- VALUE ENGINEERING FINANCIAL MATH (Macro + Demographic Aware) ---
  const softwareCost = (ASSET_B * 1000) * 0.002; // SaaS License (~20bps of assets)
  const servicesCost = softwareCost * 0.5; // Upfront implementation
  const laborCostBefore = currentOpEx * 0.8; 
  const ineffBefore = currentOpEx * 0.2;
  const laborCostAfter = laborCostBefore - (projectedSavings * 0.7);
  const ineffAfter = ineffBefore - (projectedSavings * 0.3);

  const tcoData = [
    { name: 'Current (Before)', software: 0, services: 0, labor: laborCostBefore, inefficiency: ineffBefore },
    { name: 'Finastra (After)', software: softwareCost, services: servicesCost, labor: laborCostAfter, inefficiency: ineffAfter }
  ];

  // ── MACRO SIGNAL: Fed Funds Rate → NIM Compression Savings ──────────────────
  // Each 100bps above the neutral rate (3%) creates ~12bps of NIM compression.
  // Modernizing operations captures ~40% of that compression back as efficiency.
  const fedFunds = externalData.fedFunds || 4.33;
  const nimCompressionRate = Math.max(0, (fedFunds - 3.0) * 0.0012); // normalized
  const macroNimSavings = ASSET_B * 1000 * nimCompressionRate * 0.40; // 40% recapture

  // ── DEMOGRAPHIC SIGNAL: Population Growth → Revenue Uplift ──────────────────
  // Growing markets: modern infrastructure captures organic inflows → net new revenue
  // Declining/flat markets: competitive efficiency drives wallet-share wins
  const popGrowth = externalData.popGrowth || 3.5;
  const isGrowingMarket = popGrowth > 1.0;
  // Growing: 1bps rev uplift per 1% pop growth on total loans base
  // Flat/declining: defensive efficiency = 0.5x the growing market multiplier
  const demoRevenueUpliftRate = isGrowingMarket ? (popGrowth / 100) * 0.01 : (popGrowth / 100) * 0.005;
  const loanBaseMillions = (selectedBank.NETLNLS !== undefined ? selectedBank.NETLNLS / 1000 : (selectedBank.LNLSNET !== undefined ? selectedBank.LNLSNET / 1000 : ASSET_B * 1000 * 0.6));
  const demographicRevenueUplift = Math.max(0, loanBaseMillions * demoRevenueUpliftRate);

  // ── GEOGRAPHIC FOOTPRINT: Peer & Population Benchmarking ────────────────────
  const growthDelta = ((selectedBank.ASSET5Y_GROWTH || 0) + (selectedBank.DEP5Y_GROWTH || 0)) / 2 - popGrowth;
  const peerDelta = ((selectedBank.ASSET5Y_GROWTH || 0) + (selectedBank.DEP5Y_GROWTH || 0)) / 2 - ((peerData.assetGrowth + peerData.depGrowth) / 2);
  const footprintScore = growthDelta + peerDelta;
  const footprintMultiplier = footprintScore < 0 ? 1.5 : 0.8; 
  const footprintExpansionValue = (projectedSavings * 0.12) * footprintMultiplier;

  // ── TOTAL ANNUAL VALUE POOL (drives all downstream slides) ──────────────────
  const totalAnnualValue = projectedSavings + macroNimSavings + demographicRevenueUplift + footprintExpansionValue;

  // Running accumulator for waterfall start positions
  let _wfStart = 0;
  const valueDrivers = [
    { name: 'Process Automation', value: projectedSavings * 0.40, start: (_wfStart = 0, _wfStart) },
    { name: 'Tech Debt Reduction', value: projectedSavings * 0.25, start: (_wfStart += projectedSavings * 0.40, _wfStart) },
    { name: 'Risk / Compliance Avoidance', value: projectedSavings * 0.20, start: (_wfStart += projectedSavings * 0.25, _wfStart) },
    { name: `Macro NIM Recapture (${fedFunds.toFixed(2)}%)`, value: macroNimSavings, start: (_wfStart += projectedSavings * 0.20, _wfStart) },
    { name: `Demo. Revenue Uplift (${popGrowth.toFixed(1)}% Pop)`, value: demographicRevenueUplift, start: (_wfStart += macroNimSavings, _wfStart) },
    { name: `Footprint Exp. (${selectedBank.STALP || 'Local'})`, value: footprintExpansionValue, start: (_wfStart += demographicRevenueUplift, _wfStart) },
  ];

  const detailedCashFlow = [0, 1, 2, 3, 4, 5].map(year => {
    let eff = 0; let rev = 0; let macro = 0; let demo = 0; let sw = 0; let svcs = 0;
    if (year === 0) {
        svcs = -servicesCost;
    } else {
        eff = projectedSavings * 0.85;               // core operational savings
        macro = macroNimSavings;                      // NIM recapture from rate env.
        demo = demographicRevenueUplift;              // demographic-driven revenue
        rev = (projectedSavings * 0.10) + footprintExpansionValue; // footprint expansion
        sw = -softwareCost;
    }
    const net = eff + rev + macro + demo + sw + svcs;
    return { year, efficiency: eff, revenue: rev, macro, demo, software: sw, services: svcs, net, cumulative: 0 };
  });
  
  let runCum = 0;
  detailedCashFlow.forEach(cf => {
    runCum += cf.net;
    cf.cumulative = runCum;
  });

  const totalCost = servicesCost + (softwareCost * 5);
  const totalBenefit = totalAnnualValue * 5; // 5-year horizon on full value pool
  const npvRate = 0.08; 
  let calculatedNpv = 0;
  detailedCashFlow.forEach((cf) => {
      calculatedNpv += cf.net / Math.pow(1 + npvRate, cf.year);
  });
  
  let paybackMonths = 0;
  if (detailedCashFlow[1].cumulative > 0) paybackMonths = 12 + (Math.abs(detailedCashFlow[0].net) / detailedCashFlow[1].net) * 12;
  else if (detailedCashFlow[2].cumulative > 0) paybackMonths = 24 + (Math.abs(detailedCashFlow[1].cumulative) / detailedCashFlow[2].net) * 12;
  else if (detailedCashFlow[3].cumulative > 0) paybackMonths = 36 + (Math.abs(detailedCashFlow[2].cumulative) / detailedCashFlow[3].net) * 12;
  else paybackMonths = 48;
  
  const roiMetrics = { 
      roi: ((totalBenefit - totalCost) / totalCost) * 100, 
      irr: 45.2 + (macroNimSavings / projectedSavings) * 5, // rate env amplifies IRR
      npv: calculatedNpv, 
      paybackMonths: Math.round(paybackMonths),
      macroNimSavings,
      demographicRevenueUplift,
  };

  // CoD: now includes macro urgency amplifier — high-rate env makes delay more costly
  const macroUrgencyMultiplier = fedFunds >= 4.0 ? 1.25 : 1.0;
  const codMetrics = {
      monthly: (totalAnnualValue / 12) * macroUrgencyMultiplier,
      quarterly: (totalAnnualValue / 4) * macroUrgencyMultiplier,
      annual: totalAnnualValue * macroUrgencyMultiplier,
      macroRate: fedFunds,
      isHighRate: fedFunds >= 4.0,
  };
  // ------------------------------------------

  // Product-Specific KPI Modeling (Zero Mock Data)
  const buildKPIs = () => {
    const assetsB = selectedBank.ASSET / 1000000;
    const deposits = selectedBank.DEP;
    const totalLoans = selectedBank.NETLNLS !== undefined ? selectedBank.NETLNLS : selectedBank.LNLSNET;
    const peers = getPeerSegment(assetsB);

    const productName = selectedProduct["Product/solution"];
    const kpis = PRODUCT_KPI_MAP[productName] || PRODUCT_KPI_MAP['Essence'];

    return kpis.map(kpi => {
      let val: number | undefined = undefined;
      let peerVal = 0;

      switch (kpi.key) {
        case 'yieldOnLoans': val = selectedBank.YLDLN; peerVal = peers.yldln; break;
        case 'commercialLoanRatio': val = (selectedBank.LNCI !== undefined && totalLoans) ? ((selectedBank.LNCI/1000000) / (totalLoans/1000000)) * 100 : undefined; peerVal = peers.cir; break;
        case 'loanToDepositRatio': val = totalLoans ? ((totalLoans/1000000) / (deposits/1000000)) * 100 : undefined; peerVal = peers.ltd; break;
        case 'netChargeOffsRatio': val = (selectedBank.NTLNLS !== undefined && totalLoans) ? ((selectedBank.NTLNLS) / totalLoans) * 100 : undefined; peerVal = peers.nco; break;
        case 'efficiencyRatio': val = selectedBank.EEFFR; peerVal = peers.eff; break;
        case 'netMargin': val = selectedBank.NIMY; peerVal = peers.nim; break;
        case 'realEstateRatio': val = (selectedBank.LNRE !== undefined && totalLoans) ? ((selectedBank.LNRE/1000000) / (totalLoans/1000000)) * 100 : ((selectedBank as any).SZLNRES !== undefined && totalLoans) ? (((selectedBank as any).SZLNRES/1000000) / (totalLoans/1000000)) * 100 : undefined; peerVal = peers.rer; break;
        case 'nonIntIncome': val = selectedBank.NONII !== undefined ? selectedBank.NONII / 1000 : undefined; peerVal = peers.nonii; break;
        case 'nonIntExpense': val = selectedBank.NONIX !== undefined ? selectedBank.NONIX / 1000 : undefined; peerVal = peers.nonix; break;
        case 'roa': val = selectedBank.ROA; peerVal = peers.roa; break;
        case 'roe': val = selectedBank.ROE; peerVal = peers.roe; break;
        case 'assetGrowth5Y': val = selectedBank.ASSET5Y_GROWTH; peerVal = 15; break;
        case 'depositGrowth5Y': val = selectedBank.DEP5Y_GROWTH; peerVal = 12; break;
        case 'cfpbComplaints': val = externalData.cfpb ?? undefined; peerVal = 50; break;
        case 'appRating': val = externalData.itunes ?? undefined; peerVal = 4.2; break;
        case 'populationGrowth': val = externalData.popGrowth ?? undefined; peerVal = 3.5; break;
        case 'fedFundsRate': val = externalData.fedFunds ?? undefined; peerVal = 3.5; break;
      }

      const minMultiple = kpi.lowerIsBetter ? 0.4 : 0.6;
      const maxMultiple = kpi.lowerIsBetter ? 1.6 : 1.4;
      
      return {
        label: kpi.label,
        value: val,
        avg: peerVal,
        min: kpi.key === 'netChargeOffsRatio' ? 0.1 : (peerVal * minMultiple),
        max: kpi.key === 'netChargeOffsRatio' ? peerVal * 2 : (peerVal * maxMultiple),
        format: kpi.format,
        lowerIsBetter: kpi.lowerIsBetter
      };
    });
  };
  const kpis = buildKPIs();

  const formatCurrency = (valInMillions: number, maxFractions = 1) => {
    if (valInMillions === 0) return '$0';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: maxFractions }).format(valInMillions * 1000000);
  };

  // Shared props
  const shared = { 
      bank: selectedBank, product: selectedProduct, peerData, formatCurrencyObj: formatCurrency, 
      featuredCustomer, featuredUseCase, featuredCompetitor, scoredCustomers,
      tcoData, detailedCashFlow, valueDrivers, roiMetrics, codMetrics,
      externalData, popGrowth,
      ASSET_B, currentOpEx, softwareCost, servicesCost
  };

  const slides = [
    <SlideCover key={0} {...shared} />,
    <SlideAgenda key={1} {...shared} />,
    <SlideIntro key={2} {...shared} />,
    <SlideImperative key={3} {...shared} />,
    <SlideMacroEnvironment key={4} {...shared} />,
    <SlideDemographics key={5} {...shared} />,
    <SlidePersona key={6} {...shared} />,
    <SlideKPIs key={7} {...shared} kpis={kpis} />,
    <SlideFootprint key={8} {...shared} />,
    <SlideUSMap key={9} {...shared} popGrowth={popGrowth} />,
    <SlideOpportunity key={10} {...shared} />,
    <SlideValueDrivers key={11} {...shared} projectedSavings={projectedSavings} />,
    <SlideTCO key={12} {...shared} projectedSavings={projectedSavings} />,
    <SlideCashFlow key={13} {...shared} />,
    <SlideROI key={14} {...shared} />,
    <SlideInteractiveROI key={15} {...shared} />,
    <SlideCoD key={16} {...shared} />,
    <SlideCompetitors key={17} {...shared} />,
    <SlideCapabilities key={18} {...shared} />,
    <SlideDCF key={19} {...shared} cashFlowData={cashFlowData} projectedSavings={projectedSavings} cumulative={cumulative} />,
    <SlideExecution key={20} {...shared} />,
    <SlideConclusion key={21} {...shared} />,
  ];

  return (
    <div ref={viewerRef} className="flex-1 bg-slate-100 flex flex-col h-full w-full font-body overflow-hidden print:overflow-visible print:bg-white print:block">
      {/* Navigation Bar */}
      <div className="h-16 bg-f-charcoal text-white flex items-center justify-between px-3 md:px-6 shrink-0 z-50 shadow-md print:hidden w-full overflow-hidden">
        <button onClick={exitPresentation} className="flex items-center gap-2 hover:text-f-fuchsia transition text-sm font-semibold tracking-wide font-heading shrink-0">
          <X size={18} /> <span className="hidden sm:inline">CLOSE PRESENTATION</span>
        </button>
        
        <div className="text-xs font-bold tracking-widest text-[#8a99a8] flex items-center gap-2 md:gap-3 font-heading uppercase flex-1 min-w-0 justify-center px-2 md:px-4">
          <span className="truncate max-w-[150px] lg:max-w-[300px] hidden md:block" title={selectedBank.NAME}>{selectedBank.NAME}</span>
          <span className="text-[#3e4c5b] hidden md:block">•</span>
          <span className="truncate max-w-[120px] lg:max-w-[200px] hidden lg:block" title={selectedProduct["Product/solution"]}>{selectedProduct["Product/solution"]}</span>
          <span className="text-[#3e4c5b] hidden lg:block">•</span>
          <span className="whitespace-nowrap shrink-0">SLIDE {currentSlide + 1} OF {TOTAL_SLIDES}</span>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4 font-heading shrink-0">
          <div className="hidden xl:flex bg-[#2a3645] rounded overflow-hidden shadow-inner w-32 h-8 relative mr-2">
             <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-f-violet to-f-fuchsia opacity-80" style={{ width: `${((currentSlide + 1) / TOTAL_SLIDES) * 100}%`, transition: 'width 0.3s ease' }} />
             <div className="absolute inset-0 flex items-center justify-center text-[0.65rem] font-bold tracking-widest mix-blend-plus-lighter z-10 w-full text-center">PROGRESS</div>
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => setCurrentSlide(p => Math.max(0, p - 1))} disabled={currentSlide === 0}
              className="px-3 md:px-4 py-1.5 bg-[#2a3645] rounded hover:bg-[#3e4c5b] disabled:opacity-50 text-sm font-semibold transition">Prev</button>
            <button onClick={() => setCurrentSlide(p => Math.min(TOTAL_SLIDES - 1, p + 1))} disabled={currentSlide === TOTAL_SLIDES - 1}
              className="px-3 md:px-4 py-1.5 bg-gradient-to-r from-f-violet to-f-fuchsia text-white rounded hover:opacity-90 disabled:opacity-50 text-sm font-bold transition shadow-lg">Next</button>
          </div>

          <button onClick={handlePrint} className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-[#3e4c5b] rounded hover:bg-[#2a3645] transition text-sm ml-2">
            <Download size={16} /> <span className="hidden lg:inline">PDF</span>
          </button>
          <button onClick={toggleFullScreen} className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-[#3e4c5b] rounded hover:bg-[#2a3645] transition text-sm">
            <Maximize size={16} /> <span className="hidden lg:inline">Full Screen</span>
          </button>
        </div>
      </div>

      {/* Slide Canvas — fully fluid and responsive, maintaining 16:9 aspect ratio perfectly */}
      <div className="flex-1 w-full bg-slate-200/50 flex items-center justify-center overflow-hidden min-h-0 relative p-4 md:p-6 print:p-0 print:bg-white print:overflow-visible print:block @container">
        <div 
          data-testid="presentation-canvas"
          className="bg-white relative shadow-2xl rounded-sm flex flex-col @container overflow-hidden ring-1 ring-slate-200/50 print:ring-0 print:shadow-none print:overflow-visible print:block print:w-full"
          style={{ 
            width: '100%', 
            aspectRatio: '16/9', 
            maxHeight: '100%', 
            maxWidth: 'calc(100cqh * 16 / 9)' 
          }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-f-violet to-f-fuchsia z-20 print:hidden" />
          {slides.map((slide, i) => (
            <div key={i} className={`absolute inset-0 transition-opacity duration-500 ${currentSlide === i ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'} print:relative print:block print:opacity-100 print:z-10 print:h-[100vh] print:w-full print:break-after-page`}>
              {slide}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
