import React from 'react';
import { SlideHeader, SlideFooter } from '../SlideChrome';
import type { SlideProps } from '../types';

export const SlideExecution: React.FC<SlideProps> = ({ bank, product, scoredCustomers = [] }) => {
    // Take the top 3 case studies
    const relevantCustomers = scoredCustomers.slice(0, 3);
    
    const subtitle = relevantCustomers.length > 0 
        ? `Validated implementation outcomes for ${product["Product/solution"]} deployments — proving the execution model for ${bank.NAME}.`
        : `Validated implementation outcomes for identical product deployments.`;

    return (
        <div className="absolute inset-0 pt-[1cqi] flex flex-col bg-white overflow-hidden">
           <SlideHeader title="PROVEN INSTITUTIONAL EXECUTION" subtitle={subtitle} />
           <div className="flex-1 px-[8cqi] flex max-w-[88cqi] mx-auto items-center justify-center overflow-hidden w-full py-[2cqi]">
               {relevantCustomers.length > 0 ? (
                   <div className="w-full flex justify-center gap-[2.5cqi] h-full items-stretch perspective-1000">
                       {relevantCustomers.map((customer: any, idx: number) => (
                           <div key={idx} className="flex-1 max-w-[26cqi] bg-white border border-slate-200 rounded-xl p-[2.5cqi] shadow-sm flex flex-col relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-[0.5cqi]">
                               <div className="absolute top-0 right-0 w-[15cqi] h-[15cqi] bg-gradient-to-bl from-f-fuchsia/5 to-transparent rounded-full -mr-[5cqi] -mt-[5cqi] transition-colors group-hover:from-f-fuchsia/10" />
                               
                               <h3 className="text-[1.8cqi] font-heading font-black text-f-charcoal mb-[0.8cqi] line-clamp-2 leading-tight" title={customer.Customer}>{customer.Customer}</h3>
                               
                               <div className="flex flex-wrap items-center gap-[0.8cqi] mb-[1.5cqi]">
                                   <div className="text-f-fuchsia uppercase font-bold text-[0.9cqi] tracking-wider font-heading truncate">{customer.Industry}</div>
                                   {customer.score > 0 && (
                                       <div className="bg-green-50 text-green-700 font-bold text-[0.7cqi] px-[0.6cqi] py-[0.2cqi] rounded flex items-center gap-[0.3cqi] border border-green-200 uppercase whitespace-nowrap">
                                           Segment Match
                                       </div>
                                   )}
                               </div>
                               
                               <div className="flex-1 mb-[1.5cqi] relative">
                                  <svg className="absolute -left-[0.8cqi] -top-[0.8cqi] w-[2cqi] h-[2cqi] text-f-charcoal/5" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                                  <p className="text-[1.3cqi] text-f-charcoal/80 font-body leading-relaxed border-l-[0.2cqi] border-f-violet pl-[1.5cqi] italic relative z-10 h-full">
                                      {customer["Problem/context"]}
                                  </p>
                               </div>
                               
                               <div className="bg-slate-50 p-[1.5cqi] rounded-lg border border-slate-100 mt-auto transition-colors group-hover:bg-f-bg">
                                   <h4 className="text-slate-500 uppercase font-bold text-[0.85cqi] tracking-widest mb-[0.8cqi] font-heading flex items-center gap-[0.5cqi]">
                                       <svg className="w-[1.2cqi] h-[1.2cqi] text-f-fuchsia" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                       Validated Outcomes
                                   </h4>
                                   <p className="text-[1.1cqi] text-f-charcoal font-medium font-body leading-snug">
                                       {customer["Measurable outcomes (as published)"]}
                                   </p>
                               </div>
                           </div>
                       ))}
                   </div>
               ) : (
                   <div className="w-full text-center p-[8cqi] border-2 border-dashed border-slate-200 rounded-[2cqi] bg-slate-50">
                       <p className="text-[2cqi] text-slate-400 font-medium font-heading">No Validated Case Studies Available in Evidence Base</p>
                   </div>
               )}
           </div>
           <SlideFooter bankName={bank.NAME} />
        </div>
    );
};
