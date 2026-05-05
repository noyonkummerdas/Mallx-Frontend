"use client";

import { useGetCartQuery, useUpdateCartQuantityMutation, useDeleteCartItemMutation } from "@/modules/shopping/services/shoppingApi";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CartPage() {
  const { data: cartData, isLoading } = useGetCartQuery({});
  const [updateQuantity, { isLoading: isUpdating }] = useUpdateCartQuantityMutation();
  const [deleteItem, { isLoading: isDeleting }] = useDeleteCartItemMutation();

  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);

  useEffect(() => {
    if (cartData) {
      console.log("Cart data loaded in console:", cartData);
    }
  }, [cartData]);

  // Handle premium notification popup
  const cartItemsCount = cartData?.data?.items?.length || 0;
  useEffect(() => {
    if (cartItemsCount > 0) {
      setShowDeliveryPopup(true);
      const timer = setTimeout(() => setShowDeliveryPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [cartItemsCount]);

  if (isLoading) return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const cartItems = cartData?.data?.items || [];
  const subtotal = cartData?.data?.total || 0;
  const totalItemsCount = cartData?.data?.totalItems || 0;
  const promotional = cartData?.data?.promotional || { discountCount: 0, hasCombo: false };


  const handleUpdateQuantity = async (cartItemId: string, newQty: number) => {
    if (newQty < 1) return;
    try {
      console.log("Updating quantity:", { cartItemId, quantity: newQty });
      await updateQuantity({ cartItemId, quantity: newQty }).unwrap();
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      console.log("Removing item:", id);
      await deleteItem(id).unwrap();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-200 text-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-base font-black mb-8 tracking-tight text-slate-900 uppercase">Shopping Bag</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.length > 0 ? (
              cartItems.map((item: any) => (
                <div key={item._id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center shadow-sm group hover:border-indigo-600/20 transition-all">
                  <div className="w-16 h-16 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100 relative">
                    <img 
                      src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000"} 
                      alt={item.productId?.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    {item.productId?.discountPrice > 0 && item.productId?.discountPrice < item.productId?.price && (
                      <div className="absolute top-0 right-0 bg-red-600 text-[8px] font-black text-white px-2 py-1 rounded-bl-lg uppercase tracking-tighter">
                        -{Math.round(((item.productId.price - item.productId.discountPrice) / item.productId.price) * 100)}%
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-black text-sm mb-1 uppercase tracking-tight text-slate-900 leading-none">{item.productId?.name}</h3>
                    <p className="text-slate-400 text-sm font-black mt-2 mb-4 uppercase tracking-widest leading-none">{item.variantId?.color} · {item.variantId?.size}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
                        <button
                          disabled={isUpdating}
                          onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all font-black text-slate-500 disabled:opacity-50"
                        >-</button>
                        <span className="w-10 text-center font-black text-sm text-slate-900">{item.quantity}</span>
                        <button
                          disabled={isUpdating}
                          onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all font-black text-slate-500 disabled:opacity-50"
                        >+</button>
                      </div>
                      <div className="h-4 w-[1px] bg-slate-100 hidden sm:block" />
                      <div className="flex flex-col items-center sm:items-start leading-none">
                        <span className="font-black text-indigo-600 text-sm">{item.price.toLocaleString()} <span className="text-sm font-black">TK.</span></span>
                        {item.productId?.price > item.price && (
                          <span className="text-[10px] text-slate-400 line-through font-bold opacity-60">
                            {item.productId.price.toLocaleString()} TK
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    disabled={isDeleting}
                    onClick={() => handleRemove(item._id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-200 hover:text-red-500 transition-all border border-transparent hover:border-red-100 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-xl shadow-sm">
                <p className="text-slate-400 mb-6 font-black tracking-wide uppercase text-sm">your bag is empty.</p>
                <Link href="/catalog/products" className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all">Start Shopping</Link>
              </div>
            )}
          </div>

          {/* Summary Card */}
          <div className="relative">
            <div className="sticky top-8 bg-indigo-600 rounded-xl p-6 shadow-lg shadow-indigo-600/30 text-white">
              <h2 className="text-base font-black mb-6 tracking-tighter uppercase">Cart Summary</h2>
              <div className="space-y-4 mb-8 pt-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-4 border-b border-white/10 pb-2">Order Review</h3>
                <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item: any) => (
                    <div key={item._id} className="flex justify-between items-center gap-4">
                      <span className="text-[11px] font-black uppercase tracking-tight text-white/80 truncate flex-1">{item.productId?.name} <span className="text-indigo-300 ml-1">x{item.quantity}</span></span>
                      <span className="text-[11px] font-black text-white whitespace-nowrap">{(item.price * item.quantity).toLocaleString()} TK</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 mb-8 border-t border-white/10 pt-6">
                <div className="flex justify-between text-white font-black tracking-tighter">
                  <span className="uppercase text-sm">Subtotal</span>
                  <span className="font-black text-sm">{subtotal.toLocaleString()} TK</span>
                </div>
                <div className="flex justify-between text-indigo-100 font-black tracking-wide">
                  <span className="uppercase text-sm font-black tracking-widest">Total Items</span>
                  <span className="font-black text-sm">{totalItemsCount} Units</span>
                </div>

                {promotional.discountCount > 0 && (
                  <div className="flex justify-between text-green-300 font-black tracking-wide bg-green-900/20 px-3 py-2 rounded-lg border border-green-500/20">
                    <span className="uppercase text-[10px] tracking-widest">Discount Items</span>
                    <span className="text-[10px]">{promotional.discountCount} Items</span>
                  </div>
                )}

                {promotional.hasCombo && (
                  <div className="flex justify-between text-amber-300 font-black tracking-wide bg-amber-900/20 px-3 py-2 rounded-lg border border-amber-500/20">
                    <span className="uppercase text-[10px] tracking-widest">Combo Pack</span>
                    <span className="text-[10px]">Included</span>
                  </div>
                )}
              </div>

              <Link href="/shopping/checkout">
                <button disabled={cartItems.length === 0} className="w-full bg-white text-indigo-600 font-black py-3 rounded-lg shadow-md hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest text-sm">
                  Ship Items Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Glass Delivery Popup */}
      {showDeliveryPopup && (
        <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-10 fade-in duration-500">
          <div className="glass-panel p-6 rounded-[2rem] border border-white/20 shadow-2xl backdrop-blur-xl bg-indigo-600/10 max-w-[320px] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600" />
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-1">Logistics Note</p>
                <p className="text-[11px] font-black text-slate-900 leading-relaxed uppercase tracking-tight">Delivery fees are calculated during checkout based on your destination.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
