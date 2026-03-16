"use client";

import { useGetNotificationsQuery } from "@/modules/notifications/services/notificationApi";

export default function DeliveryDashboard() {
  const { data: notifications } = useGetNotificationsQuery({});

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900 uppercase">Logistics Field Hub</h1>
            <p className="text-slate-500 font-bold italic text-sm">Operational control for real-time shipment fulfillment.</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-3 px-6 py-3 bg-white border border-green-200 rounded-2xl shadow-sm">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse border-2 border-white shadow-lg" />
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Active & Ready</span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Active Shipments */}
           <div className="lg:col-span-2">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-slate-900 uppercase tracking-tighter">
                 <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                 </div>
                 Fulfillment Queue
              </h2>
              
              <div className="space-y-6">
                 {[1, 2].map((i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-[3rem] p-10 hover:border-indigo-600/30 transition-all group shadow-sm hover:shadow-xl hover:shadow-indigo-600/5">
                       <div className="flex flex-col md:flex-row justify-between gap-6 mb-10">
                          <div>
                             <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 px-3 py-1 bg-indigo-50 rounded-full w-fit">Shipment ID: MALX-FUL-{i}9A8</p>
                             <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Standard Delivery #882{i}</h3>
                             <p className="text-slate-400 text-xs font-bold italic mt-1 font-sans">Route Analysis: 2.4 KM estimated to destination.</p>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-2xl h-fit shadow-inner">
                             <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest opacity-60">Status: Transit_Active</span>
                          </div>
                       </div>
                       
                       <div className="flex flex-col sm:flex-row items-center gap-4">
                          <button className="w-full sm:w-auto px-10 py-5 bg-indigo-600 rounded-3xl font-black text-white text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-95">Coordinate GPS Update</button>
                          <button className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 rounded-3xl font-black text-slate-900 text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">Route Specifications</button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Earnings & Stats */}
           <div className="space-y-8">
              <div className="bg-white border-2 border-indigo-600 rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-600/10 relative overflow-hidden group">
                 <div className="relative z-10 text-center">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">Real-Time Daily Yield</p>
                    <h3 className="text-5xl font-black mb-1 text-slate-900 tracking-tighter">840 <span className="text-sm font-normal text-slate-400 italic">TK</span></h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">Calculated from 14 Deliveries</p>
                 </div>
                 <div className="absolute top-[-20%] left-[-20%] w-full h-full bg-indigo-50/50 rounded-full blur-[80px] pointer-events-none" />
              </div>

              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm relative group overflow-hidden">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 px-3 py-1 bg-slate-50 rounded-full w-fit">System Security Monitor</h4>
                 <div className="flex items-center gap-5 p-5 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 relative z-10">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-50">
                       <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622l-.382-3.040z" /></svg>
                    </div>
                    <div>
                       <span className="text-xs font-black text-slate-900 uppercase tracking-tight">Biometric Verify</span>
                       <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">ENABLED & ACTIVE</p>
                    </div>
                 </div>
                 <div className="absolute bottom-[-10%] right-[-10%] opacity-[0.05] pointer-events-none text-slate-400">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}
