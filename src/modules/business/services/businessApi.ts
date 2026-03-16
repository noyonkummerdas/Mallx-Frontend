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
  }),
});

export const { 
  useGetShopDetailsQuery, 
  useUploadDocumentsMutation, 
  useGetPartnerVendorsQuery 
} = businessApi;
