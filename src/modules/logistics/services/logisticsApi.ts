import { apiSlice } from "@/store/api/apiSlice";

export const logisticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    acceptOrder: builder.mutation({
      query: (shipmentId) => ({
        url: "/api/v1/delivery/accept-order",
        method: "POST",
        body: { shipmentId },
      }),
    }),
    assignOrder: builder.mutation({
      query: (data) => ({
        url: "/api/v1/delivery/assign",
        method: "POST",
        body: data,
      }),
    }),
    updateTracking: builder.mutation({
      query: (trackingData) => ({
        url: "/api/v1/delivery/update-tracking",
        method: "PATCH",
        body: trackingData,
      }),
    }),
    getShipmentDetails: builder.query({
      query: (id) => `/api/v1/delivery/shipment/${id}`,
    }),
    getAvailableShipments: builder.query({
      query: () => "/api/v1/delivery/available-requests",
    }),
  }),
});

export const { 
  useAcceptOrderMutation, 
  useAssignOrderMutation,
  useUpdateTrackingMutation, 
  useGetShipmentDetailsQuery,
  useGetAvailableShipmentsQuery
} = logisticsApi;
