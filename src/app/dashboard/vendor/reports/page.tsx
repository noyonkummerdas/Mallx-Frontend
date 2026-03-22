"use client";

import { BarChart3, TrendingUp, PieChart, Download } from "lucide-react";

export default function VendorReportsPage() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-base font-bold text-slate-900 uppercase tracking-tighter">Business Analytics</h1>
          <p className="text-sm text-slate-500 uppercase tracking-widest mt-1">Deep dive into your sales performance</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-xl text-sm uppercase tracking-widest font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95">
          <Download size={14} />
          Export Data
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-slate-900 transition-all cursor-crosshair">
           <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center">
                 <BarChart3 size={20} />
              </div>
              <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-full font-black uppercase tracking-widest">+18%</span>
           </div>
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-1">Weekly Volume</h3>
           <p className="text-2xl font-black text-slate-900 tracking-tighter">42,500 TK</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-slate-900 transition-all cursor-crosshair">
           <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center">
                 <TrendingUp size={20} />
              </div>
              <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-black uppercase tracking-widest">Steady</span>
           </div>
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-1">Conversion Rate</h3>
           <p className="text-2xl font-black text-slate-900 tracking-tighter">3.2%</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-slate-900 transition-all cursor-crosshair">
           <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center">
                 <PieChart size={20} />
              </div>
           </div>
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-1">Top Category</h3>
           <p className="text-2xl font-black text-slate-900 tracking-tighter">Electronics</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
         <div className="relative z-10">
            <h4 className="text-lg font-black uppercase tracking-tighter mb-4">Unlock Advanced Insights</h4>
            <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed mb-8">Get detailed demographics, heatmaps, and predictive sales analytics to scale your shop ten-fold.</p>
            <button className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">Upgrade to Pro</button>
         </div>
         <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px]" />
      </div>
    </div>
  );
}
