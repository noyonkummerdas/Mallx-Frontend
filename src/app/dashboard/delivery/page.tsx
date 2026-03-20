"use client";

import { useGetAvailableShipmentsQuery, useAcceptOrderMutation, useUpdateTrackingMutation } from "@/modules/logistics/services/logisticsApi";
import { useGetMeQuery } from "@/modules/identity/services/authApi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function DeliveryDashboard() {
  const { data: userData } = useGetMeQuery({});
  const { data: shipmentsData, refetch } = useGetAvailableShipmentsQuery({});
  const [acceptOrder, { isLoading: isAccepting }] = useAcceptOrderMutation();
  const [updateTracking, { isLoading: isTracking }] = useUpdateTrackingMutation();
  
  const [activeShipmentId, setActiveShipmentId] = useState<string | null>(null);

  useEffect(() => {
    if (userData) console.log("Logistics Dashboard - User Profile:", userData);
    if (shipmentsData) console.log("Logistics Dashboard - Available Shipments:", shipmentsData);
  }, [userData, shipmentsData]);

  const handleAccept = async (id: string) => {
    try {
      console.log("Accepting shipment:", id);
      await acceptOrder(id).unwrap();
      setActiveShipmentId(id);
      refetch();
      alert("Shipment accepted!");
    } catch (err) {
      console.error("Accept failed:", err);
    }
  };

  const handleSimulateGPS = async () => {
    if (!activeShipmentId) return;
    try {
      const lat = 23.8103 + (Math.random() - 0.5) * 0.01;
      const lng = 90.4125 + (Math.random() - 0.5) * 0.01;
      console.log("Simulating GPS update:", { lat, lng });
      await updateTracking({ 
        shipmentId: activeShipmentId, 
        location: { lat, lng },
        status: "In Transit"
      }).unwrap();
      alert("GPS Coordinates Synced!");
    } catch (err) {
      console.error("GPS Sync failed:", err);
    }
  };

  const availableShipments = shipmentsData?.data?.shipments || [];
  const balance = userData?.data?.user?.walletBalance || 0;

  return (
    <>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-base font-black tracking-tight mb-1 text-slate-900 uppercase leading-none">Field Ops Hub</h1>
          <p className="text-slate-500 font-bold text-sm tracking-wide">Real-time shipment fulfillment relay.</p>
        </div>
        <div className="flex gap-3 text-slate-900">
           <div className="flex items-center gap-2 px-4 py-2 bg-white border border-green-200 rounded-xl shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-md" />
              <span className="text-sm text-green-600 uppercase tracking-widest font-black">Ready</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-slate-900">
         {/* Active Shipments / Queue */}
         <div className="lg:col-span-2">
            <h2 id="loads" className="text-base font-black px-1 border-l-2 border-slate-900 pl-3 text-slate-900 uppercase tracking-tighter">
               Queue Dispatch
            </h2>
            
            <div className="space-y-4">
               {availableShipments.length > 0 ? availableShipments.map((ship: any) => (
                  <div key={ship._id} className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-slate-900/30 transition-all group shadow-sm">
                     <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                        <div>
                           <p className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1 px-2 py-0.5 bg-slate-100 rounded-full w-fit">ID: {ship._id.slice(-6).toUpperCase()}</p>
                           <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">{ship.orderId?.name || "Premium Shipment"}</h3>
                           <p className="text-slate-400 text-sm mt-0.5 font-bold">Route: {ship.orderId?.shippingAddress?.street}</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl h-fit">
                           <span className="text-sm font-black text-slate-900 uppercase tracking-widest opacity-60">{ship.status}</span>
                        </div>
                     </div>
                     
                     <div className="flex flex-col sm:flex-row items-center gap-3">
                        {activeShipmentId === ship._id ? (
                           <button 
                             onClick={handleSimulateGPS}
                             disabled={isTracking}
                             className="w-full sm:w-auto px-6 py-3 bg-green-600 rounded-xl py-3 bg-slate-900 text-white text-sm font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-black transition-all active:scale-95"
                           >Sync GPS</button>
                        ) : (
                           <button 
                             onClick={() => handleAccept(ship._id)}
                             disabled={isAccepting}
                             className="w-full sm:w-auto px-6 py-3 bg-slate-900 rounded-xl py-3 text-white text-sm font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-black transition-all active:scale-95"
                           >Accept Relay</button>
                        )}
                        <button className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">Specifications</button>
                     </div>
                  </div>
               )) : (
                  <div className="text-center py-10 bg-white border border-dashed border-slate-200 rounded-[2rem]">
                     <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Scanning for loads...</p>
                  </div>
               )}
            </div>
         </div>

         {/* Earnings & Stats */}
         <div className="space-y-6">
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-8 shadow-xl shadow-slate-900/5 relative overflow-hidden group">
               <div className="relative z-10 text-center">
               <p id="earnings" className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3">Daily Yield</p>
                  <h3 className="text-base font-black mb-1 text-slate-900 tracking-tighter">{balance.toLocaleString()} <span className="text-sm font-normal text-slate-400">TK</span></h3>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-3">Ref: 40 TK/Order</p>
               </div>
               <div className="absolute top-[-20%] left-[-20%] w-full h-full bg-slate-50/50 rounded-full blur-[80px] pointer-events-none" />
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm relative group overflow-hidden">
               <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 px-3 py-1 bg-slate-50 rounded-full w-fit">Security Relay</h4>
               <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 relative z-10">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-900 shadow-sm border border-slate-50">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-3.652A14.99 14.99 0 0110 11.536M12 11a14.99 14.99 0 013.193 10.418m-3.193-10.418a14.954 14.954 0 013.44-8.09M12 11c0-3.517 1.009-6.799 2.753-9.571m3.44 3.652A14.99 14.99 0 0114 10.464M12 11a14.99 14.99 0 01-3.193-10.418m3.193 10.418a14.954 14.954 0 01-3.44 8.09" /></svg>
                  </div>
                  <div>
                     <span className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none block">2FA Secured</span>
                     <p className="text-sm font-black text-slate-900 uppercase tracking-widest">ACTIVE</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </>
  );
}
