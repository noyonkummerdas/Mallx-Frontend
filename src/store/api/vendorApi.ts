import { apiSlice } from "./apiSlice";

export const vendorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVendorActivity: builder.query({
      query: () => '/api/v1/admin/vendors/activity',
      providesTags: ['Analytics'],
    }),
  }),
});

export const { useGetVendorActivityQuery } = vendorApi;
