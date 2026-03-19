"use client";

import { useGetAdminTrendsQuery } from "@/modules/analytics/services/analyticsApi";
import { useEffect } from "react";

export default function SystemPage() {
  const { data: trendsData } = useGetAdminTrendsQuery({});

  useEffect(() => {
    console.log("Admin System Page - [QUERY] Admin Trends Data:", trendsData);
  }, [trendsData]);

  const marketData = trendsData?.data?.marketPenetration || [40, 70, 55, 90, 65, 80, 45];

  return (
    <>
      <header className="mb-8">
        <h1 className="text-base font-black tracking-tight mb-1 text-slate-900 uppercase leading-none">System Architecture</h1>
        <p className="text-slate-500 font-bold text-sm tracking-wide">Infrastructure health and environmental telemetry.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Market Trends Visualization */}
        <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-slate-900">
           <h2 className="text-base font-black mb-6 border-l-2 border-indigo-600 pl-3 uppercase tracking-tighter">Market Penetration</h2>
           <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 h-[220px] flex items-end justify-between gap-3">
              {marketData.map((h: number, i: number) => (
                 <div key={i} className="flex-1 group relative flex flex-col items-center">
                    <div className="w-full bg-slate-200 rounded-t-lg group-hover:bg-indigo-600 transition-all duration-500" style={{ height: `${h}%` }}>
                       <div className="absolute top-[-25px] left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">{(h*12).toLocaleString()}</div>
                    </div>
                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest mt-2">{i+1}D</span>
                 </div>
              ))}
           </div>
        </section>

        {/* System Health */}
        <section className="bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-900/20 text-white">
           <h2 className="text-base text-white/40 uppercase tracking-[0.3em] font-black mb-6">Unit Health</h2>
           <div className="space-y-6">
              {[
                { name: "API Gateway", status: "Operational" },
                { name: "Global CDN", status: "Operational" },
                { name: "Payment Engine", status: "Operational" },
                { name: "Auth Service", status: "Operational" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                   <span className="text-sm uppercase tracking-widest font-bold text-white/60">{item.name}</span>
                   <span className="text-sm font-black text-green-400 uppercase tracking-widest">{item.status}</span>
                </div>
              ))}
           </div>
        </section>
      </div>
    </>
  );
}
