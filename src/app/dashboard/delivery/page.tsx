import { useGetAvailableShipmentsQuery, useAcceptOrderMutation, useUpdateTrackingMutation } from "@/modules/logistics/services\logisticsApi";
import { useGetMeQuery } from "@/modules/identity/services/authApi";
import { useState, useEffect } from "react";

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
           {/* Active Shipments / Queue */}
           <div className="lg:col-span-2">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-slate-900 uppercase tracking-tighter">
                 <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                 </div>
                 Fulfillment Queue
              </h2>
              
              <div className="space-y-6">
                 {availableShipments.length > 0 ? availableShipments.map((ship: any) => (
                    <div key={ship._id} className="bg-white border border-slate-200 rounded-[3rem] p-10 hover:border-indigo-600/30 transition-all group shadow-sm hover:shadow-xl hover:shadow-indigo-600/5">
                       <div className="flex flex-col md:flex-row justify-between gap-6 mb-10">
                          <div>
                             <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 px-3 py-1 bg-indigo-50 rounded-full w-fit">Shipment ID: {ship._id.slice(-8).toUpperCase()}</p>
                             <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{ship.orderId?.name || "Premium Shipment"}</h3>
                             <p className="text-slate-400 text-xs font-bold italic mt-1 font-sans">Destination: {ship.orderId?.shippingAddress?.street}, {ship.orderId?.shippingAddress?.city}</p>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-2xl h-fit shadow-inner">
                             <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest opacity-60">Status: {ship.status}</span>
                          </div>
                       </div>
                       
                       <div className="flex flex-col sm:flex-row items-center gap-4">
                          {activeShipmentId === ship._id ? (
                             <button 
                               onClick={handleSimulateGPS}
                               disabled={isTracking}
                               className="w-full sm:w-auto px-10 py-5 bg-green-600 rounded-3xl font-black text-white text-xs uppercase tracking-widest shadow-2xl shadow-green-600/30 hover:bg-green-700 transition-all active:scale-95"
                             >Sync GPS Tracker</button>
                          ) : (
                             <button 
                               onClick={() => handleAccept(ship._id)}
                               disabled={isAccepting}
                               className="w-full sm:w-auto px-10 py-5 bg-indigo-600 rounded-3xl font-black text-white text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-95"
                             >Accept Shipment Request</button>
                          )}
                          <button className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 rounded-3xl font-black text-slate-900 text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">Route Specifications</button>
                       </div>
                    </div>
                 )) : (
                    <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-[3rem]">
                       <p className="text-slate-400 font-bold uppercase tracking-widest text-sm italic">Scanning for local shipment requests...</p>
                    </div>
                 )}
              </div>
           </div>

           {/* Earnings & Stats */}
           <div className="space-y-8">
              <div className="bg-white border-2 border-indigo-600 rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-600/10 relative overflow-hidden group">
                 <div className="relative z-10 text-center">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">Real-Time Daily Yield</p>
                    <h3 className="text-5xl font-black mb-1 text-slate-900 tracking-tighter">{balance.toLocaleString()} <span className="text-sm font-normal text-slate-400 italic">TK</span></h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">Fixed Delivery Fee: 40 TK/Order</p>
                 </div>
                 <div className="absolute top-[-20%] left-[-20%] w-full h-full bg-indigo-50/50 rounded-full blur-[80px] pointer-events-none" />
              </div>

              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm relative group overflow-hidden">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 px-3 py-1 bg-slate-50 rounded-full w-fit">In-Transit Security</h4>
                 <div className="flex items-center gap-5 p-5 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 relative z-10">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-50">
                       <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-3.652A14.99 14.99 0 0110 11.536M12 11a14.99 14.99 0 013.193 10.418m-3.193-10.418a14.954 14.954 0 013.44-8.09M12 11c0-3.517 1.009-6.799 2.753-9.571m3.44 3.652A14.99 14.99 0 0114 10.464M12 11a14.99 14.99 0 01-3.193-10.418m3.193 10.418a14.954 14.954 0 01-3.44 8.09" /></svg>
                    </div>
                    <div>
                       <span className="text-xs font-black text-slate-900 uppercase tracking-tight">2FA Secured</span>
                       <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">MANDATORY ACTIVE</p>
                    </div>
                 </div>
                 <div className="absolute bottom-[-10%] right-[-10%] opacity-[0.05] pointer-events-none text-slate-400">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}
