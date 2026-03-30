import { SlideHeader, SlideFooter } from '../SlideChrome';
import type { SlideProps } from '../types';
import { Map, MapPin, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';


export const SlideFootprint: React.FC<SlideProps & { popGrowth?: number }> = ({ bank, product, peerData, popGrowth = 3.5 }) => {
    // 1. Calculate Footprint Metrics
    const state = bank.STALP || bank.STNAME || "Local";
    const assetGrowth = bank.ASSET5Y_GROWTH || 0;
    const depGrowth = bank.DEP5Y_GROWTH || 0;
    
    // Footprint Score: How much is the bank growing relative to population and peers
    // Higher score = stronger footprint
    const growthDelta = (assetGrowth + depGrowth) / 2 - popGrowth;
    const peerDelta = (assetGrowth + depGrowth) / 2 - ((peerData.assetGrowth + peerData.depGrowth) / 2);
    const footprintScore = growthDelta + peerDelta;

    let footprintLabel = "Stable";
    let footprintColor = "text-f-charcoal";
    let bgPulse = "bg-f-charcoal/10";
    let icon = <Map className="w-[3cqi] h-[3cqi] text-f-charcoal" />;

    if (footprintScore < -10) {
        footprintLabel = "Vulnerable";
        footprintColor = "text-f-error";
        bgPulse = "bg-f-error/10 border-f-error/30";
        icon = <AlertTriangle className="w-[3cqi] h-[3cqi] text-f-error animate-pulse" />;
    } else if (footprintScore < 0) {
        footprintLabel = "At-Risk";
        footprintColor = "text-orange-500";
        bgPulse = "bg-orange-500/10 border-orange-500/30";
        icon = <TrendingDown className="w-[3cqi] h-[3cqi] text-orange-500" />;
    } else if (footprintScore > 10) {
        footprintLabel = "Dominant";
        footprintColor = "text-f-success";
        bgPulse = "bg-f-success/10 border-f-success/30";
        icon = <CheckCircle className="w-[3cqi] h-[3cqi] text-f-success" />;
    } else {
        footprintLabel = "Stable";
        footprintColor = "text-f-violet";
        bgPulse = "bg-f-violet/10 border-f-violet/30";
        icon = <TrendingUp className="w-[3cqi] h-[3cqi] text-f-violet" />;
    }

    // Determine if deposit or lending footprint is weaker
    const isDepositWeak = depGrowth < peerData.depGrowth;
    const isLendingWeak = assetGrowth < peerData.assetGrowth;
    let weaknessDriver = "General Market Share";
    if (isDepositWeak && !isLendingWeak) weaknessDriver = "Deposit Gathering";
    else if (!isDepositWeak && isLendingWeak) weaknessDriver = "Lending Origination";
    else if (isDepositWeak && isLendingWeak) weaknessDriver = "Lending & Deposits";

    const subtitle = `State-Level Footprint Analysis: Mapping ${bank.NAME}'s growth against demographic shifts in ${state}.`;

    return (
        <div className="absolute inset-0 pt-[1cqi] flex flex-col bg-slate-50 overflow-hidden">
            <SlideHeader title="Geographic Footprint Spectrum" subtitle={subtitle} />
            
            <div className="flex-1 px-[5cqi] flex flex-col justify-center gap-[2cqi] overflow-hidden">
                
                {/* 1. Footprint Spectrum Visualization */}
                <div className="w-full bg-white border border-f-charcoal/10 rounded-[1cqi] p-[2cqi] shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[30cqi] h-[30cqi] bg-gradient-to-bl from-f-violet/5 rounded-full blur-3xl -mr-[8cqi] -mt-[8cqi] pointer-events-none" />
                    
                    <div className="flex justify-between items-center mb-[1cqi]">
                        <div>
                            <h3 className="font-heading font-black text-[1.6cqi] text-f-charcoal mb-[0.3cqi]">Footprint Vulnerability</h3>
                            <p className="font-body text-[1cqi] text-f-charcoal/60">Benchmarked against {state} census population growth & {peerData.name} peers.</p>
                        </div>
                        <div className={`flex items-center gap-[0.8cqi] px-[1.5cqi] py-[0.7cqi] rounded-full border ${bgPulse}`}>
                            {icon}
                            <span className={`font-heading font-bold text-[1.3cqi] uppercase tracking-wider ${footprintColor}`}>
                                {footprintLabel} Footprint
                            </span>
                        </div>
                    </div>

                    {/* The Spectrum Bar */}
                    <div className="relative h-[1.2cqi] w-full rounded-full bg-gradient-to-r from-f-error via-orange-400 to-f-success mt-[2.5cqi] mb-[2cqi]">
                        <div 
                            className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-1000 ease-out"
                            style={{ left: `${Math.max(10, Math.min(90, 50 + footprintScore))}%` }}
                        >
                            <div className="w-[1.2cqi] h-[2.5cqi] bg-f-charcoal rounded-sm shadow-md border border-white" />
                            <div className="absolute top-full mt-[0.8cqi] font-bold text-[1cqi] text-f-charcoal bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100 whitespace-nowrap">
                                {bank.NAME}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between font-heading text-[0.9cqi] font-bold text-f-charcoal/50 uppercase tracking-widest">
                        <span>Losing Share</span>
                        <span>Market Parity</span>
                        <span>Dominant Growth</span>
                    </div>
                </div>

                {/* 2. Drivers and Finastra Alignment */}
                <div className="grid grid-cols-3 gap-[2cqi]">
                    <div className="bg-white p-[2cqi] rounded-[1cqi] border border-f-charcoal/10 shadow-sm flex flex-col justify-center">
                        <h4 className="font-heading font-black text-[1.4cqi] text-f-charcoal mb-[1cqi]">Market Diagnostics ({state})</h4>
                        <div className="space-y-[1cqi]">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                                <span className="font-body text-[1.1cqi] text-f-charcoal/70">State Population Growth</span>
                                <span className="font-bold text-[1.3cqi] text-f-charcoal">{popGrowth.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                                <span className="font-body text-[1.1cqi] text-f-charcoal/70">5Y Asset Growth</span>
                                <span className={`font-bold text-[1.3cqi] ${assetGrowth < peerData.assetGrowth ? 'text-f-error' : 'text-f-success'}`}>
                                    {assetGrowth.toFixed(1)}% <span className="text-[0.9cqi] text-f-charcoal/50 ml-1">(Peer: {peerData.assetGrowth.toFixed(1)}%)</span>
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-1.5">
                                <span className="font-body text-[1.1cqi] text-f-charcoal/70">5Y Deposit Growth</span>
                                <span className={`font-bold text-[1.3cqi] ${depGrowth < peerData.depGrowth ? 'text-f-error' : 'text-f-success'}`}>
                                    {depGrowth.toFixed(1)}% <span className="text-[0.9cqi] text-f-charcoal/50 ml-1">(Peer: {peerData.depGrowth.toFixed(1)}%)</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* US Map Visual */}
                    <div className="bg-white p-[2cqi] rounded-[1cqi] border border-f-charcoal/10 shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
                        <h4 className="font-heading font-black text-[1.4cqi] text-f-charcoal mb-[1cqi] absolute top-[2cqi] left-[2.5cqi] z-10 bg-white/80 px-2 py-1 rounded backdrop-blur-sm shadow-sm transition-transform group-hover:scale-105">Geographic Focus</h4>
                        <div className="w-full h-full flex flex-col items-center justify-center mt-[1cqi] relative">
                            {/* Abstract Map Representation */}
                            <Map className="w-[85%] h-[85%] text-slate-200 stroke-[1px] absolute opacity-50 transition-all duration-700 group-hover:scale-[1.02] group-hover:text-slate-300" />
                            
                            {/* Targeted State Pin */}
                            <div className={`relative z-10 flex flex-col items-center justify-center transform transition-all duration-500 scale-110 group-hover:translate-y-[-0.5cqi]`}>
                                <div className={`p-[1cqi] rounded-full shadow-lg ${footprintScore < 0 ? 'bg-f-error/10 text-f-error' : 'bg-f-fuchsia/10 text-f-fuchsia'} ring-4 ring-white`}>
                                   {footprintScore < 0 ? <AlertTriangle className="w-[2cqi] h-[2cqi]" /> : <CheckCircle className="w-[2cqi] h-[2cqi]" />}
                                </div>
                                <div className={`flex items-center gap-[0.5cqi] mt-[1cqi] px-[1.5cqi] py-[0.5cqi] rounded-full shadow-md text-[1.2cqi] font-bold text-white ${footprintScore < 0 ? 'bg-f-error' : 'bg-f-fuchsia'}`}>
                                    <MapPin className="w-[1.2cqi] h-[1.2cqi]" />
                                    {state} Market
                                </div>
                            </div>
                            
                            {/* Background Pulse Effect for Target */}
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[8cqi] h-[8cqi] rounded-full opacity-20 animate-ping ${footprintScore < 0 ? 'bg-f-error' : 'bg-f-fuchsia'}`}></div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#1b2635] to-[#2a3a50] p-[2cqi] rounded-[1cqi] shadow-lg flex flex-col justify-between text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[15cqi] h-[15cqi] bg-f-fuchsia/20 blur-[40px] rounded-full" />
                        
                        <div>
                            <div className="inline-block bg-f-fuchsia/20 border border-f-fuchsia/30 text-f-fuchsia px-[1.2cqi] py-[0.4cqi] rounded-full font-heading text-[0.85cqi] font-bold uppercase tracking-widest mb-[1cqi]">
                                Primary Value Driver
                            </div>
                            <h4 className="font-heading font-black text-[1.5cqi] mb-[0.8cqi] leading-tight flex items-center gap-[0.8cqi]">
                                <ArrowRight className="text-f-magenta w-[1.6cqi] h-[1.6cqi] shrink-0" />
                                Reverse {weaknessDriver} Leakage
                            </h4>
                            <p className="font-body text-[1.1cqi] text-white/80 leading-relaxed mb-[1.5cqi]">
                                Leveraging <strong className="text-white">{product['Product/solution']}</strong>'s {product['Key features/benefits'].toLowerCase()} to recapture local market share and defend against challenger institutions within {state}.
                            </p>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-md rounded-[0.5cqi] p-[1.2cqi] border border-white/10">
                            <p className="font-heading font-bold text-[0.9cqi] text-f-cyan uppercase tracking-wider mb-0.5">Financial Impact</p>
                            <p className="font-body text-[1.1cqi] text-white/90">Modeled as immediate Footprint Expansion revenue uplift in DCF analysis.</p>
                        </div>
                    </div>
                </div>

            </div>
            
            <SlideFooter bankName={bank.NAME} />
        </div>
    );
};
