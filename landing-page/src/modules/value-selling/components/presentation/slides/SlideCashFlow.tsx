import React from 'react';
import { SlideHeader, SlideFooter } from '../SlideChrome';
import type { SlideProps } from '../types';

type CashFlowRow = {
  year: number;
  efficiency: number;
  revenue: number;
  macro?: number;
  demo?: number;
  software: number;
  services: number;
  net: number;
  cumulative: number;
};

export const SlideCashFlow: React.FC<SlideProps> = ({ bank, formatCurrencyObj, detailedCashFlow = [] }) => {
    const subtitle = `Detailed 5-Year P&L impact model demonstrating exact cash flow timing, investment requirements, and net benefit realization for ${bank.NAME}.`;
    const flows = detailedCashFlow as CashFlowRow[];

    return (
        <div className="absolute inset-0 pt-[1cqi] flex flex-col bg-white overflow-hidden">
           <SlideHeader title="5-Year Financial Impact (P&L)" subtitle={subtitle} />
           <div className="flex-1 px-[6cqi] py-[2cqi] flex flex-col overflow-hidden">
               <div className="w-full bg-white border border-f-charcoal/10 rounded-[1cqi] shadow-sm overflow-hidden">
                   <table className="w-full text-left border-collapse">
                       <thead>
                           <tr className="bg-f-bg border-b border-f-charcoal/10">
                               <th className="py-[1.5cqi] px-[2cqi] font-heading font-black text-[1.2cqi] text-f-charcoal uppercase tracking-wider">Category</th>
                               {flows.map(cf => (
                                    <th key={cf.year} className="py-[1.5cqi] px-[2cqi] font-heading font-bold text-[1.1cqi] text-f-charcoal text-right">
                                        {cf.year === 0 ? 'Year 0 (Impl)' : `Year ${cf.year}`}
                                    </th>
                               ))}
                           </tr>
                       </thead>
                       <tbody className="font-body text-[1.15cqi]">
                           {/* Benefits */}
                           <tr>
                               <td colSpan={7} className="py-[0.8cqi] px-[2cqi] font-bold text-f-success bg-f-success/5 border-b border-f-charcoal/5">Value Drivers (Benefits)</td>
                           </tr>
                           <tr className="border-b border-f-charcoal/5">
                               <td className="py-[1cqi] px-[2cqi] text-f-charcoal/80 pl-[4cqi]">Operational Efficiency</td>
                               {flows.map(cf => <td key={cf.year} className="py-[1cqi] px-[2cqi] text-right text-f-charcoal">{formatCurrencyObj(cf.efficiency)}</td>)}
                           </tr>
                           <tr className="border-b border-f-charcoal/5">
                               <td className="py-[1cqi] px-[2cqi] text-f-charcoal/80 pl-[4cqi]">Footprint & Revenue Expansion</td>
                               {flows.map(cf => <td key={cf.year} className="py-[1cqi] px-[2cqi] text-right text-f-charcoal">{formatCurrencyObj(cf.revenue)}</td>)}
                           </tr>
                           <tr className="border-b border-f-charcoal/5 bg-f-violet/5">
                               <td className="py-[1cqi] px-[2cqi] text-f-violet font-semibold pl-[5cqi]">↳ Macro NIM Recapture <span className="text-[0.9cqi] font-normal opacity-70">(FRED)</span></td>
                               {flows.map(cf => <td key={cf.year} className="py-[1cqi] px-[2cqi] text-right text-f-violet font-medium">{formatCurrencyObj(cf.macro || 0)}</td>)}
                           </tr>
                           <tr className="border-b border-f-charcoal/10 bg-f-fuchsia/5">
                               <td className="py-[1cqi] px-[2cqi] text-f-fuchsia font-semibold pl-[5cqi]">↳ Demographic Revenue <span className="text-[0.9cqi] font-normal opacity-70">(Census)</span></td>
                               {flows.map(cf => <td key={cf.year} className="py-[1cqi] px-[2cqi] text-right text-f-fuchsia font-medium">{formatCurrencyObj(cf.demo || 0)}</td>)}
                           </tr>
                           <tr className="border-b border-f-charcoal/10 font-bold bg-f-bg/30">
                               <td className="py-[1cqi] px-[2cqi] text-f-charcoal">Total Benefits</td>
                               {flows.map(cf => <td key={cf.year} className="py-[1cqi] px-[2cqi] text-right text-f-success">{formatCurrencyObj(cf.efficiency + cf.revenue + (cf.macro || 0) + (cf.demo || 0))}</td>)}
                           </tr>

                           {/* Costs */}
                           <tr>
                               <td colSpan={7} className="py-[0.8cqi] px-[2cqi] font-bold text-f-error bg-f-error/5 border-b border-f-charcoal/5">Investments (Costs)</td>
                           </tr>
                           <tr className="border-b border-f-charcoal/5">
                               <td className="py-[1cqi] px-[2cqi] text-f-charcoal/80 pl-[4cqi]">Software License / SaaS</td>
                               {flows.map(cf => <td key={cf.year} className="py-[1cqi] px-[2cqi] text-right text-f-charcoal">{formatCurrencyObj(cf.software)}</td>)}
                           </tr>
                           <tr className="border-b border-f-charcoal/5">
                               <td className="py-[1cqi] px-[2cqi] text-f-charcoal/80 pl-[4cqi]">Implementation & Services</td>
                               {flows.map(cf => <td key={cf.year} className="py-[1cqi] px-[2cqi] text-right text-f-charcoal">{formatCurrencyObj(cf.services)}</td>)}
                           </tr>
                           <tr className="border-b border-f-charcoal/10 font-bold bg-f-bg/30">
                               <td className="py-[1cqi] px-[2cqi] text-f-charcoal">Total Costs</td>
                               {flows.map(cf => <td key={cf.year} className="py-[1cqi] px-[2cqi] text-right text-f-error">{formatCurrencyObj(cf.software + cf.services)}</td>)}
                           </tr>

                           {/* Net */}
                           <tr className="bg-f-charcoal text-white font-heading text-[1.3cqi]">
                               <td className="py-[1.2cqi] px-[2cqi] font-black">Net Cash Flow</td>
                               {flows.map(cf => (
                                    <td key={cf.year} className={`py-[1.2cqi] px-[2cqi] text-right font-black ${cf.net < 0 ? 'text-f-error' : 'text-f-success'}`}>
                                        {formatCurrencyObj(cf.net)}
                                    </td>
                               ))}
                           </tr>
                           <tr className="bg-[#2a3645] text-white font-heading text-[1.3cqi]">
                               <td className="py-[1.2cqi] px-[2cqi] font-black">Cumulative Cash Flow</td>
                               {flows.map(cf => (
                                    <td key={cf.year} className={`py-[1.2cqi] px-[2cqi] text-right font-black ${cf.cumulative < 0 ? 'text-[#ff7474]' : 'text-[#61f182]'}`}>
                                        {formatCurrencyObj(cf.cumulative)}
                                    </td>
                               ))}
                           </tr>
                       </tbody>
                   </table>
               </div>
           </div>
           <SlideFooter bankName={bank.NAME} />
        </div>
    );
};
