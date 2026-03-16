"use client";

import { useGetNotificationsQuery } from "@/modules/notifications/services/notificationApi";

export default function DeliveryDashboard() {
  const { data: notifications } = useGetNotificationsQuery({});

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Delivery Partner</h1>
            <p className="text-slate-400 font-medium">Tracking shipments and managing deliveries.</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-3 px-6 py-3 bg-green-500/10 border border-green-500/20 rounded-2xl">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                <span className="text-sm font-bold text-green-500">Online & Ready</span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Active Shipments */}
           <div className="lg:col-span-2">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-4">
                 <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 00-1 1v1m-6-1a1 1 0 00-1 1v1m12-1a1 1 0 00-1 1v1m-6-1a1 1 0 00-1 1v1" /></svg>
                 Active Deliveries
              </h2>
              
              <div className="space-y-6">
                 {[1, 2].map((i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 hover:border-indigo-500 transition-all group">
                       <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                          <div>
                             <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Order #MALX-99{i}</p>
                             <h3 className="text-xl font-bold">Electronics Hub Delivery</h3>
                             <p className="text-slate-500 text-sm italic">2.4 km away from current location</p>
                          </div>
                          <div className="bg-slate-800/50 px-4 py-2 rounded-xl h-fit">
                             <span className="text-xs font-bold text-white uppercase">Picked Up</span>
                          </div>
                       </div>
                       
                       <div className="flex flex-col md:flex-row items-center gap-4">
                          <button className="w-full md:w-auto px-8 py-4 bg-indigo-600 rounded-2xl font-black shadow-lg shadow-indigo-600/20 hover:scale-105 transition-transform">Update Live Tracking</button>
                          <button className="w-full md:w-auto px-8 py-4 bg-slate-800 rounded-2xl font-black">View Directions</button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Earnings & Stats */}
           <div className="space-y-8">
              <div className="bg-indigo-600 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-600/20">
                 <p className="text-xs font-black text-indigo-200 uppercase tracking-widest mb-4">Today's Earnings</p>
                 <h3 className="text-4xl font-black mb-1">840 <span className="text-sm font-normal opacity-80">TK</span></h3>
                 <p className="text-xs text-indigo-200 font-medium">From 14 successful deliveries</p>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8">
                 <h4 className="text-sm font-black uppercase tracking-widest mb-6">Security Check</h4>
                 <div className="flex items-center gap-4 p-4 rounded-2xl bg-green-500/5 border border-green-500/10">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622l-.382-3.040z" /></svg>
                    <span className="text-xs font-bold text-slate-300">2FA Protection Enabled</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}
