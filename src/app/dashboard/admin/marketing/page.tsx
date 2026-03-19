"use client";

import { useEffect } from "react";
import { Megaphone, Zap, Gift, ShoppingBag, Plus } from "lucide-react";
import { useGetOffersQuery } from "@/store/api/marketingApi";

export default function MarketingPage() {
  const { data: offersData, isLoading } = useGetOffersQuery({});

  useEffect(() => {
    if (offersData) {
      console.log("Admin Marketing Page - [QUERY] Vendor Offers & Campaigns:", offersData);
    }
  }, [offersData]);

  const offers = offersData?.data || [];

  return (
    <>
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-black tracking-tight mb-1 text-slate-900 uppercase leading-none">Growth Engine</h1>
          <p className="text-slate-500 font-bold italic text-[10px] tracking-wide">Promotional campaigns and vendor offer auditing.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all">
          <Plus size={14} />
          <span>New Campaign</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-slate-900">
           <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Megaphone size={16} /></div>
              <h2 className="text-xs font-black uppercase tracking-tighter">Active Audits</h2>
           </div>

           <div className="space-y-4">
              {isLoading ? (
                <p className="text-[10px] uppercase font-bold text-slate-400 italic">Syncing Offers...</p>
              ) : offers.length > 0 ? offers.map((offer: any, i: number) => (
                <div key={offer._id || i} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 group hover:border-indigo-200 transition-all">
                   <div className="flex items-center justify-between mb-2">
                       <span className="text-[8px] font-black uppercase tracking-widest text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-full">{offer.type || 'Promo'}</span>
                       <span className="text-[9px] font-bold text-slate-400 font-mono">#{offer.code || `OFFER-${i}`}</span>
                   </div>
                   <h3 className="text-[11px] font-black text-slate-900 uppercase mb-1">{offer.name || 'Vendor Campaign'}</h3>
                   <p className="text-[9px] text-slate-400 font-bold mb-3 italic">{offer.description || 'Global discount initiative'}</p>
                   <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                       <div className="flex items-center gap-2">
                          <Zap size={10} className="text-orange-500" />
                          <span className="text-[10px] font-black text-slate-900">{offer.discountValue}% OFF</span>
                       </div>
                       <button className="text-[8px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600">Review</button>
                   </div>
                </div>
              )) : (
                <p className="text-[10px] uppercase font-bold text-slate-400 italic">No vendor offers currently pending audit.</p>
              )}
           </div>
        </section>

        <section className="bg-slate-900 rounded-[40px] p-12 text-white flex flex-col items-center justify-center text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10"><Megaphone size={120} /></div>
           <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
              <ShoppingBag size={32} />
           </div>
           <h2 className="text-xl font-black uppercase tracking-tighter mb-4">Ecosystem Growth Monitor</h2>
           <p className="text-[11px] text-indigo-100/60 font-bold uppercase tracking-widest leading-relaxed max-w-[280px]">
              Tracking promotional efficiency and conversion impact across all regional nodes.
           </p>
        </section>
      </div>
    </>
  );
}
