import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SlideHeader, SlideFooter } from '../SlideChrome';
import type { SlideProps } from '../types';

export const SlideTCO: React.FC<SlideProps> = ({ bank, formatCurrencyObj, tcoData = [], projectedSavings = 0 }) => {
    const subtitle = `Shifting ${bank.NAME}'s cost structure from legacy inefficiencies to optimized digital execution, unlocking ${formatCurrencyObj(projectedSavings)} in annual capacity.`;

    return (
        <div className="absolute inset-0 pt-[1cqi] flex flex-col bg-white overflow-hidden">
           <SlideHeader title="Total Cost of Ownership (Before vs. After)" subtitle={subtitle} />
           <div className="flex-1 px-[6cqi] flex gap-[4cqi] items-center overflow-hidden">
               <div className="w-[60%] h-[32cqi] bg-white border border-f-charcoal/10 rounded-[1cqi] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-[2.5cqi]">
                   <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={tcoData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }} barSize={100}>
                           <XAxis dataKey="name" stroke="var(--color-f-charcoal)" opacity={0.5} style={{ fontSize: '1.2cqi', fontFamily: 'Outfit', fontWeight: 600 }} />
                           <YAxis tickFormatter={(value) => formatCurrencyObj(value, 0)} stroke="var(--color-f-charcoal)" opacity={0.5} style={{ fontSize: '1cqi', fontFamily: 'Outfit' }} />
                           <Tooltip
                               formatter={(value: any, name: any) => [formatCurrencyObj(value as number, 0), String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
                               contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', background: '#fff', fontFamily: 'Roboto' }}
                           />
                           <Legend wrapperStyle={{ fontFamily: 'Outfit', fontSize: '1.1cqi', paddingTop: '1cqi' }} />
                           <Bar dataKey="software" stackId="a" fill="var(--color-f-violet)" />
                           <Bar dataKey="services" stackId="a" fill="var(--color-f-fuchsia)" />
                           <Bar dataKey="labor" stackId="a" fill="var(--color-f-charcoal)" opacity={0.8} />
                           <Bar dataKey="inefficiency" stackId="a" fill="var(--color-f-error)" opacity={0.6} />
                       </BarChart>
                   </ResponsiveContainer>
               </div>
               <div className="w-[40%] flex flex-col justify-center gap-[2cqi]">
                    <div className="bg-f-bg p-[2.5cqi] rounded-[1cqi] border border-f-charcoal/5">
                        <h4 className="text-[1.4cqi] font-heading font-black text-f-charcoal mb-[1cqi]">Structural Shift</h4>
                        <p className="text-[1.2cqi] text-f-charcoal/70 font-body leading-relaxed">
                            Replacing high-cost manual labor and operational inefficiency with fixed-cost software and modern architectures. The 'After' state locks in long-term margin expansion by eliminating compounding technical debt.
                        </p>
                    </div>
                    <div className="bg-f-success/10 border-l-4 border-f-success p-[2cqi] rounded-r-[1cqi]">
                        <div className="text-f-success font-heading font-extrabold uppercase tracking-widest text-[1cqi] mb-[0.5cqi]">Net Annual TCO Reduction</div>
                        <div className="text-[3cqi] font-heading font-black text-f-success leading-none">{formatCurrencyObj(projectedSavings, 1)}</div>
                    </div>
               </div>
           </div>
           <SlideFooter bankName={bank.NAME} />
        </div>
    );
};
