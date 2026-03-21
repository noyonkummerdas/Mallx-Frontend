"use client";

import { useGetPartnerCommissionsQuery } from "@/modules/business/services/businessApi";
import { Wallet, TrendingUp, PieChart, ShieldCheck } from "lucide-react";

export default function PartnerCommissionsPage() {
  const { data: commissionsData, isLoading } = useGetPartnerCommissionsQuery({});
  const commissions = commissionsData?.data?.commissions || [];

  return (
    <div className="max-w-6xl mx-auto text-slate-900">
      <header className="mb-10">
        <h1 className="text-xl font-black tracking-tight mb-1 uppercase leading-none">Commission Structures</h1>
        <p className="text-slate-500 font-bold text-xs tracking-wide">Audit your earning yields per category slice.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
         <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-900/20">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50 mb-4">Average Yield</p>
            <h3 className="text-2xl font-black tracking-tighter mb-1">12.5%</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Rate</p>
         </div>
         <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Top Sector</p>
            <h3 className="text-2xl font-black tracking-tighter mb-1 text-slate-900">Electronics</h3>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">High Vol</p>
         </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <section className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm">
              <h2 className="text-xs font-black mb-8 border-l-2 border-slate-900 pl-3 uppercase tracking-tighter flex items-center justify-between">
                 Active Mappings
                 <span className="text-[10px] text-slate-300 normal-case font-bold">{commissions.length} items</span>
              </h2>
              <div className="space-y-6">
                {commissions.length > 0 ? commissions.map((comm: any) => (
                  <div key={comm._id} className="flex items-center justify-between group p-2 hover:bg-slate-50 rounded-2xl transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:border-indigo-600/30">
                          <PieChart size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                       </div>
                       <div>
                          <p className="text-sm font-black uppercase tracking-tight">{comm.categoryId?.name || 'Unassigned'}</p>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Category Allocation</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-slate-900">{comm.commissionRate}%</p>
                       <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic">Partner Rate</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12 opacity-50 italic text-xs font-bold uppercase tracking-widest">
                     No commission mappings found.
                  </div>
                )}
              </div>
           </section>

           <div className="space-y-6">
              <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                 <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
                 <h3 className="text-lg font-black uppercase tracking-tighter mb-4">Strategic Forecast</h3>
                 <p className="text-indigo-100 text-xs font-bold leading-relaxed mb-8">Based on current merchant activity, your projected monthly yield is expected to increase by 8%.</p>
                 <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/40">View Analytics</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
