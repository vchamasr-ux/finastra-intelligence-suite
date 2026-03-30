import React from 'react';
import { SlideHeader, SlideFooter } from '../SlideChrome';
import type { SlideProps } from '../types';

export const SlideImperative: React.FC<SlideProps> = ({ bank, product, peerData, formatCurrencyObj }) => {
    const effRatio = bank.EEFFR || 55.2;
    const peerEff = peerData.eff;
    const effGap = (effRatio - peerEff).toFixed(1);
    const assetStr = formatCurrencyObj(bank.ASSET / 1000);

    // Deterministic McKinsey-style subtitle
    const subtitle = effRatio > peerEff
        ? `${bank.NAME}'s efficiency ratio of ${effRatio.toFixed(1)}% trails the ${peerData.name} peer median by ${effGap}pp — a structural drag on shareholder returns.`
        : `${bank.NAME} operates at ${effRatio.toFixed(1)}% efficiency, outperforming ${peerData.name} peers, but faces infrastructure risk without modernization.`;

    return (
        <div className="absolute inset-0 pt-[1cqi] flex flex-col bg-white overflow-hidden">
           <SlideHeader title="Strategic Imperative" subtitle={subtitle} />
           <div className="flex-1 px-[8cqi] flex gap-[4cqi] items-center overflow-hidden">
               <div className="flex-1 flex flex-col pr-[3cqi]">
                   <h3 className="text-f-charcoal/50 font-heading font-extrabold tracking-[0.2em] text-[1cqi] uppercase mb-[1.5cqi]">The Challenge</h3>
                   <p className="text-[2.5cqi] text-f-charcoal font-heading font-light leading-snug">
                       Institutions managing <strong className="font-extrabold text-f-violet">{assetStr}</strong> in assets face critical pressure to modernize infrastructure while strictly controlling operational expenditure.
                   </p>
               </div>
               <div className="w-[1px] h-[55%] bg-gradient-to-b from-transparent via-f-charcoal/10 to-transparent shrink-0" />
               <div className="flex-1 flex flex-col pl-[3cqi]">
                   <h3 className="text-f-fuchsia font-heading font-extrabold tracking-[0.2em] text-[1cqi] uppercase mb-[1.5cqi]">Our Solution Context</h3>
                   <p className="text-[1.5cqi] text-f-charcoal/90 font-body leading-relaxed mb-[2cqi]">
                       {product["Primary use cases"]}
                   </p>
                   <div className="bg-gradient-to-br from-f-violet/5 to-f-fuchsia/5 border border-f-violet/10 rounded-xl p-[2.5cqi] shadow-sm">
                       <p className="text-f-charcoal text-[1.3cqi] font-serif italic text-center leading-relaxed">"{product["Concise description"]}"</p>
                   </div>
               </div>
           </div>
           <SlideFooter bankName={bank.NAME} />
        </div>
    );
};
