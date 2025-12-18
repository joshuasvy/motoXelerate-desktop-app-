import { useState, useEffect } from "react";
import { useOrders } from "../../../hooks/useOrders";
import axios from "axios";
import PanelHeader from "../PanelHeader";
import ReviewCard from "../card/ReviewCard";
import StatCard from "../StatCard";
import RecentAppointment from "../RecentAppointment";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const { orders, sales, revenue } = useOrders();

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ No token found in localStorage");
        return;
      }

      const res = await axios.get(
        "https://api-motoxelerate.onrender.com/api/appointment",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const appointmentsArray = Array.isArray(res.data?.appointments)
        ? res.data.appointments
        : Array.isArray(res.data)
        ? res.data
        : [];

      // Normalize backend fields to Appointment type
      const normalized = appointmentsArray.map((a: any) => ({
        name: a.customer_Name ?? "—",
        service: a.service_Type ?? "—",
        mechanic: a.mechanic || "Unassigned",
        schedule: a.date
          ? `${new Date(a.date).toLocaleDateString()} ${a.time ?? ""}`
          : "—",
        status: a.status ?? "Pending",
      }));

      setAppointments(normalized);

      console.log(
        `📥 Appointments fetched successfully: ${normalized.length} reservations`
      );
    } catch (err: any) {
      console.error(
        "❌ Error fetching appointments:",
        err.response?.data || err.message
      );
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.get("https://api-motoxelerate.onrender.com/api/order", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (err) {
      console.error("❌ Error fetching orders:", err.message);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchOrders();

    const interval = setInterval(() => {
      fetchAppointments();
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="mb-6 border-b border-gray-200">
        <PanelHeader name="Dashboard" />
      </div>
      <div className="flex justify-center">
        <div className="flex flex-row gap-5 w-full">
          {/* Left Column */}
          <div className="flex-1 space-y-3">
            <StatCard
              title="Sales"
              value={`₱ ${sales.toLocaleString()}`}
              icon="/images/icons/sales.png"
            />
            <StatCard
              title="Revenue"
              value={`₱ ${revenue.toLocaleString()}`}
              icon="/images/icons/sales.png"
            />
            <StatCard
              title="Orders"
              value={orders.length.toString()}
              icon="/images/icons/order-history.png"
            />
          </div>

          {/* Right Column */}
          <div className="flex-1 space-y-3">
            <StatCard
              title="Reservations"
              value={appointments.length.toString()}
              icon="/images/icons/reservation.png"
            />
            <ReviewCard />
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div>
        <RecentAppointment appointments={appointments.slice(0, 5)} />
      </div>
    </div>
  );
}
