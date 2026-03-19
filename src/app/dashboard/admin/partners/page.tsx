"use client";

import { useEffect } from "react";
import { Users, Search, Filter, ChevronRight, LayoutGrid, ShieldAlert, Plus } from "lucide-react";
import { useGetPartnersQuery } from "@/store/api/partnerApi";

export default function PartnersPage() {
  const { data: partnersData, isLoading } = useGetPartnersQuery({});

  useEffect(() => {
    console.log("Admin Partners Page - [STATE]:", { partnersData, isLoading });
    if (partnersData) console.log("Admin Partners Page - [QUERY] All Partners Data:", partnersData);
  }, [partnersData, isLoading]);

  // Handle both { data: { partners: [...] } } and { data: [...] } structures
  const partners = Array.isArray(partnersData?.data) 
    ? partnersData.data 
    : partnersData?.data?.partners || [];

  return (
    <>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-black tracking-tight mb-1 text-slate-900 uppercase leading-none">Global Partner Network</h1>
          <p className="text-slate-500 font-bold italic text-[10px] tracking-wide">Strategic regional operational entities and category ownership.</p>
        </div>
        <button 
          onClick={() => window.location.href='/dashboard/admin/partners/create'}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95"
        >
          <Plus size={14} />
          Register Partner
        </button>
      </header>

      <section className="text-slate-900">
         <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xs font-black border-l-2 border-emerald-600 pl-3 uppercase tracking-tighter mb-1">Partner Directory</h2>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold ml-3">Ecosystem-wide partner surveillance</p>
            </div>
            <div className="flex gap-2">
               <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-emerald-600 transition-colors"><Search size={14} /></button>
               <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-emerald-600 transition-colors"><Filter size={14} /></button>
            </div>
         </div>
         
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-slate-50 border border-slate-100 rounded-[32px] p-6 animate-pulse h-48" />
              ))
            ) : partners.length > 0 ? partners.map((partner: any, i: number) => {
              const name = partner.userId?.name || partner.name || "System Partner";
              const email = partner.userId?.email || partner.email;
              const status = partner.userId?.status || partner.status || "Unknown";
              
              return (
                <div key={partner._id || i} className="group bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs uppercase shadow-lg shadow-slate-900/10">
                        {name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">{name}</p>
                        <p className="text-[9px] text-slate-400 font-bold tracking-tight lowercase">{email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                       {status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <LayoutGrid size={10} />
                        Assigned Sectors
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {partner.assignedCategories?.length > 0 ? partner.assignedCategories.map((cat: any) => (
                          <span key={cat._id} className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 text-[8px] font-black uppercase tracking-tighter hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 transition-all">
                            {cat.name}
                          </span>
                        )) : (
                          <span className="text-[9px] text-slate-300 italic font-bold">General Operations</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50 flex justify-between items-center mt-auto">
                        <div className="flex -space-x-1.5">
                           {[1,2,3].map(j => <div key={j} className="w-5 h-5 rounded-full border-2 border-white bg-slate-100" />)}
                        </div>
                        <button className="text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                           Audit Logs <ChevronRight size={10} />
                        </button>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full py-16 text-center">
                <p className="text-[10px] uppercase font-bold text-slate-400 italic mb-4">No regional partners detected in registry.</p>
                <button onClick={() => window.location.href='/dashboard/admin/partners/create'} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                  Onboard Initial Partner
                </button>
              </div>
            )}
          </div>
      </section>
    </>
  );
}
