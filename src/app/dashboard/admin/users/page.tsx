"use client";

import { useEffect, useState } from "react";
import { Search, Filter, ChevronRight, Loader2, ShieldCheck, ShieldAlert, User as UserIcon, Plus } from "lucide-react";
import { useGetUsersQuery, useUpdateUserStatusMutation } from "@/store/api/userApi";

export default function UsersPage() {
  const { data: usersData, isLoading, isError, error, refetch } = useGetUsersQuery({});
  const [updateStatus, { isLoading: isUpdating }] = useUpdateUserStatusMutation();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

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
      {/* Search & Oversight Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 transition-all duration-500 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-[40px] w-full max-w-lg shadow-[0_32px_128px_rgba(0,0,0,0.1)] overflow-hidden relative animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all z-10"
            >
              <Plus size={24} className="rotate-45" />
            </button>
            
            <div className="h-32 bg-slate-900 relative">
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent" />
            </div>
            
            <div className="px-10 pb-10 -mt-16 relative">
              <div className="relative mb-6">
                <img 
                  src={getProfileImage(selectedUser.name, 0)}
                  alt={selectedUser.name}
                  className="w-28 h-28 rounded-[32px] object-cover border-8 border-white shadow-2xl bg-white"
                />
                <div className={`absolute bottom-2 left-24 w-6 h-6 rounded-full border-4 border-white ${selectedUser.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-rose-400'}`} />
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">
                    {selectedUser.name}
                  </h3>
                  <p className="text-sm font-black text-slate-400 lowercase tracking-tight mb-4">{selectedUser.email}</p>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] ${(selectedUser.role || selectedUser.roleId?.name) === 'Admin' ? 'bg-slate-900 text-white shadow-lg' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                      {(selectedUser.role || selectedUser.roleId?.name) || "Customer"}
                    </span>
                    <span className="px-3 py-1 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
                      UID: {selectedUser._id?.slice(-8).toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-50/50 rounded-3xl p-5 border border-slate-100 group hover:border-indigo-200 transition-all duration-300">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Registration</p>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </p>
                   </div>
                   <div className="bg-slate-50/50 rounded-3xl p-5 border border-slate-100 group hover:border-emerald-200 transition-all duration-300">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Security Verification</p>
                      <p className="text-xs font-black text-emerald-600 uppercase tracking-tighter">Authenticated</p>
                   </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex gap-4">
                   <button 
                    onClick={() => handleStatusChange(selectedUser._id, selectedUser.status)}
                    disabled={updatingId === selectedUser._id}
                    className={`flex-1 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-[0.98] shadow-lg ${selectedUser.status === 'Active' ? 'bg-rose-50 text-rose-500 hover:bg-rose-100 shadow-rose-500/5' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 shadow-emerald-500/5'}`}
                   >
                     {updatingId === selectedUser._id ? "Processing..." : (selectedUser.status === 'Active' ? "Deactivate Access" : "Restore Access")}
                   </button>
                   <button 
                    onClick={() => setSelectedUser(null)}
                    className="px-8 py-4 bg-slate-100 text-slate-400 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-900 hover:text-white transition-all active:scale-[0.98]"
                   >
                     Exit
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    <button 
                      onClick={() => setSelectedUser(user)}
                      className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 hover:bg-indigo-50 transition-all hover:scale-110 active:scale-95 shadow-sm"
                    >
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
