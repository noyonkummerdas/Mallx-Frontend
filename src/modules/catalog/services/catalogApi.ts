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
  }),
});

export const { 
  useGetProductsQuery, 
  useGetProductDetailsQuery, 
  useGetCategoriesQuery 
} = catalogApi;
