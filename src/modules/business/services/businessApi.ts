import { apiSlice } from "@/store/api/apiSlice";

export const businessApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShopDetails: builder.query({
      query: () => "/api/v1/vendors/me/shop",
      providesTags: ["User"],
    }),
    uploadDocuments: builder.mutation({
      query: (docData) => ({
        url: "/api/v1/vendors/documents",
        method: "POST",
        body: docData,
      }),
    }),
    getPartnerVendors: builder.query({
      query: () => "/api/v1/partners/vendors",
    }),
    getPartnerDashboard: builder.query({
      query: () => "/api/v1/partners/dashboard",
    }),
    assignPartnerCategory: builder.mutation({
      query: (data) => ({
        url: "/api/v1/partners/assign-category",
        method: "POST",
        body: data,
      }),
    }),
    setCommission: builder.mutation({
      query: (data) => ({
        url: "/api/v1/partners/commissions",
        method: "POST",
        body: data,
      }),
    }),
    configurePaymentMethods: builder.mutation({
      query: (data) => ({
        url: "/api/v1/payments/methods",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { 
  useGetShopDetailsQuery, 
  useUploadDocumentsMutation, 
  useGetPartnerVendorsQuery,
  useGetPartnerDashboardQuery,
  useAssignPartnerCategoryMutation,
  useSetCommissionMutation,
  useConfigurePaymentMethodsMutation
} = businessApi;
