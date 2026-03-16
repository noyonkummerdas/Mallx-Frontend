import { apiSlice } from "@/store/api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/api/v1/auth/register",
        method: "POST",
        body: userData,
      }),
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
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useVerifyOtpMutation, 
  useGetMeQuery 
} = authApi;
