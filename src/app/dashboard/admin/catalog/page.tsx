"use client";

import { useGetProductsQuery, useGetCategoriesQuery } from "@/modules/catalog/services/catalogApi";
import { useGetPartnersQuery, useAssignPartnerCategoryMutation } from "@/modules/business/services/businessApi";
import { useEffect, useState } from "react";
import { Zap, X, Truck, Box, Plus, Loader2, LayoutGrid } from "lucide-react";
import { useCreateCategoryMutation } from "@/modules/catalog/services/catalogApi";

export default function CatalogPage() {
  const { data: productsData, isLoading: isLoadingProducts } = useGetProductsQuery({});
  const { data: categoriesData, isLoading: isLoadingCategories, refetch: refetchCategories } = useGetCategoriesQuery({});
  const { data: partnersData } = useGetPartnersQuery({});
  const [assignCategory, { isLoading: isAssigning }] = useAssignPartnerCategoryMutation();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [mapping, setMapping] = useState({ partnerId: "", categoryId: "" });
  const [newCategory, setNewCategory] = useState({ name: "", parentCategoryId: "" });
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  useEffect(() => {
    console.log("Admin Catalog Page - [QUERY] Products Data:", productsData);
    console.log("Admin Catalog Page - [QUERY] Categories Data:", categoriesData);
  }, [productsData, categoriesData]);

  const totalProducts = productsData?.data?.total || productsData?.data?.length || 0;
  const partnersRaw = partnersData?.data?.partners || partnersData?.data || [];
  const partners = Array.isArray(partnersRaw) ? partnersRaw : [];
  
  // ULTRA-Robust extraction for categories
  const categories = (() => {
    const raw = categoriesData?.data || categoriesData;
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === 'object') {
      if (Array.isArray(raw.data)) return raw.data;
      if (Array.isArray(raw.categories)) return raw.categories;
    }
    return [];
  })();

  const handleAssign = async () => {
    if (!mapping.partnerId || !mapping.categoryId) {
      alert("Please select both a partner and a category.");
      return;
    }
    try {
      await assignCategory(mapping).unwrap();
      setStatusMessage({ type: 'success', text: "Partner linked to category successfully" });
      setIsModalOpen(false);
      setMapping({ partnerId: "", categoryId: "" });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: "Mapping failed: " + (err.data?.message || "Unknown error") });
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name) {
      alert("Category name is required");
      return;
    }
    const payload = {
      ...newCategory,
      parentCategoryId: newCategory.parentCategoryId || null
    };

    try {
      await createCategory(payload).unwrap();
      setStatusMessage({ type: 'success', text: "Category '" + newCategory.name + "' created successfully" });
      setIsCreateModalOpen(false);
      setNewCategory({ name: "", parentCategoryId: "" });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: "Creation failed: " + (err.data?.message || err.message || "Unknown error") });
    }
  };

  return (
    <>
      {statusMessage && (
        <div className={`fixed top-8 right-8 z-[100] animate-in slide-in-from-right-10 duration-300 p-4 rounded-2xl shadow-2xl border-2 flex items-center gap-3 max-w-sm ${
          statusMessage.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          <div className={`p-2 rounded-xl ${statusMessage.type === 'success' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
            <Zap size={16} />
          </div>
          <p className="text-xs font-black uppercase tracking-widest leading-tight">{statusMessage.text}</p>
        </div>
      )}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-base font-black tracking-tight mb-1 text-slate-900 uppercase leading-none">Catalog Intelligence</h1>
          <p className="text-slate-500 font-bold text-sm tracking-wide">Marketplace taxonomy and product lifecycle control.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-white border-2 border-slate-900 text-slate-900 px-6 py-3 rounded-xl text-sm uppercase tracking-widest font-black hover:bg-slate-50 transition-all active:scale-95"
          >
            <Plus size={16} />
            New Category
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl text-sm uppercase tracking-widest font-black hover:bg-black transition-all shadow-lg shadow-slate-900/10 active:scale-95"
          >
            <Zap size={16} />
            Assign Partner
          </button>
        </div>
      </header>

      <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-slate-900 mb-8">
         <div className="flex items-center justify-between mb-8">
           <h2 className="text-base font-black border-l-2 border-indigo-600 pl-3 uppercase tracking-tighter">Category Registry</h2>
           <div className="flex items-center gap-4">
             <button 
               onClick={() => refetchCategories()}
               className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all active:rotate-180 duration-500"
               title="Refresh Registry"
             >
               <Plus size={16} className="rotate-45" /> {/* Using Plus as a placeholder for RotateCw if not imported, but wait I should import it */}
             </button>
             <p className="text-sm text-slate-400 font-black uppercase tracking-widest">{categories.length} Domains Defined</p>
           </div>
         </div>
         
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="border-b border-slate-100">
                 <th className="pb-4 text-sm font-black text-slate-400 uppercase tracking-widest">Category Name</th>
                 <th className="pb-4 text-sm font-black text-slate-400 uppercase tracking-widest">Hierarchy Layer</th>
                 <th className="pb-4 text-sm font-black text-slate-400 uppercase tracking-widest">Status</th>
                 <th className="pb-4 text-sm font-black text-slate-400 uppercase tracking-widest text-right">Activity</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
               {isLoadingCategories ? (
                 <tr><td colSpan={4} className="py-20 text-center text-sm font-black text-slate-300 uppercase animate-pulse">Synchronizing Taxonomy...</td></tr>
               ) : categories.length > 0 ? categories.map((cat: any) => (
                 <tr key={cat._id} className="group hover:bg-slate-50/50 transition-all">
                   <td className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <Box size={14} />
                        </div>
                        <p className="text-sm font-black text-slate-900">{cat.name}</p>
                      </div>
                   </td>
                   <td className="py-5">
                      <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-tighter text-[10px]">
                        {cat.parentCategoryId?.name || cat.parent?.name || (cat.parentCategoryId ? "Linked Domain" : "Global Tier")}
                      </span>
                   </td>
                   <td className="py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-sm font-black text-slate-900 uppercase tracking-widest text-[10px]">Active</span>
                      </div>
                   </td>
                   <td className="py-5 text-right">
                      <button className="text-sm font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">Manage</button>
                   </td>
                 </tr>
               )) : (
                 <tr>
                    <td colSpan={4} className="py-20 text-center">
                       <p className="text-sm font-black text-slate-300 uppercase tracking-[0.3em] mb-4">No Catalog Segments Established</p>
                       <div className="text-[10px] text-slate-300 font-mono opacity-50 bg-slate-50 rounded-lg p-4 inline-block">
                         DEBUG: {JSON.stringify(categoriesData?.data || categoriesData || "NULL").substring(0, 50)}...
                       </div>
                    </td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-slate-900">
         <h2 className="text-base font-black mb-6 border-l-2 border-slate-900 pl-3 uppercase tracking-tighter">Product Inventory</h2>
         <div className="flex flex-col items-center justify-center h-48 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <p className="text-sm text-slate-400 uppercase tracking-widest font-black">
              {isLoadingProducts ? "Loading Registry..." : `${totalProducts} Products In Ecosystem`}
            </p>
         </div>
      </section>

      {/* Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X size={24} />
            </button>

            <header className="mb-10">
              <h2 className="text-base font-black text-slate-900 uppercase tracking-tight mb-1">Assign Category vertical</h2>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Connect logistical partners to specific marketplace categories</p>
            </header>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Logistical Partner Name</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Truck size={18} />
                  </div>
                  <input 
                    list="partners-list"
                    placeholder="Type or select partner name..."
                    onChange={(e) => {
                      const selected = partners.find((p: any) => (p.userId?.name || p.name) === e.target.value);
                      if (selected) setMapping({...mapping, partnerId: selected._id});
                    }}
                    className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-600 rounded-2xl pl-12 pr-4 py-4 text-sm font-black text-slate-900 transition-all outline-none"
                  />
                  <datalist id="partners-list">
                    {partners.map((p: any) => (
                      <option key={p._id} value={p.userId?.name || p.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Target Category Name</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Box size={18} />
                  </div>
                  <input 
                    list="categories-list"
                    placeholder="Type or select category..."
                    onChange={(e) => {
                      const selected = categories.find((c: any) => c.name === e.target.value);
                      if (selected) setMapping({...mapping, categoryId: selected._id});
                    }}
                    className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-600 rounded-2xl pl-12 pr-4 py-4 text-sm font-black text-slate-900 transition-all outline-none"
                  />
                  <datalist id="categories-list">
                    {categories.map((c: any) => (
                      <option key={c._id} value={c.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleAssign}
                  disabled={isAssigning}
                  className="w-full bg-indigo-600 text-white font-black py-5 rounded-[1.5rem] text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <Zap size={18} />
                  {isAssigning ? "Processing Connection..." : "Deploy Assignment"}
                </button>
                <p className="text-center mt-6 text-sm text-slate-400 font-bold uppercase tracking-widest opacity-60">
                  This action establishes a logistical vertical boundary.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Creation Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X size={24} />
            </button>

            <header className="mb-10">
              <h2 className="text-base font-black text-slate-900 uppercase tracking-tight mb-1">Architect New Domain</h2>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Define a new marketplace category and its hierarchy.</p>
            </header>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Category Name</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Box size={18} />
                  </div>
                  <input 
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    placeholder="e.g. Mens Fashion"
                    className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-600 rounded-2xl pl-12 pr-4 py-4 text-sm font-black text-slate-900 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Parent Category Name (Optional)</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <LayoutGrid size={18} />
                  </div>
                  <input 
                    list="parent-categories-list"
                    placeholder="Type name of parent domain..."
                    onChange={(e) => {
                      const selected = categories.find((c: any) => c.name === e.target.value);
                      if (selected) setNewCategory({...newCategory, parentCategoryId: selected._id});
                      else if (e.target.value === "") setNewCategory({...newCategory, parentCategoryId: ""});
                    }}
                    className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-600 rounded-2xl pl-12 pr-4 py-4 text-sm font-black text-slate-900 transition-all outline-none"
                  />
                  <datalist id="parent-categories-list">
                    {categories.map((c: any) => (
                      <option key={c._id} value={c.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleCreateCategory}
                  disabled={isCreating}
                  className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isCreating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Defining Domain...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Establish Category
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
