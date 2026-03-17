"use client";

import { useGetPartnerDashboardQuery, useGetPartnerVendorsQuery, useSetCommissionMutation, useAssignPartnerCategoryMutation } from "@/modules/business/services/businessApi";
import { useAssignOrderMutation, useGetAvailableShipmentsQuery } from "@/modules/logistics/services/logisticsApi";
import { useState, useEffect } from "react";

export default function PartnerDashboard() {
  const { data: dashboardData } = useGetPartnerDashboardQuery({});
  const { data: vendorsData, refetch: refetchVendors } = useGetPartnerVendorsQuery({});
  const { data: shipmentsData } = useGetAvailableShipmentsQuery({});
  const [setCommission, { isLoading: isSettingCommission }] = useSetCommissionMutation();
  const [assignOrder, { isLoading: isAssigning }] = useAssignOrderMutation();

  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [commissionVal, setCommissionVal] = useState("");

  useEffect(() => {
    if (dashboardData) console.log("Partner Dashboard - Stats:", dashboardData);
    if (vendorsData) console.log("Partner Dashboard - Vendors:", vendorsData);
    if (shipmentsData) console.log("Partner Dashboard - Shipments:", shipmentsData);
  }, [dashboardData, vendorsData, shipmentsData]);

  const handleSetCommission = async (vendorId: string) => {
    try {
      console.log("Setting commission for vendor:", { vendorId, rate: commissionVal });
      await setCommission({ vendorId, rate: Number(commissionVal) }).unwrap();
      alert("Commission updated!");
      refetchVendors();
      setCommissionVal("");
      setSelectedVendor(null);
    } catch (err) {
      console.error("Commission update failed:", err);
    }
  };

  const handleAssign = async (shipmentId: string, deliveryBoyId: string) => {
    try {
      console.log("Assigning shipment to delivery boy:", { shipmentId, deliveryBoyId });
      await assignOrder({ shipmentId, deliveryBoyId }).unwrap();
      alert("Shipment assigned!");
    } catch (err) {
      console.error("Assignment failed:", err);
    }
  };

  const stats = dashboardData?.data || { totalVendors: 0, activeShipments: 0, partnerEarnings: 0 };
  const vendors = vendorsData?.data?.vendors || [];
  const shipments = shipmentsData?.data?.shipments || [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
            <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900 uppercase">Partner Command</h1>
            <p className="text-slate-500 font-bold italic text-sm tracking-wide">Regional orchestration and multi-vendor lifecycle management.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm transition-all group">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Partner Cumulative Yield</p>
              <h3 className="text-4xl font-black mb-2 tracking-tighter text-slate-900">{stats.partnerEarnings?.toLocaleString()} <span className="text-sm font-normal text-slate-400 italic">TK</span></h3>
              <p className="text-indigo-600 text-[10px] font-black uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded-full w-fit">Performance Tier 1</p>
           </div>
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm transition-all">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Managed Merchants</p>
              <h3 className="text-4xl font-black mb-2 tracking-tighter text-slate-900">{vendors.length} <span className="text-sm font-normal text-slate-400 italic">Shops</span></h3>
              <p className="text-orange-500 text-[10px] font-black uppercase tracking-wider bg-orange-50 px-2 py-1 rounded-full w-fit">Regional Reach</p>
           </div>
           <div className="bg-white border-2 border-indigo-600 rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-600/5 group relative overflow-hidden">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">Active Logistics Load</p>
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100">
                    <span className="text-xl font-black text-indigo-600">{shipments.length}</span>
                 </div>
                 <div>
                    <h3 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Pending Handover</h3>
                    <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">Awaiting Assignment</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           {/* Vendor Management */}
           <section className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
              <h2 className="text-xl font-black mb-8 border-l-4 border-indigo-600 pl-4 uppercase tracking-tighter">Merchant Governance</h2>
              <div className="space-y-6">
                 {vendors.length > 0 ? vendors.map((vendor: any) => (
                    <div key={vendor._id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100/50 hover:bg-white transition-all group">
                       <div className="flex justify-between gap-4 mb-4">
                          <div>
                             <p className="font-black text-sm uppercase tracking-tight text-slate-900">{vendor.shopName}</p>
                             <p className="text-[10px] text-slate-400 font-black tracking-widest">{vendor.category?.name || "General Merchant"}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Commission</p>
                             <p className="font-black text-sm text-slate-900">{vendor.commissionRate}%</p>
                          </div>
                       </div>
                       
                       {selectedVendor === vendor._id ? (
                          <div className="flex gap-2 animate-in fade-in slide-in-from-top-2">
                             <input 
                               type="number" 
                               value={commissionVal}
                               onChange={(e) => setCommissionVal(e.target.value)}
                               placeholder="New Rate %" 
                               className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black outline-none focus:border-indigo-500"
                             />
                             <button 
                                onClick={() => handleSetCommission(vendor._id)}
                                disabled={isSettingCommission}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                             >Update</button>
                             <button onClick={() => setSelectedVendor(null)} className="px-6 py-2 bg-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest">X</button>
                          </div>
                       ) : (
                          <button 
                             onClick={() => setSelectedVendor(vendor._id)}
                             className="w-full py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:border-indigo-100 transition-all"
                          >Configure Metrics</button>
                       )}
                    </div>
                 )) : (
                    <div className="text-center py-10 opacity-50 italic text-xs font-bold uppercase tracking-widest">No merchants found in this region.</div>
                 )}
              </div>
           </section>

           {/* Logistics Orchestration */}
           <section className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm text-slate-900">
              <h2 className="text-xl font-black mb-8 border-l-4 border-indigo-600 pl-4 uppercase tracking-tighter">Shipment Dispatch</h2>
              <div className="space-y-6">
                 {shipments.length > 0 ? shipments.map((ship: any) => (
                    <div key={ship._id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100/50 hover:bg-white transition-all group">
                       <div className="flex justify-between items-center mb-6">
                          <div>
                             <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">UNASSIGNED SHIPMENT</p>
                             <p className="font-black text-sm uppercase tracking-tight text-slate-900">REF: {ship._id.slice(-8).toUpperCase()}</p>
                          </div>
                          <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-100 px-3 py-1 rounded-lg">{ship.status}</span>
                       </div>
                       
                       <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl mb-4">
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Route Detail</p>
                          <p className="text-xs font-bold text-slate-700 italic">{ship.orderId?.shippingAddress?.street}, {ship.orderId?.shippingAddress?.city}</p>
                       </div>

                       <div className="flex gap-2">
                          <select className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none shadow-sm focus:border-indigo-500">
                             <option>Select Delivery Agent</option>
                             <option>Agent: Rahim (Active)</option>
                             <option>Agent: Karim (Nearby)</option>
                          </select>
                          <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-95 transition-all shadow-lg shadow-indigo-600/20">Handover</button>
                       </div>
                    </div>
                 )) : (
                    <div className="text-center py-10 opacity-50 italic text-xs font-bold uppercase tracking-widest">Scanning logistics queue for unassigned loads...</div>
                 )}
              </div>
           </section>
        </div>
      </div>
    </main>
  );
}
