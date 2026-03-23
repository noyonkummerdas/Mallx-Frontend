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
    getCategories: builder.query({
      query: () => "/api/v1/categories",
      providesTags: ["Category"],
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: "/api/v1/products",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: ({ productId, productData }) => ({
        url: `/api/v1/products/${productId}`,
        method: "PATCH",
        body: productData,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Product", id: productId }, "Product"],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/api/v1/products/${productId}`,
        method: "DELETE",
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
    postProductReview: builder.mutation({
      query: ({ productId, reviewData }) => ({
        url: `/api/v1/products/${productId}/reviews`,
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Product", id: productId }],
    }),
    getRecentlyViewed: builder.query({
      query: () => "/api/v1/products/personal/recently-viewed",
      providesTags: ["Product"],
    }),
    getAdminInventory: builder.query({
      query: () => "/api/v1/products/admin/inventory",
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useAddVariantMutation,
  usePostProductReviewMutation,
  useGetRecentlyViewedQuery,
  useGetAdminInventoryQuery,
} = productApi;
