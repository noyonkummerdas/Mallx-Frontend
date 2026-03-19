"use client";

import { Package, Search, Filter, AlertCircle, ShoppingCart } from "lucide-react";
import { useGetAdminInventoryQuery } from "@/modules/catalog/services/catalogApi";

export default function AdminInventoryPage() {
  const { data: inventoryData, isLoading, error } = useGetAdminInventoryQuery({});

  const products = inventoryData?.data?.products || [];

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Global Inventory Control</h1>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">Surveillance of marketplace stock levels and variant distribution</p>
      </header>

      <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xs font-black border-l-2 border-slate-900 pl-3 uppercase tracking-tighter mb-1 font-mono">Stock Audit Queue</h2>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold ml-3">Aggregated inventory metrics</p>
          </div>
          <div className="flex gap-2">
             <button className="p-2 bg-slate-50 text-slate-400 rounded-lg"><Search size={14} /></button>
             <button className="p-2 bg-slate-50 text-slate-400 rounded-lg"><Filter size={14} /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Product / SKU</th>
                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Vendor</th>
                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Variants</th>
                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Stock</th>
                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={5} className="py-12 text-center text-[10px] uppercase font-bold text-slate-400 italic">Synchronizing Global Warehouse Data...</td></tr>
              ) : products.length > 0 ? products.map((product: any) => (
                <tr key={product._id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                         {product.images?.[0] ? <img src={product.images[0].imageUrl} className="w-full h-full object-cover rounded-xl" /> : <Package size={16} />}
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-slate-900 leading-none mb-1">{product.name}</p>
                        <p className="text-[9px] text-slate-400 font-mono tracking-tighter uppercase">{product.sku || 'NO-SKU'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5">
                    <p className="text-[10px] font-black text-slate-900 uppercase leading-none">{product.vendorId?.shopName || 'Unknown Shop'}</p>
                    <p className="text-[8px] text-slate-400 font-bold tracking-tight">{product.vendorId?.userId?.email}</p>
                  </td>
                  <td className="py-5">
                    <div className="flex -space-x-2">
                       {product.variants?.slice(0, 3).map((v: any, i: number) => (
                         <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-900 text-white text-[7px] flex items-center justify-center font-black uppercase">
                           {v.name.charAt(0)}
                         </div>
                       ))}
                       {product.variants?.length > 3 && (
                         <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 text-slate-400 text-[7px] flex items-center justify-center font-black">
                           +{product.variants.length - 3}
                         </div>
                       )}
                    </div>
                  </td>
                  <td className="py-5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-black ${product.totalInventory < 10 ? 'text-red-500' : 'text-slate-900'}`}>{product.totalInventory}</span>
                      {product.totalInventory < 10 && <AlertCircle size={10} className="text-red-500" />}
                    </div>
                  </td>
                  <td className="py-5">
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase shadow-sm ${
                      product.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="py-12 text-center text-[10px] uppercase font-bold text-slate-400 italic">No inventory records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
