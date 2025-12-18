export type OrderItem = {
  productId: string;
  productName: string;
  specification: string;
  price: number; // always a number
  image: string;
  quantity: number;
  status: string;
  read: boolean;
};

export type Order = {
  orderId: string;
  orderDate: string; // ISO date string
  totalOrder: number; // always a number, default 0
  paymentStatus: string;
  paidAt: string | null;
  deliveryAddress: string;
  notes: string;
  items: OrderItem[];
};

// ✅ Appointment type
export type Appointment = {
  appointmentId: string;
  service: string; // maps to service_Type
  date: string; // ISO date string
  time: string;
  price: number; // maps to service_Charge, default 0
  paymentMethod: string; // maps to payment.method
  paymentStatus: string; // maps to payment.status
  status: string; // Completed, Pending, etc.
};

// ✅ Customer type
export type Customer = {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
  image: string;
  orders: Order[];
  appointments: Appointment[];
};