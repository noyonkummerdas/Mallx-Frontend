"use client";

import { useState } from "react";
import { CreditCard, ShieldCheck, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { useConfigurePaymentMethodsMutation, useProcessRefundMutation } from "@/modules/business/services/businessApi";

export default function AdminPaymentsPage() {
  const [configureMethods, { isLoading: isConfiguring }] = useConfigurePaymentMethodsMutation();
  const [processRefund, { isLoading: isRefunding }] = useProcessRefundMutation();
  
  const [newMethod, setNewMethod] = useState({ name: "", provider: "COD", status: "Active" });

  const handleAddMethod = async () => {
    try {
      await configureMethods(newMethod).unwrap();
      alert("Payment Method Configured successfully");
    } catch (err: any) {
      alert("Configuration failed: " + err.data?.message);
    }
  };

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Fintech System Control</h1>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">Configure gateway credentials and settlement infrastructure</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Gateways */}
        <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xs font-black border-l-2 border-indigo-600 pl-3 uppercase tracking-tighter mb-1 font-mono text-indigo-900">Active Gateways</h2>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold ml-3">Merchant settlement channels</p>
              </div>
              <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Plus size={14} /></button>
           </div>

           <div className="space-y-4">
              {[
                { name: "Cash on Delivery", type: "Offline", status: "Active", icon: <CheckCircle2 size={12} className="text-emerald-500" /> },
                { name: "Stripe Connect", type: "Gateway", status: "Active", icon: <CheckCircle2 size={12} className="text-emerald-500" /> },
                { name: "SSLCommerz", type: "Regional", status: "Inactive", icon: <AlertCircle size={12} className="text-slate-300" /> }
              ].map((gateway, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-900 shadow-sm border border-slate-100">
                         <CreditCard size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-900 uppercase">{gateway.name}</p>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{gateway.type}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                         {gateway.icon}
                         <span className="text-[9px] font-black text-slate-900 uppercase tracking-tight">{gateway.status}</span>
                      </div>
                      <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Rapid Configuration */}
        <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm self-start">
           <h2 className="text-xs font-black border-l-2 border-slate-900 pl-3 uppercase tracking-tighter mb-8 font-mono">Gateway Initialization</h2>
           
           <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Method Identity</label>
                <input 
                  type="text" 
                  value={newMethod.name}
                  onChange={(e) => setNewMethod({...newMethod, name: e.target.value})}
                  placeholder="e.g. SSLCommerz" 
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-[10px] font-bold text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-slate-900 transition-all shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Service Provider</label>
                    <select 
                      value={newMethod.provider}
                      onChange={(e) => setNewMethod({...newMethod, provider: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-[10px] font-bold text-slate-900 shadow-inner"
                    >
                       <option>COD</option>
                       <option>Stripe</option>
                       <option>SSLCommerz</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Deployment Status</label>
                    <select 
                       value={newMethod.status}
                       onChange={(e) => setNewMethod({...newMethod, status: e.target.value})}
                       className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-[10px] font-bold text-slate-900 shadow-inner"
                    >
                       <option>Active</option>
                       <option>Inactive</option>
                       <option>Dev Mode</option>
                    </select>
                 </div>
              </div>

              <button 
                onClick={handleAddMethod}
                disabled={isConfiguring}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 mt-4"
              >
                 <ShieldCheck size={14} />
                 {isConfiguring ? "Deploying Protocol..." : "Commit Gateway Configuration"}
              </button>
           </div>
        </section>
      </div>
    </div>
  );
}
