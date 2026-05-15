'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-10 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <AlertTriangle className="w-10 h-10 text-rose-500" />
        </div>
        
        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">
          System Interruption
        </h2>
        
        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10">
          We've encountered an unexpected technical glitch. Our elite team has been notified and is working on a resolution.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => reset()}
            className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-slate-900/10"
          >
            <RefreshCcw className="w-4 h-4" />
            Retry Connection
          </button>
          
          <Link href="/" className="block">
            <button className="w-full h-14 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-95">
              <Home className="w-4 h-4" />
              Return to Terminal
            </button>
          </Link>
        </div>
        
        <p className="mt-10 text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
          Error ID: {error.digest || 'MALLX-ERR-500'}
        </p>
      </div>
    </div>
  );
}
