import { apiSlice } from "./apiSlice";

export const logisticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLiveStatus: builder.query({
      query: () => '/api/v1/logistics/live-status',
      providesTags: ['Analytics'],
    }),
    addTruck: builder.mutation({
      query: (body) => ({
        url: '/api/v1/logistics/trucks',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetLiveStatusQuery, useAddTruckMutation } = logisticsApi;
