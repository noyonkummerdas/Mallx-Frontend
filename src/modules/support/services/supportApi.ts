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
    respondToTicket: builder.mutation({
      query: ({ id, response }) => ({
        url: `/api/v1/support/tickets/${id}/respond`,
        method: "PATCH",
        body: { response },
      }),
    }),
    getMyTickets: builder.query({
      query: () => "/api/v1/support/my-tickets",
    }),
  }),
});

export const {
  useCreateTicketMutation,
  useRespondToTicketMutation,
  useGetMyTicketsQuery,
} = supportApi;
