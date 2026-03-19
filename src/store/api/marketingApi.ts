import { apiSlice } from "./apiSlice";

export const marketingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOffers: builder.query({
      query: () => '/api/v1/admin/marketing/offers',
      providesTags: ['Marketing'],
    }),
    createCampaign: builder.mutation({
      query: (body) => ({
        url: '/api/v1/admin/marketing/campaigns',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Marketing'],
    }),
  }),
});

export const { useGetOffersQuery, useCreateCampaignMutation } = marketingApi;
