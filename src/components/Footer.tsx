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
    <footer className="w-full bg-[#0B0F19] py-24 relative overflow-hidden border-t border-white/[0.05]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-action/50 to-transparent opacity-30" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-20 relative z-10">
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-3 mb-10 group">
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all shadow-2xl shadow-white/5">
              <span className="text-[#0B0F19] font-black text-2xl">X</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
              Mall<span className="text-action font-black">X</span>
            </span>
          </Link>
          <p className="text-slate-500 text-xs font-medium leading-relaxed mb-10 uppercase tracking-[0.15em] max-w-[240px]">
            The new standard for <span className="text-white">high-performance</span> digital commerce.
          </p>
          <div className="flex gap-4">
            {['Twitter', 'Instagram', 'Github'].map((social) => (
              <div key={social} className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer group">
                <span className="text-[10px] font-black text-slate-500 group-hover:text-white uppercase tracking-tighter">{social[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Columns */}
        {[
          { title: 'Storefront', links: ['Marketplace', 'Campaigns', 'Bundles', 'Flash Sales'] },
          { title: 'Ecosystem', links: ['Vendors', 'Delivery', 'Affiliates', 'Rewards'] },
          { title: 'Governance', links: ['Help Center', 'Security'] }
        ].map((column) => (
          <div key={column.title}>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/40 mb-10">{column.title}</h4>
            <ul className="space-y-5">
              {column.links.map((link) => (
                <li key={link}>
                  <Link href="#" className="text-[11px] font-bold text-slate-500 hover:text-white transition-all uppercase tracking-[0.15em] flex items-center gap-2 group">
                    <span className="w-0 h-[2px] bg-action group-hover:w-3 transition-all duration-300" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Identity Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <div className="flex items-center gap-6">
           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
             © 2026 MallX Collective
           </p>
           <div className="w-[1px] h-3 bg-white/10 hidden md:block" />
           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] hidden md:block">
             nknoyon01936@gmail.com
           </p>
        </div>
        
        <div className="flex gap-10">
          <Link href="/support/privacy" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.3em] transition-all">Privacy</Link>
          <Link href="/support/terms" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.3em] transition-all">Terms</Link>
          <Link href="#" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.3em] transition-all">Compliance</Link>
        </div>
      </div>
    </footer>
  );
}
