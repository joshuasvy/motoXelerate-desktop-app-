import { useState, useEffect, useCallback } from "react";
import { socket } from "../utils/socket";
import { API_URL } from "../utils/config";
import type { Invoice, InvoiceItem } from "../types/Invoice";
import axios from "axios";

export type OrderItem = {
  productId: string;
  product_Name?: string;
  product_Price?: string;
  quantity: number;
  status: string;
};

export type Order = {
  id: string;
  name: string;
  email?: string;
  contact?: string;
  address?: string;
  date: string;
  dateRaw: string;
  quantity: number;
  total: string;
  paymentStatus: string;
  paymentMethod: string;
  referenceId: string;
  status: string;
  items: OrderItem[];
};

const getOverallStatus = (items: any[]): string => {
  if (!items || items.length === 0) return "Pending";
  if (items.some((i) => i.status === "For Approval")) {
    return "For Approval";
  }
  if (items.some((i) => i.status === "To ship")) {
    return "To ship";
  }
  if (items.some((i) => i.status === "Ship")) return "Ship";
  if (items.some((i) => i.status === "Delivered")) return "Delivered";
  if (items.every((i) => i.status === "Completed")) return "Completed";

  return "Pending";
};

const formatOrders = (data: any[]): Order[] =>
  data.map((order: any) => {
    const items = (order.items ?? []).map((item: any) => ({
      productId: item.product?._id ?? "",
      product_Name: item.product?.productName ?? "Unknown",
      product_Price: item.product?.price
        ? `₱${item.product.price.toLocaleString()}`
        : "N/A",
      quantity: item.quantity ?? 0,
      status: item.status ?? "Pending",
    }));

    const overallStatus = getOverallStatus(items);

    return {
      id: order._id?.toString() ?? "",
      name: order.customerName ?? "Unknown",
      email: order.customerEmail ?? "N/A",
      contact: order.customerPhone ?? "N/A",
      date: new Date(
        order.orderDate ?? order.createdAt ?? new Date()
      ).toLocaleDateString(),
      dateRaw: order.orderDate ?? order.createdAt ?? new Date().toISOString(),
      quantity:
        order.items?.reduce(
          (sum: number, item: any) => sum + (item?.quantity ?? 0),
          0
        ) ?? 0,
      total: `₱${Number(order.totalOrder ?? 0).toLocaleString()}`,
      paymentStatus: order.payment?.status ?? "N/A",
      paymentMethod: order.payment?.method ?? order.paymentMethod ?? "N/A",
      referenceId: order.payment?.referenceId ?? "N/A",
      status: overallStatus,
      address: order.deliveryAddress ?? "No address provided",
      items,
    };
  });

const formatOrderDetail = (data: any): Order => formatOrders([data])[0];

