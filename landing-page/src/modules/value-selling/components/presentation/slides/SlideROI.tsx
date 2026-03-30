import React from 'react';
import { SlideHeader, SlideFooter } from '../SlideChrome';
import type { SlideProps } from '../types';
import { TrendingUp, Activity, Target, Timer, Zap, MapPin } from 'lucide-react';

export const SlideROI: React.FC<SlideProps> = ({ bank, formatCurrencyObj, roiMetrics = { roi: 0, irr: 0, npv: 0, paybackMonths: 0 } }) => {
    const metrics = roiMetrics as typeof roiMetrics & { macroNimSavings?: number; demographicRevenueUplift?: number };
    const subtitle = `Comprehensive investment return metrics for ${bank.NAME}, incorporating macro rate environment and demographic growth signals into the full value pool.`;

    const hasMacro = (metrics.macroNimSavings || 0) > 0;
    const hasDemo = (metrics.demographicRevenueUplift || 0) > 0;

    return (
        <div className="absolute inset-0 pt-[1cqi] flex flex-col bg-f-bg overflow-hidden border-[0.8cqi] border-f-charcoal">
           <SlideHeader title="Investment Return Metrics" subtitle={subtitle} />
           <div className="flex-1 px-[8cqi] flex flex-col items-center justify-center overflow-hidden gap-[2cqi]">
                <div className="grid grid-cols-2 gap-[2cqi] w-full max-w-[90cqi]">
                    
                    {/* ROI */}
                    <div className="bg-white p-[2.5cqi] rounded-[1.5cqi] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-f-charcoal/5 flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute -right-8 -top-8 bg-f-violet/5 w-[15cqi] h-[15cqi] rounded-full group-hover:bg-f-violet/10 transition-colors" />
                        <TrendingUp className="w-[3.5cqi] h-[3.5cqi] text-f-violet mb-[1cqi] relative z-10" />
                        <div className="text-f-charcoal/60 font-heading font-black tracking-widest uppercase text-[1.1cqi] mb-[0.5cqi] relative z-10">Return on Investment (5-Year)</div>
                        <div className="text-[5cqi] font-heading font-black text-f-charcoal leading-none relative z-10">
                            {roiMetrics.roi >= 1000 ? (roiMetrics.roi / 100).toFixed(1) : roiMetrics.roi.toFixed(0)}
                            <span className="text-[2.8cqi] text-f-violet">{roiMetrics.roi >= 1000 ? 'x' : '%'}</span>
                        </div>
                    </div>

                    {/* NPV */}
                    <div className="bg-white p-[2.5cqi] rounded-[1.5cqi] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-f-charcoal/5 flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute -left-8 -bottom-8 bg-f-success/5 w-[15cqi] h-[15cqi] rounded-full group-hover:bg-f-success/10 transition-colors" />
                        <Target className="w-[3.5cqi] h-[3.5cqi] text-f-success mb-[1cqi] relative z-10" />
                        <div className="text-f-charcoal/60 font-heading font-black tracking-widest uppercase text-[1.1cqi] mb-[0.5cqi] relative z-10">Net Present Value (NPV)</div>
                        <div className="text-[4.5cqi] font-heading font-black text-f-charcoal leading-none relative z-10">
                            {formatCurrencyObj(roiMetrics.npv, 1)}
                        </div>
                    </div>

                    {/* IRR */}
                    <div className="bg-white p-[2.5cqi] rounded-[1.5cqi] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-f-charcoal/5 flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute -right-8 -bottom-8 bg-f-fuchsia/5 w-[15cqi] h-[15cqi] rounded-full group-hover:bg-f-fuchsia/10 transition-colors" />
                        <Activity className="w-[3.5cqi] h-[3.5cqi] text-f-fuchsia mb-[1cqi] relative z-10" />
                        <div className="text-f-charcoal/60 font-heading font-black tracking-widest uppercase text-[1.1cqi] mb-[0.5cqi] relative z-10">Internal Rate of Return (IRR)</div>
                        <div className="text-[4.5cqi] font-heading font-black text-f-charcoal leading-none relative z-10">
                            {roiMetrics.irr.toFixed(1)}<span className="text-[2.8cqi] text-f-fuchsia">%</span>
                        </div>
                    </div>

                    {/* Payback */}
                    <div className="bg-[#2a3645] p-[2.5cqi] rounded-[1.5cqi] shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
                        <Timer className="w-[3.5cqi] h-[3.5cqi] text-white/50 mb-[1cqi] relative z-10" />
                        <div className="text-white/60 font-heading font-black tracking-widest uppercase text-[1.1cqi] mb-[0.5cqi] relative z-10">Breakeven / Payback Period</div>
                        <div className="text-[4.5cqi] font-heading font-black text-white leading-none relative z-10">
                            {roiMetrics.paybackMonths} <span className="text-[2.2cqi] font-normal text-white/80 tracking-wide">months</span>
                        </div>
                    </div>
                </div>

                {/* Data Signal Bar — shows which live signals are factored in */}
                {(hasMacro || hasDemo) && (
                    <div className="flex items-center gap-[3cqi] w-full max-w-[90cqi] bg-white px-[3cqi] py-[1.5cqi] rounded-xl border border-f-charcoal/10 shadow-sm">
                        <span className="text-[1cqi] font-heading font-bold text-f-charcoal/50 uppercase tracking-widest shrink-0">Live Signals Baked In:</span>
                        {hasMacro && (
                            <div className="flex items-center gap-1.5 bg-f-violet/10 px-[1.5cqi] py-[0.5cqi] rounded-lg">
                                <Zap className="w-[1.2cqi] h-[1.2cqi] text-f-violet" />
                                <span className="text-[0.95cqi] font-bold text-f-violet">FRED: {formatCurrencyObj(metrics.macroNimSavings! , 1)} NIM Recapture/yr</span>
                            </div>
                        )}
                        {hasDemo && (
                            <div className="flex items-center gap-1.5 bg-f-fuchsia/10 px-[1.5cqi] py-[0.5cqi] rounded-lg">
                                <MapPin className="w-[1.2cqi] h-[1.2cqi] text-f-fuchsia" />
                                <span className="text-[0.95cqi] font-bold text-f-fuchsia">Census: {formatCurrencyObj(metrics.demographicRevenueUplift!, 1)} Demo Revenue/yr</span>
                            </div>
                        )}
                    </div>
                )}
           </div>
           <SlideFooter bankName={bank.NAME} />
        </div>
    );
};
