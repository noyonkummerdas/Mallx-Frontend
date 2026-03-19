"use client";

import { useGetDashboardDataQuery } from "@/store/api/dashboardApi";
import { useUpdateWithdrawalStatusMutation } from "@/modules/finance/services/financeApi";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Search, Filter, ChevronRight, Zap, Package, Wallet, Users, LayoutDashboard, TrendingUp, Settings, Eye, Plus, Truck } from "lucide-react";

export default function AdminDashboard() {
  const { data: commissionData, isLoading, error } = useGetDashboardDataQuery({});
  const [updateWithdrawal] = useUpdateWithdrawalStatusMutation();

  // Handle both { data: { ... } } and { ... } response structures
  const rawData = commissionData?.data || commissionData;
  const dashData = (rawData && typeof rawData === 'object' && 'salesAnalytics' in rawData) 
    ? rawData 
    : (commissionData?.data && typeof commissionData.data === 'object' && 'salesAnalytics' in commissionData.data)
      ? commissionData.data
      : null;

  const sales = dashData?.salesAnalytics || { today: { totalAmount: 0, orderCount: 0 }, thisWeek: { totalAmount: 0, orderCount: 0 }, thisMonth: { totalAmount: 0, orderCount: 0 } };

  // Search for statistics across all possible nodes
  const statsNode = commissionData?.data?.statistics || commissionData?.statistics || 
                    commissionData?.data?.inventoryStats || commissionData?.inventoryStats || 
                    commissionData?.data || commissionData;

  const inventory = {
    totalUsers: statsNode?.totalUsers || statsNode?.userCount || statsNode?.statistics?.totalUsers || 0,
    totalVendors: statsNode?.totalVendors || statsNode?.vendorCount || statsNode?.statistics?.totalVendors || 0,
    totalPartners: statsNode?.totalPartners || statsNode?.partnerCount || statsNode?.statistics?.totalPartners || 0,
    discountedProducts: statsNode?.discountedProducts || 0,
    activeCampaigns: statsNode?.activeCampaigns || 0
  };

  const logisticsNode = commissionData?.data?.logisticsOverview || commissionData?.logisticsOverview || 
                       commissionData?.data?.logistics || commissionData?.logistics || statsNode;

  const logistics = {
    activeTrucks: logisticsNode?.activeTrucks || 0,
    pendingShipments: logisticsNode?.pendingShipments || logisticsNode?.inTransitShipments || 0,
    deliveryPersonnel: logisticsNode?.deliveryPersonnel || logisticsNode?.totalDeliveryBoys || 0
  };

  const actionsNode = commissionData?.data?.actionableItems || commissionData?.actionableItems || 
                      commissionData?.data?.pendingActions || commissionData?.pendingActions || statsNode;

  const actions = {
    pendingReturnsCount: actionsNode?.pendingReturnsCount || actionsNode?.unresolvedReturns || 0,
    recentReturnRequests: actionsNode?.recentReturnRequests || [],
    vendorRecentActivity: actionsNode?.vendorRecentActivity || []
  };

  const activeOffers = commissionData?.data?.activeOffers || commissionData?.activeOffers || 
                       commissionData?.data?.marketing?.activeOffers || [];

  useEffect(() => {
    if (commissionData) {
      console.log("Admin Dashboard (Overview) - [SYNC] Latest Backend Data:", commissionData);
      console.group("!!! ECOSYSTEM COUNTERS !!!");
      console.log("Users:", inventory.totalUsers);
      console.log("Vendors:", inventory.totalVendors);
      console.log("Partners:", inventory.totalPartners);
      console.log("Logistics:", logistics.deliveryPersonnel);
      console.groupEnd();
    }
    if (error) {
      console.error("Admin Dashboard (Overview) - [ERROR] Backend Sync Failed:", error);
    }
  }, [commissionData, error, inventory, logistics]);

  return (
    <>
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-black tracking-tight mb-1 text-slate-900 uppercase leading-none">Marketplace Overlord</h1>
          <p className="text-slate-500 font-bold text-sm tracking-wide">Real-time ecosystem surveillance and financial governance.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-5 py-2.5 bg-white border border-indigo-200 rounded-xl flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
            <span className="text-sm font-black text-indigo-600 uppercase tracking-widest leading-none">Operational Live</span>
          </div>
        </div>
      </header>

      {/* Primary Financial Stream */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm border-l-4 border-l-indigo-600">
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Today's Revenue</p>
          <h3 className="text-base font-black mb-1 tracking-tighter text-slate-900">{sales.today?.totalAmount?.toLocaleString()} <span className="text-sm font-normal text-slate-400">TK</span></h3>
          <p className="text-indigo-600 text-sm font-black uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full w-fit">{sales.today?.orderCount} Valid Orders</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm border-l-4 border-l-emerald-600">
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Weekly Volume</p>
          <h3 className="text-base font-black mb-1 tracking-tighter text-slate-900">{sales.thisWeek?.totalAmount?.toLocaleString()} <span className="text-sm font-normal text-slate-400">TK</span></h3>
          <p className="text-emerald-600 text-sm font-black uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full w-fit">{sales.thisWeek?.orderCount} Valid Orders</p>
        </div>
        <div className="bg-slate-900 rounded-2xl p-6 shadow-xl shadow-slate-900/10 text-white">
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Monthly Target</p>
          <h3 className="text-base font-black mb-1 tracking-tighter">{sales.thisMonth?.totalAmount?.toLocaleString()} <span className="text-sm font-normal text-slate-400">TK</span></h3>
          <p className="text-white/20 text-sm font-black uppercase tracking-widest mt-1 font-mono">FIN-OPS-READY-V2</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-base font-black border-l-2 border-slate-900 pl-3 uppercase tracking-tighter mb-1">Ecosystem Statistics</h2>
                <p className="text-sm text-slate-400 uppercase tracking-widest font-bold ml-3">Entity and operational breakdown</p>
              </div>
              <TrendingUp size={20} className="text-slate-400" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Total Users</p>
                <p className="text-sm font-black text-slate-900">{inventory.totalUsers}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Active Vendors</p>
                <p className="text-sm font-black text-slate-900">{inventory.totalVendors}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Hub Partners</p>
                <p className="text-sm font-black text-slate-900">{inventory.totalPartners}</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-1">Logi Personnel</p>
                <p className="text-sm font-black text-indigo-700">{logistics.deliveryPersonnel}</p>
              </div>
            </div>

            <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-slate-50 pb-2">Transit Registry</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-100 rounded-2xl flex items-center gap-4 bg-slate-50/50">
                <div className="p-2 bg-slate-900 text-white rounded-lg"><Package size={16} /></div>
                <div>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-0.5">Pending Shipments</p>
                  <p className="text-sm font-black text-slate-900">{logistics.pendingShipments}</p>
                </div>
              </div>
              <div className="p-4 border border-slate-100 rounded-2xl flex items-center gap-4 bg-slate-50/50">
                <div className="p-2 bg-indigo-600 text-white rounded-lg"><Truck size={16} /></div>
                <div>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-0.5">Active Trucks</p>
                  <p className="text-sm font-black text-slate-900">{logistics.activeTrucks}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-base font-black border-l-2 border-orange-500 pl-3 uppercase tracking-tighter">Return Requests</h2>
                <span className="text-sm font-black bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full uppercase">{actions.pendingReturnsCount} NEW</span>
              </div>
              <div className="space-y-3">
                {actions.recentReturnRequests?.map((req: any, i: number) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-orange-200 transition-all">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-black text-slate-900 uppercase">{req.orderId}</span>
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded bg-white border border-slate-100 ${req.status === 'Pending' ? 'text-orange-500' : 'text-emerald-500'}`}>{req.status}</span>
                    </div>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-tighter">{req.reason}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              <h2 className="text-base font-black border-l-2 border-indigo-600 pl-3 uppercase tracking-tighter mb-8">Vendor Stream</h2>
              <div className="space-y-4">
                {actions.vendorRecentActivity?.map((act: any, i: number) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0 shadow-sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight mb-0.5">{act.vendor}</p>
                      <p className="text-sm text-slate-400 font-bold tracking-tighter mb-1">{act.action}</p>
                      <p className="text-sm text-slate-300 font-black uppercase tracking-widest font-mono">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <section className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={100} /></div>
            <h2 className="text-base font-black uppercase tracking-widest mb-8 flex items-center gap-2 border-b border-white/5 pb-4">
              <Zap size={14} className="text-indigo-400" />
              Live Campaigns
            </h2>
            <div className="space-y-4">
              {activeOffers.map((offer: any, i: number) => (
                <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm group hover:border-indigo-500/50 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-black px-2 py-0.5 bg-indigo-600 rounded-full uppercase tracking-widest">{offer.type}</span>
                    <div className="text-right">
                      <p className="text-sm text-white/40 line-through leading-none">{offer.originalPrice?.toLocaleString()} TK</p>
                      <p className="text-sm font-black text-indigo-400">{offer.discountPrice?.toLocaleString()} TK</p>
                    </div>
                  </div>
                  <p className="text-sm font-black uppercase tracking-tighter">{offer.product}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <h3 className="text-base font-black uppercase tracking-widest mb-6">Audit Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-black uppercase tracking-widest text-slate-400">Total Discounts</span>
                <span className="text-sm font-black text-slate-900">-{inventory.discountedProducts} SKUs</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-black uppercase tracking-widest text-slate-400">Active Promos</span>
                <span className="text-sm font-black text-slate-900">{inventory.activeCampaigns} Node</span>
              </div>
            </div>
            <button onClick={() => window.location.href = '/dashboard/admin/marketing'} className="w-full mt-6 bg-slate-900 text-white py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg">
              Audit Growth
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
