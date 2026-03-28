import React, { useState, useEffect } from 'react';
import { usePresentationStore } from '../stores/PresentationContext';
import type { FDICBankRecord } from '../stores/PresentationContext';
import { useFDICData } from '../hooks/useFDICData';
import { finastraData } from '../data/FinastraData';
import { Search, Building, Briefcase } from 'lucide-react';
import { ProductCombobox } from './ProductCombobox';

export const PitchbookGenerator: React.FC = () => {
  const { setBank, setProduct, selectedBank, selectedProduct } = usePresentationStore();
  const { searchBank, searchBankByCert, loading, error } = useFDICData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FDICBankRecord[]>([]);

  // Auto-Hydration via Deep Linking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const certParam = params.get('cert');
    if (certParam && !selectedBank) {
      searchBankByCert(certParam).then((res) => {
        if (res) {
          setBank(res);
          setProduct(finastraData.products[0]);
        }
      }).catch(() => {
        // Deep link cert param not found — user can search manually.
      });
    }
  }, [searchBankByCert, setBank, setProduct, selectedBank]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const results = await searchBank(searchQuery);
      setSearchResults(results);
    } catch (err) {
      // The error is already propagated, but we catch here to prevent Form crash.
      // It is displayed via the error div below.
    }
  };

  return (
    <div className="w-80 border-r border-gray-800 bg-gray-900/50 backdrop-blur-xl p-6 flex flex-col gap-8 h-screen overflow-y-auto">
      <div>
        {/* Aligned Header */}
        <div className="flex flex-col mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#c137a2] to-[#694ed6] flex items-center justify-center text-white font-bold shadow-lg shadow-[#c137a2]/20">
              F
            </div>
            <h1 className="text-xl font-semibold text-white tracking-tight">Finastra Intelligence</h1>
          </div>
          <span className="text-xs font-medium text-[#c137a2] tracking-widest uppercase mt-1">Pitchbook Generator</span>
        </div>
        
        {/* FDIC Bank Search */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Building size={14} /> 1. Target Institution
          </label>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="e.g. JPMorgan"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={loading || !searchQuery}
              className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-md disabled:opacity-50 transition-colors"
            >
              <Search size={18} />
            </button>
          </form>
          
          {error && (
            <div className="mt-3 p-3 bg-red-900/40 border border-red-800 rounded-md text-red-300 text-xs">
              <strong>Fail Loudly Exception:</strong> {error}
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="mt-3 flex flex-col gap-2 max-h-[280px] overflow-y-auto pr-2">
              {searchResults.map(b => (
                <div 
                  key={b.ID} 
                  onClick={() => setBank(b)}
                  className={`p-3 rounded-md cursor-pointer border transition-colors ${selectedBank?.ID === b.ID ? 'bg-blue-900/40 border-blue-600' : 'bg-gray-800 border-gray-700 hover:border-gray-500'}`}
                >
                  <p className="font-semibold text-sm truncate">{b.NAME}</p>
                  <p className="text-xs text-gray-400">{b.CITY}, {b.STNAME} • Cert: {b.CERT}</p>
                  <p className="text-xs text-blue-400 font-mono mt-1">Assets: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2 }).format(b.ASSET * 1000)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Selection */}
        <div className="z-50">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Briefcase size={14} /> 2. Value Proposition
          </label>
          <ProductCombobox
            productNames={finastraData.products.map(p => p["Product/solution"])}
            value={selectedProduct ? selectedProduct["Product/solution"] : ""}
            onChange={(val: string) => {
              const product = finastraData.products.find(p => p["Product/solution"] === val);
              if (product) setProduct(product);
            }}
          />
        </div>
      </div>
    </div>
  );
};
