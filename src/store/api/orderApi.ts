import { apiSlice } from "./apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReturnRequests: builder.query({
      query: () => '/api/v1/orders/returns',
      providesTags: ['Order'],
    }),
    handleReturnRequest: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/v1/orders/returns/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const { useGetReturnRequestsQuery, useHandleReturnRequestMutation } = orderApi;
