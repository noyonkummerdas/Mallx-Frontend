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
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/5 blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px]" />

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Join MallX</h1>
            <p className="text-slate-500">Create your account to start shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-400"
                  placeholder="John Doe"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Account Type</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="Customer">Customer</option>
                  <option value="Vendor">Vendor</option>
                  <option value="DeliveryBoy">Delivery Boy</option>
                </select>
              </div>
            </div>

            {formData.role === "DeliveryBoy" && (
              <div className="space-y-4 border-l-4 border-indigo-500 pl-4 bg-indigo-50/30 py-4 pr-4 rounded-r-2xl animate-in fade-in slide-in-from-left-4">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">KYC Requirements (Mandatory)</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">NID Number</label>
                    <input
                      type="text"
                      required
                      value={formData.nid}
                      onChange={(e) => setFormData({...formData, nid: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500"
                      placeholder="NID-XXXX-XXXX"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Passport Photo URL</label>
                    <input
                      type="text"
                      required
                      value={formData.photo}
                      onChange={(e) => setFormData({...formData, photo: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Nominee Name</label>
                    <input
                      type="text"
                      required
                      value={formData.nomineeName}
                      onChange={(e) => setFormData({...formData, nomineeName: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Nominee NID</label>
                    <input
                      type="text"
                      required
                      value={formData.nomineeNid}
                      onChange={(e) => setFormData({...formData, nomineeNid: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500"
                      placeholder="NID-XXXX-XXXX"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-400"
                placeholder="email@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Confirm</label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-3xl shadow-xl shadow-indigo-600/20 transition-all mt-4 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl animate-in fade-in zoom-in-95">
              <p className="text-red-600 text-xs font-black uppercase tracking-widest text-center">
                {(error as any)?.data?.message?.includes("duplicate key") 
                  ? "Email already registered. Try another or Sign In." 
                  : (error as any)?.data?.message || "Registration failed. Try again."}
              </p>
            </div>
          )}

          <p className="text-center mt-8 text-slate-500 text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
