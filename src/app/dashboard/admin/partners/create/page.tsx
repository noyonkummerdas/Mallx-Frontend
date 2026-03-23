"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, User, Mail, Phone, Lock, ChevronRight, Loader2, Check, LayoutGrid } from "lucide-react";
import { useRegisterMutation } from "@/modules/identity/services/authApi";
import { useGetCategoriesQuery } from "@/modules/shopping/services/productApi";

export default function CreatePartnerPage() {
  const router = useRouter();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery({});
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    roleName: "Partner"
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        ...formData,
        assignedCategories: selectedCategories
      }).unwrap();
      alert("Partner created successfully!");
      router.push("/dashboard/admin/users");
    } catch (err: any) {
      alert(err?.data?.message || "Failed to create partner");
    }
  };

  const categories = categoriesData?.data || [];

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-base font-black tracking-tight mb-1 text-slate-900 uppercase leading-none">Global Partner Onboarding</h1>
        <p className="text-sm text-slate-500 font-bold tracking-wide">Register a strategic partner for regional operations and growth.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-base font-black border-l-2 border-emerald-600 pl-3 uppercase tracking-tighter mb-6 leading-none">Partner Identity</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Robert Smith"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Business Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="partner@mallx.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+8801..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Initial Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-base font-black border-l-2 border-emerald-600 pl-3 uppercase tracking-tighter mb-6 leading-none">Business Categories</h2>
          
          <div className="space-y-4 relative">
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest pl-1">Assign operational domains (e.g. Mens, Womens)</p>
            
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all select-none"
              >
                <div className="flex flex-wrap gap-1">
                  {selectedCategories.length > 0 ? (
                    selectedCategories.map(id => {
                      const cat = categories.find((c: any) => c._id === id);
                      return (
                        <span key={id} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-sm font-black uppercase">
                          {cat?.name || "..."}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-slate-400 font-black uppercase tracking-widest opacity-40">Select target categories...</span>
                  )}
                </div>
                <ChevronRight size={14} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-90' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 max-h-60 overflow-y-auto p-2 space-y-1 animate-in fade-in zoom-in duration-200">
                  {isLoadingCategories ? (
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-black uppercase p-4">
                      <Loader2 className="animate-spin" size={12} />
                      Syncing sectors...
                    </div>
                  ) : categories.length > 0 ? (
                    categories.map((cat: any) => {
                      const isSelected = selectedCategories.includes(cat._id);
                      return (
                        <div
                          key={cat._id}
                          onClick={() => toggleCategory(cat._id)}
                          className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                            isSelected ? "bg-emerald-50 text-emerald-900" : "hover:bg-slate-50 text-slate-600"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <LayoutGrid size={12} className={isSelected ? "text-emerald-600" : "text-slate-300"} />
                            <span className="text-sm font-black uppercase tracking-tighter">{cat.name}</span>
                          </div>
                          {isSelected && <Check size={12} className="text-emerald-600" />}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4 text-sm text-slate-400 font-black uppercase">No sectors available</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isRegistering}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
        >
          {isRegistering ? (
            <>
              <Loader2 className="animate-spin" size={14} />
              Onboarding Partner...
            </>
          ) : (
            <>
              Finalize Partner Creation
              <ChevronRight size={14} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
