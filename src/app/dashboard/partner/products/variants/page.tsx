"use client";

import { useGetPartnerVariantsQuery } from "@/modules/business/services/businessApi";
import { 
  Package, Store, Tag, Database, 
  Layers, ChevronRight, Search, 
  ArrowUpRight, AlertCircle, ShoppingCart,
  Percent
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PartnerVariantsPage() {
  const { data: variantsData, isLoading, error } = useGetPartnerVariantsQuery({});
  const [searchTerm, setSearchTerm] = useState("");

  const variants = variantsData?.data?.variants || [];
  
  const filteredVariants = variants.filter((v: any) => 
    v.productId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.productId?.vendorId?.shopName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center opacity-40 font-black uppercase tracking-[0.3em] animate-pulse">
            Scanning Global Inventory...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20">
      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase leading-none mb-2 italic">Product Variants</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Total Network SKU Intelligence</p>
        </div>

        <div className="relative group min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search SKU, Product or Vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-6 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold uppercase tracking-wider outline-none focus:border-slate-900 transition-all shadow-sm"
          />
        </div>
      </header>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-900/10">
            <Layers size={18} className="text-indigo-400 mb-4" />
            <p className="text-2xl font-black">{variants.length}</p>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Unique SKUs</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <Database size={18} className="text-slate-400 mb-4" />
            <p className="text-2xl font-black text-slate-900">{variants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0)}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Network Stock</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <Store size={18} className="text-slate-400 mb-4" />
            <p className="text-2xl font-black text-slate-900">{Array.from(new Set(variants.map((v: any) => v.productId?.vendorId?._id))).length}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Active Merchants</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <Tag size={18} className="text-slate-400 mb-4" />
            <p className="text-2xl font-black text-slate-900">
                {(variants.reduce((acc: number, v: any) => acc + (v.price || 0), 0) / (variants.length || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Avg SKU Price (TK)</p>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 italic bg-slate-50/50">
                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-widest text-slate-400">Variant Identity</th>
                <th className="px-6 py-6 text-left text-[9px] font-black uppercase tracking-widest text-slate-400">Merchant</th>
                <th className="px-6 py-6 text-left text-[9px] font-black uppercase tracking-widest text-slate-400">Specs / SKU</th>
                <th className="px-6 py-6 text-left text-[9px] font-black uppercase tracking-widest text-slate-400">Commercials</th>
                <th className="px-6 py-6 text-left text-[9px] font-black uppercase tracking-widest text-slate-400">Availability</th>
                <th className="px-8 py-6 text-right text-[9px] font-black uppercase tracking-widest text-slate-400">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredVariants.length > 0 ? filteredVariants.map((variant: any) => (
                <tr key={variant._id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 text-slate-400">
                         <Package size={20} />
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {variant.productId?.name || "Unlinked Asset"}
                        </p>
                        <div className="flex gap-2 mt-1">
                            {variant.attributes && Object.entries(variant.attributes).map(([key, value]: any) => (
                                <span key={key} className="text-[8px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                                    {key}: {value}
                                </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                            {variant.productId?.vendorId?.shopName || "External Node"}
                        </p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <code className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        {variant.sku || "NO_SKU_LOG"}
                    </code>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 tracking-tighter">
                            {variant.price?.toLocaleString()} <span className="text-[9px] font-medium text-slate-400 italic">TK</span>
                        </span>
                        {variant.discountPrice && (
                            <span className="text-[9px] font-bold text-red-500 line-through opacity-50">
                                {variant.discountPrice.toLocaleString()} TK
                            </span>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-[60px]">
                            <div 
                                className={`h-full rounded-full transition-all ${variant.stock > 10 ? 'bg-green-500' : variant.stock > 0 ? 'bg-amber-400' : 'bg-red-500'}`}
                                style={{ width: `${Math.min((variant.stock / 50) * 100, 100)}%` }}
                            />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${variant.stock === 0 ? 'text-red-500 animate-pulse' : 'text-slate-900'}`}>
                            {variant.stock} <span className="text-[8px] text-slate-400 uppercase">Qty</span>
                        </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link 
                        href={`/dashboard/partner/vendors/${variant.productId?.vendorId?._id}`}
                        className="w-8 h-8 bg-white border border-slate-100 rounded-lg inline-flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm"
                    >
                        <ArrowUpRight size={14} />
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="opacity-20 flex flex-col items-center">
                        <AlertCircle size={48} className="mb-4" />
                        <h3 className="text-sm font-black uppercase tracking-[0.2em]">No Inventory Detected</h3>
                        <p className="text-[10px] font-bold mt-2 tracking-widest">Network SKUs will appear here once vendors list products.</p>
                    </div>
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
