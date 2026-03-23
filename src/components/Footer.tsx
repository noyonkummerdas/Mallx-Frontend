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
    <footer className="w-full bg-surface border-t border-white/5 py-24 relative overflow-hidden">
      <div className="glow-bg opacity-30" />
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-3 mb-8 group">
            <div className="w-10 h-10 accent-gradient rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all shadow-lg shadow-indigo-500/20">
              <span className="text-white font-black text-xl">X</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">
              Mall<span className="text-action font-black">X</span>
            </span>
          </Link>
          <p className="text-muted text-xs font-bold leading-relaxed mb-8 uppercase tracking-widest opacity-60">
            Defining the future of high-performance commerce with obsidian precision.
          </p>
          <div className="flex gap-4">
            {['Twitter', 'Instagram', 'Github'].map((social) => (
              <div key={social} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:border-action transition-all cursor-pointer group">
                <span className="text-[10px] font-black text-muted group-hover:text-white uppercase tracking-tighter">{social[0]}</span>
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
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-8 border-l-2 border-action pl-3">{column.title}</h4>
            <ul className="space-y-4">
              {column.links.map((link) => (
                <li key={link}>
                  <Link href="#" className="text-xs font-bold text-muted hover:text-white transition-all uppercase tracking-widest">{link}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] opacity-40">
          © 2026 MallX Technologies. All rights reserved.
        </p>
        <div className="flex gap-8">
          <Link href="#" className="text-[10px] font-black text-muted hover:text-white uppercase tracking-[0.2em] transition-all">Privacy</Link>
          <Link href="#" className="text-[10px] font-black text-muted hover:text-white uppercase tracking-[0.2em] transition-all">Terms</Link>
          <Link href="#" className="text-[10px] font-black text-muted hover:text-white uppercase tracking-[0.2em] transition-all">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
