"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/modules/identity/services/authApi";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole?: "admin" | "vendor" | "partner" | "delivery" | "customer";
}

/**
 * RoleGuard Component
 * Enforces authentication and role-based access control.
 * 1. Checks for 'mallx_token' in localStorage.
 * 2. Redirects to /auth/login if unauthenticated.
 * 3. Verified user role against allowedRole if provided.
 */
export default function RoleGuard({ children, allowedRole }: RoleGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { data: userData, isLoading, isError } = useGetMeQuery({}, {
    // Only run the query if we think we have a token
    skip: typeof window === 'undefined' || !localStorage.getItem("mallx_token")
  });

  useEffect(() => {
    const token = localStorage.getItem("mallx_token");

    if (!token) {
      console.warn("RoleGuard - [AUTH] No token found, redirecting to login.");
      router.push("/auth/login");
      return;
    }

    if (!isLoading && !userData && isError) {
      console.error("RoleGuard - [AUTH] Token invalid or expired, redirecting to login.");
      localStorage.removeItem("mallx_token");
      router.push("/auth/login");
      return;
    }

    if (!isLoading && userData) {
      const user = userData?.data?.user;
      const userRole = user?.role?.toLowerCase();
      
      if (allowedRole && userRole !== allowedRole.toLowerCase()) {
        console.warn(`RoleGuard - [AUTH] Role mismatch. Expected: ${allowedRole}, Found: ${userRole}. Redirecting to respective dashboard.`);
        // Redirect to their own dashboard instead of login
        const dashboardMap: Record<string, string> = {
          admin: "/dashboard/admin",
          vendor: "/dashboard/vendor",
          partner: "/dashboard/partner",
          deliveryboy: "/dashboard/delivery",
          customer: "/dashboard/customer"
        };
        router.push(dashboardMap[userRole] || "/dashboard/customer");
        return;
      }

      setIsAuthorized(true);
    }
  }, [userData, isLoading, isError, allowedRole, router]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">
          Authenticating Nexus...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
