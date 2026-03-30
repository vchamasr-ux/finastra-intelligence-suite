import { useEffect, useState, useMemo, useCallback } from 'react';
import { Activity, DollarSign, Server, ChevronDown, Building2, Download, Target, RefreshCw } from 'lucide-react';
import { cn } from './lib/utils';
import { BankLeaderboard } from './components/BankLeaderboard';
import { runClientEngine, clearEngineCache } from './lib/engine';
import type { BankIntel } from './lib/engine';
import { downloadCampaignCsv } from './lib/export';
import { ProductCombobox } from './components/ProductCombobox';
// @ts-ignore
import finastraProducts from './lib/finastra_data.json';

const productNames = finastraProducts.products.map((p: any) => p['Product/solution']);


const SEGMENT_LABELS: Record<string, string> = {
  all: 'All Segments',
  over_250b: '>250B',
  '250b_100b': '250B to 100B',
  '100b_50b': '100B to 50B',
  '50b_10b': '50B to 10B',
  '10b_1b': '10B to 1B',
  under_1b: 'less than 1B',
};

function App() {
  const [banks, setBanks] = useState<BankIntel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [entryFilter, setEntryFilter] = useState<'all' | 'lending' | 'payments'>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');

  const [fatalError, setFatalError] = useState<Error | null>(null);

  const fetchIntel = useCallback(async () => {
    setLoading(true);
    setFatalError(null);
    try {
      const intel = await runClientEngine();
      setBanks(intel);
    } catch (err: any) {
      console.error('Failed to load intelligence data:', err);
      setFatalError(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchIntel();
  }, [fetchIntel]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    clearEngineCache();
    fetchIntel();
  }, [fetchIntel]);

  const filteredBanks = useMemo(() => {
    let result = banks;

    // Entry point filter
    if (entryFilter !== 'all') {
      result = result.filter(b => b.primaryEntryPoint === entryFilter);
    }

    // Segment filter
    if (segmentFilter !== 'all') {
      result = result.filter(b => b.assetTier === segmentFilter);
    }

    // Product filter — re-sort by specific product score descending
    if (productFilter !== 'all') {
      result = [...result].sort((a, b) => {
        const aScore = a.productScores?.find(p => p.productName === productFilter)?.score ?? 0;
        const bScore = b.productScores?.find(p => p.productName === productFilter)?.score ?? 0;
        return bScore - aScore;
      });
    }

    return result;
  }, [banks, entryFilter, productFilter, segmentFilter]);

  return (
    <div className="h-[calc(100vh-3rem)] overflow-hidden mt-12 flex flex-col bg-finastra-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(193,55,162,0.1),rgba(255,255,255,0))] text-slate-300 font-sans selection:bg-finastra-fuchsia/30">
      {/* Top Navbar */}
      <nav className="glass-panel shrink-0 z-50 border-b border-white/5">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-finastra-fuchsia to-finastra-purple flex items-center justify-center text-white font-bold shadow-lg shadow-finastra-fuchsia/20">
                  F
                </div>
                <h1 className="text-xl font-semibold text-white tracking-tight">Finastra Intelligence</h1>
              </div>
              <span className="text-xs font-medium text-finastra-fuchsia tracking-widest uppercase mt-1">Lead Generation Engine v2</span>
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-400 uppercase tracking-widest">Total Scored</span>
                <span className="text-lg font-bold text-white leading-none mt-1">{banks.length}</span>
              </div>
              <div className="px-4 py-2 rounded-full bg-finastra-fuchsia/10 border border-finastra-fuchsia/20 flex flex-col items-center justify-center">
                <span className="text-xs text-finastra-fuchsia font-medium">High Propensity targets</span>
                <span className="text-lg font-bold text-white leading-none mt-1">{banks.filter(b => (b.productScores[0]?.score || 0) > 80).length}</span>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading || refreshing}
                title="Clear cache and refresh FDIC data"
                className={cn(
                  "p-2.5 rounded-full border transition-all",
                  refreshing
                    ? "border-finastra-fuchsia/50 bg-finastra-fuchsia/10 text-finastra-fuchsia"
                    : "border-slate-700/50 bg-slate-800/50 text-slate-400 hover:text-white hover:border-slate-600"
                )}
              >
                <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full flex flex-col flex-1 min-h-0 overflow-hidden pt-4 sm:pt-6">
        <div className="flex flex-col h-full min-h-0">
          {/* Filters Header */}
          <div className="flex items-center justify-between flex-wrap gap-4 shrink-0 px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6">
            <h2 className="text-xl font-medium text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-slate-400" />
              Account Strategy <span className="font-semibold text-finastra-fuchsia">Leaderboard</span>
            </h2>
            
            <div className="flex items-center gap-3 flex-wrap">
              {/* Entry Point Filter */}
              <div className="flex bg-slate-900/80 p-1.5 rounded-lg border border-slate-800/80 shadow-inner">
                <button
                  onClick={() => setEntryFilter('all')}
                  className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-colors", entryFilter === 'all' ? "bg-slate-800 text-white shadow" : "text-slate-500 hover:text-slate-300")}
                >
                  All Targets
                </button>
                <button
                  onClick={() => setEntryFilter('lending')}
                  className={cn("px-4 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-all duration-300", entryFilter === 'lending' ? "bg-finastra-fuchsia/10 text-finastra-fuchsia border border-finastra-fuchsia/20 shadow-sm" : "text-slate-500 hover:text-slate-300")}
                >
                  <DollarSign className="w-4 h-4" />
                  Lending
                </button>
                <button
                  onClick={() => setEntryFilter('payments')}
                  className={cn("px-4 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-all duration-300", entryFilter === 'payments' ? "bg-finastra-purple/10 text-finastra-purple border border-finastra-purple/20 shadow-sm" : "text-slate-500 hover:text-slate-300")}
                >
                  <Activity className="w-4 h-4" />
                  Payments
                </button>
              </div>

              {/* Segment Filter Dropdown */}
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <select
                  value={segmentFilter}
                  onChange={(e) => setSegmentFilter(e.target.value)}
                  className={cn(
                    "appearance-none pl-9 pr-10 py-2 text-sm font-medium rounded-lg border transition-all cursor-pointer",
                    "bg-slate-900/80 border-slate-800/80 text-slate-300 shadow-inner",
                    "hover:border-finastra-fuchsia/40 focus:border-finastra-fuchsia focus:ring-1 focus:ring-finastra-fuchsia/30 focus:outline-none",
                    segmentFilter !== 'all' && "border-finastra-fuchsia/50 text-finastra-fuchsia bg-finastra-fuchsia/5"
                  )}
                >
                  {Object.entries(SEGMENT_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              {/* Product Filter Dropdown */}
              <ProductCombobox
                productNames={productNames}
                value={productFilter}
                onChange={setProductFilter}
                className="w-64 z-50"
              />

              <button
                onClick={() => downloadCampaignCsv(filteredBanks, entryFilter, productFilter)}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg bg-white text-slate-900 border border-white/20 hover:bg-slate-200 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>

          {/* Intelligence Grid */}
          <div className="flex-1 min-h-0 bg-slate-950/60 border-t border-white/10 flex flex-col">
            {fatalError ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="bg-red-50 p-6 rounded-lg text-center border-red-200 border" data-testid="fatal-error-container">
                  <h3 className="text-red-700 font-bold mb-2">Intelligence Ingestion Failed</h3>
                  <p className="text-red-600 text-sm font-mono max-w-lg mb-4">{fatalError.message || "External proxies timed out."}</p>
                  <p className="text-red-800 text-xs font-bold uppercase tracking-widest">FAIL LOUDLY ENFORCED</p>
                </div>
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Server className="w-12 h-12 text-slate-600 animate-pulse mb-4" />
                <p className="text-slate-500 text-lg">Querying FDIC Intelligence Nexus...</p>
              </div>
            ) : (
              <BankLeaderboard banks={filteredBanks} selectedProduct={productFilter} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
