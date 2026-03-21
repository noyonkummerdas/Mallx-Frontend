"use client";

import { Truck, MapPin, Navigation, Map } from "lucide-react";

export default function PartnerLocationsPage() {
  return (
    <div className="max-w-6xl mx-auto text-slate-900">
      <header className="mb-10 text-slate-900">
        <h1 className="text-xl font-black tracking-tight mb-1 uppercase leading-none">Operational Zones</h1>
        <p className="text-slate-500 font-bold text-xs tracking-wide">Manage logistics coverage and hub location mapping.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-slate-900">
         <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm relative overflow-hidden group">
            <div className="bg-slate-50 border border-slate-100 rounded-[2rem] w-full h-[400px] flex items-center justify-center relative group-hover:border-indigo-600/20 transition-all overflow-hidden cursor-crosshair">
               <Map className="absolute inset-0 w-full h-full object-cover opacity-5 grayscale" size={100} />
               <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/30 animate-pulse">
                     <Navigation size={20} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Interactive Map Syncing...</p>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl shadow-slate-900/20">
               <h3 className="text-sm font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                  <MapPin size={16} className="text-indigo-400" />
                  Active Hubs
               </h3>
               <div className="space-y-4">
                  <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-indigo-500/50 transition-all">
                     <div>
                        <p className="text-xs font-black uppercase tracking-tight">DHAKA CENTRAL</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">MAIN REGIONAL HUB</p>
                     </div>
                     <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
