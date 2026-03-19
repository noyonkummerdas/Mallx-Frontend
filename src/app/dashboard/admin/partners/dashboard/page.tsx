"use client";

import { LayoutDashboard, TrendingUp, Users, ShoppingBag, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { useGetPartnerDashboardQuery } from "@/modules/business/services/businessApi";

export default function AdminPartnerDashboardPage() {
  const { data: dashboardData, isLoading } = useGetPartnerDashboardQuery({});

  const stats = dashboardData?.data?.stats || {
    totalSales: 0,
    orderCount: 0,
    vendorCount: 0
  };

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight font-sans">Ecosystem Performance Intelligence</h1>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">Real-time surveillance of partner-driven revenue and operational growth</p>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         {[
           { label: "Partner GMV", value: `$${stats.totalSales}`, change: "+12.5%", trending: true, icon: <TrendingUp size={16} /> },
           { label: "Active Vendors", value: stats.vendorCount, change: "+3 New", trending: true, icon: <Users size={16} /> },
           { label: "Managed Volume", value: stats.orderCount, change: "-2.1%", trending: false, icon: <ShoppingBag size={16} /> },
           { label: "Network Health", value: "98.4%", change: "Stable", trending: true, icon: <Activity size={16} /> }
         ].map((stat, i) => (
           <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm group hover:border-slate-900 transition-all">
              <div className="flex items-center justify-between mb-4">
                 <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all">
                    {stat.icon}
                 </div>
                 <div className={`flex items-center gap-1 text-[9px] font-black uppercase ${stat.trending ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {stat.trending ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {stat.change}
                 </div>
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-xl font-black text-slate-900 tracking-tighter uppercase">{stat.value}</p>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Lead Partners */}
         <section className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xs font-black border-l-2 border-slate-900 pl-3 uppercase tracking-tighter mb-8 font-mono text-slate-900">High-Velocity Partners</h2>
            <div className="space-y-4">
               {isLoading ? (
                  <p className="text-[10px] uppercase font-bold text-slate-400 italic py-10 text-center">Crunching logistical telemetry...</p>
               ) : (
                 [
                   { name: "Global Cargo Hub", city: "Dhaka", gmv: "$24.5k", health: 98 },
                   { name: "Coastal Terminal", city: "Chittagong", gmv: "$18.2k", health: 95 },
                   { name: "Highland Express", city: "Sylhet", gmv: "$12.9k", health: 89 },
                 ].map((partner, i) => (
                   <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:scale-[1.01] transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-900 font-black text-[10px] shadow-sm italic">P{i+1}</div>
                         <div>
                            <p className="text-[11px] font-black text-slate-900 uppercase leading-none mb-1">{partner.name}</p>
                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest italic">{partner.city} Sector Hub</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-12 text-right">
                         <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">GMV Yield</p>
                            <p className="text-[11px] font-black text-slate-900 uppercase">{partner.gmv}</p>
                         </div>
                         <div className="w-20">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">Health</p>
                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
                               <div className="h-full bg-slate-900 rounded-full" style={{ width: `${partner.health}%` }} />
                            </div>
                         </div>
                      </div>
                   </div>
                 ))
               )}
            </div>
         </section>

         {/* Meta Data */}
         <section className="bg-[#0f172a] text-white rounded-3xl p-8 shadow-xl shadow-slate-900/20 self-start">
            <h2 className="text-[10px] font-black border-l-2 border-white pl-3 uppercase tracking-[0.2em] mb-8 italic opacity-60">System Telemetry</h2>
            
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Api Integrity</span>
                  <span className="text-[10px] font-black text-emerald-400 uppercase shadow-emerald-400/20">Operational</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Settlement Cycle</span>
                  <span className="text-[10px] font-black text-white uppercase">Daily @ 00:00</span>
               </div>
               <hr className="border-slate-800" />
               <div className="py-2">
                  <div className="flex items-center gap-2 mb-4">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                     <p className="text-[9px] font-black uppercase tracking-widest">Real-time Stream</p>
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-md italic font-mono text-[9px] text-slate-400 space-y-2">
                     <p>"{'>'} GET /api/v1/partners/dashboard"</p>
                     <p className="text-emerald-500">"{'>'} 200 OK: payload received"</p>
                     <p>"{'>'} re-calculating GMV distribution..."</p>
                  </div>
               </div>
            </div>
         </section>
      </div>
    </div>
  );
}
