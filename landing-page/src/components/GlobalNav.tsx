import { Link, useLocation } from 'react-router-dom';
import { Home, Target, Presentation, Database } from 'lucide-react';

export const GlobalNav = () => {
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isAssets = location.pathname === '/assets';
  const isLeadGen = location.pathname.startsWith('/lead-gen');
  const isValueSelling = location.pathname.startsWith('/pitchbook');

  const navItems = [
    { label: 'Intelligence Hub', icon: Home, url: '/', active: isHome },
    { label: 'Lead Gen Engine', icon: Target, url: '/lead-gen', active: isLeadGen },
    { label: 'Value Selling', icon: Presentation, url: '/pitchbook', active: isValueSelling },
    { label: 'Finastra Assets', icon: Database, url: '/assets', active: isAssets },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-12 bg-slate-950/80 backdrop-blur-md border-b border-white/10 flex items-center justify-center gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            to={item.url}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              item.active 
                ? 'bg-[#c137a2]/20 text-[#c137a2] border border-[#c137a2]/50 shadow-[0_0_15px_rgba(193,55,162,0.2)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Icon size={16} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};
