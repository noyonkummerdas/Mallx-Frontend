"use client";

import { useState } from "react";
import { Zap, Link as LinkIcon, ShoppingBag, Truck, ChevronRight } from "lucide-react";
import { useGetPartnersQuery, useAssignPartnerCategoryMutation } from "@/modules/business/services/businessApi";
import { useGetCategoriesQuery } from "@/modules/shopping/services/productApi";

export default function AdminPartnerMappingPage() {
  const { data: partnersData } = useGetPartnersQuery({});
  const { data: categoriesData } = useGetCategoriesQuery({});
  const [assignCategory, { isLoading: isAssigning }] = useAssignPartnerCategoryMutation();

  const [mapping, setMapping] = useState({ partnerId: "", categoryId: "" });

  const partners = partnersData?.data?.partners || [];
  const categories = categoriesData?.data || [];

  const handleAssign = async () => {
    try {
      await assignCategory(mapping).unwrap();
      alert("Partner linked to category successfully");
    } catch (err: any) {
      alert("Mapping failed: " + err.data?.message);
    }
  };

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-base font-black text-slate-900 uppercase tracking-tight">Strategic Category Ownership</h1>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Map logistical partners to specific marketplace verticals</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mapping Controls */}
        <section className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
           <h2 className="text-base font-black border-l-2 border-indigo-600 pl-3 uppercase tracking-tighter mb-8 font-mono text-indigo-900 leading-none">Vertical Assignment</h2>
           
           <div className="space-y-6">
              <div>
                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Logistical Partner</label>
                <select 
                  value={mapping.partnerId}
                  onChange={(e) => setMapping({...mapping, partnerId: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-black text-slate-900 shadow-inner"
                >
                   <option value="">Select Entity</option>
                   {partners.map((p: any) => (
                      <option key={p._id} value={p._id}>{p.userId?.name}</option>
                   ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Marketplace Category</label>
                <select 
                   value={mapping.categoryId}
                   onChange={(e) => setMapping({...mapping, categoryId: e.target.value})}
                   className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-black text-slate-900 shadow-inner"
                >
                   <option value="">Select Domain</option>
                   {categories.map((c: any) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                   ))}
                </select>
              </div>

              <button 
                onClick={handleAssign}
                disabled={isAssigning}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 mt-4"
              >
                 <Zap size={14} />
                 {isAssigning ? "Establishing Link..." : "Commence Mapping"}
              </button>
           </div>
        </section>

        {/* Current Matrix */}
        <section className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8 text-slate-900">
              <h2 className="text-base font-black border-l-2 border-slate-900 pl-3 uppercase tracking-tighter font-mono leading-none">Active Ownership Matrix</h2>
              <div className="px-3 py-1 bg-slate-900 text-white text-sm font-black uppercase rounded-lg">Operational Live</div>
           </div>

           <div className="space-y-3">
              {partners.filter((p: any) => p.assignedCategories?.length > 0).map((partner: any, i: number) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-100 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 shadow-sm">
                          <Truck size={16} />
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900 uppercase leading-none mb-1">{partner.userId?.name}</p>
                          <div className="flex flex-wrap gap-1">
                             {partner.assignedCategories.map((cat: any) => (
                                <span key={cat._id} className="text-sm font-black text-slate-400 bg-white border border-slate-100 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                                   {cat.name}
                                </span>
                             ))}
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="text-right">
                          <p className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none">Status</p>
                          <p className="text-sm font-black text-indigo-600 uppercase tracking-tight">Regulated</p>
                       </div>
                       <div className="p-2 text-slate-300 group-hover:text-indigo-600 transition-colors">
                          <ChevronRight size={14} />
                       </div>
                    </div>
                 </div>
              ))}
              {partners.filter((p: any) => p.assignedCategories?.length > 0).length === 0 && (
                 <div className="py-20 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-4">
                       <LinkIcon size={20} />
                    </div>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No ownership links established yet.</p>
                 </div>
              )}
           </div>
        </section>
      </div>
    </div>
  );
}
