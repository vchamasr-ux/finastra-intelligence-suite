import React, { useState, useMemo } from 'react';
import { SlideFooter } from '../SlideChrome';
import type { SlideProps } from '../types';
import { Settings, Target, Zap, MapPin, Calculator, Play } from 'lucide-react';

export const SlideInteractiveROI: React.FC<SlideProps> = ({ 
    bank, 
    formatCurrencyObj, 
    ASSET_B = 0, 
    currentOpEx = 0,
    softwareCost = 0,
    servicesCost = 0,
    externalData = { cfpb: null, itunes: null, fedFunds: null, popGrowth: null },
    roiMetrics
}) => {
    // Sliders state
    const [efficiencyTarget, setEfficiencyTarget] = useState<number>(15);
    const [nimRecapture, setNimRecapture] = useState<number>(40);
    const [demoMultiplier, setDemoMultiplier] = useState<number>(1.0);

    const fedFunds = externalData.fedFunds || 4.33;
    const popGrowth = externalData.popGrowth || 3.5;
    
    // Live recalculation
    const liveMetrics = useMemo(() => {
        // Base numbers
        const totalLoans = bank.NETLNLS !== undefined ? bank.NETLNLS : bank.LNLSNET || ASSET_B * 1000 * 0.6;
        
        // 1. Efficiency
        const projectedSavings = currentOpEx * (efficiencyTarget / 100);
        
        // 2. NIM
        const nimCompressionRate = Math.max(0, (fedFunds - 3.0) * 0.0012);
        const macroNimSavings = ASSET_B * 1000 * nimCompressionRate * (nimRecapture / 100);
        
        // 3. Demo
        const isGrowingMarket = popGrowth > 1.0;
        const demoRevenueUpliftRate = isGrowingMarket ? (popGrowth / 100) * 0.01 : (popGrowth / 100) * 0.005;
        const baseDemoRevenue = Math.max(0, totalLoans / 1000 * demoRevenueUpliftRate * 1000);
        const demographicRevenueUplift = baseDemoRevenue * demoMultiplier;

        const footprintExpansionValue = (projectedSavings * 0.12) * 1.0; // static for simplicity
        
        const totalAnnualValue = projectedSavings + macroNimSavings + demographicRevenueUplift + footprintExpansionValue;

        // Cash flow
        const detailedCashFlow = [0, 1, 2, 3, 4, 5].map(year => {
            if (year === 0) return { year, net: -servicesCost };
            const eff = projectedSavings * 0.85;
            const rev = (projectedSavings * 0.10) + footprintExpansionValue; 
            const net = eff + rev + macroNimSavings + demographicRevenueUplift - softwareCost;
            return { year, net };
        });

        const totalCost = servicesCost + (softwareCost * 5);
        const totalBenefit = totalAnnualValue * 5;
        
        const npvRate = 0.08; 
        let calculatedNpv = 0;
        detailedCashFlow.forEach((cf) => {
            calculatedNpv += cf.net / Math.pow(1 + npvRate, cf.year);
        });

        let runCum = 0;
        const cfs = detailedCashFlow.map(cf => {
            runCum += cf.net;
            return { ...cf, cumulative: runCum };
        });

        let paybackMonths = 0;
        if (cfs[1].cumulative > 0) paybackMonths = 12 + (Math.abs(cfs[0].net) / cfs[1].net) * 12;
        else if (cfs[2].cumulative > 0) paybackMonths = 24 + (Math.abs(cfs[1].cumulative) / cfs[2].net) * 12;
        else if (cfs[3].cumulative > 0) paybackMonths = 36 + (Math.abs(cfs[2].cumulative) / cfs[3].net) * 12;
        else paybackMonths = 48;

        return {
            npv: calculatedNpv,
            roi: ((totalBenefit - totalCost) / totalCost) * 100,
            annual: totalAnnualValue,
            payback: Math.round(paybackMonths)
        };
    }, [ASSET_B, bank.LNLSNET, bank.NETLNLS, currentOpEx, demoMultiplier, efficiencyTarget, fedFunds, nimRecapture, popGrowth, servicesCost, softwareCost]);

    const getDiffColor = (liveVal: number, baseVal: number, inverse = false) => {
        const isBetter = inverse ? liveVal < baseVal : liveVal > baseVal;
        const isWorse = inverse ? liveVal > baseVal : liveVal < baseVal;
        if (isBetter) return "text-f-success";
        if (isWorse) return "text-f-fuchsia";
        return "text-white/50";
    };

    return (
        <div className="absolute inset-0 pt-[1cqi] flex flex-col bg-[#1a232f] overflow-hidden border-[0.8cqi] border-f-charcoal/50">
            <div className="absolute top-0 right-0 w-[40cqi] h-[40cqi] bg-f-violet/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="px-[5cqi] shrink-0 pt-[2cqi] relative z-20 flex justify-between items-end">
                <div>
                    <h1 className="text-[3.5cqi] leading-[1.1] font-heading font-black tracking-tight text-white uppercase drop-shadow-sm">
                        Live Value Parameterization
                    </h1>
                    <h2 className="text-[1.3cqi] font-body text-white/50 tracking-wide mt-[1cqi] max-w-[80%] leading-relaxed border-l-2 border-f-violet pl-4">
                        Interactive control panel for {bank.NAME} value drivers.
                    </h2>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded border border-white/10 text-white/70 font-bold uppercase tracking-widest text-[0.9cqi]">
                    <Settings className="w-4 h-4 text-f-violet animate-pulse" />
                    Interactive Mode
                </div>
            </div>

            <div className="flex-1 px-[5cqi] mt-[3cqi] pb-[5cqi] flex gap-[3cqi] relative z-10 w-full overflow-hidden">
                
                {/* Control Panel (Sliders) */}
                <div className="w-[45%] flex flex-col gap-[2.5cqi]">
                    <div className="bg-[#212b36] border border-white/10 rounded-2xl p-[3cqi] flex flex-col gap-[2.5cqi] shadow-xl">
                        
                        {/* Control 1: OpEx Efficiency */}
                        <div className="flex flex-col gap-[1cqi]">
                            <div className="flex justify-between items-center text-white font-heading tracking-wide">
                                <div className="flex items-center gap-2">
                                    <Target className="w-[1.2cqi] h-[1.2cqi] text-white/60" />
                                    <span className="text-[1.2cqi] font-bold">OpEx Efficiency Target</span>
                                </div>
                                <span className="text-[1.4cqi] font-black text-f-violet">{efficiencyTarget}%</span>
                            </div>
                            <input 
                                type="range" min="5" max="30" step="1" 
                                value={efficiencyTarget} onChange={(e) => setEfficiencyTarget(Number(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-f-violet"
                            />
                            <div className="flex justify-between text-white/40 text-[0.8cqi] font-bold">
                                <span>Conservative (5%)</span>
                                <span>Aggressive (30%)</span>
                            </div>
                        </div>

                        {/* Control 2: NIM Recapture */}
                        <div className="flex flex-col gap-[1cqi]">
                            <div className="flex justify-between items-center text-white font-heading tracking-wide">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-[1.2cqi] h-[1.2cqi] text-white/60" />
                                    <span className="text-[1.2cqi] font-bold">NIM Compression Recapture</span>
                                </div>
                                <span className="text-[1.4cqi] font-black text-f-fuchsia">{nimRecapture}%</span>
                            </div>
                            <input 
                                type="range" min="0" max="80" step="5" 
                                value={nimRecapture} onChange={(e) => setNimRecapture(Number(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-f-fuchsia"
                            />
                            <div className="flex justify-between text-white/40 text-[0.8cqi] font-bold">
                                <span>Baseline (0%)</span>
                                <span>Optimized (80%)</span>
                            </div>
                        </div>

                        {/* Control 3: Demographic Rev */}
                        <div className="flex flex-col gap-[1cqi]">
                            <div className="flex justify-between items-center text-white font-heading tracking-wide">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-[1.2cqi] h-[1.2cqi] text-white/60" />
                                    <span className="text-[1.2cqi] font-bold">Demographic Market Capture</span>
                                </div>
                                <span className="text-[1.4cqi] font-black text-white/90">{demoMultiplier.toFixed(1)}x</span>
                            </div>
                            <input 
                                type="range" min="0" max="2.0" step="0.1" 
                                value={demoMultiplier} onChange={(e) => setDemoMultiplier(Number(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                            />
                            <div className="flex justify-between text-white/40 text-[0.8cqi] font-bold">
                                <span>Ignore Macro</span>
                                <span>2x Multiplier</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Outputs Panel (Live KPIs) */}
                <div className="flex-1 flex flex-col gap-[2cqi]">
                    <div className="grid grid-cols-2 gap-[2cqi]">
                        <div className="bg-[#2a3645] border border-white/5 rounded-2xl p-[2.5cqi] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-f-violet/5 to-transparent pointer-events-none" />
                            <div className="text-white/50 uppercase tracking-widest font-bold text-[0.9cqi] mb-[0.5cqi]">Live 5-Year NPV</div>
                            <div className="text-[4cqi] font-heading font-black text-white leading-none">
                                {formatCurrencyObj(liveMetrics.npv, 1)}
                            </div>
                            <div className={`mt-[1cqi] text-[1cqi] font-bold flex items-center gap-1 ${getDiffColor(liveMetrics.npv, roiMetrics?.npv || 0)}`}>
                                <Calculator className="w-3 h-3" /> Base: {formatCurrencyObj(roiMetrics?.npv || 0, 1)}
                            </div>
                        </div>

                        <div className="bg-[#2a3645] border border-white/5 rounded-2xl p-[2.5cqi] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-f-fuchsia/5 to-transparent pointer-events-none" />
                            <div className="text-white/50 uppercase tracking-widest font-bold text-[0.9cqi] mb-[0.5cqi]">Live Ann. Value Pool</div>
                            <div className="text-[4cqi] font-heading font-black text-white leading-none">
                                {formatCurrencyObj(liveMetrics.annual, 1)}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-[2cqi] flex-1">
                        <div className="bg-[#2a3645] border border-white/5 rounded-2xl p-[2.5cqi] flex flex-col justify-center items-center text-center">
                            <div className="text-white/50 uppercase tracking-widest font-bold text-[0.9cqi] mb-[0.5cqi]">Live Return (ROI)</div>
                            <div className="text-[3.5cqi] font-heading font-black text-white leading-none">
                                {liveMetrics.roi >= 1000 ? (liveMetrics.roi / 100).toFixed(1) : liveMetrics.roi.toFixed(0)}
                                <span className="text-white/50 text-[2cqi]">{liveMetrics.roi >= 1000 ? 'x' : '%'}</span>
                            </div>
                            <div className={`mt-[1cqi] text-[0.9cqi] font-bold flex items-center gap-1 ${getDiffColor(liveMetrics.roi, roiMetrics?.roi || 0)}`}>
                                Base: {(roiMetrics?.roi || 0) >= 1000 ? `${((roiMetrics?.roi || 0) / 100).toFixed(1)}x` : `${(roiMetrics?.roi || 0).toFixed(0)}%`}
                            </div>
                        </div>

                        <div className="bg-[#2a3645] border border-white/5 rounded-2xl p-[2.5cqi] flex flex-col justify-center items-center text-center">
                            <div className="text-white/50 uppercase tracking-widest font-bold text-[0.9cqi] mb-[0.5cqi]">Live Payback</div>
                            <div className="text-[3.5cqi] font-heading font-black text-white leading-none">
                                {liveMetrics.payback} <span className="text-white/50 text-[1.5cqi] font-normal tracking-wide">mo</span>
                            </div>
                            <div className={`mt-[1cqi] text-[0.9cqi] font-bold flex items-center gap-1 ${getDiffColor(liveMetrics.payback, roiMetrics?.paybackMonths || 0, true)}`}>
                                Base: {roiMetrics?.paybackMonths || 0} mo
                            </div>
                        </div>
                    </div>

                    <div className="bg-f-violet/10 border border-f-violet/30 rounded-xl px-[2cqi] py-[1.5cqi] flex items-center gap-4 mt-auto">
                        <Play className="w-[1.5cqi] h-[1.5cqi] text-f-violet" />
                        <span className="text-white/80 font-heading tracking-wide text-[1cqi]">
                            These calculations are projected dynamically and independently of central reporting metrics. Adjust sliders to explore best/worst-case scenarios.
                        </span>
                    </div>

                </div>

            </div>
            <SlideFooter bankName={bank.NAME} />
        </div>
    );
};
