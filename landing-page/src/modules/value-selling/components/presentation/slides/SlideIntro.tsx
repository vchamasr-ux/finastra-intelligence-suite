import React from 'react';
import { SlideHeader, SlideFooter } from '../SlideChrome';
import type { SlideProps } from '../types';

export const SlideIntro: React.FC<SlideProps> = ({ bank, product, formatCurrencyObj }) => (
    <div className="absolute inset-0 pt-[1cqi] flex flex-col bg-white overflow-hidden">
       <SlideHeader title="EXECUTIVE INTRODUCTION" subtitle={`${bank.NAME} manages ${formatCurrencyObj(bank.ASSET / 1000)} in assets across ${bank.STNAME} — this review quantifies where modernization will unlock margin.`} />
       <div className="flex-1 px-[8cqi] py-[2cqi] flex flex-col justify-center items-center text-center overflow-hidden">
           <h2 className="text-[3.2cqi] font-heading font-extrabold text-f-charcoal leading-tight mb-[2.5cqi] max-w-[75cqi]">
               Defending <span className="text-transparent bg-clip-text bg-gradient-to-r from-f-violet to-f-fuchsia">{bank.NAME}'s</span> {formatCurrencyObj(bank.DEP / 1000)} Deposit Base With Next-Generation Infrastructure.
           </h2>
           <div className="w-[8cqi] h-[0.3cqi] bg-gradient-to-r from-f-violet to-f-fuchsia mb-[2.5cqi]" />
           <p className="text-[1.7cqi] font-body text-f-charcoal/70 max-w-[65cqi] leading-relaxed">
               With a robust branch network across {bank.STNAME}, {bank.NAME} is positioned for growth. However, as the industry bifurcates into digital leaders and legacy operators, our objective is to demonstrate conclusively how <strong className="text-f-charcoal font-bold">{product["Product/solution"]}</strong> will upgrade your technological footprint and structurally enhance operating margins.
           </p>
       </div>
       <SlideFooter bankName={bank.NAME} />
    </div>
);
