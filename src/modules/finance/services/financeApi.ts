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
  }),
});

export const { 
  useGetBalanceQuery, 
  useRequestWithdrawalMutation, 
  useGetWithdrawalHistoryQuery 
} = financeApi;
