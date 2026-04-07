import { apiSlice } from "./apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => '/api/v1/admin/commissions/report',
      providesTags: ['Analytics'],
    }),
    getSalesAnalytics: builder.query({
      query: (period = 'month') => `/api/v1/admin/analytics/sales?period=${period}`,
      providesTags: ['Analytics'],
    }),
    getReturnAnalytics: builder.query({
      query: () => '/api/v1/admin/analytics/returns',
      providesTags: ['Analytics'],
    }),
    getLogisticsStatus: builder.query({
      query: () => '/api/v1/admin/logistics/live-status',
      providesTags: ['Analytics'],
    }),
    getOffersAudit: builder.query({
      query: () => '/api/v1/admin/marketing/offers',
      providesTags: ['Analytics'],
    }),
  }),
});

export const { 
  useGetDashboardDataQuery,
  useGetSalesAnalyticsQuery,
  useGetReturnAnalyticsQuery,
  useGetLogisticsStatusQuery,
  useGetOffersAuditQuery
} = dashboardApi;
