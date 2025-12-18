import { useEffect, useState } from "react";
import type { Customer } from "../../../types/CustomerType";

type CustomerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
};

export default function CustomerModal({
  isOpen,
  onClose,
  customer,
}: CustomerModalProps) {
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "orders" | "appointments"
  >("profile");

  useEffect(() => {
    if (isOpen && customer) {
      setMounted(true);
      requestAnimationFrame(() => setAnimateIn(true));
    } else {
      setAnimateIn(false);
      const timeout = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, customer]);

  if (!mounted || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm">
      <div
        className={`bg-white rounded-xl shadow-2xl max-w-6xl w-full h-[600px] p-6 relative transform transition-all duration-300 ease-in-out ${
          animateIn
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-10 opacity-0 scale-95"
        }`}
      >
        <button
          onClick={onClose}
          className="text-2xl absolute top-6 right-6 text-gray-500 hover:text-gray-800 transition"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-6">Customer Profile</h2>

        <div className="flex space-x-6 border-b mb-6">
          {["profile", "orders", "appointments"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-2 font-medium transition ${
                activeTab === tab
                  ? "text-green-700 border-b-2 border-green-700"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="overflow-y-auto h-[580px] pr-2">
          {activeTab === "profile" && (
            <div className="flex flex-col items-center space-y-8">
              <img
                src={customer.image}
                alt={customer.name}
                className="w-48 h-48 rounded-full border-4 border-blue-100 shadow-md object-cover"
              />
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-md font-medium w-full max-w-md">
                <p className="text-gray-500">Customer ID</p>
                <p className="w-96 truncate">{customer.id}</p>

                <p className="text-gray-500">Name</p>
                <p className="w-96 truncate">{customer.name}</p>

                <p className="text-gray-500">Contact</p>
                <p>{customer.contact}</p>

                <p className="text-gray-500">Email</p>
                <p className="w-96 truncate">{customer.email}</p>

                <p className="text-gray-500">Address</p>
                <p className="w-96 truncate">{customer.address}</p>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-4">
              {customer.orders.length > 0 ? (
                customer.orders.map((order, idx) => (
                  <div
                    key={order.orderId || idx}
                    className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">
                        {order.orderId || "—"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      Product: {order.items?.[0]?.productName || "—"}
                    </div>
                    <div className="mt-1 text-sm">
                      Total: ₱{Number(order.totalOrder ?? 0).toLocaleString()}
                    </div>
                    <div className="mt-1 text-sm">
                      Payment: {order.paymentStatus || "—"}
                    </div>
                    <div className="mt-1 text-sm">
                      Status: {order.items?.[0]?.status || "N/A"}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No completed orders found
                </p>
              )}
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="space-y-4">
              {customer.appointments.length > 0 ? (
                customer.appointments.map((appt, idx) => (
                  <div
                    key={appt.appointmentId || idx}
                    className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">
                        {appt.service || "—"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {appt.date
                          ? new Date(appt.date).toLocaleDateString()
                          : "—"}{" "}
                        {appt.time || ""}
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      Price: ₱{Number(appt.price ?? 0).toLocaleString()}
                    </div>
                    <div className="mt-1 text-sm">
                      Payment Method: {appt.paymentMethod || "—"}
                    </div>
                    <div className="mt-1 text-sm">
                      Status: {appt.status || "N/A"}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No completed appointments found
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
