"use client";

import { useGetProductsQuery } from "@/modules/catalog/services/catalogApi";
import { useEffect } from "react";

export default function CatalogPage() {
  const { data: productsData, isLoading } = useGetProductsQuery({});

  useEffect(() => {
    console.log("Admin Catalog Page - [QUERY] Products Data:", productsData);
  }, [productsData]);

  const totalProducts = productsData?.data?.total || productsData?.data?.length || 0;

  return (
    <>
      <header className="mb-8">
        <h1 className="text-lg font-black tracking-tight mb-1 text-slate-900 uppercase leading-none">Catalog Intelligence</h1>
        <p className="text-slate-500 font-bold italic text-[10px] tracking-wide">Marketplace taxonomy and product lifecycle control.</p>
      </header>

      <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-slate-900">
         <h2 className="text-xs font-black mb-6 border-l-2 border-indigo-600 pl-3 uppercase tracking-tighter">Catalog Control</h2>
         <div className="flex flex-col items-center justify-center h-48 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">
              {isLoading ? "Loading Registry..." : `${totalProducts} Products In Ecosystem`}
            </p>
         </div>
      </section>
    </>
  );
}
