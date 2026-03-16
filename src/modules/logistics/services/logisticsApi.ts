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
  }),
});

export const { 
  useAcceptOrderMutation, 
  useUpdateTrackingMutation, 
  useGetShipmentDetailsQuery 
} = logisticsApi;
