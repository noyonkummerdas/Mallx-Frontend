"use client";

import { useLoginMutation } from "@/modules/identity/services/authApi";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Calling login with:", { email, password });
      const result = await login({ email, password }).unwrap();
      console.log("Login successful returned data:", result);

      if (result.twoFactorRequired) {
        router.push(`/auth/verify-otp?userId=${result.userId}`);
        return;
      }

      localStorage.setItem("mallx_token", result.token);
      
      const user = result.data?.user || result.user;
      const rawRole = user?.role || user?.roleId?.name || result.role || "Customer";
      const roleStr = String(rawRole).toLowerCase();
      
      console.log("Resolved role string:", roleStr);

      switch(roleStr) {
        case "admin":
          window.location.href = "/dashboard/admin";
          break;
        case "vendor":
          window.location.href = "/dashboard/vendor";
          break;
        case "partner":
          window.location.href = "/dashboard/partner";
          break;
        case "deliveryboy":
          window.location.href = "/dashboard/delivery";
          break;
        default:
          console.warn("Role not found or default, redirecting to Customer. Role was:", roleStr);
          window.location.href = "/dashboard/customer";
          break;
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden text-slate-900">
      {/* Subtle Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-slate-200/40 blur-[150px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-slate-200/40 blur-[120px]" />

      <div className="w-full max-w-sm relative z-10">
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-2xl shadow-slate-200/40">
          <div className="text-center mb-8">
            <h1 className="text-2xl text-slate-900 mb-2 uppercase tracking-tighter">Welcome Back</h1>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[9px] text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all placeholder:text-slate-400 text-xs"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-[9px] text-slate-400 uppercase tracking-widest mb-2 px-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all placeholder:text-slate-400 text-xs"
                placeholder="••••••••"
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl shadow-lg shadow-slate-900/20 transition-all active:scale-95 disabled:opacity-50 text-[10px] uppercase tracking-widest mt-2"
            >
              {isLoading ? "Validating..." : "Sign In"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-center">
               <p className="text-red-600 text-[10px] uppercase tracking-tight">Invalid access credentials.</p>
            </div>
          )}

          <div className="text-center mt-8">
            <p className="text-slate-500 text-[9px] uppercase tracking-widest">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-slate-900 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
