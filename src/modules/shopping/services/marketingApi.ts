import { apiSlice } from "@/store/api/apiSlice";

export const marketingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCampaigns: builder.query({
      query: () => "/api/v1/marketing/campaigns",
      providesTags: ["Marketing"],
    }),
    getFlashSales: builder.query({
      query: (params?: { categoryId?: string }) => ({
        url: "/api/v1/marketing/flash-sales",
        params,
      }),
      providesTags: ["Marketing"],
    }),
    getCombos: builder.query({
      query: () => "/api/v1/marketing/combos",
      providesTags: ["Marketing"],
    }),
    getBundles: builder.query({
      query: (params?: { categoryId?: string }) => ({
        url: "/api/v1/promotions/bundles",
        params,
      }),
      providesTags: ["Marketing"],
    }),
    getVouchers: builder.query({
      query: (params?: { categoryId?: string }) => ({
        url: "/api/v1/promotions/vouchers",
        params,
      }),
      providesTags: ["Marketing"],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetFlashSalesQuery,
  useGetCombosQuery,
  useGetBundlesQuery,
  useGetVouchersQuery,
} = marketingApi;
