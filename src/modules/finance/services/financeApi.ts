import { apiSlice } from "@/store/api/apiSlice";

export const financeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBalance: builder.query({
      query: () => "/api/v1/vendors/balance",
      providesTags: ["User"],
    }),
    requestWithdrawal: builder.mutation({
      query: (data) => ({
        url: "/api/v1/withdrawals/request",
        method: "POST",
        body: data,
      }),
    }),
    getWithdrawalHistory: builder.query({
      query: () => "/api/v1/withdrawals/history",
    }),
    updateWithdrawalStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/v1/withdrawals/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
    }),
  }),
});

export const { 
  useGetBalanceQuery, 
  useRequestWithdrawalMutation, 
  useGetWithdrawalHistoryQuery,
  useUpdateWithdrawalStatusMutation
} = financeApi;
