"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAddToCartMutation } from "../services/shoppingApi";
import { useGetMeQuery } from "@/modules/identity/services/authApi";
import { usePathname } from "next/navigation";
import { clearLocalCart } from "../store/cartSlice";

export default function CartSyncProcessor() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  const { data: userData } = useGetMeQuery({}, { skip: isAuthPage });
  const isAuthenticated = !!userData?.data?.user;
  const localItems = useSelector((state: RootState) => state.cart.localItems);
  const [addToCartApi] = useAddToCartMutation();

  useEffect(() => {
    const syncCart = async () => {
      if (isAuthenticated && localItems.length > 0) {
        console.log("Syncing guest cart to server...");
        
        try {
          // Sync each item one by one (Backend doesn't support bulk yet)
          for (const item of localItems) {
            await addToCartApi({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }).unwrap();
          }
          
          // Clear local cart once done
          dispatch(clearLocalCart());
          console.log("Cart sync complete.");
        } catch (error) {
          console.error("Failed to sync guest cart:", error);
        }
      }
    };

    syncCart();
  }, [isAuthenticated, localItems, addToCartApi, dispatch]);

  return null; // This is a logic-only component
}
