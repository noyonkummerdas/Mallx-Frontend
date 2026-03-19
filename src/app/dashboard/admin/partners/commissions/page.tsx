"use client";

import { useState } from "react";
import { TrendingUp, ShieldCheck, DollarSign, Percent, AlertCircle } from "lucide-react";
import { useGetPartnersQuery, useSetCommissionMutation } from "@/modules/business/services/businessApi";
import { useGetCategoriesQuery } from "@/modules/catalog/services/catalogApi";

export default function AdminPartnerCommissionsPage() {
  const { data: partnersData } = useGetPartnersQuery({});
  const { data: categoriesData } = useGetCategoriesQuery({});
  const [setCommission, { isLoading: isSubmitting }] = useSetCommissionMutation();

  const [form, setForm] = useState({ partnerId: "", categoryId: "", percentage: 0 });

  const partners = partnersData?.data?.partners || [];
  const categories = categoriesData?.data?.categories || [];

  const handleCommit = async () => {
    try {
      await setCommission(form).unwrap();
      alert("Commission rates updated successfully");
    } catch (err: any) {
      alert("Update failed: " + err.data?.message);
    }
  };

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Taxation & Commission Protocol</h1>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">Define multi-tier revenue sharing across regional verticals</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-slate-900">
        {/* Rate Configuration */}
        <section className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm h-fit">
           <h2 className="text-xs font-black border-l-2 border-emerald-600 pl-3 uppercase tracking-tighter mb-8 font-mono text-emerald-900">Rate Commitment</h2>
           
           <div className="space-y-6">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Operational Partner</label>
                <select 
                  value={form.partnerId}
                  onChange={(e) => setForm({...form, partnerId: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-[10px] font-bold text-slate-900 shadow-inner"
                >
                   <option value="">Select Entity</option>
                   {partners.map((p: any) => (
                      <option key={p._id} value={p._id}>{p.userId?.name}</option>
                   ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Category Target</label>
                <select 
                   value={form.categoryId}
                   onChange={(e) => setForm({...form, categoryId: e.target.value})}
                   className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-[10px] font-bold text-slate-900 shadow-inner"
                >
                   <option value="">Select Domain</option>
                   {categories.map((c: any) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                   ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Commission Percentage (%)</label>
                <div className="relative">
                   <input 
                      type="number" 
                      value={form.percentage}
                      onChange={(e) => setForm({...form, percentage: Number(e.target.value)})}
                      placeholder="e.g. 15"
                      className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 pl-10 text-[10px] font-black text-slate-900 shadow-inner"
                   />
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                      <Percent size={12} />
                   </div>
                </div>
              </div>

              <button 
                onClick={handleCommit}
                disabled={isSubmitting}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 mt-4"
              >
                 <ShieldCheck size={14} />
                 {isSubmitting ? "Updating Protocol..." : "Commit Rate Change"}
              </button>
           </div>
        </section>

        {/* Global Rate Matrix */}
        <section className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-black border-l-2 border-slate-900 pl-3 uppercase tracking-tighter font-mono">Platform Revenue Matrix</h2>
              <div className="flex gap-2">
                 <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase rounded-lg border border-emerald-100 italic">Audit Ready</div>
              </div>
           </div>

           <div className="space-y-4">
              {[
                { partner: "Dhaka Logistics", category: "Electronics", rate: "12%", status: "Active" },
                { partner: "Chittagong Ops", category: "Fashion", rate: "15%", status: "Pending Fix" },
                { partner: "Sylhet Express", category: "Groceries", rate: "8%", status: "Active" },
              ].map((row, i) => (
                 <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-100 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-emerald-600 shadow-sm">
                          <DollarSign size={16} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-900 uppercase leading-none mb-1">{row.partner} <span className="text-slate-300 mx-1">/</span> {row.category}</p>
                          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Revenue Sharing Protocol</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-8 text-right min-w-[150px]">
                       <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Global Rate</p>
                          <p className="text-[12px] font-black text-slate-900 uppercase tracking-tighter">{row.rate}</p>
                       </div>
                       <div className="hidden sm:block">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Verification</p>
                          <div className={`text-[9px] font-black uppercase tracking-tight flex items-center gap-1 ${row.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'}`}>
                             {row.status === 'Active' ? <ShieldCheck size={10} /> : <AlertCircle size={10} />}
                             {row.status}
                          </div>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
}
