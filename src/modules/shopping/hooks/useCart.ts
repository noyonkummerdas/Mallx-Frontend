import { useAddToCartMutation, useGetCartQuery } from "../services/shoppingApi";
import { useGetMeQuery } from "@/modules/identity/services/authApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addToLocalCart } from "../store/cartSlice";

export const useCart = () => {
  const dispatch = useDispatch();
  const { data: userData } = useGetMeQuery({});
  const isAuthenticated = !!userData?.data?.user;

  // 1. Get Backend Cart Data
  const { data: backendCartData, isLoading: isBackendLoading } = useGetCartQuery(undefined, { 
    skip: !isAuthenticated 
  });

  // 2. Get Local Cart Data
  const localCartItems = useSelector((state: RootState) => state.cart.localItems);

  // 3. Mutation for Login users
  const [addToCartApi, { isLoading: isAddingToApi }] = useAddToCartMutation();

  // 4. Combined Items
  const items = isAuthenticated ? backendCartData?.data?.items || [] : localCartItems;

  // 5. Combined Total Count
  const totalCount = items.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0);

  const addItem = async (item: { productId: string; name: string; price: number; image: string; quantity: number }) => {
    if (isAuthenticated) {
      return await addToCartApi({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }).unwrap();
    } else {
      // Add to local Redux + LocalStorage
      dispatch(addToLocalCart(item));
      return { success: true, message: "Added to guest cart locally" };
    }
  };

  return {
    items,
    totalCount,
    addItem,
    isAuthenticated,
    isLoading: isBackendLoading || isAddingToApi
  };
};
