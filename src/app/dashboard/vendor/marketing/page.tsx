"use client";

import { Megaphone, Zap, Gift, Plus, Calendar } from "lucide-react";

export default function VendorMarketingPage() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-base font-bold text-slate-900 uppercase tracking-tighter">Growth & Promotions</h1>
          <p className="text-sm text-slate-500 uppercase tracking-widest mt-1">Boost your shop visibility and sales</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl text-sm uppercase tracking-widest font-bold hover:bg-black transition-all shadow-lg active:scale-95">
          <Plus size={14} />
          Create Campaign
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Placeholder cards for future marketing features */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl transition-all group pointer-events-none opacity-60">
           <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap size={24} />
           </div>
           <h3 className="text-base font-black uppercase tracking-tight text-slate-900 mb-2">Flash Deals</h3>
           <p className="text-sm text-slate-500 leading-relaxed font-medium capitalize">Run time-limited discounts to clear inventory fast and boost ranking.</p>
           <div className="mt-6 pt-6 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Coming Soon</span>
           </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl transition-all group pointer-events-none opacity-60">
           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Gift size={24} />
           </div>
           <h3 className="text-base font-black uppercase tracking-tight text-slate-900 mb-2">Bundle Offers</h3>
           <p className="text-sm text-slate-500 leading-relaxed font-medium capitalize">Create "Buy 1 Get 1" or bundled discounts to increase average order value.</p>
           <div className="mt-6 pt-6 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Coming Soon</span>
           </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl transition-all group pointer-events-none opacity-60">
           <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Megaphone size={24} />
           </div>
           <h3 className="text-base font-black uppercase tracking-tight text-slate-900 mb-2">Ad Placements</h3>
           <p className="text-sm text-slate-500 leading-relaxed font-medium capitalize">Feature your products on the homepage or top of search results.</p>
           <div className="mt-6 pt-6 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Coming Soon</span>
           </div>
        </div>
      </div>

      <div className="mt-12 bg-slate-50 border border-slate-100 rounded-3xl p-10 text-center">
         <Calendar className="mx-auto text-slate-200 w-16 h-16 mb-4" />
         <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Campaign History</h4>
         <p className="text-xs text-slate-300 uppercase tracking-[0.2em] mt-2">No active or past marketing campaigns found.</p>
      </div>
    </div>
  );
}
