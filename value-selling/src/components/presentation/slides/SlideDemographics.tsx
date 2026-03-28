import React from 'react';
import { SlideHeader, SlideFooter } from '../SlideChrome';
import type { SlideProps } from '../types';

export const SlideDemographics: React.FC<SlideProps> = ({ bank, product, externalData }) => {
    if (!externalData || externalData.popGrowth === null) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
                <p className="text-f-charcoal/40 text-[2cqi] font-heading">Fetching Demographic Intelligence...</p>
            </div>
        );
    }

    const popGrowth = externalData.popGrowth;
    const stateName = bank.STNAME || "the state";
    const isGrowing = popGrowth > 1.0;
    const isDeclining = popGrowth <= 0;
    
    // contextual narrative
    let subtitle = "";
    if (isGrowing) {
        subtitle = `${bank.NAME}'s primary footprint in ${stateName} is expanding at ${popGrowth.toFixed(1)}%. Scaling infrastructure is critical to capture organic inflows.`;
    } else if (isDeclining) {
        subtitle = `Demographic headwinds in ${stateName} (${popGrowth.toFixed(1)}%) mandate aggressive market-share acquisition to sustain growth.`;
    } else {
        subtitle = `Moderate population growth in ${stateName} (${popGrowth.toFixed(1)}%) requires high-efficiency digital channels to deepen existing client relationships.`;
    }

    let strategyHeader = "";
    let strategyBody = "";
    
    if (isGrowing) {
        strategyHeader = "Capture The Influx";
        strategyBody = `As new residents and businesses enter ${stateName}, first-mover digital capability dictates who wins their deposits and loans. Legacy onboarding creates friction; modern infrastructure scales seamlessly to absorb growth.`;
    } else if (isDeclining) {
        strategyHeader = "Steal Market Share";
        strategyBody = `In a zero-sum demographic environment, growth comes from competitors. Superior user experiences, faster decisioning, and hyper-personalized products are the only sustainable weapons for acquisition.`;
    } else {
        strategyHeader = "Wallet Share Expansion";
        strategyBody = `When organic market expansion is flat, profitability relies on becoming the primary financial institution (PFI). Deeper product penetration requires unified data integration.`;
    }

    // Quantified impact label for financial model linkage
    const upliftLabel = isGrowing
        ? `+${popGrowth.toFixed(1)}% market expansion → factored into Revenue Uplift (DCF)`
        : `Flat/declining market → footprint defense factored into Cost of Delay & ROI model`;

    return (
        <div className="absolute inset-0 pt-[1cqi] flex flex-col bg-white overflow-hidden">
           <SlideHeader title="Demographic Catalyst" subtitle={subtitle} />
           <div className="flex-1 px-[8cqi] flex gap-[5cqi] items-stretch justify-center overflow-hidden pb-[1cqi]">
               
               {/* Left: Data Visualization */}
               <div className="flex-1 flex flex-col items-start justify-center pr-[3cqi] border-r border-f-charcoal/10">
                   <h3 className="text-f-charcoal/50 font-heading font-extrabold tracking-[0.2em] text-[1.2cqi] uppercase mb-[1.5cqi]">Geographic Headprint Context</h3>
                   
                   <div className="flex items-baseline gap-4 mb-[1.5cqi]">
                       <span className={`text-[7cqi] font-black leading-tight tracking-tighter drop-shadow-sm ${isDeclining ? "text-f-fuchsia" : "text-f-violet"}`}>
                           {popGrowth > 0 ? "+" : ""}{popGrowth.toFixed(1)}%
                       </span>
                       <span className="text-[2cqi] font-body text-f-charcoal/50 font-medium">Growth</span>
                   </div>
                   
                   <p className="text-[1.6cqi] text-f-charcoal font-heading font-light leading-snug mb-[2cqi]">
                       Census data indicates a trajectory shift in <strong className="font-extrabold">{stateName}</strong>, redefining the battleground for commercial and retail banking relationships.
                   </p>

                   {/* Financial model linkage badge */}
                   <div className="flex items-center gap-[1cqi] bg-f-violet/5 border border-f-violet/20 px-[1.5cqi] py-[1cqi] rounded-lg">
                       <div className="w-2 h-2 rounded-full bg-f-violet shrink-0" />
                       <span className="text-[1cqi] font-bold text-f-charcoal/70 tracking-wide">{upliftLabel}</span>
                   </div>
               </div>
               
               {/* Right: Strategy */}
               <div className="flex-[1.2] flex flex-col pl-[3cqi] justify-center overflow-hidden">
                   <h3 className="text-f-fuchsia font-heading font-extrabold tracking-[0.2em] text-[1.2cqi] uppercase mb-[2cqi]">Go-to-Market Strategy</h3>
                   
                   <div className="bg-white border-2 border-f-charcoal/5 rounded-2xl p-[3cqi] shadow-[0_10px_40px_rgba(8,_112,_184,_0.04)] relative overflow-hidden group hover:border-f-violet/20 transition-all duration-500 flex flex-col gap-[1.5cqi]">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-f-violet/5 rounded-bl-[100%] group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
                       
                       <h4 className="text-[2.2cqi] font-black text-f-charcoal tracking-tight">{strategyHeader}</h4>
                       <p className="text-[1.4cqi] text-f-charcoal/70 font-body leading-relaxed">
                           {strategyBody}
                       </p>
                       
                       <div className="flex items-center gap-[1.5cqi] bg-f-charcoal/5 self-start px-[2cqi] py-[1cqi] rounded-lg mt-[0.5cqi]">
                           <div className="w-2.5 h-2.5 rounded-full bg-f-violet animate-pulse" />
                           <span className="text-[1.1cqi] font-bold text-f-charcoal/80 tracking-widest uppercase">Aligned to {product["Product/solution"]}</span>
                       </div>
                   </div>
               </div>
               
           </div>
           <SlideFooter bankName={bank.NAME} />
        </div>
    );
};
