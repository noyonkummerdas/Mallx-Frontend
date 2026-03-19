"use client";

import { useEffect, useState } from "react";
import { Users, Search, Filter, ChevronRight, LayoutGrid, ShieldAlert, Plus } from "lucide-react";
import { useGetPartnersQuery } from "@/store/api/partnerApi";

export default function PartnersPage() {
  const { data: partnersData, isLoading, isFetching, isSuccess, refetch } = useGetPartnersQuery({});
  const [selectedPartner, setSelectedPartner] = useState<any>(null);

  // Robust data extraction
  const partners = isSuccess ? (Array.isArray(partnersData?.data) ? partnersData.data : (partnersData?.data?.partners || [])) : [];
  const showSkeleton = isLoading || (isFetching && partners.length === 0);

  return (
    <>
      {/* Detail Oversight Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedPartner(null)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all z-10"
            >
              <Plus size={20} className="rotate-45" />
            </button>
            
            <div className="h-24 bg-gradient-to-r from-emerald-600 to-indigo-600" />
            
            <div className="px-8 pb-8 -mt-10 relative">
              <div className="w-20 h-20 rounded-3xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl uppercase border-4 border-white shadow-xl mb-4 ml-2">
                {(selectedPartner.businessName || selectedPartner.userId?.name || "?").charAt(0)}
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">
                    {selectedPartner.businessName || selectedPartner.userId?.name || "System Partner"}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black uppercase tracking-widest">
                      {selectedPartner.userId?.status || selectedPartner.status || "PENDING"}
                    </span>
                    <span className="text-sm text-slate-400 font-bold lowercase tracking-tight">
                      {selectedPartner.userId?.email || "internal@system.mallx"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Contact Priority</p>
                      <p className="text-sm font-black text-slate-900">{selectedPartner.userId?.phone || "No direct line"}</p>
                   </div>
                   <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Commission Tier</p>
                      <p className="text-sm font-black text-emerald-600">Standard 15%</p>
                   </div>
                </div>

                <div>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3 flex items-center gap-2 pl-1">
                      <LayoutGrid size={10} />
                      Assigned Sectors
                   </p>
                   <div className="flex flex-wrap gap-2">
                      {selectedPartner.assignedCategories?.length > 0 ? selectedPartner.assignedCategories.map((cat: any) => (
                        <div key={cat._id || cat} className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 uppercase tracking-tighter shadow-sm">
                          {cat.name || "N/A"}
                        </div>
                      )) : (
                        <div className="text-sm text-slate-300 font-bold uppercase py-2 tracking-widest">Universal Operations</div>
                      )}
                   </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                   <button 
                    onClick={() => setSelectedPartner(null)}
                    className="w-full py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-[0.98]"
                   >
                     Exit Oversight
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-base font-black tracking-tight mb-1 text-slate-900 uppercase leading-none">Global Partner Network</h1>
          <p className="text-slate-500 font-bold text-sm tracking-wide">Strategic regional operational entities and category ownership.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => refetch()}
            className="p-3 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-emerald-600 transition-all active:rotate-180 duration-500 shadow-sm"
          >
            <Plus size={16} className="rotate-45" />
          </button>
          <button 
            onClick={() => window.location.href='/dashboard/admin/partners/create'}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95"
          >
            <Plus size={14} />
            Register Partner
          </button>
        </div>
      </header>

      <section className="text-slate-900">
         <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-base font-black border-l-2 border-emerald-600 pl-3 uppercase tracking-tighter mb-1">Partner Directory</h2>
              <p className="text-sm text-slate-400 uppercase tracking-widest font-black ml-3">Ecosystem-wide partner surveillance</p>
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
                <div key={partner._id || i} className="group bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm uppercase shadow-lg shadow-slate-900/10 shrink-0">
                        {name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tighter leading-none mb-1 truncate">{name}</p>
                        <p className="text-sm text-slate-400 font-black tracking-tight lowercase truncate">{email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest shrink-0 ${status === 'Active' || status === 'Pending' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                       {status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 opacity-60">
                        <LayoutGrid size={10} />
                        Assigned Sectors
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                         {partner.assignedCategories?.length > 0 ? partner.assignedCategories.slice(0, 3).map((cat: any) => (
                          <span key={cat._id || cat} className="px-2 py-0.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-tighter">
                            {cat.name || "Sector"}
                          </span>
                        )) : (
                          <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">General Ops</span>
                        )}
                        {partner.assignedCategories?.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-black uppercase">+{partner.assignedCategories.length - 3}</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50 flex justify-between items-center mt-auto">
                        <button 
                          onClick={() => setSelectedPartner(partner)}
                          className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1"
                        >
                           Inspect Partner <ChevronRight size={10} />
                        </button>
                        <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 flex items-center gap-1">
                           Logs <ChevronRight size={10} />
                        </button>
                    </div>
                  </div>
                </div>
              );
             }) : isSuccess && partners.length === 0 ? (
               <div className="col-span-full py-16 text-center">
                <p className="text-sm uppercase font-black text-slate-400 mb-4">No regional partners detected in registry.</p>
                <button onClick={() => window.location.href='/dashboard/admin/partners/create'} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                  Onboard Initial Partner
                </button>
              </div>
            ) : null}
          </div>
      </section>
    </>
  );
}
