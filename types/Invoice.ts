export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  unitPrice: number;
  lineTotal: number;
  status?: string;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  sourceType: "Order" | "Appointment";
  sourceId: string;
  customerName: string;
  customerAddress?: string;
  customerEmail?: string;
  customerPhone?: string;
  paymentMethod: string;
  paymentStatus: "Pending" | "Succeeded" | "Failed";
  referenceId?: string;
  paidAt?: string | null;
  items: InvoiceItem[];
  subtotal: number;
  total: number;
  status: "Unpaid" | "Paid" | "Cancelled" | "Refunded";
  appointmentId?: string;
  serviceType?: string;
  mechanic?: string;
  date?: string;
  time?: string;
  appointmentStatus?: string;
  createdAt: string;
  updatedAt: string;
}
