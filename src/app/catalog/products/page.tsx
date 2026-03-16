"use client";

import { useGetProductsQuery } from "@/modules/catalog/services/catalogApi";
import Link from "next/link";
import { useState } from "react";

export default function ProductListingPage() {
  const { data, isLoading, isError } = useGetProductsQuery({});
  
  if (isLoading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const products = data?.data?.products || [];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-3 tracking-tight">Marketplace Catalog</h1>
            <p className="text-slate-400">Discover premium products from verified vendors</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 flex items-center gap-3">
                <span className="text-slate-500 text-sm">Sort by:</span>
                <select className="bg-transparent text-sm font-semibold outline-none cursor-pointer">
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
              className="group bg-slate-900/50 border border-slate-800 rounded-[2rem] overflow-hidden hover:border-indigo-500/50 transition-all hover:translate-y-[-4px] shadow-xl hover:shadow-indigo-500/10"
            >
              <div className="aspect-square bg-slate-800 relative overflow-hidden">
                {product.images && product.images[0] ? (
                  <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 font-bold uppercase tracking-widest text-xs">
                    No Image
                  </div>
                )}
                {product.price < 500 && (
                  <div className="absolute top-4 left-4 bg-indigo-600 text-[10px] font-black uppercase px-2 py-1 rounded-full shadow-lg">
                    HOT DEAL
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">
                  {product.category?.name || "Global"}
                </div>
                <h3 className="font-bold text-lg mb-4 line-clamp-1 group-hover:text-indigo-400 transition-colors">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-black">{product.price} <span className="text-xs font-normal text-slate-500 ml-1">TK</span></div>
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-32 bg-slate-900/20 border border-dashed border-slate-800 rounded-[3rem]">
            <p className="text-slate-500 font-medium italic">No products found in the catalog.</p>
          </div>
        )}
      </div>
    </main>
  );
}
