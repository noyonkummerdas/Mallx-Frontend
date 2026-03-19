import { apiSlice } from "./apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => '/api/v1/admin/commissions/report',
      providesTags: ['Analytics'],
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashboardApi;
