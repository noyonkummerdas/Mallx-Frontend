import { apiSlice } from "@/store/api/apiSlice";

export const shoppingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "/api/v1/cart",
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: (item) => ({
        url: "/api/v1/cart/add",
        method: "POST",
        body: item,
      }),
      invalidatesTags: ["Cart"],
    }),
    checkout: builder.mutation({
      query: (orderData) => ({
        url: "/api/v1/orders/checkout",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Cart", "Order"],
    }),
    getWishlist: builder.query({
      query: () => "/api/v1/wishlist",
      providesTags: ["Product"],
    }),
  }),
});

export const { 
  useGetCartQuery, 
  useAddToCartMutation, 
  useCheckoutMutation, 
  useGetWishlistQuery 
} = shoppingApi;
