import { Home, Target, Presentation, Database } from 'lucide-react';

export const GlobalNav = () => {
  const currentOrigin = window.location.origin;
  const currentHash = window.location.hash;
  
  const hubUrl = import.meta.env.VITE_INTELLIGENCE_HUB_URL || 'http://localhost:5175';
  const leadGenUrl = import.meta.env.VITE_LEAD_GEN_URL || 'http://localhost:5174';
  const valueSellingUrl = import.meta.env.VITE_VALUE_SELLING_URL || 'http://localhost:5173';

  const isHome = currentOrigin === hubUrl && !currentHash.includes('assets');
  const isLeadGen = currentOrigin === leadGenUrl;
  const isValueSelling = currentOrigin === valueSellingUrl;
  const isAssets = currentOrigin === hubUrl && currentHash.includes('assets');

  const navItems = [
    { label: 'Intelligence Hub', icon: Home, url: `${hubUrl}/`, active: isHome },
    { label: 'Lead Gen Engine', icon: Target, url: `${leadGenUrl}/`, active: isLeadGen },
    { label: 'Value Selling', icon: Presentation, url: `${valueSellingUrl}/`, active: isValueSelling },
    { label: 'Finastra Assets', icon: Database, url: `${hubUrl}/#assets`, active: isAssets },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-12 bg-slate-950/80 backdrop-blur-md border-b border-white/10 flex items-center justify-center gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.label}
            href={item.url}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              item.active 
                ? 'bg-[#c137a2]/20 text-[#c137a2] border border-[#c137a2]/50 shadow-[0_0_15px_rgba(193,55,162,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Icon size={16} />
            {item.label}
          </a>
        );
      })}
    </div>
  );
};
