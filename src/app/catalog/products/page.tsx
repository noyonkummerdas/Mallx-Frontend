"use client";

import { useGetProductsQuery } from "@/modules/catalog/services/catalogApi";
import Link from "next/link";
import { useState } from "react";

export default function ProductListingPage() {
  const { data, isLoading, isError } = useGetProductsQuery({});
  
  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const products = data?.data?.products || [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-3 tracking-tight text-slate-900">Marketplace Catalog</h1>
            <p className="text-slate-500 font-medium">Discover premium products from verified vendors</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-sm">
                <span className="text-slate-400 text-sm font-semibold">Sort by:</span>
                <select className="bg-transparent text-sm font-bold outline-none cursor-pointer text-slate-700">
                   <option>Newest</option>
                   <option>Price: Low to High</option>
                   <option>Price: High to Low</option>
                </select>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product: any) => (
            <Link 
              href={`/catalog/products/${product._id}`} 
              key={product._id}
              className="group bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:border-indigo-600/30 transition-all hover:translate-y-[-4px] shadow-sm hover:shadow-xl hover:shadow-indigo-600/5"
            >
              <div className="aspect-square bg-slate-100 relative overflow-hidden">
                {product.images && product.images[0] ? (
                  <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-[10px]">
                    No Image Found
                  </div>
                )}
                {product.price < 500 && (
                  <div className="absolute top-4 left-4 bg-indigo-600 text-[10px] font-black uppercase px-3 py-1 text-white rounded-full shadow-lg">
                    HOT
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">
                  {product.category?.name || "Global"}
                </div>
                <h3 className="font-bold text-lg mb-4 line-clamp-1 text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-black text-slate-900">{product.price.toLocaleString()} <span className="text-xs font-normal text-slate-400 ml-1 italic">TK</span></div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all text-indigo-600 shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-32 bg-white border border-dashed border-slate-200 rounded-[3rem] shadow-inner">
            <p className="text-slate-400 font-bold italic tracking-wide">No products found in the catalog.</p>
          </div>
        )}
      </div>
    </main>
  );
}
