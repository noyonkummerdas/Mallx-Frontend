"use client";

import { useGetPartnerDashboardQuery, useGetPartnerVendorsQuery, useSetCommissionMutation, useAssignPartnerCategoryMutation } from "@/modules/business/services/businessApi";
import { useAssignOrderMutation, useGetAvailableShipmentsQuery } from "@/modules/logistics/services/logisticsApi";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

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
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar role="partner" />
      
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
<header className="mb-8">
    <h1 className="text-lg tracking-tight mb-1 text-slate-900 uppercase">Partner Hub</h1>
    <p className="text-slate-500 text-[10px] tracking-wide">Regional orchestration and merchant governance.</p>
</header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-slate-900">
           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm group">
              <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-2">Partner Yield</p>
              <h3 className="text-xl mb-1 tracking-tighter">{stats.partnerEarnings?.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">TK</span></h3>
              <p className="text-slate-900 text-[8px] uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full w-fit">Tier 1</p>
           </div>
           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-2">Merchants</p>
              <h3 className="text-xl mb-1 tracking-tighter">{vendors.length} <span className="text-[10px] font-normal text-slate-400">Shops</span></h3>
              <p className="text-orange-500 text-[8px] uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-full w-fit">Regional</p>
           </div>
           <div className="bg-white border border-slate-900 rounded-2xl p-6 shadow-md group relative overflow-hidden">
              <p className="text-[9px] text-slate-900 uppercase tracking-widest mb-2">Logistics Load</p>
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                    <span className="text-sm text-slate-900">{shipments.length}</span>
                 </div>
                 <div>
                    <h3 className="text-xs tracking-tighter text-slate-900 uppercase">Pending</h3>
                    <p className="text-slate-400 text-[8px] uppercase tracking-widest leading-none">Awaiting Assignment</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-slate-900">
           {/* Vendor Management */}
           <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h2 className="text-xs mb-6 border-l-2 border-slate-900 pl-3 uppercase tracking-tighter">Governance</h2>
              <div className="space-y-4">
                 {vendors.length > 0 ? vendors.map((vendor: any) => (
                    <div key={vendor._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white transition-all group">
                       <div className="flex justify-between gap-3 mb-3">
                          <div>
                             <p className="text-xs uppercase tracking-tight text-slate-900">{vendor.shopName}</p>
                             <p className="text-[9px] text-slate-400 tracking-widest">{vendor.category?.name || "General Merchant"}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[8px] text-slate-900 uppercase tracking-widest leading-none">Rate</p>
                             <p className="text-xs text-slate-900">{vendor.commissionRate}%</p>
                          </div>
                       </div>
                       
                       {selectedVendor === vendor._id ? (
                          <div className="flex gap-2">
                             <input 
                                type="number" 
                                value={commissionVal}
                                onChange={(e) => setCommissionVal(e.target.value)}
                                placeholder="%" 
                                className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] outline-none focus:border-slate-900"
                             />
                             <button 
                                onClick={() => handleSetCommission(vendor._id)}
                                disabled={isSettingCommission}
                                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] uppercase tracking-widest"
                             >Set</button>
                             <button onClick={() => setSelectedVendor(null)} className="px-2 py-1.5 bg-slate-200 rounded-lg text-[9px]">✕</button>
                          </div>
                       ) : (
                          <button 
                             onClick={() => setSelectedVendor(vendor._id)}
                             className="w-full py-1.5 bg-white border border-slate-200 rounded-lg text-[9px] uppercase tracking-widest hover:bg-slate-100 transition-all shadow-sm"
                          >Configure</button>
                       )}
                    </div>
                 )) : (
                    <div className="text-center py-6 opacity-50 italic text-[9px] font-black uppercase tracking-widest">No merchants.</div>
                 )}
              </div>
           </section>

           {/* Logistics Orchestration */}
           <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-slate-900">
              <h2 className="text-xs mb-6 border-l-2 border-slate-900 pl-3 uppercase tracking-tighter">Dispatch Queue</h2>
              <div className="space-y-4">
                 {shipments.length > 0 ? shipments.map((ship: any) => (
                    <div key={ship._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white transition-all group">
                       <div className="flex justify-between items-center mb-4">
                          <div>
                             <p className="text-[8px] text-slate-900 uppercase tracking-widest leading-none mb-1">UNASSIGNED</p>
                             <p className="text-xs uppercase tracking-tight text-slate-900">REF: {ship._id.slice(-6).toUpperCase()}</p>
                          </div>
                          <span className="text-[8px] text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-lg">{ship.status}</span>
                       </div>
                       
                       <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl mb-3">
                          <p className="text-[8px] text-slate-400 uppercase tracking-widest mb-1">Route Detail</p>
                          <p className="text-[10px] text-slate-700 leading-tight truncate">{ship.orderId?.shippingAddress?.street}</p>
                       </div>

                       <div className="flex gap-2">
                          <select className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] uppercase tracking-widest outline-none shadow-sm focus:border-slate-900">
                             <option>Select Agent</option>
                             <option>Agent: Rahim</option>
                          </select>
                          <button className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] uppercase tracking-widest hover:scale-95 transition-all shadow-lg shadow-indigo-600/20">Assign</button>
                       </div>
                    </div>
                 )) : (
                    <div className="text-center py-6 opacity-50 italic text-[9px] uppercase tracking-widest">Queue Clear.</div>
                 )}
              </div>
           </section>
        </div>
        </div>
      </main>
    </div>
  );
}
