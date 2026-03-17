import { apiSlice } from "@/store/api/apiSlice";

export const loyaltyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLoyaltyStats: builder.query({
      query: () => "/api/v1/loyalty/stats",
      providesTags: ["Loyalty"],
    }),
    getReferralCode: builder.query({
      query: () => "/api/v1/loyalty/referral-code",
    }),
    getReferralHistory: builder.query({
      query: () => "/api/v1/loyalty/referrals",
    }),
    redeemPoints: builder.mutation({
      query: (amount) => ({
        url: "/api/v1/loyalty/redeem",
        method: "POST",
        body: { amount },
      }),
      invalidatesTags: ["Loyalty", "User"],
    }),
  }),
});

export const {
  useGetLoyaltyStatsQuery,
  useGetReferralCodeQuery,
  useGetReferralHistoryQuery,
  useRedeemPointsMutation,
} = loyaltyApi;
