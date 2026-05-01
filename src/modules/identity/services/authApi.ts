import { apiSlice } from "@/store/api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.token && !data?.twoFactorRequired) {
            localStorage.setItem("mallx_token", data.token);
          }
        } catch (err) {}
      },
      transformResponse: (response: any) => {
        if (response?.data?.user) {
          const user = response.data.user;
          user.role = user.role || user.roleId?.name || user.roleName || "Customer";
        }
        return response;
      }
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/api/v1/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
      transformResponse: (response: any) => {
        if (response?.data?.user) {
          const user = response.data.user;
          user.role = user.role || user.roleId?.name || user.roleName || "Customer";
        }
        return response;
      }
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/api/v1/auth/verify-otp",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.token) {
            localStorage.setItem("mallx_token", data.token);
          }
        } catch (err) {}
      },
      transformResponse: (response: any) => {
        if (response?.data?.user) {
          const user = response.data.user;
          user.role = user.role || user.roleId?.name || user.roleName || "Customer";
        }
        return response;
      }
    }),
    getMe: builder.query({
      query: () => "/api/v1/auth/me",
      providesTags: ["User"],
      transformResponse: (response: any) => {
        if (response?.data?.user) {
          const user = response.data.user;
          user.role = user.role || user.roleId?.name || user.roleName || "Customer";
        }
        return response;
      }
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
  useAddAddressMutation,
} = authApi;
