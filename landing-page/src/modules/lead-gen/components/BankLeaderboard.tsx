import { Target } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import type { BankIntel } from '../lib/engine';
import { competitorsList, productsList } from '../lib/engine';
import { useState, useMemo } from 'react';
import { BankDetailsModal } from './BankDetailsModal';

export function BankLeaderboard({ banks, selectedProduct = 'all' }: { banks: BankIntel[]; selectedProduct?: string }) {
  const [selectedBank, setSelectedBank] = useState<BankIntel | null>(null);

  const isProductMode = selectedProduct !== 'all';

  const competitorMatch = useMemo(() => {
    if (!isProductMode) return null;
    return competitorsList.find((c: any) => 
      c["Finastra focal products"]?.toLowerCase().includes(selectedProduct.toLowerCase()) || 
      selectedProduct.toLowerCase().includes(c["Finastra focal products"]?.toLowerCase())
    );
  }, [selectedProduct, isProductMode]);

  const productData = useMemo(() => {
    if (!isProductMode) return null;
    return productsList.find((p: any) => p["Product/solution"] === selectedProduct);
  }, [selectedProduct, isProductMode]);

  if (banks.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500">
        No banks found matching the criteria.
      </div>
    );
  }

  // Helper: get the relevant product score for each bank
  const getProductDisplay = (bank: BankIntel) => {
    if (!bank.productScores || bank.productScores.length === 0) return null;
    if (selectedProduct !== 'all') {
      return bank.productScores.find(p => p.productName === selectedProduct) || null;
    }
    return bank.productScores[0]; // Top match
  };

  return (
    <div className="flex flex-col gap-0 h-full min-h-0">
      {competitorMatch && productData && (
        <div className="mx-4 sm:mx-6 lg:mx-8 mb-4 p-4 rounded-xl bg-gradient-to-r from-finastra-purple/20 to-finastra-fuchsia/10 border border-finastra-purple/30 flex items-start gap-4 shadow-[0_0_15px_rgba(105,78,214,0.15)] animate-in fade-in slide-in-from-bottom-2 duration-500 shrink-0">
          <div className="p-2 bg-finastra-purple/20 rounded-lg shrink-0">
            <Target className="w-6 h-6 text-finastra-purple" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-white mb-1.5 flex items-center gap-2">
              Competitive Positioning: {selectedProduct}
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
              Likely migrating from <strong className="text-white bg-white/10 px-1.5 py-0.5 rounded mr-1">{competitorMatch["Commonly referenced competitor set (examples)"]}</strong> — 
              Position <strong className="text-white">{selectedProduct}</strong> by emphasizing: <span className="italic text-slate-200">{productData["Key features/benefits"]}</span>
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex-1 min-h-0 overflow-y-auto overflow-x-hidden relative bg-transparent">
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 z-10">
          <tr className="border-b border-white/10 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-900/90 backdrop-blur-md">
            <th className="py-4 px-6 lg:px-8 xl:px-12 font-semibold">Institution Name</th>
            <th className="py-3 px-6 lg:px-8 xl:px-12 font-semibold text-right">Total Assets</th>

            {isProductMode ? (
              <>
                <th className="py-3 px-6 lg:px-8 xl:px-12 font-semibold text-center">{selectedProduct} Fit</th>
                <th className="py-3 px-6 lg:px-8 xl:px-12 font-semibold text-left">Justification</th>
              </>
            ) : (
              <>
                <th className="py-3 px-6 lg:px-8 xl:px-12 font-semibold text-center">Top Product Fit</th>
                <th className="py-3 px-6 lg:px-8 xl:px-12 font-semibold text-center">Top Product Match</th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {banks.map((bank, idx) => {
            const productInfo = getProductDisplay(bank);

            return (
              <tr 
                key={bank.id} 
                onClick={() => setSelectedBank(bank)}
                className="hover:bg-slate-800/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.03)] transition-all duration-300 group relative cursor-pointer"
              >
                <td className="py-3 px-6 lg:px-8 xl:px-12 ">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-slate-600 w-6 font-medium">{idx + 1}.</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-300 group-hover:text-white group-hover:translate-x-1 transition-all">
                        {bank.name}
                      </span>
                      <span className="text-xs text-slate-500 mt-0.5 opacity-80">
                        FDIC Cert: {bank.fdicCert}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-6 lg:px-8 xl:px-12 text-right text-sm text-slate-300 font-medium">
                  {formatCurrency(bank.totalAssets * 1000)}
                </td>


                {isProductMode ? (
                  <>
                    {/* Product Score */}
                    <td className="py-3 px-6 lg:px-8 xl:px-12 text-center">
                      {productInfo ? (
                        <div className="relative group/score inline-block">
                          <span className={cn(
                            "text-lg font-bold tracking-tight cursor-help underline decoration-dashed underline-offset-4 decoration-slate-600",
                            productInfo.score > 75 ? "text-finastra-fuchsia" : productInfo.score > 50 ? "text-amber-400" : "text-slate-500"
                          )}>
                            {productInfo.score}
                          </span>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl opacity-0 invisible group-hover/score:opacity-100 group-hover/score:visible transition-all z-50 transform group-hover/score:-translate-y-1 text-left">
                            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                              <span className="text-sm font-semibold text-white whitespace-normal">{productInfo.productName} Score Math</span>
                            </div>
                            <ul className="text-xs text-slate-400 space-y-2 list-none m-0 p-0 whitespace-normal">
                              {productInfo.reasons.map((r, i) => (
                                <li key={i} className="flex gap-2">
                                  <span className="text-slate-600 mt-0.5">•</span>
                                  <span className="leading-relaxed">{r}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-b border-r border-slate-700 transform rotate-45"></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    {/* Justification Reasons */}
                    <td className="py-3 px-6 lg:px-8 xl:px-12 text-left">
                      {productInfo && productInfo.reasons.length > 0 ? (
                        <ul className="text-xs text-slate-400 space-y-1 list-none m-0 p-0 max-w-md">
                          {productInfo.reasons.map((r, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-finastra-fuchsia mt-0.5 flex-shrink-0">›</span>
                              <span className="leading-relaxed">{r}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-500 text-xs text-left">No specific signals</span>
                      )}
                    </td>
                  </>
                ) : (
                  <>
                    {/* Top Product Fit Score */}
                    <td className="py-3 px-6 lg:px-8 xl:px-12 text-center">
                      {productInfo ? (
                        <div className="relative group/score inline-block">
                          <span className={cn(
                            "font-bold text-lg tracking-tight cursor-help underline decoration-dashed underline-offset-4 decoration-slate-600",
                            productInfo.score > 75 ? "text-finastra-fuchsia" : productInfo.score > 50 ? "text-amber-400" : "text-slate-500"
                          )}>
                            {productInfo.score}
                          </span>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl opacity-0 invisible group-hover/score:opacity-100 group-hover/score:visible transition-all z-50 transform group-hover/score:-translate-y-1 text-left">
                            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                              <span className="text-sm font-semibold text-white whitespace-normal">{productInfo.productName} Score Math</span>
                            </div>
                            <ul className="text-xs text-slate-400 space-y-2 list-none m-0 p-0 whitespace-normal">
                              {productInfo.reasons.map((r, i) => (
                                <li key={i} className="flex gap-2">
                                  <span className="text-slate-600 mt-0.5">•</span>
                                  <span className="leading-relaxed">{r}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-b border-r border-slate-700 transform rotate-45"></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    {/* Top Product Match with hover tooltip */}
                    <td className="py-3 px-6 lg:px-8 xl:px-12 text-center">
                      {productInfo ? (
                        <div className="relative group/tooltip inline-block">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold tracking-wide cursor-help">
                            {productInfo.productName}
                          </span>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 transform group-hover/tooltip:-translate-y-1">
                            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                              <span className="text-sm font-semibold text-white whitespace-normal text-left">{productInfo.productName}</span>
                              <span className="text-xs font-bold text-finastra-fuchsia bg-finastra-fuchsia/10 px-2 py-0.5 rounded">{productInfo.score}/100</span>
                            </div>
                            <ul className="text-xs text-slate-400 space-y-2 text-left list-none m-0 p-0 whitespace-normal">
                              {productInfo.reasons.map((r, i) => (
                                <li key={i} className="flex gap-2">
                                  <span className="text-slate-600 mt-0.5">•</span>
                                  <span className="leading-relaxed">{r}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-b border-r border-slate-700 transform rotate-45"></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-xs text-center">-</span>
                      )}
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Modal */}
      <BankDetailsModal 
        bank={selectedBank} 
        selectedProduct={selectedProduct}
        onClose={() => setSelectedBank(null)} 
      />
    </div>
    </div>
  );
}
