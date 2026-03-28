import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { SlideHeader, SlideFooter } from '../SlideChrome';
import type { SlideProps } from '../types';

export const SlideDCF: React.FC<SlideProps> = ({ bank, formatCurrencyObj, cashFlowData = [], projectedSavings = 0, cumulative = 0 }) => {
    const paybackYear = cashFlowData.findIndex(d => d.cumulative > 0);
    const subtitle = paybackYear > 0
        ? `Investment breaks even in Year ${paybackYear}, generating ${formatCurrencyObj(cumulative)} cumulative value by Year 5 for ${bank.NAME}.`
        : `Projected ${formatCurrencyObj(cumulative)} net present value over five years with ${formatCurrencyObj(projectedSavings)} annual run-rate savings.`;

    return (
        <div className="absolute inset-0 pt-[1cqi] flex flex-col bg-white overflow-hidden">
           <SlideHeader title="5-Year Value Realization (DCF)" subtitle={subtitle} />
           <div className="flex-1 px-[6cqi] flex gap-[4cqi] items-center overflow-hidden">
               <div className="w-[58%] h-[32cqi] bg-white border border-f-charcoal/10 rounded-[1cqi] shadow-sm p-[2.5cqi]">
                   <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={cashFlowData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                           <ReferenceLine y={0} stroke="var(--color-f-charcoal)" opacity={0.2} />
                           <XAxis dataKey="year" stroke="var(--color-f-charcoal)" opacity={0.5} style={{ fontSize: '1cqi', fontFamily: 'Outfit' }} />
                            <YAxis tickFormatter={(value) => formatCurrencyObj(value)} stroke="var(--color-f-charcoal)" opacity={0.5} style={{ fontSize: '1cqi', fontFamily: 'Outfit' }} />
                           <Tooltip
                               formatter={(value: any) => [formatCurrencyObj(value as number), "Amount"]}
                               contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', background: '#fff', fontFamily: 'Roboto' }}
                           />
                           <Bar dataKey="cumulative" radius={[4, 4, 0, 0]}>
                               {cashFlowData.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={entry.cumulative < 0 ? 'var(--color-f-error)' : 'var(--color-f-success)'} />
                               ))}
                           </Bar>
                       </BarChart>
                   </ResponsiveContainer>
               </div>
               <div className="w-[42%] flex flex-col justify-center gap-[3cqi]">
                   <div className="bg-f-success/5 border-l-4 border-f-success p-[2.5cqi] rounded-r-[1cqi]">
                       <div className="text-f-success font-heading font-extrabold uppercase tracking-widest text-[1.1cqi] mb-[1cqi]">Projected Annual Savings</div>
                       <div className="text-[4cqi] font-heading font-black text-f-success leading-none">{formatCurrencyObj(projectedSavings)}</div>
                   </div>
                   <div className="bg-f-violet/5 border-l-4 border-f-violet p-[2.5cqi] rounded-r-[1cqi]">
                       <div className="text-f-violet font-heading font-extrabold uppercase tracking-widest text-[1.1cqi] mb-[1cqi]">5-Year Cumulative Value</div>
                       <div className="text-[4cqi] font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-f-violet to-f-fuchsia leading-none">{formatCurrencyObj(cumulative)}</div>
                   </div>
               </div>
           </div>
           <SlideFooter bankName={bank.NAME} />
        </div>
    );
};
