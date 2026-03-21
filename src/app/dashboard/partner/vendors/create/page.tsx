"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, User, Mail, Phone, Lock, FileText, ChevronRight, Loader2 } from "lucide-react";
import { useCreateVendorMutation } from "@/modules/business/services/businessApi";

export default function PartnerCreateVendorPage() {
  const router = useRouter();
  const [createVendor, { isLoading }] = useCreateVendorMutation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    shopName: "",
    shopDetails: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createVendor(formData).unwrap();
      router.push("/dashboard/partner/vendors");
    } catch (err: any) {
      alert(err?.data?.message || "Failed to create vendor");
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-slate-900">
      <header className="mb-8">
        <h1 className="text-lg font-black tracking-tight mb-1 uppercase leading-none">Merchant Onboarding</h1>
        <p className="text-slate-500 font-bold italic text-[10px] tracking-wide">Register a new merchant entity into your regional network.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xs font-black border-l-2 border-indigo-600 pl-3 uppercase tracking-tighter mb-6 text-slate-900">Merchant Identity</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Salim Ahmed"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all font-sans text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="vendor@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all font-sans text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+8801..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all font-sans text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all font-sans text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xs font-black border-l-2 border-indigo-600 pl-3 uppercase tracking-tighter mb-6 text-slate-900">Shop Configuration</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Shop Name</label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Apex Electronics"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all font-sans text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Shop Details</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-slate-400" size={14} />
                <textarea 
                  name="shopDetails"
                  value={formData.shopDetails}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Provide a brief background of the business..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all resize-none font-sans text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={14} />
              Onboarding Merchant...
            </>
          ) : (
            <>
              Finalize Vendor Creation
              <ChevronRight size={14} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
