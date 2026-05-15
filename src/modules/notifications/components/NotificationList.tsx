"use client";

import { useGetNotificationsQuery, useMarkAsReadMutation, useMarkAllAsReadMutation } from "../services/notificationApi";
import { Bell, Check, CheckCheck, Loader2, Mail, MessageSquare, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function NotificationList() {
  const { data: notificationData, isLoading, refetch } = useGetNotificationsQuery({});
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const notifications = notificationData?.data?.notifications || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
      toast.success("Notification marked as read");
    } catch (err) {
      toast.error("Failed to update notification");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead({}).unwrap();
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to update notifications");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest">Fetching alerts...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Notifications</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">You have {unreadCount} unread messages</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllRead}
            className="p-2 hover:bg-slate-50 rounded-lg text-indigo-600 transition-all flex items-center gap-2 group"
            title="Mark all as read"
          >
            <CheckCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Mark all read</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
        {notifications.length > 0 ? (
          notifications.map((notification: any) => (
            <div 
              key={notification._id}
              className={`px-6 py-4 flex gap-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 relative group ${!notification.isRead ? 'bg-indigo-50/30' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                notification.type === 'order' ? 'bg-emerald-50 text-emerald-600' : 
                notification.type === 'message' ? 'bg-blue-50 text-blue-600' : 
                'bg-slate-100 text-slate-600'
              }`}>
                {notification.type === 'order' ? <ShoppingBag className="w-5 h-5" /> : 
                 notification.type === 'message' ? <Mail className="w-5 h-5" /> : 
                 <Bell className="w-5 h-5" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className={`text-xs font-bold text-slate-900 truncate ${!notification.isRead ? 'pr-4' : ''}`}>
                    {notification.title}
                  </h4>
                  <span className="text-[9px] font-medium text-slate-400 whitespace-nowrap">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {notification.message}
                </p>
              </div>

              {!notification.isRead && (
                <button 
                  onClick={() => handleMarkAsRead(notification._id)}
                  className="absolute top-4 right-16 p-1.5 bg-white shadow-sm border border-slate-100 rounded-lg text-indigo-600 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  title="Mark as read"
                >
                  <Check className="w-3 h-3" />
                </button>
              )}
              
              {!notification.isRead && (
                <div className="absolute top-5 right-5 w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
              )}
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-slate-300">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Silence is golden</p>
            <p className="text-[9px] font-medium text-slate-400 mt-1 uppercase tracking-widest">No notifications yet</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100">
        <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10">
          View Notification History
        </button>
      </div>
    </div>
  );
}
