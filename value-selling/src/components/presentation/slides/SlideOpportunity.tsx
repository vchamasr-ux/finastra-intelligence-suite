import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { SlideHeader, SlideFooter } from '../SlideChrome';
import type { SlideProps } from '../types';
import { formatValue } from '../types';

export const SlideOpportunity: React.FC<SlideProps> = ({ bank, product, peerData, featuredCustomer }) => {
    const effRatio = bank.EEFFR || 55.2;
    const gapDir = effRatio > peerData.eff ? 'above' : 'below';
    const subtitle = `${bank.NAME}'s ${effRatio.toFixed(1)}% efficiency ratio sits ${gapDir} the ${peerData.name} average of ${peerData.eff.toFixed(1)}% — mapping this gap to ${product["Product/solution"]} execution pathways.`;

    return (
        <div className="absolute inset-0 pt-[1cqi] flex flex-col bg-white overflow-hidden">
           <SlideHeader title="Opportunity Mapping" subtitle={subtitle} />
           <div className="flex-1 px-[8cqi] flex flex-col justify-center overflow-hidden">
               <div className="flex items-stretch gap-[3cqi] bg-white p-[3cqi] border border-f-charcoal/10 rounded-[1.5cqi] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-f-charcoal/5">
                   <div className="w-[35%] flex flex-col justify-center px-[2cqi] border-r-2 border-f-charcoal/10 border-dashed">
                        <div className="w-[4.5cqi] h-[4.5cqi] rounded-full bg-f-error/10 flex items-center justify-center mb-[2cqi]">
                            <AlertCircle className="text-f-error w-[2.5cqi] h-[2.5cqi]" />
                        </div>
                        <h3 className="text-f-charcoal font-heading font-black text-[2.2cqi] leading-tight mb-[1cqi]">Efficiency Drag</h3>
                        <p className="text-f-charcoal/70 text-[1.3cqi] font-body leading-snug">Identified via your <strong className="text-f-charcoal">{formatValue(effRatio, "percent")}</strong> Efficiency Ratio benchmark against the {peerData.name} average of <strong className="text-f-charcoal">{formatValue(peerData.eff, "percent")}</strong>.</p>
                   </div>
                   <div className="flex-1 px-[3cqi] flex flex-col justify-center">
                        <h3 className="text-f-violet font-heading font-black text-[2.2cqi] leading-tight mb-[1.5cqi] flex items-center gap-[1.5cqi]">
                            <div className="w-[4cqi] h-[4cqi] rounded-full bg-f-success/10 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-[2cqi] h-[2cqi] text-f-success" />
                            </div>
                            {product["Product/solution"]} Resolution
                        </h3>
                        <p className="text-[1.6cqi] text-f-charcoal leading-relaxed font-body">
                            {featuredCustomer ? featuredCustomer["Measurable outcomes (as published)"] : "Automated workflows and modern API architectures guarantee a 15% structural reduction in operational delivery costs across targeted verticals."}
                        </p>
                        {featuredCustomer && (
                             <div className="mt-[2cqi] inline-block bg-f-bg px-[1.5cqi] py-[0.7cqi] rounded-lg border border-f-charcoal/5">
                                 <p className="text-[1cqi] font-bold text-f-charcoal/60 tracking-[0.1em] uppercase font-heading">
                                     Demonstrated at: <span className="text-f-fuchsia">{featuredCustomer?.Customer}</span>
                                 </p>
                             </div>
                        )}
                   </div>
               </div>
           </div>
           <SlideFooter bankName={bank.NAME} />
        </div>
    );
};
