import React from 'react';
import { SlideHeader, SlideFooter } from '../SlideChrome';
import type { SlideProps } from '../types';

export const SlideConclusion: React.FC<SlideProps> = ({ bank, product }) => (
    <div className="absolute inset-0 pt-[1cqi] flex flex-col bg-white overflow-hidden">
       <SlideHeader title="Conclusion & Next Steps" subtitle={`Two-phase roadmap to accelerate ${bank.NAME}'s ${product["Product/solution"]} deployment and validate projected returns.`} />
       <div className="flex-1 px-[8cqi] flex flex-col items-center justify-center overflow-hidden">
           <h2 className="text-[3.5cqi] font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-f-charcoal to-f-charcoal/70 mb-[4cqi] text-center drop-shadow-sm">
               Seize the Modernization Advantage
           </h2>
           <div className="flex gap-[3cqi] w-full max-w-[65cqi]">
               <div className="flex-1 bg-gradient-to-br from-f-violet to-f-fuchsia p-[1px] rounded-[1.5cqi] shadow-lg hover:shadow-xl transition-shadow">
                    <div className="bg-white p-[3cqi] rounded-[calc(1.5cqi-1px)] h-full flex flex-col items-center text-center">
                        <div className="w-[5cqi] h-[5cqi] bg-gradient-to-br from-f-violet to-f-fuchsia rounded-full flex items-center justify-center text-white font-black font-heading text-[2.2cqi] mb-[2cqi] shadow-md">1</div>
                        <h4 className="text-[2cqi] font-heading font-black text-f-charcoal mb-[1cqi]">Technical Deep Dive</h4>
                        <p className="text-[1.4cqi] text-f-charcoal/80 font-body">Review solution architecture against {bank.NAME}'s current IT state.</p>
                    </div>
               </div>
               <div className="flex-1 bg-f-bg border border-f-charcoal/10 p-[3cqi] rounded-[1.5cqi] flex flex-col items-center text-center hover:bg-white hover:shadow-lg transition-all">
                   <div className="w-[5cqi] h-[5cqi] bg-f-charcoal/10 rounded-full flex items-center justify-center text-f-charcoal font-black font-heading text-[2.2cqi] mb-[2cqi]">2</div>
                   <h4 className="text-[2cqi] font-heading font-black text-f-charcoal mb-[1cqi]">Business Case Finalization</h4>
                   <p className="text-[1.4cqi] text-f-charcoal/80 font-body">Align on exact OPEX inputs to finalize the 5-Year DCF models.</p>
               </div>
           </div>
       </div>
       <SlideFooter bankName={bank.NAME} align="center" />
    </div>
);