export function mapOrderToInvoice(order: Order): Invoice {
  const normalizedStatus: "Pending" | "Succeeded" | "Failed" =
    order.paymentStatus === "Succeeded"
      ? "Succeeded"
      : order.paymentStatus === "Failed"
      ? "Failed"
      : "Pending";

  const items: InvoiceItem[] = order.items.map((item) => {
    const unitPrice = item.product_Price
      ? Number(item.product_Price.replace(/[^\d.-]/g, ""))
      : 0;
    return {
      description: item.product_Name ?? "Unknown",
      quantity: item.quantity,
      unitPrice,
      lineTotal: item.quantity * unitPrice,
      status: item.status ?? "N/A",
    };
  });

  return {
    _id: "",
    invoiceNumber: `INV-${order.id}`,
    sourceType: "order",
    sourceId: order.id,
    customerName: order.name,
    customerAddress: order.address,
    customerEmail: order.email ?? "N/A",
    customerPhone: order.contact ?? "N/A",
    paymentMethod: order.paymentMethod,
    paymentStatus: normalizedStatus,
    referenceId: order.referenceId ?? "N/A",
    paidAt: normalizedStatus === "Succeeded" ? new Date().toISOString() : null,
    items,
    subtotal: Number(order.total.replace(/[^\d.-]/g, "")),
    total: Number(order.total.replace(/[^\d.-]/g, "")),
    status: normalizedStatus === "Succeeded" ? "paid" : "unpaid",
    createdAt: new Date(order.dateRaw).toISOString(),
    updatedAt: new Date(order.dateRaw).toISOString(),
  };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sales = orders
    .filter((o) => o.status.toLowerCase() === "completed")
    .reduce((sum, o) => sum + Number(o.total.replace(/[^\d.-]/g, "")), 0);
  const revenue = orders.reduce(
    (sum, o) => sum + Number(o.total.replace(/[^\d.-]/g, "")),
    0
  );

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ No token found, skipping fetchOrders");
        return;
      }
      const response = await axios.get(`${API_URL}/api/order`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const payload = Array.isArray(response.data)
        ? response.data
        : response.data.orders ?? [];

      console.log("✅ Orders fetched:", payload.length);

      const formatted = formatOrders(payload);
      setOrders(formatted);
    } catch (err: any) {
      setError(err.response?.data || err.message);
      console.error(
        "❌ Failed to fetch orders:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch all invoices
  const fetchInvoices = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ No token found, skipping fetchInvoices");
        return;
      }
      const response = await axios.get(`${API_URL}/api/invoice`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const payload = Array.isArray(response.data)
        ? response.data
        : response.data.invoices ?? [];

      console.log("✅ Invoices fetched:", payload.length);
      setInvoices(payload);
    } catch (err: any) {
      setError(err.response?.data || err.message);
      console.error(
        "❌ Failed to fetch invoices:",
        err.response?.data || err.message
      );
    }
  }, []);

  // ✅ Fetch single order by ID
  const fetchOrderById = useCallback(
    async (id: string): Promise<Order | null> => {
      if (!id || id.trim() === "") {
        console.warn("⚠️ Invalid order ID, skipping fetchOrderById");
        return null;
      }
      try {
        const token = localStorage.getItem("token");
        if (!token) return null;

        const res = await axios.get(`${API_URL}/api/order/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Order fetched by ID:", id);
        return formatOrderDetail(res.data);
      } catch (err: any) {
        console.error(
          "❌ Failed to fetch order:",
          err.response?.data || err.message
        );
        return null;
      }
    },
    []
  );

  // ✅ Update order items/status
  const updateOrderItems = useCallback(
    async (id: string, items: OrderItem[]): Promise<Order | null> => {
      if (!id || id.trim() === "") {
        console.warn("⚠️ Invalid order ID, skipping updateOrderItems");
        return null;
      }
      try {
        const token = localStorage.getItem("token");
        if (!token) return null;

        await axios.put(
          `${API_URL}/api/order/${id}`,
          {
            items: items.map((itm) => ({
              productId: itm.productId,
              status: itm.status,
            })),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("✅ Order items updated:", id);
        return await fetchOrderById(id);
      } catch (err: any) {
        console.error(
          "❌ Failed to update order:",
          err.response?.data || err.message
        );
        return null;
      }
    },
    [fetchOrderById]
  );

  // ✅ Socket listeners
  useEffect(() => {
    fetchOrders();
    fetchInvoices();
    const handleUpdate = (data: any) => {
      const formatted = formatOrders([data])[0];
      if (!formatted.id || formatted.id.trim() === "") {
        console.warn("⚠️ Skipping socket update with invalid ID");
        return;
      }
      setOrders((prev) => {
        const exists = prev.some((o) => o.id === formatted.id);
        return exists
          ? prev.map((o) => (o.id === formatted.id ? formatted : o))
          : [formatted, ...prev];
      });
    };

    const handleDelete = (deleted: any) => {
      const id =
        typeof deleted._id === "string"
          ? deleted._id
          : deleted._id?.toString?.() ?? "";
      if (!id || id.trim() === "") {
        console.warn("⚠️ Skipping socket delete with invalid ID");
        return;
      }
      setOrders((prev) => prev.filter((o) => o.id !== id));
    };

    socket.on("order:update", handleUpdate);
    socket.on("order:delete", handleDelete);

    return () => {
      console.log("🧹 Cleaning up socket listeners...");
      socket.off("order:update", handleUpdate);
      socket.off("order:delete", handleDelete);
    };
  }, [fetchOrders, fetchInvoices]);

  return {
    orders,
    invoices,
    loading,
    error,
    sales,
    revenue,
    setOrders,
    fetchOrders,
    fetchInvoices,
    fetchOrderById,
    updateOrderItems,
    mapOrderToInvoice,
  };
}
