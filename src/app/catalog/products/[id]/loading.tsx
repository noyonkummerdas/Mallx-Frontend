export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white pt-10 pb-8 h-[240px]">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          <div className="w-48 h-3 bg-slate-100 rounded" />
          <div className="w-2/3 h-12 bg-slate-200 rounded-xl" />
          <div className="w-1/3 h-6 bg-slate-100 rounded" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="sticky top-[72px] z-40 bg-white border-b border-slate-100 py-3">
        <div className="max-w-7xl mx-auto px-6 flex gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-32 h-10 bg-slate-50 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="aspect-video bg-white rounded-3xl border border-slate-100 p-8" />
            <div className="mt-8 h-64 bg-white rounded-3xl border border-slate-100 p-8" />
          </div>
          <div className="lg:col-span-4">
            <div className="h-[500px] bg-white rounded-3xl border border-slate-100 p-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
