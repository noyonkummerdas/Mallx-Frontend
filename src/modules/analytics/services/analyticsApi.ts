import { apiSlice } from "@/store/api/apiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: () => "/api/v1/analytics/admin/stats",
    }),
    getAdminTrends: builder.query({
      query: () => "/api/v1/analytics/admin/trends",
    }),
    getVendorStats: builder.query({
      query: () => "/api/v1/analytics/vendor/stats",
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetAdminTrendsQuery,
  useGetVendorStatsQuery,
} = analyticsApi;
