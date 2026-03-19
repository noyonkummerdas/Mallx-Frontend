"use client";

import { useEffect } from "react";
import { Truck, Activity, MapPin, Package, ShieldCheck } from "lucide-react";
import { useGetLiveStatusQuery } from "@/store/api/logisticsApi";

export default function LogisticsPage() {
  const { data: logisticsData, isLoading } = useGetLiveStatusQuery({});

  useEffect(() => {
    if (logisticsData) {
      console.log("Admin Logistics Page - [QUERY] Live Shipment & Truck Status:", logisticsData);
    }
  }, [logisticsData]);

  const stats = logisticsData?.data?.stats || { activeTrucks: 0, liveShipments: 0, pendingDeliveries: 0 };
  const shipments = logisticsData?.data?.shipments || [];

  return (
    <>
      <header className="mb-8">
        <h1 className="text-lg font-black tracking-tight mb-1 text-slate-900 uppercase leading-none">Logistics Control</h1>
        <p className="text-slate-500 font-bold italic text-[10px] tracking-wide">Live fleet surveillance and shipment lifecycle monitoring.</p>
      </header>

      {/* Logistics Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm group hover:border-indigo-600 transition-all">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Active Fleet</p>
          <div className="flex items-center gap-4">
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Truck size={20} /></div>
             <h3 className="text-xl font-black tracking-tighter text-slate-900">{stats.activeTrucks} <span className="text-[10px] font-normal text-slate-400 italic">Trucks</span></h3>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm group hover:border-emerald-600 transition-all">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Live Shipments</p>
          <div className="flex items-center gap-4">
             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Activity size={20} /></div>
             <h3 className="text-xl font-black tracking-tighter text-slate-900">{stats.liveShipments} <span className="text-[10px] font-normal text-slate-400 italic">In Transit</span></h3>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm group hover:border-orange-600 transition-all">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Pending Loads</p>
          <div className="flex items-center gap-4">
             <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Package size={20} /></div>
             <h3 className="text-xl font-black tracking-tighter text-slate-900">{stats.pendingDeliveries} <span className="text-[10px] font-normal text-slate-400 italic">Awaiting</span></h3>
          </div>
        </div>
      </div>

      <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-slate-900">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xs font-black border-l-2 border-slate-900 pl-3 uppercase tracking-tighter mb-1">Transit Registry</h2>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold ml-3">Real-time GPS status of all active modules</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 italic">
                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Shipment ID</th>
                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Route / Destination</th>
                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={4} className="py-8 text-center text-[10px] uppercase font-bold text-slate-400">Pulling Satellite Data...</td></tr>
              ) : shipments.length > 0 ? shipments.map((shipment: any, i: number) => (
                <tr key={shipment._id || i} className="group hover:bg-slate-50/50 transition-all">
                  <td className="py-4">
                    <p className="text-[11px] font-black text-slate-900 leading-none mb-1">#{shipment.trackingId || `SHP-${i}`}</p>
                    <p className="text-[9px] text-slate-400 font-bold tracking-tight italic">Category: {shipment.category || 'General'}</p>
                  </td>
                  <td className="py-4 font-mono">
                    <div className="flex items-center gap-2 text-[10px]">
                       <MapPin size={12} className="text-slate-400" />
                       <span className="font-bold text-slate-600">{shipment.destination || 'Global Hub'}</span>
                    </div>
                  </td>
                  <td className="py-4">
                     <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${
                       shipment.status === 'In Transit' ? 'bg-indigo-50 text-indigo-600' : 
                       shipment.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                     }`}>
                       {shipment.status || 'Scheduled'}
                     </span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="inline-flex items-center gap-1 text-[9px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">
                       <ShieldCheck size={12} />
                       Audit Log
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="py-12 text-center text-[10px] uppercase font-bold text-slate-400 italic">No live shipments currently monitored in the ecosystem.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
