import { useState } from "react";
import RecentOrderModal from "../modals/RecentOrderModal";
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
  status: string;
  address: string;
  items: OrderItem[];
};

type RecentOrdersProps = {
  orders: Order[];
};

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
      item.price != null ? `₱${parseFloat(item.price).toLocaleString()}` : null,
    quantity: item.quantity,
    status: item.status,
  })),
});

export default function RecentOrders({ orders }: RecentOrdersProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = async (order: Order) => {
    try {
      const response = await axios.get(
        `https://api-motoxelerate.onrender.com/api/order/${order.id}`
      );
      const formatted = formatOrder(response.data);
      setSelectedOrder(formatted);
      setIsModalOpen(true);
    } catch (err) {
      console.error("❌ Failed to fetch full order:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Recent Orders</h2>
        <img
          src="/images/icons/order-history.png"
          alt="Recent Orders"
          className="w-8"
        />
      </div>

      <div className="flex flex-row flex-wrap gap-5 text-sm text-gray-600 font-medium mb-3">
        <div className="w-[210px] ">Order ID</div>
        <div className="w-[180px] ml-3 ">Name</div>
        <div className="w-[110px] ">Date</div>
        <div className="w-fit mr-5 ">Product Ordered</div>
        <div className="w-[100px] ">Total</div>
        <div className="w-[150px] ">Payment Method</div>
        <div className="w-fit ">Actions</div>
      </div>

      {orders.map((order) => (
        <div
          key={order.id}
          className="flex flex-row flex-wrap gap-6 text-sm pt-4"
        >
          <div className="w-[210px] ">
            <p className="font-semibold truncate line-clamp-1">{order.id}</p>
          </div>
          <div className="w-[177px] ml-2 ">
            <p className="font-semibold truncate line-clamp-1">{order.name}</p>
          </div>
          <div className="w-[105px] ">
            <p className="font-semibold">{order.date}</p>
          </div>
          <div className="w-[120px] ">
            <p className="font-semibold text-center">{order.quantity}</p>
          </div>
          <div className="w-[95px] ml-4 ">
            <p className="font-semibold">{order.total}</p>
          </div>
          <div className="w-[145px] ">
            <p className="font-semibold">{order.payment}</p>
          </div>
          <div className="w-fit flex flex-row gap-5">
            <button
              onClick={() => handleEdit(order)}
              className="font-semibold text-blue-600 hover:underline"
            >
              View
            </button>
            <button
              onClick={() => handleEdit(order)}
              className="font-semibold text-red-600 hover:underline"
            >
              Edit
            </button>
          </div>
        </div>
      ))}

      <RecentOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
      />
    </div>
  );
}
