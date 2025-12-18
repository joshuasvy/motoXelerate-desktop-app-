import { useState, useEffect, useRef } from "react";
import { useNotificationContext } from "../../hooks/useNotificationContext";
import OrderCancellation from "./modals/OrderCancellation";

export default function PanelHeader({ name }: { name: string }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    actOnCancellation,
  } = useNotificationContext();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  return (
    <div className="flex flex-row justify-between items-center mb-3 relative p-2">
      <p className="text-3xl font-semibold">{name}</p>

      <div className="flex flex-row items-center relative">
        <p className="text-xl font-medium">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        {/* Notification Icon */}
        <div className="relative ml-5" ref={dropdownRef}>
          <button onClick={() => setShowDropdown(!showDropdown)}>
            <img
              src="/images/icons/notification.png"
              alt="Notification"
              className="w-7 rotate-45"
            />
          </button>

          {/* Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-[600px] bg-white rounded-lg shadow-lg p-4 z-50">
              <p className="text-lg font-semibold mb-3 flex justify-between items-center">
                Notifications
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm font-normal"
                  >
                    Mark all as read
                  </button>
                )}
              </p>

              <div className="space-y-3 max-h-64 overflow-y-auto cursor-pointer">
                {notifications.map((notif) => {
                  const handleClick = () => {
                    if (notif.type === "CancellationRequest") {
                      setSelectedNotification(notif);
                      setShowCancelModal(true);
                    } else {
                      markAsRead(notif.id);
                    }
                  };

                  const renderTypeLabel = () => {
                    switch (notif.type) {
                      case "order":
                        return "🛒 Order";
                      case "appointment":
                        return "📅 Appointment";
                      case "CancellationRequest":
                        return "🛑 Cancellation Request";
                      case "CancellationAccepted":
                        return "✅ Cancellation Accepted";
                      case "CancellationRejected":
                        return "❌ Cancellation Rejected";
                      default:
                        return "🔔 Notification";
                    }
                  };

                  return (
                    <div
                      key={notif.id}
                      className={`border rounded-md p-3 shadow-sm ${
                        notif.read ? "bg-gray-50 opacity-80 hover:opacity-100 hover:bg-white" : "bg-yellow-50"
                      }`}
                      onClick={handleClick}
                    >
                      <p className="text-sm font-medium flex items-center">
                        {renderTypeLabel()}
                        {!notif.read && (
                          <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </p>

                      <p className="text-sm text-gray-700">{notif.message}</p>

                      {notif.type === "CancellationRequest" && notif.reason && (
                        <p className="text-xs text-red-600 mt-1">
                          Reason: {notif.reason}
                        </p>
                      )}

                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for cancellation */}
      {showCancelModal && selectedNotification && (
        <OrderCancellation
          notification={selectedNotification}
          onClose={() => setShowCancelModal(false)}
          onAction={actOnCancellation}
        />
      )}
    </div>
  );
}
