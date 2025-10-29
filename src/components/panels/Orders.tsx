import PanelHeader from "../PanelHeader";
import StatCard from "../StatCard";
import RecentOrders from "../card/RecentOrders";

const orderData = [
  {
    id: "ORD-20251021",
    name: "John Doe",
    date: "October 21, 2025",
    total: "₱ 500",
    payment: "Gcash",
    status: "Completed",
  },
  {
    id: "ORD-20251022",
    name: "Jane Smith",
    date: "October 22, 2025",
    total: "₱ 1,200",
    payment: "Credit Card",
    status: "For approval",
  },
  {
    id: "ORD-20251023",
    name: "Mark Lee",
    date: "October 23, 2025",
    total: "₱ 850",
    payment: "Cash",
    status: "Delivered",
  },
];

export default function Orders() {
  return (
    <div>
      <PanelHeader name="Orders" />
      <RecentOrders orders={orderData} />
      <div className="flex justify-between gap-6 mt-5">
        <div className="w-full space-y-6">
          <StatCard
            title="Total Orders"
            value="1,230"
            icon="/images/icons/cart.png"
          />
          <StatCard
            title="Complete Orders"
            value="1,002"
            icon="/images/icons/cart.png"
          />
        </div>
        <div className="w-full space-y-6">
          <StatCard
            title="Pending Orders"
            value="342"
            icon="/images/icons/cart.png"
          />
          <StatCard
            title="Today's Orders"
            value="23"
            icon="/images/icons/cart.png"
          />
        </div>
      </div>
    </div>
  );
}
