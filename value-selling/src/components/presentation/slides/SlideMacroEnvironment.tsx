import React from 'react';
import { SlideHeader, SlideFooter } from '../SlideChrome';
import type { SlideProps } from '../types';
import { TrendingDown, TrendingUp, Zap } from 'lucide-react';

export const SlideMacroEnvironment: React.FC<SlideProps> = ({ bank, product, externalData }) => {
    if (!externalData || externalData.fedFunds === null) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
                <p className="text-f-charcoal/40 text-[2cqi] font-heading">Fetching Macro Intelligence...</p>
            </div>
        );
    }

    const fedFunds = externalData.fedFunds;
    const isHighRate = fedFunds >= 4.0;
    
    // contextual narrative
    let subtitle = "";
    if (isHighRate) {
        subtitle = `At a Fed Funds rate of ${fedFunds.toFixed(2)}%, ${bank.NAME} faces severe cost-of-deposit pressure and margin compression. Strategic efficiency is mandatory.`;
    } else {
        subtitle = `In a lower-rate environment (${fedFunds.toFixed(2)}%), ${bank.NAME} must maximize origination volume and operational velocity to sustain profitability.`;
    }

    // specific product angle
    const productKeywords = product["Primary use cases"]?.toLowerCase() || "";
    const isLending = productKeywords.includes('lend') || productKeywords.includes('loan') || productKeywords.includes('origination');
    
    let strategicPillar = "";
    let strategicDesc = "";
    
    if (isHighRate && isLending) {
        strategicPillar = "Protect Net Interest Margins";
        strategicDesc = "When funding costs soar, capital allocation becomes hyper-competitive. Our platform optimizes risk-adjusted yield by targeting high-margin lending segments with precision.";
    } else if (isHighRate && !isLending) {
        strategicPillar = "Neutralize OpEx Inflation";
        strategicDesc = "Margin compression demands ruthless efficiency. Modernizing core infrastructure reduces labor dependencies and scales operations without linear headcount growth.";
    } else if (!isHighRate && isLending) {
        strategicPillar = "Capture Origination Volume";
        strategicDesc = "Lower rates stimulate borrowing. Institutions that execute faster win the deal. Our digital origination reduces friction to convert pipeline into closed-won faster.";
    } else {
        strategicPillar = "Accelerate Digital Transformation";
        strategicDesc = "Scale operations proactively. Modern architecture prepares the balance sheet for the next rate cycle through enhanced agility and non-interest income growth.";
    }

    const targetProduct = product["Product/solution"];

    // NIM compression quantification for financial model linkage
    const nimCompressionPct = isHighRate ? ((fedFunds - 3.0) * 0.12).toFixed(1) : "0.0";
    const rateDriverLabel = isHighRate
        ? `${nimCompressionPct}% NIM compression modeled → factored into OpEx savings in DCF & ROI`
        : `Rate tailwind → origination uplift factored into Revenue Uplift (DCF)`;

    return (
        <div className="absolute inset-0 pt-[1cqi] flex flex-col bg-white overflow-hidden">
           <SlideHeader title="Macroeconomic Headwinds" subtitle={subtitle} />
           <div className="flex-1 px-[8cqi] flex items-center justify-center overflow-hidden gap-[4cqi] pb-[1cqi]">
               
               {/* Left Side: Fed Funds Rate Visualization */}
               <div className="flex-1 flex flex-col items-center justify-center p-[4cqi] bg-f-charcoal/5 rounded-2xl border border-f-charcoal/10 relative overflow-hidden h-[80%]">
                   <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-f-fuchsia/10 rounded-bl-[100%] blur-3xl opacity-50" />
                   <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-f-violet/10 rounded-tr-[100%] blur-3xl opacity-50" />
                   
                   <h3 className="text-[1.2cqi] font-heading font-bold uppercase tracking-widest text-f-charcoal/50 mb-[1.5cqi] z-10">Effective Fed Funds Rate</h3>
                   <div className="text-[7cqi] font-black text-f-violet leading-none tracking-tighter mb-[1cqi] relative z-10 drop-shadow-sm">
                       {fedFunds.toFixed(2)}<span className="text-[3.5cqi] text-f-charcoal/40 ml-[0.5cqi]">%</span>
                   </div>
                   <div className="flex items-center gap-2 mb-[1.5cqi] z-10">
                       {isHighRate
                           ? <TrendingDown className="w-[2cqi] h-[2cqi] text-f-error" />
                           : <TrendingUp className="w-[2cqi] h-[2cqi] text-f-success" />}
                       <span className={`text-[1.2cqi] font-bold ${isHighRate ? 'text-f-error' : 'text-f-success'}`}>
                           {isHighRate ? 'High-Rate Environment' : 'Easing Rate Environment'}
                       </span>
                   </div>
                   {/* Financial model linkage badge */}
                   <div className="flex items-center gap-[1cqi] bg-white/80 border border-f-violet/20 px-[1.5cqi] py-[1cqi] rounded-lg z-10">
                       <Zap className="w-[1.2cqi] h-[1.2cqi] text-f-violet shrink-0" />
                       <span className="text-[0.9cqi] font-bold text-f-charcoal/70 tracking-wide">{rateDriverLabel}</span>
                   </div>
               </div>

               {/* Right Side: Finastra Solution */}
               <div className="flex-1 flex flex-col h-[80%] justify-center">
                   <h3 className="text-f-fuchsia font-heading font-extrabold tracking-[0.2em] text-[1.2cqi] uppercase mb-[2cqi]">Strategic Response</h3>
                   
                   <div className="flex-1 p-[3.5cqi] bg-gradient-to-br from-[#1a2332] to-[#0f172a] rounded-2xl text-white shadow-2xl border border-[#2a3645] relative overflow-hidden flex flex-col justify-between">
                       <div className="absolute top-0 left-0 w-full h-[0.5cqi] bg-gradient-to-r from-f-violet to-f-fuchsia" />
                       <div>
                           <h4 className="text-[2.2cqi] font-heading font-black mb-[1.5cqi] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">{strategicPillar}</h4>
                           <p className="text-[1.4cqi] font-body leading-relaxed text-[#8a99a8] mb-[2cqi] font-light">
                               {strategicDesc}
                           </p>
                       </div>
                       <div className="inline-block px-[2.5cqi] py-[1.2cqi] bg-white/5 rounded backdrop-blur-md border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] self-start">
                           <span className="text-[1.1cqi] font-bold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#9b8afb] to-[#c689fb]">Powered by {targetProduct}</span>
                       </div>
                   </div>
               </div>
               
           </div>
           <SlideFooter bankName={bank.NAME} />
        </div>
    );
};
