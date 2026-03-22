"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  useGetProductDetailsQuery, 
  useUpdateProductMutation, 
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useUploadProductImageMutation
} from "@/modules/catalog/services/catalogApi";
import { CATEGORY_FIELDS } from "@/modules/catalog/constants/categoryFields";
import { 
  ArrowLeft, 
  Trash2, 
  ChevronRight, 
  TrendingUp, 
  ShoppingBag,
  ExternalLink,
  Eye,
  Plus
} from "lucide-react";
import Link from "next/link";

export default function ProductEditPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const { data: productData, isLoading: isProductLoading } = useGetProductDetailsQuery(id);
  const { data: categoriesData } = useGetCategoriesQuery({});
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    status: ""
  });
  const [dynamicAttributes, setDynamicAttributes] = useState<Record<string, string>>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (productData?.data?.product) {
      const p = productData.data.product;
      setFormData({
        name: p.name,
        description: p.description,
        price: p.price.toString(),
        stock: p.stock.toString(),
        categoryId: p.categoryId?._id || p.categoryId,
        status: p.status
      });
      if (p.attributes && Array.isArray(p.attributes)) {
        const attrRecord: Record<string, string> = {};
        p.attributes.forEach((attr: { key: string; value: string }) => {
          attrRecord[attr.key] = attr.value;
        });
        setDynamicAttributes(attrRecord);
      } else {
        setDynamicAttributes({});
      }
      if (p.images) {
        setImagePreviews(p.images.map((img: any) => img.url));
      }
    }
  }, [productData]);

  const categories = categoriesData?.data || [];
  const selectedCategoryName = categories.find((c: any) => c._id === formData.categoryId)?.name || "";
  const extraFields = CATEGORY_FIELDS[selectedCategoryName] || [];

  const handleUpdate = async (e: React.FormEvent) => {
    if (!formData.name || !formData.price || !formData.categoryId) {
      alert("Please fill in all required fields (Name, Price, Category).");
      return;
    }

    try {
      await updateProduct({
        id,
        productData: {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          attributes: Object.entries(dynamicAttributes).map(([key, value]) => ({
            key,
            value
          }))
        }
      }).unwrap();
      
      alert("Product updated successfully!");
    } catch (err: any) {
      console.error("Update failed:", err);
      const errorMsg = err.data?.message || err.error || "Failed to update product.";
      alert(`Error: ${errorMsg}`);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        await deleteProduct(id).unwrap();
        router.push("/dashboard/vendor/products");
      } catch (err) {
        alert("Deletion failed.");
      }
    }
  };

  if (isProductLoading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto py-8">
      {/* Breadcrumbs & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold">
          <Link href="/dashboard/vendor/products" className="text-slate-400 hover:text-black transition-colors flex items-center gap-2">
            <ArrowLeft size={14} /> Inventory
          </Link>
          <ChevronRight size={12} className="text-slate-200" />
          <span className="text-slate-900">{formData.name}</span>
        </div>
        
        <div className="flex items-center gap-3">
           <Link href={`/catalog/products/${id}`} target="_blank">
              <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-900 px-5 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-slate-50 transition-all shadow-sm">
                <ExternalLink size={14} /> View Live
              </button>
           </Link>
           <button 
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-red-100 transition-all"
           >
            <Trash2 size={14} /> Delete
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Form (8 Units) */}
        <form onSubmit={handleUpdate} className="lg:col-span-8 space-y-10">
          
          {/* Performance Mini-Dashboard */}
          <div className="grid grid-cols-3 gap-6">
             {[
               { label: "Total Views", value: "2.4k", icon: Eye, color: "blue" },
               { label: "Sales Made", value: "48", icon: ShoppingBag, color: "green" },
               { label: "Conv. Rate", value: "3.2%", icon: TrendingUp, color: "emerald" }
             ].map((stat, i) => (
               <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                  <div className={`w-8 h-8 bg-${stat.color}-50 text-${stat.color}-600 rounded-lg flex items-center justify-center mb-4`}>
                    <stat.icon size={16} />
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{stat.label}</p>
                  <p className="text-lg font-black text-slate-900 mt-1">{stat.value}</p>
               </div>
             ))}
          </div>

          {/* General Info */}
          <div className="bg-white border border-slate-300 rounded-2xl p-8 shadow-sm">
             <h4 className="text-[11px] text-black uppercase tracking-[0.2em] font-semibold mb-10">01. General Specifications</h4>
             
             <div className="space-y-10">
                <div className="group">
                    <label className="text-[9px] text-slate-500 uppercase tracking-[0.25em] font-medium mb-4 block group-focus-within:text-black transition-all">Product Name</label>
                    <input 
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[#fcfcfc] border-b-2 border-slate-200 px-0 py-4 outline-none text-xl text-black font-semibold placeholder:text-slate-300 focus:border-black transition-all"
                        placeholder="e.g. Premium Wireless Headphones"
                    />
                </div>

                <div className="group">
                    <label className="text-[9px] text-slate-500 uppercase tracking-[0.25em] font-medium mb-4 block group-focus-within:text-black transition-all">Description</label>
                    <textarea 
                        required
                        rows={6}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-[#fcfcfc] border-b-2 border-slate-200 px-0 py-4 outline-none text-sm text-black font-medium leading-relaxed placeholder:text-slate-300 focus:border-black transition-all resize-none"
                        placeholder="Detailed product information..."
                    />
                </div>
             </div>
          </div>

          {/* Dynamic Category Specifications */}
          {extraFields.length > 0 && (
              <div className="bg-white border border-slate-300 rounded-2xl p-8 shadow-sm">
                  <h4 className="text-[11px] text-black uppercase tracking-[0.2em] font-semibold mb-10">02. Category Specifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {extraFields.map((field) => (
                          <div key={field.name} className="group">
                              <label className="text-[9px] text-slate-500 uppercase tracking-[0.25em] font-medium mb-4 block group-focus-within:text-black transition-all">
                                  {field.label}
                              </label>
                              <input
                                  type={field.type}
                                  value={dynamicAttributes[field.name] || ""}
                                  onChange={(e) => setDynamicAttributes({...dynamicAttributes, [field.name]: e.target.value})}
                                  className="w-full bg-[#fcfcfc] border-b-2 border-slate-200 px-0 py-3 outline-none text-base text-black font-semibold focus:border-black transition-all"
                                  placeholder={field.placeholder}
                              />
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* Visual Assets (Read Only for now) */}
          <div className="bg-white border border-slate-300 rounded-2xl p-8 shadow-sm">
             <h4 className="text-[11px] text-black uppercase tracking-[0.2em] font-semibold mb-8">03. Visual Assets</h4>
             <div className="grid grid-cols-4 gap-4">
                {imagePreviews.map((url, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-100 bg-slate-50 relative group/img">
                    <img src={url} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                       <button type="button" className="p-2 bg-white rounded-lg text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
                <button type="button" className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-slate-900 transition-all group">
                   <Plus size={20} className="group-hover:scale-110 transition-transform" />
                   <span className="text-[8px] uppercase tracking-widest font-bold mt-2">Add</span>
                </button>
             </div>
          </div>
        </form>

        {/* Right Column: Meta & Actions (4 Units) */}
        <div className="lg:col-span-4 space-y-8">
           
           {/* Financials & Stock */}
           <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-2xl shadow-slate-900/20">
              <h4 className="text-[11px] text-white/50 uppercase tracking-[0.25em] font-semibold mb-10">04. Commercial Meta</h4>
              
              <div className="space-y-10">
                  <div className="group">
                      <label className="text-[8px] text-white/40 uppercase tracking-[0.3em] font-medium mb-3 block">Base Price (TK)</label>
                      <div className="flex items-end gap-3 border-b border-white/20 pb-4 focus-within:border-white transition-all">
                          <span className="text-xl font-bold opacity-30">৳</span>
                          <input 
                              type="number"
                              value={formData.price}
                              onChange={(e) => setFormData({...formData, price: e.target.value})}
                              className="w-full bg-transparent outline-none text-2xl font-black text-white placeholder:text-white/10"
                          />
                      </div>
                  </div>

                  <div className="group">
                      <label className="text-[8px] text-white/40 uppercase tracking-[0.3em] font-medium mb-3 block">Current Inventory</label>
                      <div className="flex items-end gap-3 border-b border-white/20 pb-4 focus-within:border-white transition-all">
                          <span className="text-xl font-bold opacity-30">#</span>
                          <input 
                              type="number"
                              value={formData.stock}
                              onChange={(e) => setFormData({...formData, stock: e.target.value})}
                              className="w-full bg-transparent outline-none text-2xl font-black text-white placeholder:text-white/10"
                          />
                      </div>
                  </div>
              </div>

              <button 
                onClick={handleUpdate}
                disabled={isUpdating}
                className="w-full bg-white text-slate-900 font-black py-5 rounded-2xl text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-slate-100 transition-all active:scale-[0.98] mt-12 disabled:opacity-50"
              >
                {isUpdating ? "Synching..." : "Commit Changes"}
              </button>
           </div>

           {/* Status Control */}
           <div className="bg-white border border-slate-300 rounded-2xl p-8 shadow-sm">
              <h4 className="text-[11px] text-black uppercase tracking-[0.2em] font-semibold mb-6">Management State</h4>
              <div className="flex items-center gap-2 mb-8">
                 <span className={`px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-widest font-black ${
                    formData.status === 'Active' ? 'bg-green-50 text-green-600' : 
                    formData.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-500'
                 }`}>
                    {formData.status}
                 </span>
                 <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Current Lifecycle</span>
              </div>
              
              <p className="text-[10px] text-slate-500 leading-relaxed mb-4 font-medium italic">
                Note: Product status is controlled by regional administrators to ensure marketplace quality standards.
              </p>
           </div>

        </div>
      </div>
    </div>
  );
}
