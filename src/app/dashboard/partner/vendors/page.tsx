"use client";

import { useGetPartnerVendorsQuery, useSetCommissionMutation, useUpdateVendorStatusMutation } from "@/modules/business/services/businessApi";
import { Store, User, Mail, Phone, ShieldCheck, Clock, ExternalLink, Settings2, Search, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function PartnerVendorsPage() {
  const { data: vendorsData, isLoading } = useGetPartnerVendorsQuery({});
  const [setCommission, { isLoading: isSettingCommission }] = useSetCommissionMutation();
  const [updateVendorStatus, { isLoading: isUpdatingStatus }] = useUpdateVendorStatusMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [commissionVal, setCommissionVal] = useState("");

  const vendors = vendorsData?.data?.vendors || [];
  const filteredVendors = vendors.filter((v: any) => 
    v.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateCommission = async (vendorId: string) => {
    try {
      await setCommission({ vendorId, rate: Number(commissionVal) }).unwrap();
      alert("Commission updated!");
      setSelectedVendorId(null);
      setCommissionVal("");
    } catch (err) {
      alert("Failed to update commission");
    }
  };

  const handleUpdateStatus = async (vendorId: string, status: string) => {
    try {
      await updateVendorStatus({ vendorId, status }).unwrap();
      alert(`Vendor marked as ${status}`);
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'Pending': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'Blocked': return 'bg-red-500/10 text-red-600 border-red-200';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto text-slate-900">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link href="/dashboard/partner" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all flex items-center gap-1 mb-2">
            <ArrowLeft size={10} /> Back to Hub
          </Link>
          <h1 className="text-xl font-black tracking-tight mb-1 uppercase leading-none">Merchant Network</h1>
          <p className="text-slate-500 font-bold text-xs tracking-wide">Governance and performance oversight for your regional vendors.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                    type="text" 
                    placeholder="Search Merchants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all w-64 shadow-sm"
                />
            </div>
            <Link 
                href="/dashboard/partner/vendors/create"
                className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-slate-900/20"
            >
                Add Merchant
            </Link>
        </div>
      </header>

      {isLoading ? (
          <div className="text-center py-20 opacity-40 font-black uppercase tracking-[0.3em] animate-pulse">Synchronizing Data...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredVendors.length > 0 ? filteredVendors.map((vendor: any) => (
            <div key={vendor._id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                
                {/* Visual Identity */}
                <div className="flex items-center gap-4 min-w-[300px]">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:border-indigo-600/20 transition-all text-slate-900">
                        <Store size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">{vendor.shopName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 border rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusStyle(vendor.status)}`}>
                                {vendor.status}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                                {vendor.category?.name || "General"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Contact & Meta */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Account Holder</p>
                        <div className="flex items-center gap-2">
                            <User size={12} className="text-slate-400" />
                            <p className="text-[11px] font-bold text-slate-700">{vendor.userId?.name || "Unknown User"}</p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Communication</p>
                        <div className="flex items-center gap-3">
                            <Mail size={12} className="text-slate-400" />
                            <p className="text-[11px] font-bold text-slate-700">{vendor.userId?.email || "N/A"}</p>
                        </div>
                    </div>
                    <div className="space-y-1 hidden md:block">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Joined On</p>
                        <div className="flex items-center gap-2">
                            <Clock size={12} className="text-slate-400" />
                            <p className="text-[11px] font-bold text-slate-700">{new Date(vendor.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {/* Actions & Logistics */}
                <div className="flex items-center gap-4 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="bg-slate-50 p-3 rounded-2xl flex flex-col items-end min-w-[100px]">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Commission</p>
                        <p className="text-sm font-black text-slate-900">{vendor.commissionRate || 0}%</p>
                    </div>

                    <div className="flex gap-2">
                        {selectedVendorId === vendor._id ? (
                            <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl animate-in slide-in-from-right-4">
                                <input 
                                    type="number"
                                    value={commissionVal}
                                    onChange={(e) => setCommissionVal(e.target.value)}
                                    placeholder="%"
                                    className="w-14 bg-white border-none rounded-lg px-2 py-1.5 text-[10px] font-bold outline-none"
                                />
                                <button 
                                    onClick={() => handleUpdateCommission(vendor._id)}
                                    disabled={isSettingCommission}
                                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest"
                                >
                                    Apply
                                </button>
                                <button 
                                    onClick={() => setSelectedVendorId(null)}
                                    className="p-1.5 text-white/50 hover:text-white"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <button 
                                    onClick={() => setSelectedVendorId(vendor._id)}
                                    className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all text-slate-500 hover:text-slate-900 shadow-sm"
                                    title="Configure Commission"
                                >
                                    <Settings2 size={16} />
                                </button>
                                 <button 
                                    className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all text-slate-500 hover:text-slate-900 shadow-sm"
                                    title="View Shop Profile"
                                >
                                    <ExternalLink size={16} />
                                </button>
                                {vendor.status === 'Pending' && (
                                    <button 
                                        onClick={() => handleUpdateStatus(vendor._id, 'Active')}
                                        disabled={isUpdatingStatus}
                                        className="h-10 px-4 bg-green-600 text-white rounded-xl flex items-center justify-center hover:bg-green-700 transition-all text-[9px] font-black uppercase tracking-widest shadow-lg shadow-green-600/20 disabled:opacity-50"
                                    >
                                        Approve
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

              </div>
            </div>
          )) : (
            <div className="bg-white border border-slate-200 border-dashed rounded-[3rem] p-32 text-center">
                <Store size={48} className="mx-auto text-slate-200 mb-6" />
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Empty Network</h3>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-2">Zero active merchants registered in your hub.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const X = ({ size, className }: { size?: number, className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
)
