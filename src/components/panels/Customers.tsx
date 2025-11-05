import { useEffect, useState } from "react";
import CustomerLogCard from "../card/CustomerLogCard";
import PanelHeader from "../PanelHeader";
import axios from "axios";

export default function Customers() {
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    const fetchUsersAndOrders = async () => {
      try {
        const userRes = await axios.get(
          "https://api-motoxelerate.onrender.com/api/user/users"
        );
        const users = userRes.data;

        const customerPromises = users.map(async (user) => {
          try {
            const orderRes = await axios.get(
              `https://api-motoxelerate.onrender.com/api/order/user/${user._id}`
            );
            const orders = orderRes.data;
            const recentOrder = orders[0]; // ✅ most recent

            return {
              id: user._id,
              name: `${user.firstName} ${user.lastName}`,
              contact: user.contact || "No contact",
              email: user.email || "No email",
              address: user.address || "No address",
              orderId: recentOrder?.orderId || "ORD-N/A",
              product:
                recentOrder?.items?.[0]?.productName || "No product ordered",
              date:
                new Date(recentOrder?.orderDate).toLocaleDateString() ||
                "No date",
              total:
                recentOrder?.totalOrder !== undefined
                  ? `₱${recentOrder.totalOrder.toLocaleString()}`
                  : "₱0",
              payment: recentOrder?.paymentMethod || "N/A",
              status: recentOrder?.items?.[0]?.status || "N/A",
            };
          } catch (err) {
            console.warn(`⚠️ No orders for user ${user._id}`);
            return {
              id: user._id,
              name: `${user.firstName} ${user.lastName}`,
              contact: user.contact || "No contact",
              email: user.email || "No email",
              address: user.address || "No address",
              orderId: "ORD-N/A",
              product: "No product ordered",
              date: "No date",
              total: "₱0",
              payment: "N/A",
              status: "N/A",
            };
          }
        });

        const customers = await Promise.all(customerPromises);
        setCustomerData(customers);
      } catch (err) {
        console.error("❌ Failed to fetch users or orders:", err);
      }
    };

    fetchUsersAndOrders();
  }, []);

  return (
    <div>
      <PanelHeader name="Customers" />
      <CustomerLogCard customers={customerData} />
    </div>
  );
}
