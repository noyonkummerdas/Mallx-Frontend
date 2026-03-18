"use client";

import { useRegisterMutation } from "@/modules/identity/services/authApi";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Customer",
    nid: "",
    photo: "",
    nomineeName: "",
    nomineeNid: ""
  });
  const [register, { isLoading, error }] = useRegisterMutation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      console.log("Calling register with:", formData);
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        roleName: formData.role,
        kyc: formData.role === "DeliveryBoy" ? {
          nid: formData.nid,
          photo: formData.photo,
          nominee: {
            name: formData.nomineeName,
            nid: formData.nomineeNid
          }
        } : undefined
      }).unwrap();
      console.log("Registration successful returned data:", result);
      router.push("/auth/login");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden text-slate-900">
      {/* Subtle Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-slate-200/40 blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-200/40 blur-[120px]" />

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-white border border-slate-200 p-10 rounded-2xl shadow-2xl shadow-slate-200/40">
          <div className="text-center mb-8">
            <h1 className="text-2xl text-slate-900 mb-2 uppercase tracking-tighter">Join MallX</h1>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest leading-relaxed">
              {formData.role === "Vendor" ? "Register your shop and start selling" : 
               formData.role === "DeliveryBoy" ? "Join our delivery network" : 
               "Create your account to start shopping"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[9px] text-slate-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all text-xs"
                  placeholder="John Doe"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[9px] text-slate-400 uppercase tracking-widest mb-2 px-1">Account Type</label>
                <div className="relative">
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all text-xs appearance-none cursor-pointer"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Vendor">Vendor</option>
                    <option value="DeliveryBoy">Delivery Partner</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
                </div>
              </div>
            </div>

            {formData.role === "DeliveryBoy" && (
              <div className="space-y-4 border-l-2 border-slate-900 pl-4 bg-slate-50 py-4 pr-4 rounded-r-xl transition-all">
                <p className="text-[9px] text-slate-900 uppercase tracking-widest mb-2">KYC Requirements (Mandatory)</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[8px] text-slate-400 uppercase tracking-widest mb-1">NID Number</label>
                    <input
                      type="text"
                      required
                      value={formData.nid}
                      onChange={(e) => setFormData({...formData, nid: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-xs outline-none focus:border-slate-900"
                      placeholder="NID-XXXX-XXXX"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[8px] text-slate-400 uppercase tracking-widest mb-1">Photo URL</label>
                    <input
                      type="text"
                      required
                      value={formData.photo}
                      onChange={(e) => setFormData({...formData, photo: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-xs outline-none focus:border-slate-900"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[8px] text-slate-400 uppercase tracking-widest mb-1">Nominee Name</label>
                    <input
                      type="text"
                      required
                      value={formData.nomineeName}
                      onChange={(e) => setFormData({...formData, nomineeName: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-xs outline-none focus:border-slate-900"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[8px] text-slate-400 uppercase tracking-widest mb-1">Nominee NID</label>
                    <input
                      type="text"
                      required
                      value={formData.nomineeNid}
                      onChange={(e) => setFormData({...formData, nomineeNid: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-xs outline-none focus:border-slate-900"
                      placeholder="NID-XXXX-XXXX"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[9px] text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all text-xs"
                placeholder="email@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] text-slate-400 uppercase tracking-widest mb-2 px-1">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all text-xs"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-[9px] text-slate-400 uppercase tracking-widest mb-2 px-1">Confirm</label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all text-xs"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl shadow-xl shadow-slate-900/10 transition-all mt-4 active:scale-95 disabled:opacity-50 text-[10px] uppercase tracking-widest"
            >
              {isLoading ? "creating process..." : "join ecosystem"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-red-600 text-[10px] uppercase tracking-widest text-center">
                {(error as any)?.data?.message?.includes("duplicate key") 
                  ? "Email already registered. Try another or Sign In." 
                  : (error as any)?.data?.message || "Registration failed. Try again."}
              </p>
            </div>
          )}

          <div className="text-center mt-8">
            <p className="text-slate-500 text-[9px] uppercase tracking-widest">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-slate-900 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
