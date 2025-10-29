import { useState } from "react";
import RecentOrderModal from "../modals/RecentOrderModal";

type Order = {
  id: string;
  name: string;
  date: string;
  total: string;
  payment: string;
  status: string;
};

type RecentOrdersProps = {
  orders: Order[];
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
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

      <div className="flex flex-row flex-wrap gap-4 text-sm text-gray-600 font-medium mb-3">
        <div className="min-w-[140px]">Order ID</div>
        <div className="min-w-[140px]">Name</div>
        <div className="min-w-[160px]">Date</div>
        <div className="min-w-[120px]">Total</div>
        <div className="min-w-[160px]">Payment Method</div>
        <div className="min-w-[120px]">Status</div>
        <div className="min-w-[160px]">Actions</div>
      </div>

      {orders.map((order) => (
        <div
          key={order.id}
          className="flex flex-row flex-wrap gap-4 text-sm pt-4"
        >
          <div className="min-w-[140px]">
            <p className="font-semibold">{order.id}</p>
          </div>
          <div className="min-w-[140px]">
            <p className="font-semibold">{order.name}</p>
          </div>
          <div className="min-w-[160px]">
            <p className="font-semibold">{order.date}</p>
          </div>
          <div className="min-w-[120px]">
            <p className="font-semibold">{order.total}</p>
          </div>
          <div className="min-w-[160px]">
            <p className="font-semibold">{order.payment}</p>
          </div>
          <div className="min-w-[120px]">
            <p className="font-semibold text-green-600">{order.status}</p>
          </div>
          <div className="min-w-[160px]">
            <button
              onClick={() => handleView(order)}
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
      />
    </div>
  );
}
