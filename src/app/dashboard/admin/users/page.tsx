"use client";

import { useEffect, useState } from "react";
import { Search, Filter, ChevronRight, Loader2, ShieldCheck, ShieldAlert, User as UserIcon } from "lucide-react";
import { useGetUsersQuery, useUpdateUserStatusMutation } from "@/store/api/userApi";

export default function UsersPage() {
  const { data: usersData, isLoading, isError, error, refetch } = useGetUsersQuery({});
  const [updateStatus, { isLoading: isUpdating }] = useUpdateUserStatusMutation();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // High-performance placeholder image generator
  const getProfileImage = (name: string, i: number) => {
    const ids = ['1535713875002-d1d0cf377fde', '1494790108377-be9c29b29330', '1599566150163-29194dcaad36', '1438761681033-6461ffad8d80', '1472099645785-5658abf4ff4e'];
    return `https://images.unsplash.com/photo-${ids[i % 5]}?auto=format&fit=crop&w=100&q=80`;
  };

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      setUpdatingId(id);
      await updateStatus({ id, status: newStatus }).unwrap();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const users = usersData?.data?.users || [];

  return (
    <>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-base font-black tracking-tight mb-1 text-slate-900 uppercase leading-none">Universal Profiling</h1>
          <p className="text-slate-500 font-bold text-sm tracking-wide">Ecosystem-wide identity and activity monitoring.</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="p-3 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-indigo-600 transition-all active:rotate-180 duration-500 shadow-sm"
        >
          <Search size={16} className="rotate-45 text-slate-300" />
        </button>
      </header>

      {isError && (
        <div className="mb-8 p-6 bg-red-900 text-white rounded-[32px] flex flex-col gap-4 shadow-2xl shadow-red-500/20 animate-in zoom-in duration-300">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl font-black text-sm">ERR_{(error as any)?.status || "500"}</div>
            <div className="flex-1">
              <h3 className="text-base font-black uppercase tracking-widest mb-1">Ecosystem Sync Failure</h3>
              <p className="text-sm font-bold opacity-70">The registry service is currently unresponsive. Re-authentication may be required.</p>
            </div>
            <button onClick={() => refetch()} className="px-5 py-2 bg-white text-red-900 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Retry Sync</button>
          </div>
        </div>
      )}

      <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-slate-900 relative">
        {isUpdating && (
          <div className="absolute top-8 right-8 animate-pulse text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
            <Loader2 size={10} className="animate-spin" />
            Propagating Changes...
          </div>
        )}
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-base font-black border-l-2 border-indigo-600 pl-3 uppercase tracking-tighter mb-1">Live User Feed</h2>
            <p className="text-sm text-slate-400 uppercase tracking-widest font-bold ml-3">System-wide profile monitoring</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Identity</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Role Cluster</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Security Status</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right px-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                [1, 2, 3, 4, 5].map((idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-5 px-2">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100" />
                        <div className="space-y-2">
                          <div className="h-3 w-28 bg-slate-100 rounded-md" />
                          <div className="h-2.5 w-40 bg-slate-50 rounded-md" />
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-2">
                      <div className="h-6 w-20 bg-slate-100 rounded-xl" />
                    </td>
                    <td className="py-5 px-2 text-right">
                       <div className="h-4 w-16 bg-slate-50 rounded-md ml-auto" />
                    </td>
                    <td className="py-5 px-2 text-right">
                       <div className="w-8 h-8 rounded-xl bg-slate-50 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : users.length > 0 ? users.map((user: any, i: number) => (
                <tr key={user._id || i} className="group hover:bg-slate-50/50 transition-all">
                  <td className="py-5 px-2">
                    <div className="flex items-center gap-4">
                      <div className="relative group/avatar">
                        <img 
                          src={getProfileImage(user.name, i)}
                          alt={user.name}
                          className="w-10 h-10 rounded-2xl object-cover bg-slate-100 shadow-md shadow-slate-900/5 group-hover/avatar:scale-110 transition-transform duration-300"
                          onError={(e: any) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0f172a&color=fff&bold=true`;
                          }}
                        />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-900 leading-none mb-1.5 truncate uppercase tracking-tighter">{user.name}</p>
                        <p className="text-[11px] text-slate-400 font-black tracking-tight lowercase truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-2">
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 ${(user.role || user.roleId?.name) === 'Admin' ? 'bg-slate-900 text-white' :
                      (user.role || user.roleId?.name) === 'Vendor' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                        (user.role || user.roleId?.name) === 'Partner' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          'bg-slate-50 text-slate-400 border border-slate-100'
                      }`}>
                      {(user.role || user.roleId?.name) || "Customer"}
                    </span>
                  </td>
                  <td className="py-5 px-2">
                    <button 
                      onClick={() => handleStatusChange(user._id, user.status)}
                      disabled={updatingId === user._id}
                      className={`flex items-center gap-2 group/status transition-all ${user.status === 'Active' ? 'text-emerald-600' : 'text-rose-400'}`}
                    >
                      <div className={`w-2 h-2 rounded-full transition-all ${user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-rose-400'}`} />
                      <span className="text-xs font-black uppercase tracking-tighter group-hover/status:underline whitespace-nowrap lowercase">
                        {updatingId === user._id ? "Updating..." : (user.status || "Unknown")}
                      </span>
                    </button>
                  </td>
                  <td className="py-5 px-2 text-right">
                    <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                       {user.status === 'Active' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="py-8 text-center text-sm uppercase font-bold text-slate-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
