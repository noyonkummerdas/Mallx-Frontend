import { apiSlice } from "./apiSlice";

export const partnerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPartners: builder.query({
      query: () => '/api/v1/admin/partners',
      providesTags: ['Partner'],
    }),
    getPartnerById: builder.query({
      query: (id) => `/api/v1/admin/partners/${id}`,
      providesTags: (result, error, id) => [{ type: 'Partner', id }],
    }),
    createPartner: builder.mutation({
      query: (body) => ({
        url: '/api/v1/admin/partners',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Partner'],
    }),
    updatePartner: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/v1/admin/partners/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => ['Partner', { type: 'Partner', id }],
    }),
  }),
});

export const { 
  useGetPartnersQuery, 
  useGetPartnerByIdQuery, 
  useCreatePartnerMutation, 
  useUpdatePartnerMutation 
} = partnerApi;
