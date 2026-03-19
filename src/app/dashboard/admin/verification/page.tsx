"use client";

import { useEffect } from "react";
import { useGetAllDocumentsQuery } from "@/modules/business/services/businessApi";

export default function VerificationPage() {
  const { data: docsData, isLoading } = useGetAllDocumentsQuery({});

  useEffect(() => {
    if (docsData) console.log("Admin Verification Page - [QUERY] Payloads:", docsData);
  }, [docsData]);

  const documents = docsData?.data?.docs || [];

  return (
    <>
      <header className="mb-8">
        <h1 className="text-lg font-black tracking-tight mb-1 text-slate-900 uppercase leading-none">Identity Verification</h1>
        <p className="text-slate-500 font-bold italic text-[10px] tracking-wide">KYC processing and vendor onboarding audit.</p>
      </header>

      <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-slate-900">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-black border-l-2 border-indigo-600 pl-3 uppercase tracking-tighter">Verification Center</h2>
            <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">
              {isLoading ? "Checking..." : `${documents.length} Total Documents`}
            </span>
          </div>
          <div className="space-y-4">
            {isLoading ? (
               <div className="text-center py-8 text-[10px] uppercase font-bold text-slate-400">Loading documents...</div>
            ) : documents.length > 0 ? documents.map((doc: any, i: number) => (
              <div key={doc._id || i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:bg-white transition-all">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-slate-400">
                      {doc.vendorId?.logo ? (
                        <img src={doc.vendorId.logo} alt="Vendor" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-black text-[10px] uppercase">{doc.vendorId?.shopName?.charAt(0) || "V"}</span>
                      )}
                   </div>
                   <div>
                      <p className="text-xs font-bold text-slate-900">{doc.vendorId?.shopName || "Unknown Shop"}</p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                        {doc.documentType} · Status: <span className={doc.status === 'Verified' ? 'text-green-600' : 'text-orange-500'}>{doc.status}</span>
                      </p>
                   </div>
                </div>
                <div className="flex gap-3">
                  <a 
                    href={doc.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all"
                  >
                    View Docs
                  </a>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 italic text-[10px] uppercase font-bold text-slate-400 border border-dashed border-slate-100 rounded-2xl">No documents pending review.</div>
            )}
          </div>
      </section>
    </>
  );
}
