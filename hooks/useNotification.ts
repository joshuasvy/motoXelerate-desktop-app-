// hooks/useNotifications.ts
import { useState, useEffect, useCallback } from "react";
import { socket } from "../utils/socket";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "../utils/config";
import dedupeNotifications from "../helper/notificationHelper";
import axios from "axios";

export type Notification = {
  id: string;
  orderId?: string | null;
  appointmentId?: string | null;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  paymentMethod?: string;
  totalOrder?: number;
  notes?: string;
  items?: {
    product?: {
      _id?: string;
      productName?: string;
      specification?: string;
      price?: number;
      image?: string;
    };
    quantity?: number;
    status?: string;
  }[];
  payment?: {
    cancellationStatus?: string;
    cancellationReason?: string;
    cancelledAt?: string | null;
  };
  type:
    | "order"
    | "appointment"
    | "CancellationRequest"
    | "CancellationAccepted"
    | "CancellationRejected";
  message: string;
  reason?: string;
  status?: string;
  createdAt: string;
  read: boolean;
};

type TokenPayload = {
  _id?: string;
  id?: string;
  userId?: string;
  role?: string;
  iat: number;
  exp: number;
};

// 🔐 Helper: decode token and return auth context
function getAuthContext() {
  const token = localStorage.getItem("token");
  if (!token) return { headers: undefined, role: null, userId: null };

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const headers = { Authorization: `Bearer ${token}` };
    const role = decoded.role ?? null;
    const userId = decoded._id ?? decoded.id ?? decoded.userId ?? null;
    return { headers, role, userId };
  } catch (err) {
    console.error("❌ Failed to decode token:", err);
    return { headers: undefined, role: null, userId: null };
  }
}

