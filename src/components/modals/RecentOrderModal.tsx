import { useEffect, useState } from "react";
import { useOrders } from "../../../hooks/useOrders";
import type { Order } from "../../../hooks/useOrders";
import Button from "../ActionBtn";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedOrder: Order | null;
  setSelectedOrder: React.Dispatch<React.SetStateAction<Order | null>>;
};

export default function RecentOrderModal({
  isOpen,
  onClose,
  selectedOrder,
  setSelectedOrder,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const { fetchOrderById, updateOrderItems } = useOrders();

  useEffect(() => {
    const loadOrder = async () => {
      if (!isOpen || !selectedOrder?.id) return;
      setLoading(true);
      try {
        const refreshed = await fetchOrderById(selectedOrder.id);
        if (refreshed) setSelectedOrder(refreshed);
      } catch (err) {
        console.error("❌ Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [isOpen, selectedOrder?.id, fetchOrderById, setSelectedOrder]);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => setAnimateIn(true));
    } else {
      setAnimateIn(false);
      const timeout = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!mounted) return null;

  const updateStatus = async () => {
    if (!selectedOrder?.id) return;
    try {
      const updated = await updateOrderItems(
        selectedOrder.id,
        selectedOrder.items
      );
      if (updated) {
        setSelectedOrder(updated);
        console.log("✅ Product statuses updated and reloaded");
        onClose();
      }
    } catch (err) {
      console.error("❌ Failed to update product statuses:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300">
      <div
        className={`bg-white rounded-xl shadow-2xl w-[1150px] max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out ${
          animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-8 py-5">
          <h2 className="text-xl font-semibold text-gray-800">
            {selectedOrder ? `Order #${selectedOrder.id}` : "Order Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
            aria-label="Close modal"
          >
            <img
              src="/images/icons/close.png"
              alt="Close"
              className="w-5 h-5"
            />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {loading ? (
            <p className="text-center text-gray-500 text-sm">
              Loading order details…
            </p>
          ) : selectedOrder ? (
            <>
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Customer</p>
                  <p className="font-medium">{selectedOrder.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Payment</p>
                  <p className="font-medium">
                    {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus}
                    )
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Address</p>
                  <p className="font-medium">
                    {selectedOrder.address ?? "No address provided"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total</p>
                  <p className="font-medium">{selectedOrder.total}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-[3fr_3fr_1fr_1fr_2fr] bg-gray-200 text-md font-semibold text-gray-700 border-b border-gray-200">
                  <div className="px-3 py-2">Product ID</div>
                  <div className="px-3 py-2">Product Name</div>
                  <div className="px-3 py-2 text-center">Qty</div>
                  <div className="px-3 py-2">Price</div>
                  <div className="px-3 py-2">Status</div>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={`${item.productId}-${index}`}
                      className="grid grid-cols-[3fr_3fr_1fr_1fr_2fr] text-md border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <div className="px-3 py-2 font-medium truncate">
                        {item.productId}
                      </div>
                      <div className="px-3 py-2 truncate">
                        {item.product_Name ?? "Unknown"}
                      </div>
                      <div className="px-3 py-2 text-center">
                        {item.quantity}
                      </div>
                      <div className="px-3 py-2">
                        {item.product_Price ?? "N/A"}
                      </div>
                      <div className="px-3 py-2">
                        <select
                          value={item.status}
                          onChange={(e) => {
                            const newStatus = e.target.value;
                            const updatedItems = selectedOrder.items.map(
                              (itm, i) =>
                                i === index
                                  ? { ...itm, status: newStatus }
                                  : itm
                            );
                            setSelectedOrder((prev) =>
                              prev ? { ...prev, items: updatedItems } : prev
                            );
                          }}
                          className="text-sm font-medium text-gray-800 cursor-pointer bg-white border border-gray-300 rounded-md px-2 py-1 w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                          aria-label="Update item status"
                        >
                          {item.status === "For Approval" && (
                            <option value="For Approval" disabled>
                              For Approval
                            </option>
                          )}
                          <option value="To ship">To ship</option>
                          <option value="Ship">Ship</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 text-sm">
              No order selected.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-8 py-4 flex justify-end bg-gray-50 rounded-b-xl">
          <Button
            icon="/images/icons/save.png"
            onPress={updateStatus}
            className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-5 py-2 shadow-md transition"
          />
        </div>
      </div>
    </div>
  );
}
