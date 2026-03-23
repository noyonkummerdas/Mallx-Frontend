"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");
  const isDashboard = pathname.startsWith("/dashboard");
  const isSupportMain = pathname === "/support";

  if (isAuthPage || isDashboard || isSupportMain) return null;

  return (
    <footer className="bg-background border-t border-white/5 py-16 px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-8 h-8 accent-gradient rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-all">
                <span className="text-sm font-black text-white">X</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-white uppercase">Mall<span className="text-accent">X</span></span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs italic">
              Redefining the digital marketplace with premium aesthetics and rock-solid engineering.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6">Discovery</h4>
            <div className="flex flex-col gap-4">
              <Link href="/catalog/products" className="text-xs text-slate-500 hover:text-white transition-colors">Marketplace</Link>
              <Link href="/deals" className="text-xs text-slate-500 hover:text-white transition-colors">Exclusive Deals</Link>
              <Link href="/new-arrivals" className="text-xs text-slate-500 hover:text-white transition-colors">New Arrivals</Link>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6">Company</h4>
            <div className="flex flex-col gap-4">
              <Link href="/about" className="text-xs text-slate-500 hover:text-white transition-colors">Our Vision</Link>
              <Link href="/support" className="text-xs text-slate-500 hover:text-white transition-colors">Support Hub</Link>
              <Link href="/privacy" className="text-xs text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6">Stay Connected</h4>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 hover:border-accent transition-all cursor-pointer">
                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </div>
              {/* Add more icons as needed */}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            &copy; 2026 MallX Marketplace. Crafted with 💎 in Next.js
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">v2.4.0-premium</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Systems Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

