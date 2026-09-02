import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaCheckDouble, FaCircle, FaInfoCircle, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NotificationDropdown = ({ notificationApi, rolePathPrefix }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const countRes = await notificationApi.getUnreadCount();
      setUnreadCount(countRes.data?.data?.unreadCount || 0);

      const notifRes = await notificationApi.getNotifications(0, 10);
      setNotifications(notifRes.data?.data?.content || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationApi.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async (e) => {
    if (e) e.stopPropagation();
    try {
      await notificationApi.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await handleMarkAsRead(notif.notificationId);
    }
    setIsOpen(false);
    
    if (notif.referenceType === "COURSE" && notif.referenceSlug) {
      navigate(`/${rolePathPrefix}/course-preview/${notif.referenceSlug}`);
    } else {
      navigate(`/${rolePathPrefix}/dashboard`);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case "COURSE_PUBLISHED":
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-slate-300 text-slate-600 transition-all duration-200 shadow-sm relative focus:outline-none"
        title="Notifications"
      >
        <FaBell className="text-slate-600 text-sm" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs flex items-center gap-1 font-medium text-violet-600 hover:text-violet-700 transition-colors cursor-pointer"
              >
                <FaCheckDouble /> Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[350px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-sm">
                No notifications yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.notificationId}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${!notif.isRead ? 'bg-violet-50/30' : ''}`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getIconForType(notif.notificationType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold truncate ${!notif.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                          {notif.title}
                        </p>
                        {!notif.isRead && (
                          <FaCircle className="text-[8px] text-violet-600 flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">
                        {formatTime(notif.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-3 border-t border-slate-100 bg-slate-50 rounded-b-2xl text-center">
            <button
               onClick={() => { setIsOpen(false); navigate(`/${rolePathPrefix}/notifications`); }}
               className="text-xs font-semibold text-slate-600 hover:text-violet-600 transition-colors cursor-pointer"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
