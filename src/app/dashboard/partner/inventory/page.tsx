"use client";

import { useGetPartnerInventoryQuery } from "@/modules/business/services/businessApi";
import { ShoppingCart, Package, Store, AlertCircle } from "lucide-react";

export default function PartnerInventoryPage() {
  const { data: inventoryData, isLoading } = useGetPartnerInventoryQuery({});
  const products = inventoryData?.data?.products || [];

  return (
    <div className="max-w-6xl mx-auto text-slate-900">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-black tracking-tight mb-1 uppercase leading-none">Merchant Inventory</h1>
          <p className="text-slate-500 font-bold text-xs tracking-wide">Aggregated oversight of all vendor listings across your region.</p>
        </div>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 italic">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Merchant</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Product</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Stock</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.length > 0 ? products.map((item: any) => (
                <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Store size={14} />
                       </div>
                       <span className="text-[11px] font-black uppercase tracking-tight">{item.vendorId?.shopName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[11px] font-bold text-slate-600">{item.name}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.categoryId?.name}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <span className={`text-[11px] font-black ${item.stock < 10 ? 'text-orange-500' : 'text-slate-900'}`}>{item.stock}</span>
                       {item.stock < 10 && <AlertCircle size={12} className="text-orange-500" />}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[11px] font-black">{item.price?.toLocaleString()} TK</span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <p className="text-slate-300 font-bold uppercase tracking-widest text-xs italic">No stock records synchronized from merchants.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
