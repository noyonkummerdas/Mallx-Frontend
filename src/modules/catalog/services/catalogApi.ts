import { apiSlice } from "@/store/api/apiSlice";

export const catalogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: "/api/v1/products",
        params,
      }),
      providesTags: ["Product"],
    }),
    getProductDetails: builder.query({
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
    addProductVariant: builder.mutation({
      query: ({ id, variantData }) => ({
        url: `/api/v1/products/${id}/variants`,
        method: "POST",
        body: variantData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),
    uploadProductImage: builder.mutation({
      query: ({ id, imageData }) => ({
        url: `/api/v1/products/${id}/upload-image`,
        method: "POST",
        body: imageData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),
    postProductReview: builder.mutation({
      query: ({ id, reviewData }) => ({
        url: `/api/v1/products/${id}/reviews`,
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),
    getRecentlyViewed: builder.query({
      query: () => "/api/v1/products/personal/recently-viewed",
      providesTags: ["Product"],
    }),
  }),
});

export const { 
  useGetProductsQuery, 
  useGetProductDetailsQuery, 
  useGetCategoriesQuery,
  useCreateProductMutation,
  useAddProductVariantMutation,
  useUploadProductImageMutation,
  usePostProductReviewMutation,
  useGetRecentlyViewedQuery
} = catalogApi;
