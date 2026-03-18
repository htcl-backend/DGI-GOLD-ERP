import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FaBell, FaCheck, FaTrash, FaExclamationTriangle, FaInfoCircle, FaCheckCircle } from "react-icons/fa";
import { apiFetch } from "../api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiFetch("/notifications");
      setNotifications(Array.isArray(result.notifications) ? result.notifications : []);
    } catch (err) {
      setError(err.message || "Unable to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const [filter, setFilter] = useState("all");

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <FaInfoCircle className="text-blue-500" />;
      case "delivery":
        return <FaCheckCircle className="text-green-500" />;
      case "stock":
        return <FaExclamationTriangle className="text-red-500" />;
      case "payment":
        return <FaCheckCircle className="text-green-500" />;
      case "system":
        return <FaInfoCircle className="text-gray-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-gray-500";
      default:
        return "border-l-gray-500";
    }
  };

  const markAsRead = async (id) => {
    try {
      await apiFetch(`/notifications/${id}`, {
        method: "PUT",
        body: JSON.stringify({ read: true }),
      });
      setNotifications((prev) =>
        prev.map((notif) => (notif._id === id || notif.id === id ? { ...notif, read: true } : notif))
      );
    } catch (err) {
      // ignore update error, keep local state
    }
  };

  const markAllAsRead = async () => {
    const toUpdate = notifications.filter((notif) => !notif.read);
    for (const notif of toUpdate) {
      await markAsRead(notif._id || notif.id);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await apiFetch(`/notifications/${id}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((notif) => notif._id !== id && notif.id !== id));
    } catch (err) {
      // ignore delete error
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "all") return true;
    if (filter === "unread") return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Unable to load notifications</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[290px] overflow-x-hidden">
        <Header />
        <div className="p-6 bg-gray-50 min-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Notifications</h2>
              <p className="text-gray-600 mt-1">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                Mark All as Read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 bg-white p-1 rounded-lg shadow-sm">
            {[
              { key: "all", label: "All" },
              { key: "unread", label: "Unread" },
              { key: "order", label: "Orders" },
              { key: "delivery", label: "Delivery" },
              { key: "stock", label: "Stock" },
              { key: "payment", label: "Payment" }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-md font-medium transition ${filter === key
                  ? "bg-amber-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {label}
                {key === "unread" && unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No notifications</h3>
                <p className="text-gray-500">
                  {filter === "unread" ? "All caught up!" : `No ${filter} notifications found.`}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${getPriorityColor(
                    notification.priority
                  )} ${!notification.read ? "bg-blue-50" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-800">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-sm text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-500 hover:text-blue-700 p-2"
                          title="Mark as read"
                        >
                          <FaCheck size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-500 hover:text-red-700 p-2"
                        title="Delete notification"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Notification Settings */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Notification Settings</h3>
            <div className="space-y-4">
              {[
                { label: "Order Notifications", description: "Get notified when new orders are placed" },
                { label: "Delivery Updates", description: "Receive delivery status updates" },
                { label: "Stock Alerts", description: "Low stock and inventory alerts" },
                { label: "Payment Confirmations", description: "Payment received notifications" },
                { label: "System Updates", description: "Maintenance and system notifications" }
              ].map((setting, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">{setting.label}</h4>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;