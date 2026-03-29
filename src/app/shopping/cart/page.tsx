"use client";

import { useGetCartQuery, useUpdateCartQuantityMutation, useDeleteCartItemMutation } from "@/modules/shopping/services/shoppingApi";
import Link from "next/link";
import { useEffect } from "react";

export default function CartPage() {
  const { data: cartData, isLoading } = useGetCartQuery({});
  const [updateQuantity, { isLoading: isUpdating }] = useUpdateCartQuantityMutation();
  const [deleteItem, { isLoading: isDeleting }] = useDeleteCartItemMutation();

  useEffect(() => {
    if (cartData) {
      console.log("Cart data loaded in console:", cartData);
    }
  }, [cartData]);
  
  if (isLoading) return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const cartItems = cartData?.data?.items || [];
  const subtotal = cartData?.data?.total || 0;
  const deliveryCharge = cartData?.data?.deliveryCharge || 0;
  const totalPay = subtotal + deliveryCharge;

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
                  <div className="w-16 h-16 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100">
                     <img src={item.productId?.images?.[0]?.url} alt={item.productId?.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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
                         <span className="font-black text-indigo-600 text-sm">{item.price.toLocaleString()} <span className="text-sm font-black">TK</span></span>
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
              <div className="space-y-4 mb-10">
                 <div className="flex justify-between text-indigo-100 font-black tracking-wide">
                   <span className="uppercase text-sm font-black tracking-widest">Bag Subtotal</span>
                   <span className="font-black text-sm">{subtotal.toLocaleString()} TK</span>
                 </div>
                 <div className="flex justify-between text-indigo-100 font-black tracking-wide">
                   <span className="uppercase text-sm font-black tracking-widest">Delivery Charge</span>
                   <span className="font-black text-sm">{deliveryCharge === 0 ? "FREE" : `${deliveryCharge.toLocaleString()} TK`}</span>
                 </div>
                 <div className="border-t border-white/20 pt-4 flex justify-between text-sm font-black tracking-tighter">
                   <span className="uppercase">Total Pay</span>
                   <span className="text-sm">{totalPay.toLocaleString()} TK</span>
                 </div>
              </div>

               <div className="bg-white/10 rounded-lg p-3 mb-6">
                  <p className="text-sm font-black uppercase tracking-widest mb-1">Dynamic Delivery</p>
                  <p className="text-sm text-indigo-100 opacity-80 leading-relaxed font-black">Shipping costs are calculated at checkout based on location and weight.</p>
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
    </main>
  );
}
