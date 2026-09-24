import React, { useState } from 'react';
import { 
  SMART_GLASSES_DATA, 
  SmartGlassModel, 
  PORT_HARCOURT_IMPORT_GUIDE, 
  AI_EYEGLASSES_FACTS 
} from '../data/glassesData';
import { 
  Glasses, 
  Search, 
  Calculator, 
  Compass, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  ExternalLink, 
  Camera, 
  Eye, 
  Volume2, 
  Tv, 
  DollarSign, 
  MapPin, 
  Info,
  SlidersHorizontal,
  ChevronRight,
  Zap,
  Award
} from 'lucide-react';

interface OmniSpecsDashboardProps {
  isPaidUnlocked: boolean;
  onOpenPaymentModal: () => void;
}

export const OmniSpecsDashboard: React.FC<OmniSpecsDashboardProps> = ({
  isPaidUnlocked,
  onOpenPaymentModal,
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'import' | 'advisor' | 'knowledge' | 'simulator'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<SmartGlassModel | null>(null);

  // Import calculator state
  const [calcModelId, setCalcModelId] = useState<string>(SMART_GLASSES_DATA[0].id);
  const [shippingMethod, setShippingMethod] = useState<'air' | 'sea'>('air');

  // AI Advisor state
  const [userProfession, setUserProfession] = useState<string>('Content Creator / Vlogger');
  const [budgetLimit, setBudgetLimit] = useState<number>(400);
  const [priorityFeature, setPriorityFeature] = useState<'camera' | 'display' | 'audio' | 'lightweight'>('camera');
  const [aiRecommendation, setAiRecommendation] = useState<SmartGlassModel | null>(null);

  const categories = ['All', 'Ray-Ban / Meta / Oakley', 'Display Glasses', 'Audio AI Glasses', 'Big Screen Glasses'];

  const filteredGlasses = SMART_GLASSES_DATA.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.aiAssistant.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const activeCalcModel = SMART_GLASSES_DATA.find(m => m.id === calcModelId) || SMART_GLASSES_DATA[0];
  const itemCostNGN = activeCalcModel.priceUSD * PORT_HARCOURT_IMPORT_GUIDE.nairaExchangeRate;
  const customDutyNGN = itemCostNGN * (PORT_HARCOURT_IMPORT_GUIDE.customsDutyPercentage / 100);
  const vatNGN = (itemCostNGN + customDutyNGN) * (PORT_HARCOURT_IMPORT_GUIDE.vatPercentage / 100);
  const freightNGN = shippingMethod === 'air' ? 35000 : 18000;
  const totalImportCostNGN = itemCostNGN + customDutyNGN + vatNGN + freightNGN + PORT_HARCOURT_IMPORT_GUIDE.clearingFeeNGN + PORT_HARCOURT_IMPORT_GUIDE.deliveryToDoorNGN;

  const handleRunAiRecommendation = () => {
    // Find best match based on user preferences
    const matches = SMART_GLASSES_DATA.filter(m => m.priceUSD <= budgetLimit);
    if (matches.length > 0) {
      // Sort by matching priority
      const sorted = [...matches].sort((a, b) => {
        if (priorityFeature === 'camera') return (b.hasCamera ? 1 : 0) - (a.hasCamera ? 1 : 0);
        if (priorityFeature === 'display') return (b.hasDisplay ? 1 : 0) - (a.hasDisplay ? 1 : 0);
        if (priorityFeature === 'audio') return (b.hasOpenEarAudio ? 1 : 0) - (a.hasOpenEarAudio ? 1 : 0);
        return a.weightGrams - b.weightGrams;
      });
      setAiRecommendation(sorted[0]);
    } else {
      setAiRecommendation(SMART_GLASSES_DATA[0]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 border-b border-indigo-900/40 py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>2026 AI Eyeglasses &amp; XR Matrix</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              OmniSpecs <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Port Harcourt Hub</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore all 19 elite AI smart glasses and immersive XR headsets of 2026. Calculate exact Port Harcourt import costs in Naira, find your ideal model, and inspect the complete 50-point industry guide.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'catalog' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Glasses className="w-4 h-4" />
                <span>Browse 19 Models</span>
              </button>
              <button
                onClick={() => setActiveTab('import')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'import' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span>PH Import Calculator</span>
              </button>
              <button
                onClick={() => setActiveTab('advisor')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'advisor' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>AI Model Matcher</span>
              </button>
              <button
                onClick={() => setActiveTab('simulator')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'simulator' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Tv className="w-4 h-4" />
                <span>AR HUD Simulator</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="w-full md:w-80 bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-5 shadow-2xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Market Dominance</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">2026 Peak</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Ray-Ban Meta Share:</span>
                <span className="font-bold text-white">69% Market</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">2025 Global Units:</span>
                <span className="font-bold text-indigo-400">7+ Million Sold</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Port Harcourt Rate:</span>
                <span className="font-mono text-emerald-400">₦1,500 / $1</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('knowledge')}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read 50 Things Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Tab 1: Catalog Matrix */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            {/* Search and Category Filter */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search glasses by name, feature, or assistant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Glasses */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGlasses.map((glass) => (
                <div
                  key={glass.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 flex flex-col group shadow-lg"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={glass.image}
                      alt={glass.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                    />
                    <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-xs font-bold text-indigo-400">
                      ${glass.priceUSD} <span className="text-[10px] text-slate-400 font-normal">({(glass.priceUSD * 1500).toLocaleString()} NGN)</span>
                    </div>
                    <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] font-semibold text-slate-300">
                      {glass.category}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                          {glass.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                        {glass.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {glass.hasCamera && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-medium border border-blue-500/20">
                            <Camera className="w-3 h-3" /> Camera
                          </span>
                        )}
                        {glass.hasDisplay && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-medium border border-purple-500/20">
                            <Eye className="w-3 h-3" /> HUD Display
                          </span>
                        )}
                        {glass.hasOpenEarAudio && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
                            <Volume2 className="w-3 h-3" /> Open-Ear
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium">
                          {glass.weightGrams}g
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono">
                        AI: <strong className="text-slate-200">{glass.aiAssistant}</strong>
                      </span>
                      <button
                        onClick={() => setSelectedModel(glass)}
                        className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer border border-indigo-500/30"
                      >
                        View Specs
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Port Harcourt Import Calculator */}
        {activeTab === 'import' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-indigo-400" />
                    <span>Port Harcourt Import &amp; Duty Calculator (2026)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Calculate customs duty, VAT, clearing, and doorstep delivery to Port Harcourt (OGS Airport or Onne Port).
                  </p>
                </div>
                <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                  ₦1,500 / $1 USD
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Select AI Glasses Model
                    </label>
                    <select
                      value={calcModelId}
                      onChange={(e) => setCalcModelId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      {SMART_GLASSES_DATA.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} (${m.priceUSD})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Shipping Route to Port Harcourt
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setShippingMethod('air')}
                        className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          shippingMethod === 'air'
                            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900'
                        }`}
                      >
                        <span>Air Freight (Fast)</span>
                        <span className="text-[10px] text-slate-500">PH Airport (OGS) · ₦35,000</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShippingMethod('sea')}
                        className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          shippingMethod === 'sea'
                            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900'
                        }`}
                      >
                        <span>Sea Cargo (Bulk)</span>
                        <span className="text-[10px] text-slate-500">Onne Port · ₦18,000</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <span className="font-bold text-slate-300 block">Selected Item Summary:</span>
                    <div className="flex justify-between text-slate-400">
                      <span>Model:</span>
                      <span className="text-white font-semibold">{activeCalcModel.name}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Base USD Price:</span>
                      <span className="text-white font-semibold">${activeCalcModel.priceUSD}</span>
                    </div>
                  </div>
                </div>

                {/* Calculation Breakdown */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3 text-xs">
                    <h3 className="font-bold text-slate-200 pb-2 border-b border-slate-800 flex items-center justify-between">
                      <span>Cost Breakdown in Naira</span>
                      <span className="text-indigo-400 font-mono">PH Delivery Ready</span>
                    </h3>
                    <div className="flex justify-between text-slate-400">
                      <span>Item Cost ({activeCalcModel.priceUSD} × ₦1,500):</span>
                      <span className="font-mono text-white">₦{itemCostNGN.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Customs Duty (20%):</span>
                      <span className="font-mono text-white">₦{customDutyNGN.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>VAT (7.5%):</span>
                      <span className="font-mono text-white">₦{vatNGN.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Freight &amp; Handling:</span>
                      <span className="font-mono text-white">₦{freightNGN.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Clearing &amp; Doorstep Logistics:</span>
                      <span className="font-mono text-white">₦{(PORT_HARCOURT_IMPORT_GUIDE.clearingFeeNGN + PORT_HARCOURT_IMPORT_GUIDE.deliveryToDoorNGN).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-300">Total Estimated Cost:</span>
                      <span className="text-xl font-extrabold text-emerald-400 font-mono">₦{totalImportCostNGN.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={onOpenPaymentModal}
                      className="w-full py-3 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Proceed to Moniepoint Payment Checkout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: AI Model Matcher / Advisor */}
        {activeTab === 'advisor' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-400" />
                  <span>AI Eyeglasses Selector Wizard</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Answer 3 quick questions to discover which smart glasses model fits your lifestyle in Port Harcourt.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">What is your primary use case?</label>
                  <select
                    value={userProfession}
                    onChange={(e) => setUserProfession(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Content Creator / Vlogger">Content Creator &amp; Market Vlogger (PH Markets)</option>
                    <option value="Trader / Business Owner">Market Trader / WhatsApp Business Owner</option>
                    <option value="Cyclist / Athlete">Cyclist / Runner / Outdoor Athlete (Oakley/Sports)</option>
                    <option value="Student / Researcher">Student / Researcher (Reading &amp; AI Explanations)</option>
                    <option value="Remote Executive">Remote Executive (Zoom / Hologram Calls)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Maximum Budget ($ USD)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="200"
                      max="700"
                      step="50"
                      value={budgetLimit}
                      onChange={(e) => setBudgetLimit(Number(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                    <span className="font-mono font-bold text-indigo-400 text-sm w-16 text-right">${budgetLimit}</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Key Priority Feature</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'camera', label: 'Camera & Video' },
                      { id: 'display', label: 'Heads-up HUD' },
                      { id: 'audio', label: 'Open-Ear Audio' },
                      { id: 'lightweight', label: 'Lightweight Design' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPriorityFeature(p.id as any)}
                        className={`p-2.5 rounded-xl border text-center font-semibold cursor-pointer transition-all ${
                          priorityFeature === p.id
                            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunAiRecommendation}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Recommendation</span>
                </button>
              </div>

              {aiRecommendation && (
                <div className="p-5 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-indigo-900/50">
                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Top AI Match for You</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">98% Match</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <img
                      src={aiRecommendation.image}
                      alt={aiRecommendation.name}
                      className="w-32 h-24 object-cover rounded-xl border border-slate-800"
                    />
                    <div className="space-y-1.5 flex-1">
                      <h3 className="text-base font-bold text-white">{aiRecommendation.name}</h3>
                      <p className="text-xs text-slate-300">{aiRecommendation.description}</p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="text-xs font-bold text-indigo-300 font-mono">${aiRecommendation.priceUSD} (~₦{(aiRecommendation.priceUSD * 1500).toLocaleString()})</span>
                        <span className="text-xs text-slate-400 font-mono">· {aiRecommendation.weightGrams}g</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: 50 Things Knowledge Base */}
        {activeTab === 'knowledge' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    <span>The 50 Essential Things You Need to Know About AI Eyeglasses (2026)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Complete reference guide covering models, privacy features, use cases in Port Harcourt, and technical specs.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {AI_EYEGLASSES_FACTS.map((fact, index) => (
                  <div key={index} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono font-bold flex items-center justify-center shrink-0 border border-indigo-500/20">
                      {index + 1}
                    </span>
                    <p className="text-slate-300 leading-relaxed">{fact}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: AR HUD Simulator */}
        {activeTab === 'simulator' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Tv className="w-5 h-5 text-indigo-400" />
                    <span>Interactive AR HUD Overlay Simulator</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Preview heads-up display optics, navigation waypoints, and live translations in real-time.
                  </p>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-96 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=1200"
                  alt="AR HUD View"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40"></div>

                {/* HUD Elements */}
                <div className="absolute top-6 left-6 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-indigo-500/30 text-xs space-y-2 max-w-xs shadow-2xl">
                  <div className="flex items-center justify-between font-bold text-indigo-400">
                    <span>Navigation HUD</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Live</span>
                  </div>
                  <p className="text-slate-300">Turn left in 50 meters at Market Junction, Port Harcourt.</p>
                  <div className="text-[10px] text-slate-500 font-mono">ETA: 12 mins · Walking</div>
                </div>

                <div className="absolute bottom-6 right-6 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-indigo-500/30 text-xs space-y-2 max-w-xs shadow-2xl">
                  <div className="flex items-center justify-between font-bold text-purple-400">
                    <span>Live Translation</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300">Yoruba → English</span>
                  </div>
                  <p className="text-slate-300">"E kaaro, e nle o" → "Good morning, welcome!"</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Selected Model Modal */}
      {selectedModel && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setSelectedModel(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-4">
              <img
                src={selectedModel.image}
                alt={selectedModel.name}
                className="w-24 h-20 object-cover rounded-xl border border-slate-800"
              />
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {selectedModel.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedModel.name}</h3>
                <span className="text-sm font-mono font-bold text-emerald-400">${selectedModel.priceUSD} (~₦{(selectedModel.priceUSD * 1500).toLocaleString()})</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{selectedModel.description}</p>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-200 block">Key Specifications &amp; Highlights:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {selectedModel.highlights.map((h, i) => (
                  <div key={i} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Weight: <strong className="text-white">{selectedModel.weightGrams}g</strong> | Battery: <strong className="text-white">{selectedModel.batteryHours}h</strong></span>
              <button
                onClick={() => setSelectedModel(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close Specs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
