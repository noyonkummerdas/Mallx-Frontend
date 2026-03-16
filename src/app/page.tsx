"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Customer");

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-purple-600/20 blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-xl font-bold italic">M</span>
          </div>
          <span className="text-2xl font-bold tracking-tight">Mall<span className="text-indigo-500">X</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Catalog</a>
          <a href="#" className="hover:text-white transition-colors">Vendors</a>
          <a href="#" className="hover:text-white transition-colors">Logistics</a>
          <a href="#" className="hover:text-white transition-colors">Support</a>
        </div>

        <button className="px-6 py-2.5 bg-white text-slate-950 rounded-full font-semibold text-sm hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-8 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          Powered by Rock-Solid Backend
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
          The Next Generation <br /> 
          Marketplace <span className="text-indigo-500">Ecosystem</span>
        </h1>
        
        <p className="max-w-2xl text-lg text-slate-400 mb-12 leading-relaxed">
          A high-performance ecommerce architecture for Customers, Vendors, and Partners.
          Beautifully engineered with Next.js, Tailwind, and TypeScript.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="px-8 py-4 bg-indigo-600 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-2 group">
            Explore Marketplace
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </button>
          <button className="px-8 py-4 bg-slate-900 border border-slate-800 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
            Vendor Dashboard
          </button>
        </div>
      </section>

      {/* Role Selector Preview */}
      <section className="relative z-10 px-8 max-w-5xl mx-auto pb-32">
        <div className="p-8 rounded-[2.5rem] bg-slate-900/50 border border-slate-800 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-wrap gap-4 mb-8">
            {["Customer", "Vendor", "Partner", "DeliveryBoy"].map((role) => (
              <button
                key={role}
                onClick={() => setActiveTab(role)}
                className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === role 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25" 
                    : "bg-slate-800/50 text-slate-400 hover:text-white"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Optimized for {activeTab}s</h3>
              <p className="text-slate-400 mb-6 font-light leading-relaxed">
                Experience seamless operations with our dedicated {activeTab} module. 
                Full API integration for registration, tracking, and financial analytics.
              </p>
              <ul className="space-y-3">
                {[
                  "Real-time Data Sync",
                  "Secure 2FA Authentication",
                  "Performance Analytics",
                  "Cloud Binary Image Uploads"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-video bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-slate-800 rounded-3xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-4 py-2 bg-indigo-600 rounded-lg text-xs font-bold shadow-lg">VIEW MODULE</span>
              </div>
              <div className="w-full h-full flex flex-col p-6 gap-3">
                 <div className="w-2/3 h-4 bg-slate-800 rounded shadow-sm" />
                 <div className="w-1/2 h-4 bg-slate-800 rounded shadow-sm" />
                 <div className="mt-auto flex justify-between">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-full" />
                    <div className="w-24 h-10 bg-indigo-600/30 rounded-xl" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 py-12 px-8 text-center text-slate-500 text-sm">
        &copy; 2026 MallX Marketplace Ecosystem. Built with 💎 and Next.js.
      </footer>
    </main>
  );
}
