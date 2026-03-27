"use client";

import { useEffect, useState } from "react";
import { Users, Search, Filter, ChevronRight, LayoutGrid, ShieldAlert, Plus, Zap, Store } from "lucide-react";
import { useGetPartnersQuery, useUpdatePartnerMutation, useUploadPartnerPhotoMutation, useGetPartnerByIdQuery } from "@/store/api/partnerApi";
import { Camera, Save, Phone, Mail, Building2, Pencil, X } from "lucide-react";

export default function PartnersPage() {
  const { data: partnersData, isLoading, isFetching, isSuccess, refetch } = useGetPartnersQuery({});
  const [updatePartner, { isLoading: isUpdating }] = useUpdatePartnerMutation();
  const [uploadPhoto, { isLoading: isUploading }] = useUploadPartnerPhotoMutation();
  
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const { data: detailData, isLoading: isDetailLoading } = useGetPartnerByIdQuery(selectedPartnerId, { skip: !selectedPartnerId });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ businessName: "", phone: "" });
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (detailData?.data) {
      setSelectedPartner(detailData.data);
    }
  }, [detailData]);

  useEffect(() => {
    if (selectedPartner) {
      setEditForm({
        businessName: selectedPartner.businessName || "",
        phone: selectedPartner.userId?.phone || ""
      });
    }
  }, [selectedPartner]);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);
  const partners = isSuccess ? (Array.isArray(partnersData?.data) ? partnersData.data : (partnersData?.data?.partners || [])) : [];
  const showSkeleton = isLoading || (isFetching && partners.length === 0);

  const handleUpdate = async () => {
    try {
      await updatePartner({ id: selectedPartner._id, ...editForm }).unwrap();
      setStatusMessage({ type: 'success', text: "Partner updated successfully" });
      setIsEditing(false);
      // Update selectedPartner local state to reflect changes without full refetch if possible, 
      // but the API invalidates 'Partner' so it should refresh.
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: "Update failed: " + (err.data?.message || err.message) });
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadPhoto({ id: selectedPartner._id, image: file }).unwrap();
      setStatusMessage({ type: 'success', text: "Profile photo updated" });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: "Photo upload failed: " + (err.data?.message || err.message) });
    }
  };

  return (
    <>
      {statusMessage && (
        <div className={`fixed top-8 right-8 z-[200] animate-in slide-in-from-right-10 duration-300 p-4 rounded-24 border-none flex items-center gap-3 max-w-sm ${
          statusMessage.type === 'success' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
        } shadow-2xl backdrop-blur-md`}>
          <div className={`p-2 rounded-xl ${statusMessage.type === 'success' ? 'bg-success/20' : 'bg-danger/20'}`}>
            <Zap size={16} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{statusMessage.text}</p>
        </div>
      )}
      {/* Detail Oversight Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-text-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in">
          <div className="bg-card border-none rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => { setSelectedPartner(null); setIsEditing(false); }}
              className="absolute top-6 right-6 p-2 hover:bg-section rounded-xl text-text-light hover:text-text-primary transition-all z-10"
            >
              <Plus size={20} className="rotate-45" />
            </button>
            
            <div className={`h-24 gradient-hero`} />
            
            <div className="px-8 pb-8 -mt-10 relative">
              <div className="relative group w-20 h-20 mb-4 ml-2">
                {selectedPartner.profilePhoto ? (
                  <img 
                    src={selectedPartner.profilePhoto} 
                    alt="Partner" 
                    className="w-20 h-20 rounded-3xl object-cover border-4 border-card shadow-xl"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-3xl bg-partner text-white flex items-center justify-center font-black text-2xl uppercase border-4 border-card shadow-xl">
                    {(selectedPartner.businessName || selectedPartner.userId?.name || "?").charAt(0)}
                  </div>
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-text-primary/40 text-white opacity-0 group-hover:opacity-100 rounded-3xl cursor-pointer transition-opacity">
                  <Camera size={20} />
                  <input type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
                </label>
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-card/60 rounded-3xl">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <div>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                          type="text" 
                          value={editForm.businessName}
                          onChange={(e) => setEditForm({...editForm, businessName: e.target.value})}
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:outline-none focus:border-indigo-600 transition-all"
                          placeholder="Business Name"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-black text-text-primary uppercase tracking-tighter leading-none mb-2 flex items-center gap-2">
                        {selectedPartner.businessName || selectedPartner.userId?.name || "System Partner"}
                        <button onClick={() => setIsEditing(true)} className="text-text-light hover:text-partner transition-colors">
                          <Pencil size={14} />
                        </button>
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-success/10 text-success rounded text-[10px] font-black uppercase tracking-widest">
                          {selectedPartner.userId?.status || selectedPartner.status || "PENDING"}
                        </span>
                        <span className="text-sm text-slate-400 font-bold lowercase tracking-tight flex items-center gap-1.5">
                          <Mail size={12} className="opacity-40" />
                          {selectedPartner.userId?.email || "internal@system.mallx"}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div className={`bg-section rounded-2xl p-4 border transition-all ${isEditing ? 'border-primary/20 bg-primary/5' : 'border-none'}`}>
                      <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <Phone size={10} />
                        Contact Line
                      </p>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editForm.phone}
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                          className="w-full bg-transparent border-none text-sm font-black text-text-primary p-0 focus:outline-none placeholder:text-text-light"
                          placeholder="88017..."
                        />
                      ) : (
                        <p className="text-sm font-black text-text-primary">{selectedPartner.userId?.phone || "No direct line"}</p>
                      )}
                   </div>
                   <div className="bg-section rounded-2xl p-4 border-none">
                      <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest mb-1">Commission Tier</p>
                      <p className="text-sm font-black text-success underline decoration-success/20">Standard 15%</p>
                   </div>
                </div>

                {!isEditing && (
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3 flex items-center gap-2 pl-1">
                        <LayoutGrid size={10} />
                        Assigned Sectors
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {selectedPartner.assignedCategories?.length > 0 ? selectedPartner.assignedCategories.map((cat: any) => (
                          <div key={cat._id || cat} className="px-3 py-1 bg-card border border-section rounded-xl text-[10px] font-black text-text-secondary uppercase tracking-tighter shadow-sm hover:border-primary/20 transition-all">
                            {cat.name || "N/A"}
                          </div>
                        )) : (
                          <div className="text-[10px] text-text-light font-black uppercase py-2 tracking-widest">Universal Operations</div>
                        )}
                    </div>
                  </div>
                )}

                {!isEditing && (
                  <div className="pt-6 border-t border-slate-100 space-y-6">
                    <div>
                      <p className="text-[10px] text-text-light font-black uppercase tracking-widest mb-4 flex items-center gap-2 pl-1">
                        <Zap size={10} className="text-highlight" />
                        Business Performance
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-success/5 rounded-24 border border-success/10 shadow-sm relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 group-hover:scale-110 transition-transform">
                              <Store size={40} className="text-success" />
                           </div>
                           <p className="text-[9px] font-black text-success uppercase tracking-widest mb-1">Active Merchants</p>
                           <p className="text-2xl font-black text-text-primary tracking-tighter leading-none">
                              {selectedPartner.stats?.totalVendors || selectedPartner.vendors?.length || 0}
                           </p>
                        </div>
                        <div className="p-4 bg-primary/5 rounded-24 border border-primary/10 shadow-sm relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 -rotate-12 group-hover:scale-110 transition-transform">
                              <Zap size={40} className="text-primary" />
                           </div>
                           <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Order Volume</p>
                           <p className="text-2xl font-black text-text-primary tracking-tighter leading-none">
                              {selectedPartner.stats?.totalOrders || 0}
                           </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3 flex items-center gap-2 pl-1">
                          <Store size={10} />
                          Merchant Directory
                      </p>
                      {isDetailLoading ? (
                          <div className="py-4 text-center opacity-40 font-black uppercase tracking-widest text-[10px] animate-pulse">
                              Syncing Merchant Registry...
                          </div>
                      ) : selectedPartner.vendors?.length > 0 ? (
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                              {selectedPartner.vendors.map((vendor: any) => (
                                  <div key={vendor._id} className="group flex items-center justify-between p-3.5 bg-card rounded-24 border border-section hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all">
                                      <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-xl bg-section flex items-center justify-center text-text-light border-none group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                              <Store size={16} />
                                          </div>
                                          <div>
                                              <p className="text-[11px] font-black text-text-primary uppercase tracking-tight">{vendor.shopName}</p>
                                              <div className="flex items-center gap-2">
                                                <p className="text-[9px] font-bold text-text-secondary uppercase tracking-widest leading-none truncate max-w-[100px]">{vendor.userId?.name || "System Record"}</p>
                                                <span className="w-1 h-1 rounded-full bg-section" />
                                                <p className="text-[9px] font-bold text-text-light tracking-tight leading-none">{vendor.userId?.phone || "No direct line"}</p>
                                              </div>
                                          </div>
                                      </div>
                                      <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                                          vendor.status === 'Active' ? 'bg-success/10 text-success' : 'bg-section text-text-light'
                                      }`}>
                                          {vendor.status}
                                      </span>
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <div className="py-8 bg-slate-50/50 rounded-3xl border border-slate-100 border-dashed text-center">
                              <Store size={24} className="mx-auto text-slate-200 mb-2" />
                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No verified merchants on file</p>
                          </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-section flex gap-3">
                   {isEditing ? (
                     <>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-3.5 bg-section text-text-light rounded-24 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleUpdate}
                        disabled={isUpdating}
                        className="flex-3 py-3.5 gradient-hero text-white rounded-24 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        {isUpdating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={14} />}
                        Confirm Changes
                      </button>
                     </>
                   ) : (
                    <button 
                      onClick={() => setSelectedPartner(null)}
                      className="w-full py-3.5 bg-partner text-white rounded-24 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-partner/20 hover:brightness-110 transition-all active:scale-[0.98]"
                    >
                      Exit Oversight
                    </button>
                   )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black tracking-tighter mb-1 text-text-primary uppercase leading-none">Global Partner Network</h1>
          <p className="text-text-secondary font-bold text-sm tracking-wide">Strategic regional operational entities and category ownership.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => refetch()}
            className="p-3 bg-card border border-section text-text-light rounded-24 hover:text-primary transition-all active:rotate-180 duration-500 shadow-sm"
          >
            <Plus size={16} className="rotate-45" />
          </button>
          <button 
            onClick={() => window.location.href='/dashboard/admin/partners/create'}
            className="flex items-center gap-2 px-6 py-3 gradient-hero text-white rounded-24 text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/20 active:scale-95"
          >
            <Plus size={14} />
            Register Partner
          </button>
        </div>
      </header>

      <section className="text-text-primary">
         <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-base font-black border-l-4 border-primary pl-4 uppercase tracking-tighter mb-1">Partner Directory</h2>
              <p className="text-[10px] text-text-light uppercase tracking-widest font-black ml-4">Ecosystem-wide partner surveillance</p>
            </div>
         </div>
         
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {showSkeleton ? (
               [1, 2, 3].map(i => (
                <div key={i} className="bg-slate-50 border border-slate-100 rounded-[32px] p-6 animate-pulse">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 shadow-sm" />
                       <div className="space-y-2">
                         <div className="h-3 w-24 bg-slate-100 rounded-md" />
                         <div className="h-2.5 w-32 bg-slate-100/50 rounded-md" />
                       </div>
                    </div>
                    <div className="h-4 w-12 bg-slate-100 rounded-md" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 w-20 bg-slate-100 rounded-md" />
                    <div className="flex gap-2">
                       <div className="h-5 w-16 bg-slate-100 rounded-lg" />
                       <div className="h-5 w-16 bg-slate-100 rounded-lg" />
                    </div>
                  </div>
                </div>
               ))
             ) : partners.length > 0 ? partners.map((partner: any, i: number) => {
              const name = partner.businessName || partner.userId?.name || partner.name || "System Partner";
              const email = partner.userId?.email || partner.email || "No Email";
              const status = partner.userId?.status || partner.status || "Unknown";
              
               return (
                <div key={partner._id || i} className="group mall-card p-6 border-none">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-2xl bg-partner text-white flex items-center justify-center font-black text-sm uppercase shadow-lg shadow-partner/20 shrink-0 group-hover:scale-110 transition-transform">
                        {name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-text-primary uppercase tracking-tighter leading-none mb-1 truncate">{name}</p>
                        <p className="text-[10px] text-text-light font-black tracking-[0.1em] lowercase truncate">{email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shrink-0 ${status === 'Active' ? 'bg-success/10 text-success' : 'bg-section text-text-light'}`}>
                       {status}
                    </span>
                  </div>

                   <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black text-text-light uppercase tracking-widest mb-3 flex items-center gap-1.5 opacity-60">
                        <LayoutGrid size={10} />
                        Assigned Sectors
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                         {partner.assignedCategories?.length > 0 ? partner.assignedCategories.slice(0, 3).map((cat: any) => (
                          <span key={cat._id || cat} className="px-2 py-1 rounded-lg bg-section border border-card text-text-secondary text-[9px] font-black uppercase tracking-tighter">
                            {cat.name || "Sector"}
                          </span>
                        )) : (
                          <span className="text-[9px] text-text-light font-black uppercase tracking-widest">General Ops</span>
                        )}
                        {partner.assignedCategories?.length > 3 && (
                          <span className="text-[9px] text-text-light font-black uppercase">+{partner.assignedCategories.length - 3}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-section">
                          <Store size={10} className="text-text-light" />
                          <span className="text-[9px] text-text-light font-black uppercase tracking-widest">
                              {partner.vendorCount || 0} Connected Merchants
                          </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-section flex justify-between items-center mt-auto">
                        <button 
                          onClick={() => { setSelectedPartner(partner); setSelectedPartnerId(partner._id); }}
                          className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
                        >
                           Inspect Partner <ChevronRight size={10} />
                        </button>
                        <button className="text-[10px] font-black text-text-light uppercase tracking-widest hover:text-text-primary flex items-center gap-1">
                           Logs <ChevronRight size={10} />
                        </button>
                    </div>
                  </div>
                </div>
              );
             }) : isSuccess && partners.length === 0 ? (
               <div className="col-span-full py-24 text-center">
                <Store size={48} className="mx-auto text-section mb-4" />
                <p className="text-[10px] uppercase font-black text-text-light mb-6 tracking-[0.2em]">No regional partners detected in registry.</p>
                <button onClick={() => window.location.href='/dashboard/admin/partners/create'} className="px-8 py-3 gradient-hero text-white rounded-24 text-[11px] font-black uppercase tracking-widest hover:brightness-110 shadow-xl shadow-primary/20 transition-all">
                  Onboard Initial Partner
                </button>
              </div>
            ) : null}
          </div>
      </section>
    </>
  );
}
