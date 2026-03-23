"use client";

import { useGetProductsQuery, useGetCategoriesQuery } from "@/modules/shopping/services/productApi";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Filter, X, ChevronRight, LayoutGrid, Search, SlidersHorizontal } from "lucide-react";

export default function ProductListingPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const { data: categoryData, isLoading: catLoading } = useGetCategoriesQuery({});
  const { data: productData, isLoading } = useGetProductsQuery({ 
    name: search, 
    categoryId: selectedCategory 
  });

  const products = productData?.data?.products || [];
  const categories = categoryData?.data || [];

  return (
    <main className="min-h-screen bg-white text-slate-900 relative selection:bg-action/30">
      <div className="glow-bg" />
      
      {/* Sidebar Overlay (Mobile) */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="fixed left-6 bottom-6 z-50 w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center lg:hidden hover:scale-110 active:scale-95 transition-all"
        >
          <Filter className="w-6 h-6" />
        </button>
      )}

      <div className="flex">
        {/* LEFT SIDEBAR */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-slate-100 transform transition-transform duration-500 ease-in-out lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col p-8">
             <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 accent-gradient rounded-lg flex items-center justify-center">
                      <SlidersHorizontal className="w-4 h-4 text-white" />
                   </div>
                   <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Explorer</h2>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-900 transition-colors">
                   <X className="w-5 h-5" />
                </button>
             </div>

             <div className="space-y-12 flex-1 overflow-y-auto scrollbar-hide">
                {/* Search in Sidebar */}
                <div>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 border-l-2 border-action pl-3">Search</h3>
                   <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 pl-10 text-[11px] font-bold focus:ring-2 focus:ring-action/10 focus:border-action outline-none transition-all placeholder:text-slate-300"
                      />
                      <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                   </div>
                </div>

                {/* Categories */}
                <div>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 border-l-2 border-action pl-3">Categories</h3>
                   <div className="space-y-2">
                      <button 
                        onClick={() => setSelectedCategory("")}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${selectedCategory === "" ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' : 'hover:bg-slate-50 text-slate-500'}`}
                      >
                         <span className="text-[11px] font-black uppercase tracking-widest">All Collection</span>
                         <ChevronRight className={`w-4 h-4 transition-transform ${selectedCategory === "" ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                      </button>
                      {categories.map((cat: any) => (
                        <button 
                           key={cat._id}
                           onClick={() => setSelectedCategory(cat._id)}
                           className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${selectedCategory === cat._id ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' : 'hover:bg-slate-50 text-slate-500'}`}
                        >
                           <span className="text-[11px] font-black uppercase tracking-widest">{cat.name}</span>
                           <ChevronRight className={`w-4 h-4 transition-transform ${selectedCategory === cat._id ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             <div className="pt-8 border-t border-slate-100 mt-auto">
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                      Discover the future of high-performance commerce.
                   </p>
                </div>
             </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 min-w-0">
          {/* Header/Banner Area */}
          <div className="p-8 lg:p-12">
            <header className="mb-16 flex items-start justify-between">
               <div>
                  <div className="flex items-center gap-4 mb-4">
                     <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors hidden lg:block"
                     >
                        {isSidebarOpen ? <X className="w-5 h-5 text-slate-900" /> : <Filter className="w-5 h-5 text-slate-900" />}
                     </button>
                     <span className="text-action font-black tracking-[0.3em] text-[10px] uppercase">Elite Marketplace</span>
                  </div>
                  <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic text-gradient leading-tight">
                    {selectedCategory ? categories.find((c: any) => c._id === selectedCategory)?.name : 'Global Collection'}
                  </h1>
               </div>
               
               <div className="hidden sm:flex gap-4">
                  <div className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                     <LayoutGrid className="w-4 h-4 text-slate-400" />
                     <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{products.length} Products</span>
                  </div>
               </div>
            </header>

            {/* Product Grid */}
            {isLoading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-[4/5] rounded-[2rem] bg-slate-50 animate-pulse border border-slate-100" />
                  ))}
               </div>
            ) : products.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                  {products.map((product: any) => (
                    <Link 
                        href={`/catalog/products/${product._id}`} 
                        key={product._id} 
                        className="glass-card group p-3 rounded-[2rem] overflow-hidden flex flex-col group/card shadow-sm hover:shadow-2xl hover:shadow-indigo-600/5"
                    >
                        <div className="w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-slate-50 mb-6 relative">
                          <img 
                              src={product.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000"} 
                              className="w-full h-full object-contain p-6 group-hover/card:scale-105 transition-transform duration-700" 
                              alt={product.name}
                          />
                          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] border-2 border-slate-900 px-6 py-2 rounded-xl bg-white/80">Details</span>
                          </div>
                        </div>
                        <div className="px-4 pb-4 text-left">
                          <h4 className="text-xs font-black text-slate-400 mb-2 uppercase line-clamp-1 group-hover/card:text-slate-900 transition-colors tracking-tight">{product.name}</h4>
                          <div className="flex items-center gap-3">
                              {product.discountPrice ? (
                                <>
                                    <p className="text-xl font-black text-slate-900 tracking-tighter">{product.discountPrice.toLocaleString()} <span className="text-[10px] text-slate-400 ml-1 italic">TK</span></p>
                                    <p className="text-[10px] text-slate-400 line-through font-bold opacity-40 italic">{product.price.toLocaleString()} TK</p>
                                </>
                              ) : (
                                <p className="text-xl font-black text-slate-900 tracking-tighter">{product.price.toLocaleString()} <span className="text-[10px] text-slate-400 ml-1 italic">TK</span></p>
                              )}
                          </div>
                        </div>
                    </Link>
                  ))}
               </div>
            ) : (
               <div className="py-40 text-center glass-panel rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
                     <Filter className="w-8 h-8 text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] italic">No discovery in this sector</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
