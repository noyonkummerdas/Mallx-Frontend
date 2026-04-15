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
    <footer className="w-full bg-slate-50 border-t border-slate-100 py-24 relative overflow-hidden">
      <div className="glow-bg opacity-10" />
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-3 mb-8 group">
            <div className="w-10 h-10 accent-gradient rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all shadow-lg shadow-indigo-500/20">
              <span className="text-white font-black text-xl">X</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">
              Mall<span className="text-action font-black">X</span>
            </span>
          </Link>
          <p className="text-slate-400 text-xs font-bold leading-relaxed mb-8 uppercase tracking-widest opacity-60">
            Defining the future of high-performance commerce with clean precision.
          </p>
          <div className="flex gap-4">
            {['Twitter', 'Instagram', 'Github'].map((social) => (
              <div key={social} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:border-action transition-all cursor-pointer group shadow-sm">
                <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-tighter">{social[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {[
          { title: 'Shop', links: ['Marketplace', 'Campaigns', 'Bundles', 'Flash Sales'] },
          { title: 'Partners', links: ['Vendors', 'Delivery', 'Affiliates', 'Rewards'] },
          { title: 'Support', links: ['Help Center', 'API Docs', 'Status', 'Security'] }
        ].map((column) => (
          <div key={column.title}>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 mb-8 border-l-2 border-action pl-3">{column.title}</h4>
            <ul className="space-y-4">
              {column.links.map((link) => (
                <li key={link}>
                  <Link href="#" className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-all uppercase tracking-widest">{link}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-40">
          nknoyon01936@gmail.com
        </p>
        <div className="flex gap-8">
          <Link href="#" className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[0.2em] transition-all">Privacy</Link>
          {/* <Link href="#" className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[0.2em] transition-all">Terms</Link> */}
          <Link href="#" className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[0.2em] transition-all">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
