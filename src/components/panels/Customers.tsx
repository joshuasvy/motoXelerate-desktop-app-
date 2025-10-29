import CustomerLogCard from "../card/CustomerLogCard";
import PanelHeader from "../PanelHeader";

const customerData = [
  {
    id: "CUST-20251021-9473",
    name: "John Doe",
    contact: "0999 999 9999",
    email: "johndoe@gmail.me",
    address: "Blk 13 Lot 82 Phase 3F Loremipsum Consectetur adipiscing",
    orderId: "ORD-20251021",
    product: "RCB Monoshock",
    date: "10 / 21 / 25",
    total: "₱1,250",
    payment: "Gcash",
    status: "Completed",
  },
];

export default function Customers() {
  return (
    <div>
      <PanelHeader name="Customers" />
      <CustomerLogCard customers={customerData} />
    </div>
  );
}
