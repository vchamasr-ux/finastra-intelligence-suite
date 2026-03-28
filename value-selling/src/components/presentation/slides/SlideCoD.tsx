import React from 'react';
import type { SlideProps } from '../types';
import { AlertOctagon, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type CoDMetrics = { monthly: number; quarterly: number; annual: number; macroRate?: number; isHighRate?: boolean };

export const SlideCoD: React.FC<SlideProps> = ({ bank, formatCurrencyObj, codMetrics = { monthly: 0, quarterly: 0, annual: 0 } }) => {
    const cod = codMetrics as CoDMetrics;
    const isHighRate = cod.isHighRate ?? false;
    const macroRate = cod.macroRate ?? null;

    const subtitle = isHighRate
        ? `In a ${macroRate?.toFixed(2)}% rate environment, every month of delay compounds margin destruction for ${bank.NAME}. The cost of inaction is now amplified 1.25× by macro pressure.`
        : `Quantifying the financial penalty of status quo execution for ${bank.NAME}. Every delayed decision permanently destroys capital.`;

    const chartData = Array.from({ length: 12 }, (_, i) => ({
        month: `M${i + 1}`,
        cost: cod.monthly * (i + 1),
    }));

    return (
        <div className="absolute inset-0 pt-[1cqi] flex flex-col bg-f-error overflow-hidden border-[0.8cqi] border-f-charcoal text-white">
           <div className="px-[6cqi] mb-[1cqi] pt-[1.5cqi] shrink-0">
               <h1 className="font-heading text-[3cqi] font-black text-white mb-[0.5cqi] tracking-tight">The Cost of Delay</h1>
               <p className="font-body text-[1.4cqi] text-white/80 pb-[1.5cqi] border-b-[0.15cqi] border-white/20">
                   {subtitle}
               </p>
           </div>
           
           <div className="flex-1 px-[6cqi] flex items-center justify-between overflow-hidden gap-[6cqi] pb-[2cqi]">
               {/* Left Column: Big Impact Stat */}
               <div className="w-[45%] flex flex-col justify-center border-r border-white/20 pr-[4cqi]">
                   <AlertOctagon className="w-[7cqi] h-[7cqi] text-white/30 mb-[2cqi] animate-pulse" />
                   <h2 className="font-heading font-black tracking-widest uppercase text-[1.6cqi] text-white/80 mb-[1cqi]">Every 30 Days of Inaction Costs:</h2>
                   <div className="text-[9cqi] font-heading font-black leading-[1.1] mb-[2cqi] drop-shadow-2xl text-white">
                       {formatCurrencyObj(cod.monthly, 1)}
                   </div>
                   
                   {/* Macro amplifier badge */}
                   {isHighRate && macroRate !== null && (
                       <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-[2cqi] py-[1cqi] rounded-lg mb-[2cqi]">
                           <TrendingDown className="w-[1.5cqi] h-[1.5cqi] text-white/70 shrink-0" />
                           <span className="text-[1cqi] font-bold text-white/90">
                               High-rate env ({macroRate.toFixed(2)}%) amplifies delay cost ×1.25 — every month of inaction is compounded by NIM pressure.
                           </span>
                       </div>
                   )}
                   
                   <div className="grid grid-cols-2 gap-[2cqi] w-full pt-[2cqi] border-t border-white/20">
                       <div className="flex flex-col">
                           <div className="text-white/60 font-heading font-bold uppercase tracking-widest text-[1cqi] mb-[0.5cqi]">1 Quarter (90 Days)</div>
                           <div className="text-[2.8cqi] font-heading font-black">{formatCurrencyObj(cod.quarterly, 1)}</div>
                       </div>
                       <div className="flex flex-col">
                           <div className="text-white/60 font-heading font-bold uppercase tracking-widest text-[1cqi] mb-[0.5cqi]">Annual Destruction</div>
                           <div className="text-[2.8cqi] font-heading font-black">{formatCurrencyObj(cod.annual, 1)}</div>
                       </div>
                   </div>
               </div>

               {/* Right Column: Chart */}
               <div className="w-[55%] h-full flex flex-col relative text-white py-[2cqi]">
                   <div className="font-heading font-bold text-[1.4cqi] text-white uppercase tracking-widest mb-[1cqi]">
                       Cumulative Capital Destruction (12 Months)
                   </div>
                   <div className="flex-1 w-full bg-white/5 rounded-xl border border-white/20 p-[3cqi] relative overflow-hidden">
                       <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                               <defs>
                                   <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                       <stop offset="5%" stopColor="#ffffff" stopOpacity={0.9}/>
                                       <stop offset="95%" stopColor="#ffffff" stopOpacity={0.1}/>
                                   </linearGradient>
                               </defs>
                               <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" vertical={false} />
                               <XAxis dataKey="month" stroke="rgba(255,255,255,0.8)" tick={{ fill: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 700 }} tickLine={false} axisLine={false} dy={10} />
                               <YAxis stroke="rgba(255,255,255,0.8)" tickFormatter={(val) => formatCurrencyObj(val, 0)} tick={{ fill: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 700 }} tickLine={false} axisLine={false} dx={-10} />
                               <Tooltip
                                   cursor={{ stroke: 'white', strokeWidth: 2, strokeDasharray: '5 5' }}
                                   contentStyle={{ backgroundColor: 'rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', color: '#fff' }}
                                   itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                   formatter={(value: any) => [formatCurrencyObj(value as number, 1), 'Cumulative Cost']}
                                   labelStyle={{ color: 'rgba(255,255,255,0.7)', paddingBottom: '4px' }}
                               />
                               <Area type="monotone" dataKey="cost" stroke="#ffffff" strokeWidth={5} fillOpacity={1} fill="url(#colorCost)" />
                           </AreaChart>
                       </ResponsiveContainer>
                   </div>
               </div>
           </div>
           
           {/* Custom footer override for dark bg */}
           <div className="h-[6cqi] shrink-0 border-t border-white/10 flex items-center justify-between px-[6cqi] font-heading uppercase text-[1cqi] tracking-[0.15em] font-bold text-white/50 z-20">
               <div>FINASTRA VALUE ENGINEERING</div>
               <div className="text-center">{bank.NAME} CONFIDENTIAL</div>
               <div>DATE: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
           </div>
        </div>
    );
};
