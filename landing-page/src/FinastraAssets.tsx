import { useState } from 'react';
import { Package, Users, Briefcase, SwitchCamera, Search } from 'lucide-react';
import finastraData from '../../finastra_data.json';

const PRODUCT_CATEGORIES: Record<string, string[]> = {
  "Core Modernization": ["Essence", "Phoenix Banking Core"],
  "Digital Transformation": ["MalauzAI Digital Banking", "Corporate Channels + Unified Corporate Portal + Cash/Trade/Loan portals", "Finastra ECM"],
  "Analytics": ["Essence Analytics", "AnalyzerIQ", "Fusion Data Cloud"],
  "Lending": ["Loan IQ", "Loan IQ Nexus", "Loan IQ Build", "Loan IQ Transact", "Loan Portal", "Originate (consumer & business loans/deposits)", "MortgagebotLOS + Originate Mortgagebot + Integrations", "LaserPro (platform + modules including Conductor/Evaluate)", "Fusion CreditQuest", "ESG Service"],
  "Trade Finance": ["Trade Innovation + Trade Portal", "Trade Innovation Nexus"],
  "Payments": ["Global PAYplus", "Payments To Go", "Financial Messaging (incl. Total Messaging positioning)", "Bacsactive-IP", "RapidWires", "ACH Module", "PAYplus for CLS"],
  "Compliance & Risk": ["DFA 1071 / Compliance Reporter SBDC", "Compliance as a Service (instant payments)", "Total Screening", "Confirmation Matching Service (CMS)"]
};

