import React from 'react';
import { SlideHeader, SlideFooter } from '../SlideChrome';
import type { SlideProps } from '../types';

export const SlideValueDrivers: React.FC<SlideProps> = ({ bank, formatCurrencyObj, valueDrivers = [], projectedSavings = 0 }) => {
    const subtitle = `Decomposing the ${formatCurrencyObj(projectedSavings)} annual value creation pool into specific operational outcomes and efficiency gains inside ${bank.NAME}.`;

    // Calculate max value for scaling the waterfall bars correctly
    const maxVal = Math.max(projectedSavings, ...valueDrivers.map(d => d.value));

    return (
        <div className="absolute inset-0 pt-[1cqi] flex flex-col bg-white overflow-hidden">
           <SlideHeader title="Value Drivers (Savings Decomposition)" subtitle={subtitle} />
           <div className="flex-1 px-[8cqi] flex items-end pb-[6cqi] justify-center overflow-hidden h-full relative">
                <div className="w-full h-[65%] flex items-end justify-between relative border-b-2 border-f-charcoal/20">
                    {valueDrivers.map((driver, idx) => {
                        const heightPct = (driver.value / maxVal) * 100;
                        const startPct = (driver.start / maxVal) * 100;

                        return (
                            <div key={idx} className="relative flex flex-col items-center justify-end h-full" style={{ width: `${100 / valueDrivers.length}%` }}>
                                {/* Label Top */}
                                <div className="absolute font-heading font-black text-f-charcoal text-[1.5cqi] z-10 drop-shadow-sm transition-all"
                                     style={{ bottom: `${startPct + heightPct + 2}%` }}>
                                    +{formatCurrencyObj(driver.value, 1)}
                                </div>
                                {/* Bar */}
                                <div className="absolute w-[70%] bg-gradient-to-t from-f-violet to-f-fuchsia rounded-sm shadow-sm opacity-90 transition-all border border-b-0 border-white/20"
                                     style={{ height: `${heightPct}%`, bottom: `${startPct}%` }} />
                                {/* Label Bottom */}
                                <div className="absolute -bottom-[4cqi] text-center w-[120%]">
                                    <div className="font-heading font-bold text-f-charcoal text-[1.1cqi] leading-tight break-words">{driver.name}</div>
                                </div>
                            </div>
                        )
                    })}
                    
                    {/* Final Bar (Total) */}
                    <div className="relative flex flex-col items-center justify-end h-full" style={{ width: `${100 / valueDrivers.length}%` }}>
                        <div className="absolute font-heading font-black text-f-success text-[1.8cqi] z-10 drop-shadow-sm"
                             style={{ bottom: `102%` }}>
                            {formatCurrencyObj(projectedSavings, 1)}
                        </div>
                        <div className="absolute w-[80%] bg-f-success rounded-t-sm shadow-md bottom-0"
                             style={{ height: `100%` }} />
                        <div className="absolute -bottom-[4cqi] text-center w-[120%]">
                            <div className="font-heading font-black text-f-charcoal text-[1.2cqi] uppercase tracking-wide">Total Annual Value</div>
                        </div>
                    </div>
                </div>
                
                {/* Visual guidelines */}
                {valueDrivers.map((driver, idx) => {
                    if (idx === valueDrivers.length - 1) return null;
                    const thisEnd = ((driver.start + driver.value) / maxVal) * 100;
                    return (
                        <div key={`line-${idx}`} className="absolute border-t border-dashed border-f-charcoal/30 w-full z-0 pointer-events-none"
                             style={{ bottom: `${thisEnd}%`, left: 0 }} />
                    )
                })}
           </div>
           <SlideFooter bankName={bank.NAME} />
        </div>
    );
};
