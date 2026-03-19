import { apiSlice } from "./apiSlice";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => '/api/v1/admin/me',
      providesTags: ['User'],
    }),
  }),
});

export const { useGetMeQuery } = adminApi;
