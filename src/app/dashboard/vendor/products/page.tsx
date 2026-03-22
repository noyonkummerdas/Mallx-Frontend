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

      {/* Product Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-sm uppercase tracking-[0.2em] font-black text-slate-400">Product Details</th>
                <th className="px-6 py-4 text-sm uppercase tracking-[0.2em] font-black text-slate-400">SKU / ID</th>
                <th className="px-6 py-4 text-sm uppercase tracking-[0.2em] font-black text-slate-400">Price</th>
                <th className="px-6 py-4 text-sm uppercase tracking-[0.2em] font-black text-slate-400">Inventory</th>
                <th className="px-6 py-4 text-sm uppercase tracking-[0.2em] font-black text-slate-400">Status</th>
                <th className="px-6 py-4 text-sm uppercase tracking-[0.2em] font-black text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-['Inter']">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Loading Catalog...</p>
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? filteredProducts.map((product: any) => (
                <tr key={product._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0">
                        {product.images && product.images[0] ? (
                          <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm text-slate-300">N/A</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 uppercase truncate mb-0.5">{product.name}</p>
                        <p className="text-sm text-slate-400 uppercase tracking-widest">{product.categoryId?.name || "Uncategorized"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-mono text-slate-500 uppercase">{product.sku || product._id.slice(-8)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{product.price.toLocaleString()} TK</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                      <p className="text-xs font-medium text-slate-700">{product.stock} Units</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-sm uppercase tracking-[0.1em] font-black ${
                      product.status === 'Active' ? 'bg-green-50 text-green-600' : 
                      product.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/catalog/products/${product._id}`} target="_blank">
                         <button title="View Live" className="p-2 hover:bg-white hover:text-blue-600 rounded-lg border border-transparent hover:border-slate-200 transition-all">
                           <Eye size={14} />
                         </button>
                      </Link>
                      <Link href={`/dashboard/vendor/products/${product._id}`}>
                         <button title="Edit Details" className="p-2 hover:bg-white hover:text-slate-900 rounded-lg border border-transparent hover:border-slate-200 transition-all">
                           <Edit2 size={14} />
                         </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="mb-4 opacity-10">
                       <Package size={48} className="mx-auto" />
                    </div>
                    <p className="text-sm text-slate-400 uppercase tracking-widest">No products found in your inventory</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
