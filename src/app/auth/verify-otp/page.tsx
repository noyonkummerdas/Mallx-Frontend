"use client";

import { useVerifyOtpMutation } from "@/modules/identity/services/authApi";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [verifyOtp, { isLoading, error }] = useVerifyOtpMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  useEffect(() => {
    if (!userId) {
      router.push("/auth/login");
    }
  }, [userId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Calling verifyOtp with:", { userId, otp });
      const result = await verifyOtp({ userId, otp }).unwrap();
      console.log("OTP Verification successful returned data:", result);
      
      localStorage.setItem("mallx_token", result.token);
      
      const role = result.data?.user?.role || result.user?.role;
      switch(role) {
        case "Admin": router.push("/dashboard/admin"); break;
        case "Vendor": router.push("/dashboard/vendor"); break;
        case "Partner": router.push("/dashboard/partner"); break;
        case "DeliveryBoy": router.push("/dashboard/delivery"); break;
        default: router.push("/profile"); break;
      }
    } catch (err) {
      console.error("OTP Verification failed:", err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/5 blur-[150px]" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Two-Factor Authentication</h1>
            <p className="text-slate-500">Enter the OTP sent to your email</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 font-semibold">One-Time Password</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-center text-2xl tracking-[0.5em]"
                placeholder="000000"
                maxLength={6}
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          {error && (
            <p className="text-red-500 text-sm mt-4 text-center font-medium">Invalid or expired OTP. Please try again.</p>
          )}
        </div>
      </div>
    </main>
  );
}
