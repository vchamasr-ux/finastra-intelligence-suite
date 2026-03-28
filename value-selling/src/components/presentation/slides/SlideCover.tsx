import React from 'react';
import { Building2 } from 'lucide-react';
import { SlideFooter } from '../SlideChrome';
import type { SlideProps } from '../types';

export const SlideCover: React.FC<SlideProps> = ({ bank }) => (
    <div className="absolute inset-0 pt-[1cqi] flex flex-col bg-white overflow-hidden">
       <div className="flex-1 flex flex-col items-center justify-center relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-f-violet/5 via-white to-white">
           <div className="w-[8cqi] h-[8cqi] bg-gradient-to-br from-f-violet to-f-fuchsia rounded-[2cqi] flex items-center justify-center mb-[2.5cqi] shadow-2xl shadow-f-fuchsia/20">
               <Building2 className="text-white w-[3.5cqi] h-[3.5cqi]" />
           </div>
           <h1 className="font-heading text-[6cqi] font-bold text-f-charcoal leading-none tracking-tight">EXECUTIVE BRIEFING</h1>
           <h2 className="font-heading text-[2.5cqi] italic text-f-charcoal/50 mt-[1cqi]">Performance Benchmarking Review</h2>
           <h3 className="font-heading text-[3cqi] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-f-violet to-f-fuchsia mt-[4cqi] text-center max-w-[80cqi] drop-shadow-sm">{bank.NAME}</h3>
           <p className="font-body text-[1.4cqi] text-f-charcoal/70 mt-[1.5cqi] font-medium">{bank.CITY}, {bank.STNAME} <span className="text-f-charcoal/30 px-2">•</span> Cert: {bank.CERT}</p>
           <p className="font-heading text-[1.1cqi] font-bold text-f-charcoal/40 tracking-[0.3em] mt-[4cqi] uppercase bg-f-bg px-[2cqi] py-[0.7cqi] rounded-full">Q4 2025 PERFORMANCE REVIEW</p>
       </div>
       <SlideFooter bankName={bank.NAME} align="center" />
    </div>
);
