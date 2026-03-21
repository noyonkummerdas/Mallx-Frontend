"use client";

import { useGetPartnerProductHistoryQuery } from "@/modules/business/services/businessApi";
import { Activity, Clock, FileText, ArrowUpRight } from "lucide-react";

export default function PartnerHistoryPage() {
  const { data: historyData, isLoading } = useGetPartnerProductHistoryQuery({});
  const logs = historyData?.data?.logs || [];

  return (
    <div className="max-w-6xl mx-auto text-slate-900">
      <header className="mb-10 text-slate-900">
        <h1 className="text-xl font-black tracking-tight mb-1 uppercase leading-none">Activity Stream</h1>
        <p className="text-slate-500 font-bold text-xs tracking-wide">Audit trail of operational events and merchant interactions.</p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : (
        <div className="relative text-slate-900">
           <div className="absolute left-10 top-0 bottom-0 w-px bg-slate-100 hidden md:block" />
           <div className="space-y-10 md:pl-16 relative">
              {logs.length > 0 ? logs.map((log: any) => (
                <div key={log._id} className="relative flex flex-col md:flex-row gap-6 group">
                   <div className="hidden md:flex absolute -left-[4.2rem] w-8 h-8 rounded-full bg-white border border-slate-100 items-center justify-center z-10 group-hover:bg-slate-900 group-hover:text-white transition-all group-hover:scale-110">
                      <Clock size={12} />
                   </div>
                   <div className="bg-white border border-slate-100 p-8 rounded-[2rem] flex-1 shadow-sm group-hover:shadow-lg group-hover:border-slate-900/10 transition-all">
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                               <FileText size={16} />
                            </div>
                            <p className="text-sm font-black uppercase tracking-tight">{log.action || 'System Pulse'}</p>
                         </div>
                         <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic mb-6 leading-relaxed">System-generated audit for regional governance.</p>
                      <button className="flex items-center gap-1.5 text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                         Inspect Details
                         <ArrowUpRight size={12} />
                      </button>
                   </div>
                </div>
              )) : (
                <div className="py-32 text-center bg-white border border-dashed border-slate-200 rounded-[3rem]">
                   <Activity className="mx-auto text-slate-100 mb-4" size={48} />
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">No operational logs synchronized in current window.</p>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
