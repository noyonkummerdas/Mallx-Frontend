"use client";

import { useEffect } from "react";
import { Activity, ShieldAlert, Clock, User } from "lucide-react";
import { useGetVendorActivityQuery } from "@/store/api/vendorApi";

export default function ActivityPage() {
  const { data: activityData, isLoading } = useGetVendorActivityQuery({});

  useEffect(() => {
    if (activityData) {
      console.log("Admin Activity Logs Page - [QUERY] Vendor Action Tracking:", activityData);
    }
  }, [activityData]);

  const activities = activityData?.data || [];

  return (
    <>
      <header className="mb-8">
        <h1 className="text-lg font-black tracking-tight mb-1 text-slate-900 uppercase leading-none">Security Audit</h1>
        <p className="text-slate-500 font-bold italic text-[10px] tracking-wide">Vendor action tracking and system-wide security logs.</p>
      </header>

      <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-slate-900">
        <div className="flex items-center gap-3 mb-8">
           <div className="p-2 bg-slate-900 text-white rounded-lg"><Activity size={16} /></div>
           <h2 className="text-xs font-black uppercase tracking-tighter">Live Audit Stream</h2>
        </div>

        <div className="space-y-6">
           {isLoading ? (
             <p className="text-[10px] uppercase font-bold text-slate-400 italic font-mono">Streaming Security Logs...</p>
           ) : activities.length > 0 ? activities.map((log: any, i: number) => (
             <div key={log._id || i} className="flex gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 items-start group hover:border-indigo-600/20 transition-all">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                   <Clock size={16} />
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-[11px] font-black text-slate-900 uppercase">{log.action || 'System Event'}</p>
                      <span className="text-[8px] font-bold text-slate-400 font-mono italic">
                        {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Syncing...'}
                      </span>
                   </div>
                   <p className="text-[9px] text-slate-500 font-bold leading-relaxed mb-3">
                      {log.description || 'Vendor performed a state-altering operation on the ecosystem.'}
                   </p>
                   <div className="flex items-center gap-2">
                       <User size={10} className="text-slate-400" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">{log.vendorName || 'Global Vendor'}</span>
                       <span className="w-1 h-1 bg-slate-200 rounded-full" />
                       <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{log.role || 'Partner'}</span>
                   </div>
                </div>
                <div className="pl-4">
                   <ShieldAlert size={16} className="text-slate-200 group-hover:text-indigo-600 transition-colors" />
                </div>
             </div>
           )) : (
             <p className="text-[10px] uppercase font-bold text-slate-400 italic">No activity logs recorded in the current session.</p>
           )}
        </div>
      </section>
    </>
  );
}
