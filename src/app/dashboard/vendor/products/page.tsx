"use client";

import { useGetMeQuery } from "@/modules/identity/services/authApi";
import { useGetShopDetailsQuery } from "@/modules/business/services/businessApi";
import { useGetProductsQuery } from "@/modules/shopping/services/productApi";
import Link from "next/link";
import { Plus, Search, Filter, Edit2, Eye, Package } from "lucide-react";
import { useState } from "react";

export default function VendorProductsPage() {
  const { data: shopData } = useGetShopDetailsQuery({});
  const vendorId = shopData?.data?.vendor?._id;

  const { data: productsData, isLoading } = useGetProductsQuery(
    vendorId ? { vendorId } : {},
    { skip: !vendorId }
  );

  const products = productsData?.data?.products || [];
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-base font-bold text-slate-900 uppercase tracking-tighter">Inventory Management</h1>
          <p className="text-sm text-slate-500 uppercase tracking-widest mt-1">Manage and track your listed assets</p>
        </div>
        <Link href="/dashboard/vendor/products/create">
          <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl text-sm uppercase tracking-widest font-bold hover:bg-black transition-all shadow-lg shadow-slate-900/10 active:scale-95">
            <Plus size={14} />
            List New Product
          </button>
        </Link>
      </header>

      {/* Filters & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 py-3 text-xs outline-none focus:border-slate-900 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm uppercase tracking-widest font-bold text-slate-600 hover:bg-white transition-all">
            <Filter size={14} />
            Filter
          </button>
          <div className="h-8 w-[1px] bg-slate-100 hidden md:block"></div>
          <p className="text-sm text-slate-400 uppercase tracking-widest font-bold px-2">
            Total: {filteredProducts.length}
          </p>
        </div>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-3xl p-4 animate-pulse">
              <div className="aspect-square bg-slate-100 rounded-2xl mb-4" />
              <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product: any) => (
            <div key={product._id} className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1 relative">
              {/* Product Image Container */}
              <div className="aspect-square relative overflow-hidden bg-slate-50">
                {product.images?.[0] ? (
                  <img 
                    src={product.images[0].imageUrl || product.images[0].url} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-200">
                    <Package size={48} strokeWidth={1} />
                    <p className="text-[10px] uppercase tracking-[0.2em] mt-2 font-bold">No Image Found</p>
                  </div>
                )}
                
                {/* Status Badge Overlays */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.15em] font-black backdrop-blur-md shadow-sm ${
                    product.status === 'Active' 
                      ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
                      : 'bg-orange-500/10 text-orange-600 border border-orange-500/20'
                  }`}>
                    {product.status}
                  </span>
                </div>

                {/* Quick Action Overlay */}
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-all duration-300">
                   {/* View Details Link (Whole Card Area) */}
                   <Link href={`/catalog/products/${product._id}`} className="absolute inset-0 z-10">
                      <span className="sr-only">View Details</span>
                   </Link>

                   {/* Edit Button (Top Right) */}
                   <Link 
                     href={`/dashboard/vendor/products/${product._id}`}
                     className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                   >
                      <button className="w-10 h-10 bg-white text-slate-900 rounded-xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-xl active:scale-90">
                        <Edit2 size={16} />
                      </button>
                   </Link>

                   {/* View Badge (Bottom Center) */}
                   <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75">
                      <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
                        <Eye size={14} className="text-slate-900" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">View Product</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                 <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mb-1">{product.categoryId?.name || "Uncategorized"}</p>
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate line-clamp-1 mb-3">{product.name}</h3>
                 
                 <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div>
                       <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5">Price</p>
                       <p className="text-base font-black text-slate-900">
                          {product.price.toLocaleString()} <span className="text-[10px] font-normal opacity-50">TK</span>
                       </p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5">Stock</p>
                       <p className={`text-xs font-bold ${product.stock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                          {product.stock} Units
                       </p>
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[3rem] py-32 text-center border-dashed">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <Package size={40} className="text-slate-200" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Inventory Empty</h3>
          <p className="text-xs text-slate-300 uppercase tracking-widest mt-2">Start your marketplace journey by listing your first product</p>
          <Link href="/dashboard/vendor/products/create">
            <button className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] uppercase tracking-widest font-black hover:bg-black transition-all">
              Initialize Product
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
