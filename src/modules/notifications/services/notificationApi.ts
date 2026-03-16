import { apiSlice } from "@/store/api/apiSlice";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => "/api/v1/notifications",
      providesTags: ["User"],
    }),
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/api/v1/notifications/${id}/read`,
        method: "PATCH",
      }),
    }),
    markAllAsRead: builder.mutation({
      query: () => ({
        url: "/api/v1/notifications/read-all",
        method: "PATCH",
      }),
    }),
  }),
});

export const { 
  useGetNotificationsQuery, 
  useMarkAsReadMutation, 
  useMarkAllAsReadMutation 
} = notificationApi;
