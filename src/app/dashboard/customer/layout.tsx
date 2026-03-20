"use client";

import Sidebar from "@/components/Sidebar";
import RoleGuard from "@/modules/identity/components/RoleGuard";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRole="customer">
      <div className="flex bg-slate-50 min-h-screen">
        <Sidebar role="customer" />
        <main className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </RoleGuard>
  );
}
