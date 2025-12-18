import { useEffect, useState } from "react";
import CustomerLogCard from "../card/CustomerLogCard";
import PanelHeader from "../PanelHeader";
import axios from "axios";

export default function Customers() {
  const [customerData, setCustomerData] = useState([]);

  const fetchUsersAndOrders = async () => {
    try {
      // ✅ Fetch all users first
      const { data: users } = await axios.get(
        "https://api-motoxelerate.onrender.com/api/user/users"
      );

      console.log(`👥 Loaded ${users.length} users`);

      // ✅ Grab token once for protected routes
      const token = localStorage.getItem("token");

      const customerPromises = users.map(async (user) => {
        try {
          // ✅ Fetch orders + appointments in parallel
          const [orderRes, apptRes] = await Promise.all([
            axios.get(
              `https://api-motoxelerate.onrender.com/api/order/user/${user._id}`
            ),
            axios.get(
              `https://api-motoxelerate.onrender.com/api/appointment/user/${user._id}`,
              {
                headers: { Authorization: `Bearer ${token}` }, // 🔑 include token
              }
            ),
          ]);

          // ✅ Orders: already formatted by backend
          const orders = (orderRes.data || []).map((order: any) => ({
            orderId: order.orderId,
            orderDate: order.orderDate,
            totalOrder: order.totalOrder ?? 0,
            paymentStatus: order.paymentStatus ?? "Pending",
            paidAt: order.paidAt ?? null,
            deliveryAddress: order.deliveryAddress ?? "N/A",
            notes: order.notes ?? "",
            items: order.items || [],
          }));

          // ✅ Appointments: backend now returns formatted shape
          const appointments = (apptRes.data || []).map((appt: any) => ({
            appointmentId: appt.appointmentId,
            service: appt.service,
            date: appt.date,
            time: appt.time,
            price: appt.price ?? 0,
            paymentMethod: appt.paymentMethod ?? "N/A",
            paymentStatus: appt.paymentStatus ?? "Pending",
            status: appt.status ?? "Pending",
          }));

          console.log(
            `✅ User ${user._id} (${user.firstName} ${user.lastName}) → ${orders.length} orders, ${appointments.length} appointments`
          );

          return {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            contact: user.contact || "No contact",
            email: user.email || "No email",
            address: user.address || "No address",
            image:
              user.image || "https://res.cloudinary.com/.../Starter_pfp.jpg",
            orders,
            appointments,
          };
        } catch (err: any) {
          console.warn(
            `⚠️ Failed to fetch data for user ${user._id}:`,
            err.message
          );
          return {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            contact: user.contact || "No contact",
            email: user.email || "No email",
            address: user.address || "No address",
            image:
              user.image || "https://res.cloudinary.com/.../Starter_pfp.jpg",
            orders: [],
            appointments: [],
          };
        }
      });

      const customers = await Promise.all(customerPromises);
      setCustomerData(customers);

      console.log(`📊 Final customer dataset size: ${customers.length}`);
    } catch (err: any) {
      console.error("❌ Failed to fetch users or orders:", err.message);
    }
  };

  useEffect(() => {
    fetchUsersAndOrders();
  }, []);

  return (
    <div>
      <div className="mb-6 border-b border-gray-200">
        <PanelHeader name="Customers" />
      </div>
      <CustomerLogCard customers={customerData} />
    </div>
  );
}
