import { useState, useEffect } from "react";
import { useOrders } from "../../../hooks/useOrders";
import type { Order } from "../../../hooks/useOrders";
import RecentOrderModal from "../modals/RecentOrderModal";

type RecentOrdersProps = {
  orders?: Order[];
  filter: string;
  onView: (order: Order) => void;
};

export default function RecentOrders({
  orders = [],
  filter,
  onView,
}: RecentOrdersProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expanded, setExpanded] = useState(false); // ✅ local toggle

  const { fetchOrderById } = useOrders();

  const statusColor: Record<string, string> = {
    "For Approval": "bg-yellow-100 text-yellow-700",
    "To ship": "bg-blue-100 text-blue-700",
    Ship: "bg-indigo-100 text-indigo-700",
    Delivered: "bg-purple-100 text-purple-700",
    Completed: "bg-green-200 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  const getOrderStatus = (order: Order): string => {
    if (!order.items || order.items.length === 0) return "For Approval";
    return order.items[order.items.length - 1].status ?? "For Approval";
  };

  const getStatusClass = (status: string): string =>
    statusColor[status] || "bg-gray-100 text-gray-600";

  useEffect(() => {
    const refreshOrder = async () => {
      if (!isModalOpen || !selectedOrder?.id) return;
      try {
        const refreshed = await fetchOrderById(selectedOrder.id);
        if (refreshed) setSelectedOrder(refreshed);
      } catch (err) {
        console.error("❌ Failed to refresh order:", err);
      }
    };
    refreshOrder();
  }, [isModalOpen, selectedOrder?.id, fetchOrderById]);

  const handleEdit = async (order: Order) => {
    if (!order.id) return;
    try {
      const refreshed = await fetchOrderById(order.id);
      if (refreshed) {
        setSelectedOrder(refreshed);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("❌ Failed to fetch order:", err);
    }
  };

  // ✅ Only show latest 6 unless expanded
  const displayedOrders = expanded ? orders : orders.slice(0, 6);

  const emptyMessage =
    filter === "Delivered"
      ? "There's no delivered order yet"
      : filter === "Completed"
      ? "There's no completed order yet"
      : "No orders found";

  return (
    <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
      {displayedOrders.length === 0 ? (
        <p className="text-md text-gray-600 italic text-center py-6">
          {emptyMessage}
        </p>
      ) : (
        <>
          {displayedOrders.map((order) => {
            const status = getOrderStatus(order);
            return (
              <div
                key={order.id}
                className="grid grid-cols-[2fr_repeat(5,2fr)_1fr] items-center text-sm py-3 border-b border-gray-200 hover:bg-gray-50 transition"
              >
                <div className="font-semibold truncate">{order.id}</div>
                <div className="px-2 font-medium truncate">{order.name}</div>
                <div className="text-gray-700">{order.date}</div>
                <div className="px-3 font-medium">{order.quantity}</div>
                <div className="px-2 font-medium">{order.total}</div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </div>
                <div className="px-2 flex gap-3">
                  <button
                    onClick={() => onView(order)}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(order)}
                    className="text-red-600 font-semibold hover:underline"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}

          {/* ✅ Show More / Show Less toggle */}
          {orders.length > 6 && (
            <div className="flex justify-center py-3">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-sm text-blue-600 font-semibold hover:underline"
              >
                {expanded ? "Show Less" : "Show All Orders"}
              </button>
            </div>
          )}
        </>
      )}

      {selectedOrder && (
        <RecentOrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
      )}
    </div>
  );
}
