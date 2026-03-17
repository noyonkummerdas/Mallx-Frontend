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
    updateCartQuantity: builder.mutation({
      query: ({ cartItemId, quantity }) => ({
        url: "/api/v1/cart/update-quantity",
        method: "PATCH",
        body: { cartItemId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    deleteCartItem: builder.mutation({
      query: (id) => ({
        url: `/api/v1/cart/item/${id}`,
        method: "DELETE",
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
    getMyOrders: builder.query({
      query: () => "/api/v1/orders/my-orders",
      providesTags: ["Order"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/v1/orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Order", id }],
    }),
    cancelOrder: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/api/v1/orders/${id}/cancel`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Order", id }],
    }),
    returnOrder: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/api/v1/orders/${id}/return`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Order", id }],
    }),
    getWishlist: builder.query({
      query: () => "/api/v1/wishlist",
      providesTags: ["Product"],
    }),
    getVendorOrders: builder.query({
      query: () => "/api/v1/orders/vendor/all",
      providesTags: ["Order"],
    }),
  }),
});

export const { 
  useGetCartQuery, 
  useAddToCartMutation, 
  useUpdateCartQuantityMutation,
  useDeleteCartItemMutation,
  useCheckoutMutation, 
  useGetMyOrdersQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useReturnOrderMutation,
  useGetWishlistQuery,
  useGetVendorOrdersQuery
} = shoppingApi;
