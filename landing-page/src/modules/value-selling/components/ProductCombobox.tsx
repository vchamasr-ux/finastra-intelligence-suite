import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Check, ChevronDown, Search, Package } from 'lucide-react';

const PRODUCT_CATEGORIES: Record<string, string[]> = {
  "Core Modernization": ["Essence", "Phoenix Banking Core"],
  "Digital Transformation": ["MalauzAI Digital Banking", "Corporate Channels + Unified Corporate Portal + Cash/Trade/Loan portals", "Finastra ECM"],
  "Analytics": ["Essence Analytics", "AnalyzerIQ", "Fusion Data Cloud"],
  "Lending": ["Loan IQ", "Loan IQ Nexus", "Loan IQ Build", "Loan IQ Transact", "Loan Portal", "Originate (consumer & business loans/deposits)", "MortgagebotLOS + Originate Mortgagebot + Integrations", "LaserPro (platform + modules including Conductor/Evaluate)", "Fusion CreditQuest", "ESG Service"],
  "Trade Finance": ["Trade Innovation + Trade Portal", "Trade Innovation Nexus"],
  "Payments": ["Global PAYplus", "Payments To Go", "Financial Messaging (incl. Total Messaging positioning)", "Bacsactive-IP", "RapidWires", "ACH Module", "PAYplus for CLS"],
  "Compliance & Risk": ["DFA 1071 / Compliance Reporter SBDC", "Compliance as a Service (instant payments)", "Total Screening", "Confirmation Matching Service (CMS)"]
};

interface ProductComboboxProps {
  productNames: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string; // wrapper class
}

export const ProductCombobox: React.FC<ProductComboboxProps> = ({ productNames, value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const uncategorizedProducts = useMemo(() => {
    const allCategorized = Object.values(PRODUCT_CATEGORIES).flat();
    return productNames.filter(name => !allCategorized.includes(name));
  }, [productNames]);

  const filteredCategories = useMemo(() => {
    const q = search.toLowerCase();
    const result: Record<string, string[]> = {};
    
    Object.entries(PRODUCT_CATEGORIES).forEach(([cat, prods]) => {
      const available = prods.filter(p => productNames.includes(p));
      const matching = available.filter(p => p.toLowerCase().includes(q) || cat.toLowerCase().includes(q));
      if (matching.length > 0) result[cat] = matching;
    });
    
    const matchingUncategorized = uncategorizedProducts.filter(p => p.toLowerCase().includes(q));
    if (matchingUncategorized.length > 0) {
      result["Other"] = matchingUncategorized;
    }
    
    return result;
  }, [search, productNames, uncategorizedProducts]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[38px] flex items-center justify-between pl-9 pr-4 text-sm font-medium rounded-lg border transition-all bg-slate-900/80 border-slate-800/80 text-slate-300 hover:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 shadow-inner"
      >
        <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <span className="truncate">{!value ? 'Select a Finastra Product...' : value}</span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl flex flex-col max-h-[400px] shadow-blue-500/10 transform origin-top animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-slate-800 relative shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-lg pl-9 pr-3 py-2 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 placeholder:text-slate-600 transition-all font-medium"
              placeholder="Search specific products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="overflow-y-auto flex-1 p-1 custom-scrollbar">
            {Object.keys(filteredCategories).length === 0 && (
              <div className="px-3 py-6 text-sm text-slate-500 text-center flex flex-col items-center gap-2">
                <Search className="w-6 h-6 opacity-30" />
                No products found
              </div>
            )}

            {Object.entries(filteredCategories).map(([category, products]) => (
              <div key={category} className="mb-3 last:mb-0">
                <div className="px-3 pt-2 pb-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10 border-b border-slate-800/50">
                  {category}
                </div>
                <div className="space-y-0.5 mt-1 px-1">
                  {products.map(p => {
                    const isSelected = value === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        className={`w-full text-left flex items-center px-3 py-2 text-sm rounded-md transition-all group ${isSelected ? 'bg-blue-500/10 text-blue-400 font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'}`}
                        onClick={() => { onChange(p); setIsOpen(false); setSearch(''); }}
                      >
                        <span className="truncate flex-1" title={p}>{p}</span>
                        {isSelected ? (
                          <Check className="w-4 h-4 shrink-0 ml-2" />
                        ) : (
                          <div className="w-4 h-4 shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Check className="w-4 h-4 text-slate-600" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