type TabType = 'products' | 'customers' | 'useCases' | 'competitors';
export const FinastraAssets = () => {
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [searchQuery, setSearchQuery] = useState('');

  const renderTabButton = (type: TabType, label: string, Icon: React.ElementType) => (
    <button
      onClick={() => setActiveTab(type)}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
        activeTab === type
          ? 'bg-finastra-fuchsia/20 text-finastra-fuchsia border border-finastra-fuchsia/50 shadow-[0_0_20px_rgba(193,55,162,0.15)]'
          : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-slate-200'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  const filterData = (data: any[], keyField: string) => {
    if (!searchQuery) return data;
    return data.filter((item) => {
      const mainField = item[keyField] || '';
      return mainField.toString().toLowerCase().includes(searchQuery.toLowerCase());
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 min-h-screen relative z-10 flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-finastra-fuchsia/30 bg-finastra-fuchsia/10 text-finastra-fuchsia text-xs font-semibold tracking-wide mb-4 shadow-[0_0_15px_rgba(193,55,162,0.15)]">
            <span className="w-2 h-2 rounded-full bg-finastra-fuchsia animate-ping" />
            KNOWLEDGE BASE
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Finastra <span className="text-transparent bg-clip-text bg-gradient-to-r from-finastra-fuchsia to-finastra-purple">Assets</span>
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl text-lg">
            Explore the complete repository of Finastra products, customer success stories, priority use cases, and competitive intelligence.
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search assets..."
            className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-finastra-fuchsia focus:ring-1 focus:ring-finastra-fuchsia/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-3">
        {renderTabButton('products', 'Products', Package)}
        {renderTabButton('customers', 'Customer Stories', Users)}
        {renderTabButton('useCases', 'Use Cases', Briefcase)}
        {renderTabButton('competitors', 'Competitor Maps', SwitchCamera)}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
        
        {activeTab === 'products' && (
          <div className="flex flex-col gap-12 col-span-full pb-8">
            {Object.entries(PRODUCT_CATEGORIES).map(([category, productNames]) => {
              const categoryProducts = finastraData.products.filter(p => productNames.includes(p['Product/solution']));
              const filteredCategoryProducts = filterData(categoryProducts, 'Product/solution');
              
              if (filteredCategoryProducts.length === 0) return null;

              return (
                <div key={category} className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-white">{category}</h2>
                    <div className="h-px bg-white/10 flex-1"></div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCategoryProducts.map((prod, idx) => (
                      <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-finastra-purple/30 transition-colors flex flex-col group h-full">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-finastra-purple transition-colors">{prod['Product/solution']}</h3>
                        <p className="text-sm text-slate-400 mb-4 line-clamp-3 leading-relaxed">{prod['Concise description']}</p>
                        <div className="mt-auto space-y-3 pt-4 border-t border-white/10">
                          <div>
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Target</span>
                            <p className="text-sm text-slate-300 mt-0.5 line-clamp-1">{prod['Target segments']}</p>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Deployment</span>
                            <p className="text-sm text-slate-300 mt-0.5">{prod['Deployment options']}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {/* Other / Uncategorized */}
            {(() => {
              const allCategorized = Object.values(PRODUCT_CATEGORIES).flat();
              const uncategorizedProducts = finastraData.products.filter(p => !allCategorized.includes(p['Product/solution']));
              const filteredUncategorized = filterData(uncategorizedProducts, 'Product/solution');
              
              if (filteredUncategorized.length === 0) return null;

              return (
                <div key="Other" className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-white">Other Solutions</h2>
                    <div className="h-px bg-white/10 flex-1"></div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredUncategorized.map((prod, idx) => (
                      <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-finastra-purple/30 transition-colors flex flex-col group h-full">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-finastra-purple transition-colors">{prod['Product/solution']}</h3>
                        <p className="text-sm text-slate-400 mb-4 line-clamp-3 leading-relaxed">{prod['Concise description']}</p>
                        <div className="mt-auto space-y-3 pt-4 border-t border-white/10">
                          <div>
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Target</span>
                            <p className="text-sm text-slate-300 mt-0.5 line-clamp-1">{prod['Target segments']}</p>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Deployment</span>
                            <p className="text-sm text-slate-300 mt-0.5">{prod['Deployment options']}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {activeTab === 'customers' && filterData(finastraData.customers, 'Customer').map((cust, idx) => (
          <a key={idx} href={cust['Link']} target="_blank" rel="noopener noreferrer" className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-finastra-fuchsia/30 transition-colors flex flex-col group cursor-pointer">
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-finastra-fuchsia transition-colors">{cust['Customer']}</h3>
            <p className="text-sm font-medium text-finastra-fuchsia/80 mb-4">{cust['Industry']}</p>
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Challenge</span>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">{cust['Problem/context']}</p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Solution</span>
                <p className="text-sm font-medium text-white mt-1">{cust['Finastra solution(s) implemented']}</p>
              </div>
            </div>
          </a>
        ))}

        {activeTab === 'useCases' && filterData(finastraData.useCases, 'Priority use case').map((uc, idx) => (
          <a key={idx} href={uc['Link']} target="_blank" rel="noopener noreferrer" className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-blue-400/30 transition-colors flex flex-col group cursor-pointer">
            <h3 className="text-lg font-bold text-white mb-4 group-hover:text-blue-400 transition-colors leading-tight">{uc['Priority use case']}</h3>
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Target Persona</span>
                <p className="text-sm text-slate-300 mt-1">{uc['Primary buyer personas']}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Products</span>
                <p className="text-sm font-medium text-white mt-1">{uc['Best-fit products/modules']}</p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">ROI Drivers</span>
                <p className="text-sm text-blue-300 mt-1">{uc['ROI drivers and measurable outcomes']}</p>
              </div>
            </div>
          </a>
        ))}

        {activeTab === 'competitors' && filterData(finastraData.competitors, 'Domain').map((comp, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-orange-400/30 transition-colors flex flex-col group">
            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">{comp['Domain']}</h3>
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Finastra Focus</span>
                <p className="text-sm font-medium text-white mt-1">{comp['Finastra focal products']}</p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Competitors</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {comp['Commonly referenced competitor set (examples)'].split(', ').map((c: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              {comp['Finastra differentiators'] && (
                <div className="pt-4 border-t border-white/10 mt-auto">
                  <span className="text-xs font-semibold text-[#c137a2] uppercase tracking-widest">Finastra Edge</span>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">{comp['Finastra differentiators']}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
