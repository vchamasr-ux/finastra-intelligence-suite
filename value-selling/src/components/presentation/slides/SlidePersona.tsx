import React from 'react';
import { Target, Users, AlertTriangle, TrendingUp, Cpu } from 'lucide-react';
import { SlideHeader } from '../SlideChrome';
import { getPeerSegment } from '../presentationHelpers';

export const SlidePersona: React.FC<any> = ({ bank, product, featuredUseCase }) => {
  const eeffrGap = bank.EEFFR ? (bank.EEFFR - getPeerSegment(bank.ASSET / 1000000).eff).toFixed(1) : "0.0";
  const eeffrWorse = parseFloat(eeffrGap) > 0;

  let highlightMetric = eeffrWorse
    ? `Operating efficiency trails peers by ${eeffrGap}pp`
    : `Scale growth requires protected margins`;

  const pains = featuredUseCase["Typical pains"].split(',').map((p: string) => p.trim());
  const outcomes = featuredUseCase["ROI drivers and measurable outcomes"].split(';').map((o: string) => o.trim());
  const personas = featuredUseCase["Primary buyer personas"];

  return (
    <div className="absolute inset-0 pt-[1cqi] flex flex-col bg-white overflow-hidden">
      <SlideHeader title={`Targeting ${product["Product/solution"]} to Core Pain Points`} subtitle={`Connecting ${personas} priorities to ${bank.NAME}'s operational reality.`} />

      <div className="flex-1 flex gap-[3cqi] items-stretch px-[8cqi] pb-[4cqi] max-w-[82cqi] mx-auto w-full">
        {/* Left Column: The Persona & Reality */}
        <div className="w-[45%] flex flex-col gap-[2cqi] justify-center">
          <div className="bg-slate-50 p-[2.5cqi] rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[15cqi] h-[15cqi] bg-f-fuchsia/5 rounded-full -translate-y-1/2 translate-x-1/3 transition-transform duration-700 group-hover:scale-150" />
            
            <div className="flex items-center gap-[1.2cqi] mb-[2cqi] relative z-10">
              <div className="w-[3.5cqi] h-[3.5cqi] rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Users className="w-[1.8cqi] h-[1.8cqi]" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-[1.4cqi] text-f-charcoal uppercase tracking-wider">Primary Stakeholders</h3>
                <p className="font-body text-[1.2cqi] text-slate-600">{personas}</p>
              </div>
            </div>

            <div className="bg-white p-[1.5cqi] rounded-lg border border-red-100 mb-[1.5cqi] relative z-10">
              <h4 className="font-heading font-semibold text-[1.1cqi] text-slate-800 flex items-center gap-[0.5cqi] mb-[1cqi]">
                <AlertTriangle className="w-[1.2cqi] h-[1.2cqi] text-red-500" />
                Current Pains & Friction
              </h4>
              <ul className="space-y-[0.8cqi]">
                {pains.map((pain: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-[0.5cqi] font-body text-[1.1cqi] text-slate-600">
                    <span className="text-red-400 mt-[0.2cqi]">•</span>
                    {pain}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50/50 p-[1.5cqi] rounded-lg border border-blue-100 relative z-10">
              <h4 className="font-heading font-semibold text-[1.1cqi] text-blue-900 mb-[0.5cqi]">Data Reality</h4>
              <p className="font-body text-[1.2cqi] text-blue-800 font-medium">
                {highlightMetric} — amplifying the impact of these systemic frictions.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: The Solution & ROI */}
        <div className="w-[55%] flex flex-col gap-[2cqi] justify-center">
          <div className="bg-gradient-to-br from-[#1e2733] to-[#2a3645] p-[2.5cqi] rounded-xl text-white shadow-xl relative overflow-hidden flex flex-col">
            <div className="absolute -top-[10cqi] -right-[10cqi] w-[30cqi] h-[30cqi] bg-gradient-to-bl from-f-violet/20 to-transparent rounded-full blur-3xl" />
            
            <div className="flex items-center gap-[1.2cqi] mb-[2cqi] relative z-10">
              <div className="w-[3.5cqi] h-[3.5cqi] rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white">
                <Target className="w-[1.8cqi] h-[1.8cqi]" />
              </div>
              <h3 className="font-heading font-bold text-[1.6cqi] uppercase tracking-wider">
                Alignment via {product["Product/solution"]}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-[1.5cqi] mb-[2cqi] relative z-10">
              {outcomes.map((outcome: string, idx: number) => (
                <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 p-[1.5cqi] rounded-lg">
                  <div className="flex items-center gap-[0.8cqi] mb-[0.8cqi]">
                    <TrendingUp className="w-[1.2cqi] h-[1.2cqi] text-f-violet" />
                    <span className="font-heading uppercase tracking-wider text-[0.8cqi] text-slate-300 font-bold">ROI DRIVER {idx + 1}</span>
                  </div>
                  <p className="font-body text-[1.1cqi] leading-relaxed text-slate-100">{outcome}</p>
                </div>
              ))}
            </div>

            <div className="mt-auto bg-gradient-to-r from-f-violet to-f-fuchsia p-[1.5cqi] rounded-lg relative z-10">
              <div className="flex items-center gap-[1cqi]">
                <Cpu className="w-[2cqi] h-[2cqi] text-white" />
                <p className="font-body text-[1.2cqi] font-medium leading-tight">
                  <span className="opacity-80">Strategic Motion:</span><br/>
                  Target {personas.split(',')[0]} by framing {product["Product/solution"]} not as a feature upgrade, but as the engine to solve {pains[0].toLowerCase()}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
