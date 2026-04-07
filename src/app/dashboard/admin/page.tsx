"use client";

import { 
  useGetDashboardDataQuery,
  useGetSalesAnalyticsQuery,
  useGetReturnAnalyticsQuery,
  useGetLogisticsStatusQuery,
  useGetOffersAuditQuery
} from "@/store/api/dashboardApi";
import { useUpdateWithdrawalStatusMutation } from "@/modules/finance/services/financeApi";
import { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import { Search, Filter, ChevronRight, Zap, Package, Wallet, Users, LayoutDashboard, TrendingUp, Settings, Eye, Plus, Truck, ArrowUpRight, BarChart3, AlertCircle, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

export default function AdminDashboard() {
  const { data: commissionData, isLoading: isReportLoading } = useGetDashboardDataQuery({});
  const { data: salesAnalytics, isLoading: isSalesLoading } = useGetSalesAnalyticsQuery('month');
  const { data: returnData, isLoading: isReturnsLoading } = useGetReturnAnalyticsQuery({});
  const { data: logisticsStatus, isLoading: isLogiLoading } = useGetLogisticsStatusQuery({});
  const { data: offersAudit, isLoading: isOffersLoading } = useGetOffersAuditQuery({});

  const [updateWithdrawal] = useUpdateWithdrawalStatusMutation();

  // 1. DATA AGGREGATION & FALLBACKS
  const sales = commissionData?.data?.salesAnalytics || { 
    today: { totalAmount: 0, orderCount: 0 }, 
    thisWeek: { totalAmount: 0, orderCount: 0 }, 
    thisMonth: { totalAmount: 0, orderCount: 0 } 
  };

  // Prepare chart data (Format: { name: 'Date', sales: 5000, orders: 10 })
  const chartData = useMemo(() => {
    if (!salesAnalytics?.data) return [];
    return salesAnalytics.data.map((item: any) => ({
      name: new Date(item._id).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      sales: item.totalSales || 0,
      orders: item.orderCount || 0
    }));
  }, [salesAnalytics]);

  const inventory = {
    totalUsers: commissionData?.data?.totalUsers || 0,
    totalVendors: commissionData?.data?.totalVendors || 0,
    totalPartners: commissionData?.data?.totalPartners || 0,
    discountedProducts: commissionData?.data?.totalProducts || 0
  };

  const logistics = {
    activeTrucksCount: logisticsStatus?.data?.activeTrucksCount || commissionData?.data?.activeTrucks || 0,
    pendingShipmentsCount: logisticsStatus?.data?.activeShipmentsCount || commissionData?.data?.pendingShipments || 0,
    deliveryPersonnel: logisticsStatus?.data?.totalDeliveryBoys || commissionData?.data?.deliveryPersonnel || 0,
    liveTrucks: logisticsStatus?.data?.liveTrucks || []
  };

  const returns = {
    totalPending: returnData?.data?.pendingReturns || 0,
    recentRequests: returnData?.data?.recentlyReturned || []
  };

  const offers = {
    discounts: offersAudit?.data?.discounts || [],
    flashSales: offersAudit?.data?.flashSales || [],
    combos: offersAudit?.data?.combos || []
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-12 pb-24 font-sans antialiased text-slate-900">
      {/* 1. HEADER & GLOBAL OPS STATUS */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">
            Marketplace <span className="text-indigo-600">Intelligence</span> <span className="text-slate-300 ml-2">V2.4</span>
          </h1>
          <p className="text-slate-500 font-bold text-sm tracking-wide mt-1">Cross-role operational surveillance and financial governance node.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-white border border-indigo-100 rounded-2xl flex items-center gap-3 shadow-xl shadow-indigo-100/20">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Logistics: Operational</span>
          </div>
        </div>
      </header>

      {/* 2. PRIMARY FINANCIAL STREAM (REAL-TIME) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-indigo-50 rounded-[40px] p-10 shadow-sm relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-100/50 transition-all">
          <TrendingUp className="absolute top-10 right-10 text-indigo-100 group-hover:text-indigo-600 transition-colors" size={60} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Today Revenue</p>
          <h3 className="text-4xl font-black mb-2 tracking-tighter text-slate-900">{sales.today?.totalAmount?.toLocaleString()} <span className="text-sm font-bold text-slate-300">TK</span></h3>
          <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full w-fit flex items-center gap-2">
            <Zap size={10} /> {sales.today?.orderCount} Real-time Orders
          </p>
        </div>

        <div className="bg-white border border-indigo-50 rounded-[40px] p-10 shadow-sm relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-100/50 transition-all">
          <BarChart3 className="absolute top-10 right-10 text-purple-100 group-hover:text-purple-600 transition-colors" size={60} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Weekly Volume</p>
          <h3 className="text-4xl font-black mb-2 tracking-tighter text-slate-900">{sales.thisWeek?.totalAmount?.toLocaleString()} <span className="text-sm font-bold text-slate-300">TK</span></h3>
          <p className="text-purple-600 text-[10px] font-black uppercase tracking-widest bg-purple-50 px-3 py-1.5 rounded-full w-fit">Active Growth Period</p>
        </div>

        <div className="bg-slate-900 rounded-[40px] p-10 shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl opacity-50" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Platform Gross</p>
          <h3 className="text-4xl font-black mb-2 tracking-tighter">{(commissionData?.data?.totalPlatformRevenue || 0).toLocaleString()} <span className="text-sm font-bold text-slate-500 uppercase">TK</span></h3>
          <div className="flex items-center gap-4 mt-6">
            <div className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">Commission: 10%</div>
          </div>
        </div>
      </div>

      {/* 3. VISUAL ANALYTICS (NEW) */}
      <section className="bg-white border border-slate-100 rounded-[48px] p-10 shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <div>
             <h2 className="text-xl font-black border-l-4 border-indigo-600 pl-4 uppercase tracking-tighter mb-1">Financial Intelligence Registry</h2>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Algorithmic Sales Volume Mapping (Period: Month)</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
             <Calendar size={14} className="text-slate-400" />
             <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Live Flow</span>
          </div>
        </div>

        <div className="h-[350px] w-full">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
               <defs>
                 <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                   <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
               <XAxis 
                 dataKey="name" 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} 
                 dy={10} 
               />
               <YAxis 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} 
                 tickFormatter={(value) => `${value}`}
               />
               <Tooltip 
                 cursor={{ fill: '#f8fafc', radius: 10 }}
                 contentStyle={{ 
                   borderRadius: '24px', 
                   border: '1px solid #e2e8f0', 
                   boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                   fontSize: '10px',
                   fontWeight: 900,
                   textTransform: 'uppercase'
                 }}
               />
               <Bar 
                 dataKey="sales" 
                 fill="url(#salesGradient)" 
                 radius={[12, 12, 4, 4]} 
                 barSize={32}
               >
                 {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.sales > 0 ? 'url(#salesGradient)' : '#f1f5f9'} 
                      className="hover:opacity-80 transition-opacity"
                    />
                 ))}
               </Bar>
             </BarChart>
           </ResponsiveContainer>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* MAIN OPERATIONAL FEED */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Ecosystem Grid */}
          <section className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-lg font-black border-l-4 border-indigo-600 pl-4 uppercase tracking-tighter">Ecosystem Surveillance</h2>
              <Settings className="text-slate-200" size={20} />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: inventory.totalUsers, color: 'indigo' },
                { label: 'Active Vendors', value: inventory.totalVendors, color: 'emerald' },
                { label: 'Hub Partners', value: inventory.totalPartners, color: 'amber' },
                { label: 'Riders/Boys', value: logistics.deliveryPersonnel, color: 'slate' }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:border-indigo-200 transition-all">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{item.label}</p>
                  <p className="text-2xl font-black text-slate-900 tracking-tighter">{item.value.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Logistics LIVE Flow */}
          <section className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5"><Truck size={120} /></div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-black border-l-4 border-slate-900 pl-4 uppercase tracking-tighter">Logistics Node Status</h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-white text-[8px] font-black rounded-lg uppercase tracking-widest">{logistics.activeTrucksCount} Fleet Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-5">
                <div className="size-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Package size={20} /></div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pending Shipments</p>
                  <p className="text-xl font-black text-slate-900 tracking-tight">{logistics.pendingShipmentsCount} Units</p>
                </div>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-5">
                <div className="size-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg"><Truck size={20} /></div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Multi-Trucks</p>
                  <p className="text-xl font-black text-slate-900 tracking-tight">{logistics.activeTrucksCount} In-Transit</p>
                </div>
              </div>
            </div>

            {/* Live Truck Registry (Detailed Section) */}
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 mb-4 border-b border-slate-50 pb-2">Active Fleet Details</h3>
            <div className="space-y-3">
              {logistics.liveTrucks.length > 0 ? logistics.liveTrucks.map((truck: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-50 hover:bg-white hover:border-slate-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="size-2 bg-emerald-500 rounded-full" />
                    <div>
                      <p className="text-[11px] font-black text-slate-900 uppercase">{truck.truckNumber || `TRUCK-0${i+1}`}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{truck.driverName || 'Verified Driver'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{truck.status}</p>
                    <p className="text-[9px] font-bold text-slate-300">Updated just now</p>
                  </div>
                </div>
              )) : (
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic py-4">No active fleet data at this node.</p>
              )}
            </div>
          </section>
        </div>

        {/* SIDE BAR INTELLIGENCE */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* Return Analytics Panel */}
          <section className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-base font-black px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full uppercase tracking-tighter flex items-center gap-2">
                <AlertCircle size={14} /> Returns Audit
              </h2>
              <span className="text-xl font-black text-slate-900">{returns.totalPending}</span>
            </div>
            
            <div className="space-y-4">
              {returns.recentRequests.length > 0 ? returns.recentRequests.map((req: any, i: number) => (
                <div key={i} className="p-4 bg-slate-50 rounded-3xl border border-slate-100 group cursor-pointer hover:border-rose-200 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-slate-900 uppercase">ID: {req.orderId?._id?.slice(-6) || 'N/A'}</span>
                    <span className="text-[8px] font-black px-2 py-0.5 bg-white border border-slate-200 rounded text-rose-500">{req.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-bold leading-tight">{req.reason || 'No reason provided'}</p>
                  <div className="flex justify-end mt-3">
                    <ArrowUpRight size={14} className="text-slate-300 group-hover:text-rose-500 transition-colors" />
                  </div>
                </div>
              )) : (
                <div className="py-10 text-center space-y-4">
                  <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200"><Package size={24} /></div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No active return nodes</p>
                </div>
              )}
            </div>
            
            <button className="w-full mt-6 bg-slate-900 text-white py-4 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-600 transition-all shadow-xl shadow-slate-900/10">
              Process Audits
            </button>
          </section>

          {/* Live Campaign Intelligence */}
          <section className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl opacity-50" />
            <div className="flex items-center justify-between mb-8 relative">
              <h2 className="text-base font-black flex items-center gap-3 uppercase tracking-tighter">
                <Zap size={18} className="text-indigo-400" /> Marketing Node
              </h2>
            </div>

            <div className="space-y-4 relative">
              {offers.flashSales.length > 0 ? offers.flashSales.map((sale: any, i: number) => (
                <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-[28px] backdrop-blur-sm group hover:border-indigo-500/50 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2.5 py-1 bg-indigo-600 rounded-lg text-[8px] font-black uppercase tracking-widest">Flash Sale</span>
                    <span className="text-[9px] font-black text-indigo-400 leading-none">ACTIVE NOW</span>
                  </div>
                  <p className="text-sm font-black uppercase tracking-tighter group-hover:text-indigo-400 transition-colors">{sale.name || 'PLATFORM_OFFER_01'}</p>
                </div>
              )) : (
                <div className="py-6 border border-dashed border-white/10 rounded-[28px] text-center">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Passive State</p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
               <div className="flex justify-between items-center px-4 py-3 bg-white/5 rounded-2xl">
                 <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Combo Packs</span>
                 <span className="text-sm font-black">{offers.combos.length}</span>
               </div>
               <div className="flex justify-between items-center px-4 py-3 bg-white/5 rounded-2xl">
                 <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Discounts</span>
                 <span className="text-sm font-black">{offers.discounts.length}</span>
               </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
