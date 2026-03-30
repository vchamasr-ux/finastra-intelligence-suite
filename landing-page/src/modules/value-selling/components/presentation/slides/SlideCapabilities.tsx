import React from 'react';
import { Zap, Shield, Globe, Layers, Cpu, Link } from 'lucide-react';
import { SlideHeader, SlideFooter } from '../SlideChrome';
import type { SlideProps } from '../types';

const ICONS = [Zap, Shield, Globe, Layers, Cpu, Link];

export const SlideCapabilities: React.FC<SlideProps> = ({ bank, product }) => {
    const features = (product["Key features/benefits"] || '').split(';').map((s: string) => s.trim()).filter(Boolean);
    const useCases = (product["Primary use cases"] || '').split(';').map((s: string) => s.trim()).filter(Boolean);
    const integrations = (product["Integrations/APIs"] || '').split(';').map((s: string) => s.trim()).filter(Boolean);

    const seen = new Set<string>();
    const allItems: string[] = [];
    for (const item of [...features, ...useCases, ...integrations]) {
        const key = item.toLowerCase();
        if (!seen.has(key) && allItems.length < 6) {
            seen.add(key);
            allItems.push(item);
        }
    }

    const subtitle = `${product["Product/solution"]} delivers ${allItems.length} core capabilities mapped to ${bank.NAME}'s modernization priorities.`;

    return (
        <div className="absolute inset-0 pt-[1cqi] flex flex-col bg-white overflow-hidden">
           <SlideHeader title="Target Capabilities" subtitle={subtitle} />
           <div className="flex-1 px-[6cqi] flex flex-col justify-center overflow-hidden">
               <div className={`grid ${allItems.length > 4 ? 'grid-cols-3' : 'grid-cols-2'} gap-[2cqi]`}>
                    {allItems.map((item: string, idx: number) => {
                        const Icon = ICONS[idx % ICONS.length];
                        return (
                            <div key={idx} className="flex gap-[1.5cqi] items-start p-[2cqi] bg-gradient-to-br from-f-bg to-white hover:shadow-lg transition-all duration-300 rounded-xl border border-f-charcoal/5 group">
                                <div className="w-[3.5cqi] h-[3.5cqi] bg-gradient-to-br from-f-violet to-f-fuchsia rounded-[0.8cqi] flex items-center justify-center shrink-0 shadow-md">
                                    <Icon className="text-white" style={{ width: '1.8cqi', height: '1.8cqi' }} />
                                </div>
                                <p className="text-[1.4cqi] text-f-charcoal leading-snug font-body font-medium pt-[0.3cqi]">{item}</p>
                            </div>
                        );
                    })}
               </div>
           </div>
           <SlideFooter bankName={bank.NAME} />
        </div>
    );
};
