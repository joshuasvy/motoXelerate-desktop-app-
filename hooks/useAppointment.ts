import { useState, useEffect } from "react";
import { socket } from "../utils/socket";
import { API_URL } from "../utils/config";
import axios from "axios";
import type { Invoice } from "../types/Invoice";

// Appointment type for clarity
export interface Appointment {
  _id: string;
  customer_Name: string;
  customerEmail?: string;
  customerPhone?: string;
  service_Type: string;
  mechanic?: string;
  date: string;
  time: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  service_Charge: number;
  invoiceNumber?: string;
  payment?: {
    method?: string;
    status?: "Pending" | "Succeeded" | "Failed";
    referenceId?: string;
    paidAt?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Extend Invoice with appointment-specific fields
export interface AppointmentInvoice extends Invoice {
  appointmentId?: string;
  serviceType?: string;
  mechanic?: string;
  date?: string;
  time?: string;
  appointmentStatus?: string;
}

// ✅ Mapping function: Appointment → Invoice
export const mapAppointmentToInvoice = (
  appointment: Appointment
): AppointmentInvoice => ({
  _id: appointment._id,
  invoiceNumber: appointment.invoiceNumber ?? `INV-${appointment._id}`,
  sourceType: "Appointment",
  sourceId: appointment._id,
  customerName: appointment.customer_Name,
  customerEmail: appointment.customerEmail ?? "",
  customerPhone: appointment.customerPhone ?? "",
  paymentMethod: appointment.payment?.method ?? "GCash",
  paymentStatus: appointment.payment?.status ?? "Pending",
  referenceId: appointment.payment?.referenceId,
  paidAt: appointment.payment?.paidAt,
  items: [
    {
      description: appointment.service_Type,
      quantity: 1,
      unitPrice: appointment.service_Charge,
      lineTotal: appointment.service_Charge,
    },
  ],
  subtotal: appointment.service_Charge,
  total: appointment.service_Charge,
  status: appointment.payment?.status === "Succeeded" ? "Paid" : "Unpaid",
  appointmentId: appointment._id,
  serviceType: appointment.service_Type,
  mechanic: appointment.mechanic,
  date: appointment.date,
  time: appointment.time,
  appointmentStatus: appointment.status,

  // Metadata
  createdAt: appointment.createdAt ?? "",
  updatedAt: appointment.updatedAt ?? "",
});

// ✅ Hook
export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`${API_URL}/api/appointment`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data.appointments || []);
    } catch (err: any) {
      console.error(
        "❌ Failed to fetch appointments:",
        err.response?.data || err.message
      );
    }
  };

  const fetchInvoiceFromAppointment = async (
    appointmentId: string
  ): Promise<AppointmentInvoice | null> => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const res = await axios.post(
        `${API_URL}/api/invoice/from-appointment/${appointmentId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data as AppointmentInvoice;
    } catch (err: any) {
      console.error(
        "❌ Failed to fetch invoice:",
        err.response?.data || err.message
      );
      return null;
    }
  };

  useEffect(() => {
    fetchAppointments();

    const handleUpdate = (data: Appointment) => {
      setAppointments((prev) => {
        const exists = prev.find((a) => a._id === data._id);
        if (exists) {
          return prev.map((a) => (a._id === data._id ? data : a));
        }
        return [data, ...prev];
      });
    };

    socket.off("appointment:update");
    socket.on("appointment:update", handleUpdate);

    return () => {
      socket.off("appointment:update", handleUpdate);
    };
  }, []);

  return { appointments, fetchAppointments, fetchInvoiceFromAppointment };
}
