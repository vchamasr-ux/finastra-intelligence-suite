import React from 'react';
import { ShieldCheck, ArrowRight, Zap, Combine } from 'lucide-react';
import { SlideHeader } from '../SlideChrome';

export const SlideCompetitors: React.FC<any> = ({ bank, product, featuredCompetitor }) => {
  const domain = featuredCompetitor["Domain"];
  const incumbents = featuredCompetitor["Commonly referenced competitor set (examples)"];
  const productName = product["Product/solution"];

  return (
    <div className="absolute inset-0 pt-[1cqi] flex flex-col bg-white overflow-hidden">
      <SlideHeader title={`The Case for ${productName}`} subtitle={`Why ${bank.NAME} should migrate from legacy ${domain.toLowerCase()} providers.`} />

      <div className="flex-1 flex gap-[4cqi] items-center px-[8cqi] pb-[4cqi] max-w-[82cqi] mx-auto w-full">
        {/* Left Column: The Incumbent Problem */}
        <div className="w-[45%] flex flex-col gap-[2.5cqi]">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-[3cqi] relative shadow-sm">
            <div className="absolute top-0 right-0 p-[1.5cqi]">
              <div className="w-[4cqi] h-[4cqi] bg-slate-200 rounded-full flex items-center justify-center text-slate-400 font-bold font-heading text-[1.4cqi]">
                VS
              </div>
            </div>
            
            <h3 className="font-heading font-bold text-[1.6cqi] text-slate-800 mb-[1cqi] flex items-center gap-[0.8cqi]">
              <Combine className="w-[1.5cqi] h-[1.5cqi] text-slate-400" />
              Incumbent Providers
            </h3>
            
            <div className="bg-white px-[1.5cqi] py-[1cqi] rounded-lg border border-slate-200 mb-[2cqi]">
              <p className="font-body text-[1.2cqi] text-slate-600 font-medium italic">
                {incumbents}
              </p>
            </div>
            
            <div className="space-y-[1.5cqi]">
              <div className="flex gap-[1cqi] items-start">
                <div className="w-[1.5cqi] h-[1.5cqi] rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-[0.2cqi]">
                  <ArrowRight className="w-[0.8cqi] h-[0.8cqi] text-red-600" />
                </div>
                <p className="font-body text-[1.1cqi] text-slate-600">Monolithic, locked-in ecosystems creating critical technical debt</p>
              </div>
              <div className="flex gap-[1cqi] items-start">
                <div className="w-[1.5cqi] h-[1.5cqi] rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-[0.2cqi]">
                  <ArrowRight className="w-[0.8cqi] h-[0.8cqi] text-red-600" />
                </div>
                <p className="font-body text-[1.1cqi] text-slate-600">Rigid architectures restricting API access and delaying time-to-market</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: The Finastra Advantage */}
        <div className="w-[55%] flex flex-col gap-[2cqi]">
          <div className="bg-gradient-to-br from-[#1e2733] to-[#2a3645] p-[3cqi] rounded-xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[40cqi] h-[40cqi] bg-gradient-to-bl from-f-fuchsia/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center gap-[1.2cqi] mb-[2cqi] relative z-10">
              <div className="w-[4cqi] h-[4cqi] rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white">
                <ShieldCheck className="w-[2cqi] h-[2cqi]" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-[1.6cqi] uppercase tracking-wider">The Finastra Approach</h3>
                <p className="font-body text-[1.1cqi] text-slate-300 font-medium">Open, modular, and cloud-native</p>
              </div>
            </div>

            <div className="grid gap-[1.5cqi] relative z-10">
              {featuredCompetitor["Finastra differentiators"] && (
                <div className="bg-f-fuchsia/10 backdrop-blur-sm border border-f-fuchsia/30 p-[1.5cqi] rounded-lg flex items-start gap-[1cqi]">
                  <Zap className="w-[1.5cqi] h-[1.5cqi] text-f-fuchsia shrink-0 mt-[0.2cqi]" />
                  <div>
                    <h4 className="font-heading font-black text-[1.2cqi] mb-[0.5cqi] text-f-fuchsia uppercase tracking-widest">Finastra Edge</h4>
                    <p className="font-body text-[1.2cqi] text-white leading-relaxed font-medium">
                      {featuredCompetitor["Finastra differentiators"]}
                    </p>
                  </div>
                </div>
              )}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-[1.5cqi] rounded-lg flex items-start gap-[1cqi]">
                <Zap className="w-[1.5cqi] h-[1.5cqi] text-f-fuchsia shrink-0 mt-[0.2cqi]" />
                <div>
                  <h4 className="font-heading font-bold text-[1.2cqi] mb-[0.5cqi]">Cloud-Native Agility</h4>
                  <p className="font-body text-[1.1cqi] text-slate-300">
                    {product["Target segments"].length > 50 ? product["Target segments"].substring(0, 100) + "..." : product["Target segments"]}
                  </p>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-[1.5cqi] rounded-lg flex items-start gap-[1cqi]">
                <Zap className="w-[1.5cqi] h-[1.5cqi] text-f-violet shrink-0 mt-[0.2cqi]" />
                <div>
                  <h4 className="font-heading font-bold text-[1.2cqi] mb-[0.5cqi]">Open API Architecture</h4>
                  <p className="font-body text-[1.1cqi] text-slate-300">
                    {product["Integrations/APIs"]}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
