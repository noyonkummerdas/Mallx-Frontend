import { apiSlice } from "@/store/api/apiSlice";

export const supportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTicket: builder.mutation({
      query: (data) => ({
        url: "/api/v1/support/tickets",
        method: "POST",
        body: data,
      }),
    }),
    getTickets: builder.query({
      query: () => "/api/v1/support/tickets",
    }),
    getAdminStats: builder.query({
      query: () => "/api/v1/analytics/admin/stats",
    }),
  }),
});

export const { 
  useCreateTicketMutation, 
  useGetTicketsQuery, 
  useGetAdminStatsQuery 
} = supportApi;
