import { useEffect, useState } from "react";
import axios from "axios";
import PanelHeader from "../PanelHeader";
import StatCard from "../StatCard";
import RecentOrders from "../card/RecentOrders";

type Order = {
  id: string;
  name: string;
  date: string;
  quantity: number;
  total: string;
  payment: string;
  status: string;
  items: {
    productId: string;
    product_Name: string;
    product_Price: string;
    quantity: number;
    status: string;
  }[];
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "https://api-motoxelerate.onrender.com/api/order"
        );

        const formatted: Order[] = response.data.map((order: any) => ({
          id: order._id,
          name: order.customerName,
          date: new Date(order.createdAt).toLocaleDateString(),
          quantity: order.items.reduce(
            (sum: number, item: any) => sum + item.quantity,
            0
          ), // ✅ FIXED
          total: `₱${parseFloat(order.totalOrder).toLocaleString()}`,
          payment: order.paymentMethod,
          status: order.orderRequest,
        }));

        setOrders(formatted);
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <PanelHeader name="Orders" />
      <RecentOrders orders={orders} />
      <div className="flex justify-between gap-6 mt-5">
        <div className="w-full space-y-6">
          <StatCard
            title="Total Orders"
            value={orders.length.toString()}
            icon="/images/icons/cart.png"
          />
          <StatCard
            title="Complete Orders"
            value={orders
              .filter((o) => o.status === "Approved")
              .length.toString()}
            icon="/images/icons/cart.png"
          />
        </div>
        <div className="w-full space-y-6">
          <StatCard
            title="Pending Orders"
            value={orders
              .filter((o) => o.status === "For Approval")
              .length.toString()}
            icon="/images/icons/cart.png"
          />
          <StatCard
            title="Today's Orders"
            value={orders
              .filter((o) => o.date === new Date().toLocaleDateString())
              .length.toString()}
            icon="/images/icons/cart.png"
          />
        </div>
      </div>
    </div>
  );
}
