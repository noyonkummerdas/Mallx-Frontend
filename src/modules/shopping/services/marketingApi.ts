import { apiSlice } from "@/store/api/apiSlice";

export const marketingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCampaigns: builder.query({
      query: () => "/api/v1/marketing/campaigns",
      providesTags: ["Marketing"],
    }),
    getFlashSales: builder.query({
      query: () => "/api/v1/marketing/flash-sales",
      providesTags: ["Marketing"],
    }),
    getCombos: builder.query({
      query: () => "/api/v1/marketing/combos",
      providesTags: ["Marketing"],
    }),
    getBundles: builder.query({
      query: () => "/api/v1/promotions/bundles",
      providesTags: ["Marketing"],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetFlashSalesQuery,
  useGetCombosQuery,
  useGetBundlesQuery,
} = marketingApi;
