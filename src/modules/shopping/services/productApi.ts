import { apiSlice } from "@/store/api/apiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: "/api/v1/products",
        params,
      }),
      providesTags: ["Product"],
    }),
    getProduct: builder.query({
      query: (id) => `/api/v1/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: "/api/v1/products",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),
    uploadProductImage: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `/api/v1/products/${productId}/upload-image`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Product", id: productId }],
    }),
    addVariant: builder.mutation({
      query: ({ productId, variantData }) => ({
        url: `/api/v1/products/${productId}/variants`,
        method: "POST",
        body: variantData,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Product", id: productId }],
    }),
    getCategories: builder.query({
      query: () => "/api/v1/categories",
      providesTags: ["Category"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUploadProductImageMutation,
  useAddVariantMutation,
  useGetCategoriesQuery,
} = productApi;