// Helper: sort newest first
const sortNotifications = (list: Notification[]) =>
  [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { headers } = getAuthContext();

  // ✅ Normalize type values
  const normalizeType = (type: string): Notification["type"] => {
    if (
      type === "AppointmentCreatedAdmin" ||
      type === "AppointmentStatusAdmin"
    ) {
      return "appointment";
    }
    return type as Notification["type"];
  };

  // ✅ Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    if (!headers) {
      console.warn("⚠️ Skipping fetch: missing headers");
      return;
    }

    try {
      const url = `${API_URL}/api/notification`;
      const { data } = await axios.get(url, { headers });

      const logsArray: any[] = Array.isArray(data) ? data : [];

      const allNotifs: Notification[] = logsArray.map((log) => ({
        id: log._id?.toString() ?? log.id,
        orderId: log.orderId ?? null,
        appointmentId: log.appointmentId ?? null,
        customerName: log.customerName ?? "",
        customerEmail: log.customerEmail ?? "",
        customerPhone: log.customerPhone ?? "",
        deliveryAddress: log.deliveryAddress ?? "",
        paymentMethod: log.paymentMethod ?? "",
        totalOrder: log.totalOrder ?? 0,
        notes: log.notes ?? "",
        items: log.items ?? [],
        payment: log.payment ?? {},
        type: normalizeType(log.type),
        message: log.message,
        reason: log.reason ?? "",
        status: log.status ?? "",
        createdAt: log.createdAt,
        read: Boolean(log.readAt),
      }));

      const deduped = dedupeNotifications(allNotifs);
      setNotifications(sortNotifications(deduped));
    } catch (err: any) {
      console.error("❌ Error fetching notifications:", err.message);
    }
  }, [headers]);

  // ✅ Real-time updates
  useEffect(() => {
    if (!headers) {
      console.warn("⚠️ Skipping socket setup: no headers");
      return;
    }

    fetchNotifications();

    const handleCreate = (data: any) => {
      const newNotif: Notification = {
        id: data._id?.toString() ?? data.id ?? crypto.randomUUID(),
        orderId: data.orderId ?? null,
        appointmentId: data.appointmentId ?? null,
        customerName: data.customerName ?? "",
        customerEmail: data.customerEmail ?? "",
        customerPhone: data.customerPhone ?? "",
        deliveryAddress: data.deliveryAddress ?? "",
        paymentMethod: data.paymentMethod ?? "",
        totalOrder: data.totalOrder ?? 0,
        notes: data.notes ?? "",
        items: data.items ?? [],
        payment: data.payment ?? {},
        type: normalizeType(data.type),
        message: data.message ?? `Notification: ${data.type}`,
        reason: data.reason ?? "",
        status: data.status ?? "",
        createdAt: data.createdAt ?? new Date().toISOString(),
        read: Boolean(data.readAt),
      };

      setNotifications((prev) =>
        sortNotifications(dedupeNotifications([newNotif, ...prev]))
      );
    };

    const handleUpdate = (data: any) => {
      if (data.action === "mark-read") {
        setNotifications((prev) =>
          sortNotifications(
            dedupeNotifications(
              prev.map((n) =>
                n.id === data.id || n.orderId === data.orderId
                  ? { ...n, read: true }
                  : n
              )
            )
          )
        );
      }

      if (data.action === "delete") {
        setNotifications((prev) =>
          sortNotifications(
            dedupeNotifications(
              prev.filter((n) => n.id !== data.id && n.orderId !== data.orderId)
            )
          )
        );
      }

      // ✅ Handle enriched update payloads (e.g. CancellationAccepted/Rejected)
      if (data.action === "update" && data.notification) {
        const updatedNotif: Notification = {
          id: data.notification._id?.toString() ?? data.notification.id,
          orderId: data.notification.orderId ?? null,
          appointmentId: data.notification.appointmentId ?? null,
          customerName: data.notification.customerName ?? "",
          customerEmail: data.notification.customerEmail ?? "",
          customerPhone: data.notification.customerPhone ?? "",
          deliveryAddress: data.notification.deliveryAddress ?? "",
          paymentMethod: data.notification.paymentMethod ?? "",
          totalOrder: data.notification.totalOrder ?? 0,
          notes: data.notification.notes ?? "",
          items: data.notification.items ?? [],
          payment: data.notification.payment ?? {},
          type: normalizeType(data.notification.type),
          message:
            data.notification.message ??
            `Notification: ${data.notification.type}`,
          reason: data.notification.reason ?? "",
          status: data.notification.status ?? "",
          createdAt: data.notification.createdAt ?? new Date().toISOString(),
          read: Boolean(data.notification.readAt),
        };

        setNotifications((prev) =>
          sortNotifications(
            dedupeNotifications([
              updatedNotif,
              ...prev.filter((n) => n.id !== updatedNotif.id),
            ])
          )
        );
      }
    };

    socket.on("notification:create", handleCreate);
    socket.on("notification:update", handleUpdate);

    return () => {
      socket.off("notification:create", handleCreate);
      socket.off("notification:update", handleUpdate);
    };
  }, [fetchNotifications, headers]);

  // ✅ Mark single notification as read
  const markAsRead = async (id: string) => {
    if (!headers) return;

    try {
      await axios.patch(
        `${API_URL}/api/notification/${id}/read`,
        {},
        { headers }
      );
      setNotifications((prev) =>
        sortNotifications(
          dedupeNotifications(
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          )
        )
      );
    } catch (err: any) {
      console.error("❌ Failed to mark notification as read:", err.message);
    }
  };

  // ✅ Mark all as read
  const markAllAsRead = async () => {
    if (!headers) return;

    try {
      const url = `${API_URL}/api/notification/mark-read`;
      await axios.put(url, {}, { headers });
      setNotifications((prev) =>
        sortNotifications(
          dedupeNotifications(prev.map((n) => ({ ...n, read: true })))
        )
      );
    } catch (err: any) {
      console.error("❌ Failed to mark all as read:", err.message);
    }
  };

  // ✅ Accept/Reject cancellation request
  const actOnCancellation = async (
    orderId: string,
    action: "accept" | "reject"
  ) => {
    if (!headers) return;

    try {
      const url =
        action === "accept"
          ? `${API_URL}/api/order/${orderId}/accept-cancel`
          : `${API_URL}/api/order/${orderId}/reject-cancel`;

      const res = await axios.put(url, {}, { headers });
      console.log(`✅ Cancellation ${action}ed:`, res.data);
    } catch (err: any) {
      console.error(`❌ Failed to ${action} cancellation:`, err.message);
    }
  };

  // ✅ Derived state
  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    actOnCancellation,
  };
}
