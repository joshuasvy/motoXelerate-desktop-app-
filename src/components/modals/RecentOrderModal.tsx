import { useEffect, useState } from "react";
import SaveBtn from "../SaveBtn";
import axios from "axios";

type OrderItem = {
  productId: string;
  productName: string | null;
  price: string | null;
  quantity: number;
  status: string;
};

type Order = {
  id: string;
  name: string;
  date: string;
  quantity: number;
  total: string;
  payment: string;
  address: string;
  status: string;
  items: OrderItem[];
};

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

  const formatOrder = (data: any): Order => ({
    id: data.orderId || data._id,
    name: data.customerName,
    date: new Date(data.orderDate || data.createdAt).toLocaleDateString(),
    quantity: data.items.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    ),
    total: `₱${parseFloat(data.totalOrder).toLocaleString()}`,
    payment: data.paymentMethod,
    status: data.orderRequest || "N/A",
    address: data.deliveryAddress || "No address provided",
    items: data.items.map((item: any, index: number) => ({
      productId: item.productId ?? `missing-${index}`,
      productName: item.productName ?? null,
      price:
        item.price != null
          ? `₱${parseFloat(item.price).toLocaleString()}`
          : null,
      quantity: item.quantity,
      status: item.status,
    })),
  });

  const updateStatus = async () => {
    if (!selectedOrder) return;

    try {
      const payload = {
        items: selectedOrder.items.map((item) => ({
          productId: item.productId,
          status: item.status,
        })),
      };

      await axios.put(
        `https://api-motoxelerate.onrender.com/api/order/${selectedOrder.id}`,
        payload
      );

      const refreshed = await axios.get(
        `https://api-motoxelerate.onrender.com/api/order/${selectedOrder.id}`
      );

      setSelectedOrder(formatOrder(refreshed.data));
      console.log("✅ Product statuses updated and reloaded");
      onClose();
    } catch (err) {
      console.error("❌ Failed to update product statuses:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300">
      <div
        className={`bg-white rounded-lg shadow-lg w-[1400px] h-fit px-8 py-10 pb-28 relative transform transition-all duration-300 ease-in-out ${
          animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 text-xl"
        >
          <img src="/images/icons/close.png" alt="Close" className="w-4" />
        </button>

        {selectedOrder && (
          <div>
            <h2 className="text-2xl font-semibold mb-5">{selectedOrder.id}</h2>

            <div className="flex flex-row flex-wrap gap-5 text-sm text-gray-600 font-medium mb-3">
              <div className="w-[180px]">Product ID</div>
              <div className="w-[190px]">Product Name</div>
              <div className="w-[160px]">Customer Name</div>
              <div className="w-[88px]">Quantity</div>
              <div className="w-[110px]">Price</div>
              <div className="w-[150px]">Payment Method</div>
              <div className="w-[190px]">Address</div>
              <div className="w-fit">Status</div>
            </div>

            {selectedOrder.items.map((item, index) => {
              const isFallback =
                !item.productId ||
                item.productName === null ||
                item.price === null;

              if (isFallback) {
                console.warn(
                  `⚠️ Order ${selectedOrder.id} Item[${index}] has fallback values:`,
                  item
                );
              }

              return (
                <div
                  key={`${item.productId}-${index}`}
                  className="flex flex-row flex-wrap gap-4 text-sm pt-4 border-t border-gray-200"
                >
                  <div className="w-[180px]">
                    <p className="font-semibold truncate">{item.productId}</p>
                  </div>
                  <div className="w-[195px]">
                    <p className="font-semibold truncate">
                      {item.productName ?? "Unnamed Product"}
                    </p>
                  </div>
                  <div className="w-[170px] pl-1">
                    <p className="font-semibold truncate line-clamp-1">
                      {selectedOrder.name}
                    </p>
                  </div>
                  <div className="w-[90px]">
                    <p className="font-semibold">{item.quantity}</p>
                  </div>
                  <div className="w-[110px]">{item.price ?? "₱0"}</div>
                  <div className="w-[150px]">
                    <p className="font-semibold">{selectedOrder.payment}</p>
                  </div>
                  <div className="w-[200px] pl-1">
                    <p className="font-semibold truncate">
                      {selectedOrder.address}
                    </p>
                  </div>
                  <div className="w-[120px]">
                    <select
                      value={item.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;

                        const updatedItems = selectedOrder.items.map((itm, i) =>
                          i === index ? { ...itm, status: newStatus } : itm
                        );

                        setSelectedOrder((prev) =>
                          prev ? { ...prev, items: updatedItems } : prev
                        );

                        try {
                          await axios.put(
                            `https://api-motoxelerate.onrender.com/api/order/${selectedOrder.id}`,
                            {
                              items: updatedItems.map((itm) => ({
                                productId: itm.productId,
                                status: itm.status,
                              })),
                            }
                          );

                          const refreshed = await axios.get(
                            `https://api-motoxelerate.onrender.com/api/order/${selectedOrder.id}`
                          );

                          setSelectedOrder(formatOrder(refreshed.data));
                          console.log("✅ Status updated and refreshed");
                        } catch (err) {
                          console.error("❌ Failed to update status:", err);
                        }
                      }}
                      className="text-[13px] font-medium text-black cursor-pointer bg-transparent border border-gray-500 rounded-md p-1"
                    >
                      <option value="For approval">For approval</option>
                      <option value="To ship">To ship</option>
                      <option value="Ship">Ship</option>
                      <option value="Completed">Completed</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="absolute bottom-5 right-4">
          <SaveBtn icon="/images/icons/save.png" onPress={updateStatus} />
        </div>
      </div>
    </div>
  );
}
