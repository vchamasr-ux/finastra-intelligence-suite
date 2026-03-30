import { Routes, Route, Link } from 'react-router-dom';
import { Network, Presentation, ArrowRight } from 'lucide-react';
import { GlobalNav } from './components/GlobalNav';
import { FinastraAssets } from './FinastraAssets';

// Module Imports
import LeadGenApp from './modules/lead-gen/App';
import ValueSellingApp from './modules/value-selling/App';

function Home() {
  return (
    <div className="min-h-screen pt-12 animated-bg text-slate-300 font-sans selection:bg-finastra-fuchsia/30 relative overflow-x-hidden">
      {/* Animated Orbs */}
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-finastra-fuchsia/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-[600px] h-[600px] bg-finastra-purple/20 rounded-full mix-blend-screen filter blur-[150px] animate-[pulse_8s_ease-in-out_infinite] pointer-events-none -z-10" />

      <main className="max-w-7xl mx-auto px-6 py-32 relative z-10 flex flex-col min-h-[calc(100vh-3rem)] justify-center">
        <div className="max-w-4xl mb-24 text-center mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-finastra-fuchsia/30 bg-finastra-fuchsia/10 text-finastra-fuchsia text-sm font-semibold tracking-wide mb-8 shadow-[0_0_20px_rgba(193,55,162,0.15)]">
            <span className="w-2 h-2 rounded-full bg-finastra-fuchsia animate-ping" />
            LIVE INTELLIGENCE ACTIVE
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight">
            Data-Driven Strategy.<br />
            <span className="bg-gradient-to-r text-transparent bg-clip-text from-finastra-fuchsia via-[#e85dba] to-finastra-purple drop-shadow-[0_0_30px_rgba(193,55,162,0.3)]">
              Precision Execution.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 leading-relaxed font-light max-w-3xl mx-auto">
            Welcome to the Finastra Intelligence Suite. Select a module below to unlock deterministic scoring, FDIC-backed peer benchmarking, and automated pitchbook generation.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto w-full">
          {/* Lead Gen Card */}
          <Link 
            to="/lead-gen"
            className="group relative flex flex-col p-10 rounded-3xl glass-panel hover:border-finastra-purple/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(105,78,214,0.15)] overflow-hidden h-full min-h-[300px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-finastra-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-finastra-purple/20 to-finastra-purple/5 flex items-center justify-center text-finastra-purple mb-8 border border-finastra-purple/20 shadow-[0_0_30px_rgba(105,78,214,0.1)] group-hover:scale-110 transition-transform duration-500 shrink-0">
              <Network size={32} strokeWidth={1.5} />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-between">
              Lead Gen Engine 
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-finastra-purple group-hover:text-white transition-all duration-300">
                <ArrowRight size={20} className="-translate-x-1 group-hover:translate-x-0 transition-transform" />
              </div>
            </h2>
            
            <p className="text-slate-400 font-light leading-relaxed mb-8 text-lg">
              Identify and rank optimal banking targets using deterministic product fit scoring and live FDIC Call Report analytics.
            </p>
            
            <div className="flex gap-3 mt-auto pt-4">
              <span className="text-xs font-bold px-3 py-1.5 rounded-md bg-finastra-purple/15 text-finastra-purple border border-finastra-purple/30 shadow-[0_0_10px_rgba(105,78,214,0.2)]">Live Data API</span>
            </div>
          </Link>

          {/* Value Selling Card */}
          <Link 
            to="/pitchbook"
            className="group relative flex flex-col p-10 rounded-3xl glass-panel hover:border-finastra-fuchsia/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(193,55,162,0.15)] overflow-hidden h-full min-h-[300px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-finastra-fuchsia/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-finastra-fuchsia/20 to-finastra-fuchsia/5 flex items-center justify-center text-finastra-fuchsia mb-8 border border-finastra-fuchsia/20 shadow-[0_0_30px_rgba(193,55,162,0.1)] group-hover:scale-110 transition-transform duration-500 shrink-0">
              <Presentation size={32} strokeWidth={1.5} />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-between">
              Pitchbook Generator
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-finastra-fuchsia group-hover:text-white transition-all duration-300">
                <ArrowRight size={20} className="-translate-x-1 group-hover:translate-x-0 transition-transform" />
              </div>
            </h2>
            
            <p className="text-slate-400 font-light leading-relaxed mb-8 text-lg">
              Automatically generate customized executive briefings and ROI analyses mapped to institutional peers.
            </p>
            
            <div className="flex gap-3 mt-auto pt-4">
              <span className="text-xs font-bold px-3 py-1.5 rounded-md bg-finastra-fuchsia/15 text-finastra-fuchsia border border-finastra-fuchsia/30 shadow-[0_0_10px_rgba(193,55,162,0.2)]">Presentation Mode</span>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}

function WrapperAssets() {
  return (
    <div className="min-h-screen pt-12 animated-bg text-slate-300 font-sans selection:bg-finastra-fuchsia/30 relative overflow-x-hidden">
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-finastra-fuchsia/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-[600px] h-[600px] bg-finastra-purple/20 rounded-full mix-blend-screen filter blur-[150px] animate-[pulse_8s_ease-in-out_infinite] pointer-events-none -z-10" />
      <FinastraAssets />
    </div>
  );
}

function App() {
  return (
    <>
      <GlobalNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assets" element={<WrapperAssets />} />
        <Route path="/lead-gen/*" element={<LeadGenApp />} />
        <Route path="/pitchbook/*" element={<ValueSellingApp />} />
      </Routes>
    </>
  );
}

export default App;
