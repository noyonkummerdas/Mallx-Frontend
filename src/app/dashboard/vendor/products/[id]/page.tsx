"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  useGetProductQuery, 
  useUpdateProductMutation, 
  useDeleteProductMutation,
  useGetCategoriesQuery,
} from "@/modules/shopping/services/productApi";
import { CATEGORY_FIELDS } from "@/modules/catalog/constants/categoryFields";
import { 
  ArrowLeft, 
  Trash2, 
  ChevronRight, 
  TrendingUp, 
  ShoppingBag,
  ExternalLink,
  Eye,
  Plus,
  FileText,
  Tag,
  Info,
  Layers,
  Package,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import Link from "next/link";

export default function ProductEditPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const { data: productData, isLoading: isProductLoading } = useGetProductQuery(id);
  const { data: categoriesData } = useGetCategoriesQuery({});
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    status: "",
    brand: "",
    sku: "",
    weight: "",
    warranty: "",
    dimensions: {
      length: "",
      width: "",
      height: ""
    },
    type: "unisex"
  });
  const [dynamicAttributes, setDynamicAttributes] = useState<Record<string, string>>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAudienceOpen, setIsAudienceOpen] = useState(false);
  const [isWarrantyCustom, setIsWarrantyCustom] = useState(false);

  useEffect(() => {
    if (productData?.data?.product) {


    if (productData?.data?.product) {
      const p = productData.data.product;
      setFormData({
        name: p.name,
        description: p.description,
        price: p.price.toString(),
        stock: p.stock.toString(),
        categoryId: p.categoryId?._id || p.categoryId,
        status: p.status,
        brand: p.brand || "",
        sku: p.sku || "",
        weight: p.weight?.toString() || "",
        warranty: p.warranty || "",
        dimensions: {
          length: p.dimensions?.length?.toString() || "",
          width: p.dimensions?.width?.toString() || "",
          height: p.dimensions?.height?.toString() || ""
        },
        type: p.type || "unisex"
      });

      const standardOptions = ['No Warranty', '6 Months Local Warranty', '1 Year Local Warranty', '2 Years Local Warranty', 'Lifetime Warranty'];
      if (p.warranty && !standardOptions.includes(p.warranty)) {
        setIsWarrantyCustom(true);
      } else {
        setIsWarrantyCustom(false);
      }

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
        setImagePreviews(p.images.map((img: any) => img.imageUrl || img.url));
      }
    }
  }, [productData]);

  const categories = categoriesData?.data || [];
  const selectedCategoryName = categories.find((c: any) => c._id === formData.categoryId)?.name || "";
  const extraFields = CATEGORY_FIELDS[selectedCategoryName] || [];

  const handleUpdate = async (e: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!formData.name || !formData.price || !formData.categoryId || !formData.type) {
      alert("Please fill in all required fields (Name, Price, Category, Audience).");
      return;
    }

    const dataToSend = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      brand: formData.brand,
      sku: formData.sku,
      weight: Number(formData.weight),
      warranty: formData.warranty,
      dimensions: {
        length: Number(formData.dimensions.length),
        width: Number(formData.dimensions.width),
        height: Number(formData.dimensions.height)
      },
      attributes: Object.entries(dynamicAttributes).map(([key, value]) => ({
        key,
        value
      }))
    };

    try {
      await updateProduct({
        productId: id,
        productData: dataToSend
      }).unwrap();
      
      alert("Product updated successfully!");
    } catch (err: any) {
      const errorMsg = err.data?.message || err.message || err.error || "Failed to update product.";
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
    <div className="max-w-[1200px] mx-auto py-10 px-4">


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

          {/* 01. General Specifications Module */}
          <div className="bg-white border border-slate-300 rounded-2xl p-8 shadow-sm">
             <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                    <FileText size={16} />
                </div>
                <h4 className="text-[11px] text-black uppercase tracking-[0.2em] font-semibold">01. Core Identity</h4>
                <div className="h-[1px] flex-1 bg-slate-50"></div>
             </div>
             
             <div className="space-y-12">
                <div className="group">
                    <div className="flex items-center gap-2 mb-4">
                        <Tag size={12} className="text-slate-400" />
                        <label className="text-[9px] text-slate-500 uppercase tracking-[0.25em] font-bold group-focus-within:text-black transition-all">Product Name</label>
                    </div>
                    <input 
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-6 py-4 outline-none text-base text-black font-semibold placeholder:text-slate-300 focus:border-black focus:bg-white transition-all shadow-sm"
                    />
                </div>

                <div className="group">
                    <div className="flex items-center gap-2 mb-4">
                        <Info size={12} className="text-slate-400" />
                        <label className="text-[9px] text-slate-500 uppercase tracking-[0.25em] font-bold group-focus-within:text-black transition-all">Description</label>
                    </div>
                    <textarea 
                        required
                        rows={6}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-6 py-4 outline-none text-sm text-black font-medium leading-relaxed placeholder:text-slate-300 focus:border-black focus:bg-white transition-all resize-none shadow-sm"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group">
                        <div className="flex items-center gap-2 mb-4">
                            <Layers size={12} className="text-slate-400" />
                            <label className="text-[9px] text-slate-500 uppercase tracking-[0.25em] font-bold group-focus-within:text-black transition-all">Brand</label>
                        </div>
                        <input 
                            type="text"
                            value={formData.brand}
                            onChange={(e) => setFormData({...formData, brand: e.target.value})}
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-6 py-4 outline-none text-sm text-black font-semibold placeholder:text-slate-300 focus:border-black focus:bg-white transition-all shadow-sm"
                        />
                    </div>
                    <div className="group">
                        <div className="flex items-center gap-2 mb-4">
                            <Package size={12} className="text-slate-400" />
                            <label className="text-[9px] text-slate-500 uppercase tracking-[0.25em] font-bold group-focus-within:text-black transition-all">Parent SKU</label>
                        </div>
                        <input 
                            type="text"
                            value={formData.sku}
                            onChange={(e) => setFormData({...formData, sku: e.target.value})}
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-6 py-4 outline-none text-sm text-black font-semibold placeholder:text-slate-300 focus:border-black focus:bg-white transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="group">
                        <label className="text-[8px] text-slate-400 uppercase tracking-widest font-bold mb-3 block">Weight (KG)</label>
                        <input 
                            type="number"
                            step="0.01"
                            value={formData.weight}
                            onChange={(e) => setFormData({...formData, weight: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm text-black font-bold focus:border-black transition-all"
                        />
                    </div>
                    <div className="group">
                        <label className="text-[8px] text-slate-400 uppercase tracking-widest font-bold mb-3 block">Length (CM)</label>
                        <input 
                            type="number"
                            value={formData.dimensions.length}
                            onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, length: e.target.value}})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm text-black font-bold focus:border-black transition-all"
                        />
                    </div>
                    <div className="group">
                        <label className="text-[8px] text-slate-400 uppercase tracking-widest font-bold mb-3 block">Width (CM)</label>
                        <input 
                            type="number"
                            value={formData.dimensions.width}
                            onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, width: e.target.value}})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm text-black font-bold focus:border-black transition-all"
                        />
                    </div>
                    <div className="group">
                        <label className="text-[8px] text-slate-400 uppercase tracking-widest font-bold mb-3 block">Height (CM)</label>
                        <input 
                            type="number"
                            value={formData.dimensions.height}
                            onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, height: e.target.value}})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none text-sm text-black font-bold focus:border-black transition-all"
                        />
                    </div>
                </div>

                <div className="group">
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldCheck size={12} className="text-slate-400" />
                        <label className="text-[9px] text-slate-500 uppercase tracking-[0.25em] font-bold group-focus-within:text-black transition-all">Warranty Terms</label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select 
                            value={isWarrantyCustom ? 'Custom' : (formData.warranty || '')}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === 'Custom') {
                                    setIsWarrantyCustom(true);
                                    setFormData({...formData, warranty: ""});
                                } else {
                                    setIsWarrantyCustom(false);
                                    setFormData({...formData, warranty: val});
                                }
                            }}
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-6 py-4 outline-none text-sm text-black font-semibold focus:border-black focus:bg-white transition-all shadow-sm appearance-none cursor-pointer"
                        >
                            <option value="" disabled>Select Warranty Term</option>
                            <option value="No Warranty">No Warranty</option>
                            <option value="6 Months Local Warranty">6 Months Local Warranty</option>
                            <option value="1 Year Local Warranty">1 Year Local Warranty</option>
                            <option value="2 Years Local Warranty">2 Years Local Warranty</option>
                            <option value="Lifetime Warranty">Lifetime Warranty</option>
                            <option value="Custom">Custom / Other</option>
                        </select>

                        {isWarrantyCustom && (
                            <div className="relative flex-1 group/custom">
                                <input 
                                    type="text"
                                    value={formData.warranty}
                                    onChange={(e) => setFormData({...formData, warranty: e.target.value})}
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-6 py-4 outline-none text-sm text-black font-semibold placeholder:text-slate-300 focus:border-black focus:bg-white transition-all shadow-sm animate-in fade-in slide-in-from-left-2 duration-300 pr-12"
                                    placeholder="Type custom warranty terms..."
                                />
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setIsWarrantyCustom(false);
                                        setFormData({...formData, warranty: ""});
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-colors p-1"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}
                    </div>
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

           {/* Taxonomy & Audience Module (Updated) */}
           <div className="bg-white border border-slate-300 rounded-2xl p-8 shadow-sm">
               <h4 className="text-[11px] text-black uppercase tracking-[0.2em] font-semibold mb-8">05. Taxonomy & Audience</h4>
               
               <div className="space-y-8">
                   {/* Category Selection */}
                   <div className="relative">
                       <label className="text-[9px] text-slate-500 uppercase tracking-[0.25em] font-medium mb-3 block">Category Domain</label>
                       <button
                           type="button"
                           onClick={() => {
                               setIsCategoryOpen(!isCategoryOpen);
                               setIsAudienceOpen(false);
                           }}
                           className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-xl flex items-center justify-between transition-all hover:bg-slate-100 group"
                       >
                           <span className={`text-[10px] uppercase tracking-widest ${formData.categoryId ? 'text-black font-bold' : 'text-slate-400 font-medium'}`}>
                               {categories.find((c: any) => c._id === formData.categoryId)?.name || "Select Category"}
                           </span>
                           <ChevronDown size={14} className={`text-slate-400 transition-transform duration-500 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                       </button>

                       {isCategoryOpen && (
                           <>
                               <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)} />
                               <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-300 rounded-2xl shadow-2xl z-20 overflow-hidden py-3 animate-in fade-in slide-in-from-top-4 duration-300">
                                   <div className="max-h-72 overflow-y-auto">
                                       {categories.map((cat: any) => (
                                           <button
                                               key={cat._id}
                                               type="button"
                                               onClick={() => {
                                                   setFormData({...formData, categoryId: cat._id});
                                                   setIsCategoryOpen(false);
                                               }}
                                               className={`w-full px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] font-bold transition-all hover:bg-black hover:text-white flex items-center justify-between group ${formData.categoryId === cat._id ? 'bg-slate-50 text-black' : 'text-slate-400 font-medium'}`}
                                           >
                                               {cat.name}
                                           </button>
                                       ))}
                                   </div>
                               </div>
                           </>
                       )}
                   </div>

                   {/* Audience Selection */}
                   <div className="relative">
                       <label className="text-[9px] text-slate-500 uppercase tracking-[0.25em] font-medium mb-3 block">Product Audience</label>
                       <button
                           type="button"
                           onClick={() => {
                               setIsAudienceOpen(!isAudienceOpen);
                               setIsCategoryOpen(false);
                           }}
                           className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-xl flex items-center justify-between transition-all hover:bg-slate-100 group"
                       >
                           <span className={`text-[10px] uppercase tracking-widest text-black font-bold`}>
                               {formData.type === 'boysgirls' ? 'Boys & Girls' : formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
                           </span>
                           <ChevronDown size={14} className={`text-slate-400 transition-transform duration-500 ${isAudienceOpen ? 'rotate-180' : ''}`} />
                       </button>

                       {isAudienceOpen && (
                           <>
                               <div className="fixed inset-0 z-10" onClick={() => setIsAudienceOpen(false)} />
                               <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-300 rounded-2xl shadow-2xl z-20 overflow-hidden py-3 animate-in fade-in slide-in-from-top-4 duration-300">
                                   {[
                                       { id: 'men', label: 'Men' },
                                       { id: 'women', label: 'Women' },
                                       { id: 'kids', label: 'Kids' },
                                       { id: 'boysgirls', label: 'Boys & Girls' },
                                       { id: 'unisex', label: 'Unisex' }
                                   ].map((audience) => (
                                       <button
                                           key={audience.id}
                                           type="button"
                                           onClick={() => {
                                               setFormData({...formData, type: audience.id});
                                               setIsAudienceOpen(false);
                                           }}
                                           className={`w-full px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] font-bold transition-all hover:bg-black hover:text-white flex items-center justify-between group ${formData.type === audience.id ? 'bg-slate-50 text-black' : 'text-slate-400 font-medium'}`}
                                       >
                                           {audience.label}
                                       </button>
                                   ))}
                               </div>
                           </>
                       )}
                   </div>
               </div>
           </div>

        </div>
      </div>
    </div>
  );
}
