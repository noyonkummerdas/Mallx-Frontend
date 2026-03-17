import { apiSlice } from "@/store/api/apiSlice";

export const marketingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query({
      query: () => "/api/v1/marketing/coupons",
      providesTags: ["Product"],
    }),
    getFlashSales: builder.query({
      query: () => "/api/v1/marketing/flash-sales",
    }),
    claimVoucher: builder.mutation({
      query: (id) => ({
        url: `/api/v1/promotions/vouchers/${id}/collect`,
        method: "POST",
      }),
    }),
    redeemGiftCard: builder.mutation({
      query: (code) => ({
        url: "/api/v1/promotions/gift-cards/redeem",
        method: "POST",
        body: { code },
      }),
    }),
    getBundles: builder.query({
      query: () => "/api/v1/promotions/bundles",
    }),
    createFlashSale: builder.mutation({
      query: (data) => ({
        url: "/api/v1/marketing/flash-sales",
        method: "POST",
        body: data,
      }),
    }),
    createCoupon: builder.mutation({
      query: (data) => ({
        url: "/api/v1/marketing/coupons",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { 
  useGetCouponsQuery, 
  useGetFlashSalesQuery, 
  useClaimVoucherMutation, 
  useRedeemGiftCardMutation,
  useGetBundlesQuery,
  useCreateFlashSaleMutation,
  useCreateCouponMutation
} = marketingApi;
