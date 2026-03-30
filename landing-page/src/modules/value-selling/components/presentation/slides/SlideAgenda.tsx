import React from 'react';
import { ChevronRight } from 'lucide-react';
import { SlideHeader, SlideFooter } from '../SlideChrome';
import type { SlideProps } from '../types';

const AGENDA_ITEMS = [
    "EXECUTIVE ALIGNMENT", 
    "MARKET & FOOTPRINT BENCHMARKING", 
    "OPPORTUNITY & DEMOGRAPHIC SIZING", 
    "TARGET ARCHITECTURE & CAPABILITIES", 
    "COMPREHENSIVE FINANCIAL BUSINESS CASE", 
    "COMPETITIVE POSITIONING",
    "PROVEN INSTITUTIONAL EXECUTION", 
    "DEPLOYMENT ROADMAP & NEXT STEPS"
];

export const SlideAgenda: React.FC<SlideProps> = ({ bank }) => (
    <div className="absolute inset-0 pt-[1cqi] flex flex-col bg-white overflow-hidden">
       <SlideHeader title="AGENDA" hideSubtitle />
       <div className="flex-1 px-[10cqi] flex flex-col overflow-hidden">
           <div className="flex-1 flex flex-col gap-[1.8cqi] justify-center max-w-[70cqi] mx-auto w-full">
               {AGENDA_ITEMS.map((item, idx) => (
                   <div key={idx} className="flex items-center gap-[3cqi] text-[1.9cqi] text-f-charcoal group hover:text-f-fuchsia transition cursor-default">
                       <span className="font-heading font-extrabold text-f-charcoal/20 group-hover:text-f-violet w-[5cqi] text-right transition-colors">
                           0{idx+1}
                       </span>
                       <span className="font-heading font-semibold tracking-wide">{item}</span>
                       <ChevronRight className="w-[1.5cqi] h-[1.5cqi] text-f-charcoal/20 group-hover:text-f-fuchsia ml-auto transition-colors" />
                   </div>
               ))}
           </div>
       </div>
       <SlideFooter bankName={bank.NAME} />
    </div>
);
