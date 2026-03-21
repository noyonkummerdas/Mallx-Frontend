"use client";

import { useGetPartnerVendorDetailsQuery } from "@/modules/business/services/businessApi";
import { useParams } from "next/navigation";
import { 
  Store, User, Mail, Phone, Calendar, 
  Package, ShoppingBag, Percent, ArrowLeft,
  MapPin, ShieldCheck, Clock, ExternalLink,
  ChevronRight, AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function VendorDetailsPage() {
  const params = useParams();
  const { data: detailData, isLoading, error } = useGetPartnerVendorDetailsQuery(params.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center opacity-40 font-black uppercase tracking-[0.3em] animate-pulse">
            Fetching Merchant Intelligence...
        </div>
      </div>
    );
  }

  if (error || !detailData?.data) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-6 opacity-20" />
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-2">Sync Error</h2>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Unable to retrieve merchant data. Please verify permissions.</p>
        <Link href="/dashboard/partner/vendors" className="mt-8 inline-flex px-8 py-3 bg-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
            Return to Directory
        </Link>
      </div>
    );
  }

  const { vendor, shop, stats } = detailData.data;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header Navigation */}
      <header className="mb-10 flex items-center justify-between">
        <div>
          <Link href="/dashboard/partner/vendors" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all flex items-center gap-1 mb-2">
            <ArrowLeft size={10} /> Merchant Registry
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">{vendor.shopName}</h1>
            <span className={`px-2 py-0.5 border rounded-lg text-[9px] font-black uppercase tracking-widest ${
                vendor.status === 'Active' ? 'bg-green-500/10 text-green-600 border-green-200' : 
                vendor.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 border-amber-200' : 
                'bg-red-500/10 text-red-600 border-red-200'
            }`}>
                {vendor.status}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            <button className="h-12 px-6 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-slate-900 transition-all shadow-sm flex items-center gap-2">
                Export Audit <ExternalLink size={14} />
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Shop Canvas (Banner/Branding) */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 relative">
               {shop?.banner && <img src={shop.banner} alt="Banner" className="w-full h-full object-cover opacity-80" />}
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="p-8 relative -mt-12 flex items-end gap-6">
                <div className="w-24 h-24 bg-white rounded-3xl p-1 shadow-2xl">
                    <div className="w-full h-full bg-slate-50 rounded-[1.25rem] flex items-center justify-center border border-slate-100 overflow-hidden text-slate-400">
                        {shop?.logo ? <img src={shop.logo} alt="Logo" className="w-full h-full object-cover" /> : <Store size={32} />}
                    </div>
                </div>
                <div className="pb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trade Category</p>
                    <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900 bg-white inline-block px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                        {vendor.category?.name || "General Marketplace"}
                    </h2>
                </div>
            </div>
          </div>

          {/* Performance Dashboard */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <ShoppingBag size={20} className="text-indigo-600 mb-4" />
                <p className="text-2xl font-black text-slate-900">{stats.ordersCount}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Lifecycle Orders</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <Package size={20} className="text-indigo-600 mb-4" />
                <p className="text-2xl font-black text-slate-900">{stats.productsCount}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Inventory Units</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <Percent size={20} className="text-indigo-600 mb-4" />
                <p className="text-2xl font-black text-slate-900">{vendor.commissionRate || 0}%</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Revenue Share</p>
            </div>
          </div>

          {/* Detailed Narrative */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                <Settings2 size={14} /> Industrial Profile
            </h3>
            <div className="space-y-6">
                <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Business Brief</label>
                    <p className="text-[11px] font-bold text-slate-600 mt-2 leading-relaxed">
                        {vendor.shopDetails || "No descriptive intelligence provided for this merchant profile."}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Merchant ID</label>
                        <p className="text-[11px] font-black text-slate-900 mt-1 font-mono">{vendor._id}</p>
                    </div>
                    <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Onboarding Date</label>
                        <p className="text-[11px] font-black text-slate-900 mt-1">{new Date(vendor.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-900/10">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-6">Security & Contact</h3>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                            <User size={18} className="text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Principal User</p>
                            <p className="text-[11px] font-bold mt-1 uppercase tracking-tight">{vendor.userId?.name}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                            <Mail size={18} className="text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Encrypted Communication</p>
                            <p className="text-[11px] font-bold mt-1 break-all">{vendor.userId?.email}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                            <Phone size={18} className="text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Verified Contact</p>
                            <p className="text-[11px] font-bold mt-1">{vendor.userId?.phone || "N/A"}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-10 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldCheck size={14} className="text-indigo-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest">KYC Status</span>
                    </div>
                    <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest">Identity Verified</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                    <Clock size={12} /> Recent Activity
                </h3>
                <div className="space-y-6">
                    <div className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-indigo-600 before:rounded-full">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Registry Entry Created</p>
                        <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{new Date(vendor.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-center py-4 border-t border-slate-100 mt-4">
                         <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic">No further audit logs found.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

const Settings2 = ({ size, className }: { size?: number, className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>
    </svg>
)
