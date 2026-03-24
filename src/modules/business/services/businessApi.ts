import { apiSlice } from "@/store/api/apiSlice";

export const businessApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getShopDetails: builder.query({
      query: () => "/api/v1/vendors/me/shop",
      providesTags: ["User"],
    }),
    getAllDocuments: builder.query({
      query: () => "/api/v1/vendors/all-documents",
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
      providesTags: ["Partner"],
    }),
    getPartnerVendorDetails: builder.query({
      query: (id) => `/api/v1/partners/vendors/${id}`,
      providesTags: ["Partner"],
    }),
    getPartnerDashboard: builder.query({
      query: () => "/api/v1/partners/dashboard",
      providesTags: ["Partner"],
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
      invalidatesTags: ["Partner"],
    }),
    configurePaymentMethods: builder.mutation({
      query: (data) => ({
        url: "/api/v1/payments/methods",
        method: "POST",
        body: data,
      }),
    }),
    processRefund: builder.mutation({
      query: (data) => ({
        url: "/api/v1/payments/refund",
        method: "POST",
        body: data,
      }),
    }),
    createVendor: builder.mutation({
      query: (data) => ({
        url: "/api/v1/partners/vendors",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Partner"],
    }),
    updateVendorStatus: builder.mutation({
      query: ({ vendorId, status }) => ({
        url: `/api/v1/partners/vendors/${vendorId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Partner"],
    }),
    getPartnerAgents: builder.query({
      query: () => "/api/v1/partners/agents",
      providesTags: ["Partner"],
    }),
    getPartnerCommissions: builder.query({
      query: () => "/api/v1/partners/commissions",
      providesTags: ["Partner"],
    }),
    getPartnerReturns: builder.query({
      query: () => "/api/v1/partners/returns",
      providesTags: ["Partner"],
    }),
    getPartnerInventory: builder.query({
      query: () => "/api/v1/partners/inventory",
      providesTags: ["Partner"],
    }),
    getPartnerProductHistory: builder.query({
      query: () => "/api/v1/partners/products/history",
      providesTags: ["Partner"],
    }),
    getPartnerCampaigns: builder.query({
      query: () => "/api/v1/partners/campaigns",
      providesTags: ["Partner"],
    }),
    getPartnerVariants: builder.query({
      query: () => "/api/v1/partners/products/variants",
      providesTags: ["Product"],
    }),
  }),
});

export const { 
  useGetShopDetailsQuery, 
  useUploadDocumentsMutation, 
  useGetPartnerVendorsQuery,
  useGetPartnerVendorDetailsQuery,
  useGetPartnerDashboardQuery,
  useAssignPartnerCategoryMutation,
  useSetCommissionMutation,
  useConfigurePaymentMethodsMutation,
  useProcessRefundMutation,
  useGetAllDocumentsQuery,
  useCreateVendorMutation,
  useUpdateVendorStatusMutation,
  useGetPartnerAgentsQuery,
  useGetPartnerCommissionsQuery,
  useGetPartnerReturnsQuery,
  useGetPartnerInventoryQuery,
  useGetPartnerProductHistoryQuery,
  useGetPartnerCampaignsQuery,
  useGetPartnerVariantsQuery
} = businessApi;
