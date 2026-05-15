import { LayoutGrid } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12">
      <div className="max-w-[1600px] mx-auto">
        {/* Skeleton for Hero */}
        <div className="w-full h-[400px] bg-white rounded-[3rem] animate-pulse mb-24" />
        
        {/* Skeleton for Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="aspect-[3/4] bg-white rounded-[2.5rem] animate-pulse border border-slate-100 shadow-sm" />
              <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-1/3 bg-slate-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
