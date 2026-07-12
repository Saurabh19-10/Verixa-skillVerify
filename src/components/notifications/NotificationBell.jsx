import { useEffect, useState } from "react";
import { Bell, CheckCheck, X } from "lucide-react";

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../api/notificationApi";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Notification error:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isRead: true } : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleReadAll = async () => {
    try {
      await markAllNotificationsRead();

      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const typeClass = {
    success: "text-green-400 bg-green-500/10",
    warning: "text-yellow-400 bg-yellow-500/10",
    error: "text-red-400 bg-red-500/10",
    info: "text-blue-400 bg-blue-500/10",
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-xl border border-slate-200 bg-white p-3 text-slate-700 hover:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Notifications
            </h3>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleReadAll}
                  className="text-xs text-blue-500 hover:underline"
                >
                  <CheckCheck size={14} className="inline" /> Mark all
                </button>
              )}

              <button
                onClick={() => setOpen(false)}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification._id}
                  onClick={() => handleRead(notification._id)}
                  className={`w-full border-b border-slate-100 p-4 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 ${
                    !notification.isRead
                      ? "bg-blue-500/5"
                      : "bg-transparent"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1 h-2.5 w-2.5 rounded-full ${
                        notification.isRead
                          ? "bg-slate-400"
                          : "bg-blue-500"
                      }`}
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {notification.title}
                        </h4>

                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] ${
                            typeClass[notification.type] || typeClass.info
                          }`}
                        >
                          {notification.type}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}