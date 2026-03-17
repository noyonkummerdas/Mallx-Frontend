import { apiSlice } from "@/store/api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/api/v1/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),
    getMe: builder.query({
      query: () => "/api/v1/auth/me",
      providesTags: ["User"],
    }),
    toggle2fa: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auth/toggle-2fa",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getAddresses: builder.query({
      query: () => "/api/v1/users/addresses",
      providesTags: ["User"],
    }),
    addAddress: builder.mutation({
      query: (address) => ({
        url: "/api/v1/users/addresses",
        method: "POST",
        body: address,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useVerifyOtpMutation, 
  useGetMeQuery,
  useToggle2faMutation,
  useGetAddressesQuery,
  useAddAddressMutation
} = authApi;
