import React from 'react';
import { NeedleGauge } from '../NeedleGauge';
import { SlideHeader, SlideFooter } from '../SlideChrome';
import type { SlideProps, FormatType } from '../types';

export const SlideKPIs: React.FC<SlideProps> = ({ bank, peerData, kpis = [] }) => {
    // Build a deterministic subtitle from the KPIs
    const getScore = (kpi: any) => {
        if (kpi.avg === 0) return 0;
        const pct = (kpi.value - kpi.avg) / Math.abs(kpi.avg);
        return kpi.lowerIsBetter ? -pct : pct;
    };

    const weakest = kpis.reduce((prev, curr) => {
        return getScore(curr) < getScore(prev) ? curr : prev;
    }, kpis[0]);
    const strongest = kpis.reduce((prev, curr) => {
        return getScore(curr) > getScore(prev) ? curr : prev;
    }, kpis[0]);

    const subtitle = `${bank.NAME} leads in ${strongest?.label || 'N/A'} but trails peers in ${weakest?.label || 'N/A'} — benchmarked against the ${peerData.name} segment.`;

    return (
        <div className="absolute inset-0 pt-[1cqi] flex flex-col bg-white overflow-hidden">
           <SlideHeader title="Core Financial Performance" subtitle={subtitle} />
           <div className="flex-1 px-[6cqi] flex flex-col justify-center overflow-hidden">
               <div className="grid grid-cols-3 gap-x-[3cqi] gap-y-[2cqi] w-full max-w-[82cqi] mx-auto">
                   {kpis.map((kpi, i) => (
                       <NeedleGauge key={i} value={kpi.value} min={kpi.min} max={kpi.max} label={kpi.label} avg={kpi.avg} format={kpi.format as FormatType} lowerIsBetter={kpi.lowerIsBetter} />
                   ))}
               </div>
           </div>
           <SlideFooter bankName={bank.NAME} />
        </div>
    );
};
