import { useState, useMemo } from "react";
import { useOrders } from "../../../hooks/useOrders";
import type { Order } from "../../../hooks/useOrders";
import type { Invoice as InvoiceType } from "../../../types/Invoice";
import PanelHeader from "../PanelHeader";
import Invoice from "./Invoice";
import StatCard from "../StatCard";
import RecentOrders from "../card/RecentOrders";
import FilteringBtn from "../FilteringBtn";

export default function Orders() {
  const {
    orders = [],
    setOrders,
    fetchOrderById,
    mapOrderToInvoice,
    fetchOrders,
  } = useOrders();

  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceType | null>(
    null
  );
  const [filter, setFilter] = useState("All Orders");
  const [showAll, setShowAll] = useState(false); // ✅ toggle for latest vs all

  const today = new Date();
  const isSameDay = (iso: string) => {
    const d = new Date(iso);
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  };

  const completedOrders = useMemo(
    () => orders.filter((o) => o.status === "Completed"),
    [orders]
  );

  const pendingOrders = useMemo(
    () => orders.filter((o) => ["For Approval", "Pending"].includes(o.status)),
    [orders]
  );

  const todaysOrders = useMemo(
    () => orders.filter((o) => isSameDay(o.dateRaw)),
    [orders]
  );

  const cutoff = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d;
  }, []);

  const recentOrders = useMemo(
    () => orders.filter((o) => new Date(o.dateRaw) >= cutoff),
    [orders, cutoff]
  );

  const filteredOrders = useMemo(() => {
    return recentOrders.filter((o) => {
      const status = o.status?.toLowerCase();
      if (filter === "To Ship") return status === "to ship";
      if (filter === "Ship") return status === "ship";
      if (filter === "Delivered") return status === "delivered";
      if (filter === "Completed") return status === "completed";
      return true;
    });
  }, [recentOrders, filter]);

  const handleView = async (order: Order) => {
    const refreshed = await fetchOrderById(order.id);
    if (refreshed) {
      const invoice = mapOrderToInvoice(refreshed);
      setSelectedInvoice(invoice);
      setOrders((prev) =>
        prev.map((o) => (o.id === refreshed.id ? refreshed : o))
      );
    }
  };

  if (selectedInvoice) {
    return (
      <div>
        <PanelHeader name="Transactions" />
        <Invoice
          invoice={selectedInvoice}
          onBack={() => {
            fetchOrders();
            setSelectedInvoice(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-20 bg-gray-50">
      <PanelHeader name="Orders" />

      {/* Filter buttons */}
      <div className="flex gap-3 mb-4 pb-4 border-b border-gray-200">
        {["All Orders", "To Ship", "Ship", "Delivered", "Completed"].map(
          (status) => (
            <FilteringBtn
              key={status}
              label={status}
              isActive={filter === status}
              onClick={() => {
                setFilter(status);
                setShowAll(status === "All Orders"); // ✅ only show all when "All Orders" is clicked
              }}
            />
          )
        )}
      </div>

      {/* Orders list */}
      <div className="flex-1 overflow-y-auto rounded-md shadow-md">
        {filteredOrders.length === 0 ? (
          <p className="text-gray-500 italic px-6 py-5">
            No orders found for {filter}.
          </p>
        ) : (
          <div className="bg-white px-4 py-5 rounded-md shadow-lg">
            <div className="grid grid-cols-[2fr_repeat(5,2fr)_1fr] text-sm text-white font-medium mb-3 py-2 items-center rounded-md bg-gray-800 border-b border-gray-300">
              <div className="px-2 sm:px-4">Order ID</div>
              <div className="px-2 sm:px-4">Name</div>
              <div className="px-2 sm:px-2">Date</div>
              <div className="px-2 sm:px-2">Product Ordered</div>
              <div className="px-2 sm:px-2">Total</div>
              <div className="px-2 sm:px-2">Order Status</div>
              <div className="px-2 sm:px-2">Actions</div>
            </div>
            <div className="max-h-[400px] overflow-y-auto scrollbar-hide px-1">
              <RecentOrders
                orders={filteredOrders}
                filter={filter}
                onView={handleView}
                showAll={showAll} // ✅ pass down
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex justify-between gap-6 mt-5">
        <div className="w-full space-y-6">
          <StatCard
            title="Total Orders"
            value={orders.length.toString()}
            icon="/images/icons/cart.png"
          />
          <StatCard
            title="Completed Orders"
            value={completedOrders.length.toString()}
            icon="/images/icons/cart.png"
          />
        </div>
        <div className="w-full space-y-6">
          <StatCard
            title="Pending Orders"
            value={pendingOrders.length.toString()}
            icon="/images/icons/cart.png"
          />
          <StatCard
            title="Today's Orders"
            value={todaysOrders.length.toString()}
            icon="/images/icons/cart.png"
          />
        </div>
      </div>
    </div>
  );
}
