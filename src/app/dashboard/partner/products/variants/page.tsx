"use client";

import { Package, Plus, Layers, Search } from "lucide-react";

export default function PartnerVariantsPage() {
  return (
    <div className="max-w-6xl mx-auto text-slate-900">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-black tracking-tight mb-1 uppercase leading-none">SKU Variations</h1>
          <p className="text-slate-500 font-bold text-xs tracking-wide">Manage multi-variant listings and attribute configurations.</p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-slate-900/20">
          <Plus size={14} />
          New Variation
        </button>
      </header>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
         <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 mb-10 group focus-within:border-slate-900 transition-all">
            <Search size={16} className="text-slate-300 group-focus-within:text-slate-900 transition-colors" />
            <input type="text" placeholder="SEARCH PARENT SKU..." className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest w-full placeholder:text-slate-300" />
         </div>

         <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-6 border border-slate-100">
               <Layers size={32} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 italic mb-2">Variant Matrix Operational</h3>
            <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Select a parent product to manage dimensional SKUs.</p>
         </div>
      </div>
    </div>
  );
}
