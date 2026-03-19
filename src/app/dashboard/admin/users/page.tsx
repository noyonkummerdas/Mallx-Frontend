"use client";

import { useEffect } from "react";
import { Search, Filter, ChevronRight } from "lucide-react";
import { useGetUsersQuery } from "@/store/api/userApi";

export default function UsersPage() {
  const { data: usersData, isLoading, isError, error } = useGetUsersQuery({});

  useEffect(() => {
    console.log("Admin Users Page - [STATE]:", { usersData, isLoading, isError, error });
    if (usersData) console.log("Admin Users Page - [QUERY] All Users Data:", usersData);
  }, [usersData, isLoading, isError, error]);

  const users = usersData?.data?.users || [];

  return (
    <>
      <header className="mb-8">
        <h1 className="text-lg font-black tracking-tight mb-1 text-slate-900 uppercase leading-none">Universal Profiling</h1>
        <p className="text-slate-500 font-bold italic text-[10px] tracking-wide">Ecosystem-wide identity and activity monitoring.</p>
      </header>

      <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-slate-900">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xs font-black border-l-2 border-indigo-600 pl-3 uppercase tracking-tighter mb-1">Live User Feed</h2>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold ml-3">System-wide profile monitoring</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-indigo-600 transition-colors"><Search size={14} /></button>
            <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-indigo-600 transition-colors"><Filter size={14} /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 italic">
                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Identity</th>
                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Activity</th>
                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={4} className="py-8 text-center text-[10px] uppercase font-bold text-slate-400">Loading Registry...</td></tr>
              ) : users.length > 0 ? users.map((user: any, i: number) => (
                <tr key={user._id || i} className="group hover:bg-slate-50/50 transition-all">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-[10px] uppercase shadow-sm">
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-slate-900 leading-none mb-1">{user.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold tracking-tight">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${(user.role || user.roleId?.name) === 'Admin' ? 'bg-slate-900 text-white' :
                      (user.role || user.roleId?.name) === 'Vendor' ? 'bg-indigo-50 text-indigo-600' :
                        (user.role || user.roleId?.name) === 'Partner' ? 'bg-emerald-50 text-emerald-600' :
                          'bg-slate-100 text-slate-500'
                      }`}>
                      {user.role || user.roleId?.name || "Customer"}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-slate-300'}`} />
                      <span className="text-[9px] font-bold text-slate-900">{user.status || "Unknown"}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><ChevronRight size={14} /></button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="py-8 text-center text-[10px] uppercase font-bold text-slate-400 italic">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
