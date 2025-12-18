import { useEffect, useState } from "react";
import Section from "../Section";
import DetailRow from "../DetailRow";
import ItemsTable from "../ItemsTable";
import type { Invoice } from "../../../types/Invoice";
import type { Appointment } from "../../../hooks/useAppointment";
import { formatDate, formatTime } from "../../../utils/dateHelpers";
import axios from "axios";
import { API_URL } from "../../../utils/config";

type InvoiceProps = {
  invoice: Invoice;
  onBack: () => void;
  fetchInvoiceFromAppointment?: (id: string) => Promise<Invoice | null>;
};

const formatCurrency = (amount: number) => `₱${amount.toLocaleString()}`;

export default function Invoice({ invoice, onBack }: InvoiceProps) {
  const [current, setCurrent] = useState<Invoice>(invoice);
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  // Keep local invoice state in sync when parent changes
  useEffect(() => {
    setCurrent(invoice);
  }, [invoice]);

  // Fetch live appointment if this invoice is linked to one
  useEffect(() => {
    const fetchAppointment = async () => {
      if (invoice.sourceType === "Appointment" && invoice.sourceId) {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            `${API_URL}/api/appointment/${invoice.sourceId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setAppointment(res.data);
          console.log("🔄 Fetched live appointment for invoice:", res.data);
        } catch (err: any) {
          console.error(
            "❌ Failed to fetch appointment:",
            err.response?.data || err.message
          );
        }
      }
    };
    fetchAppointment();
  }, [invoice]);

  const isAppointment = current.sourceType === "Appointment";

  const handleDownloadJson = () => {
    let exportData: any;

    if (current.sourceType === "Appointment") {
      // Appointment invoice JSON
      exportData = {
        invoiceNumber: current.invoiceNumber,
        referenceId: current.referenceId,
        subtotal: current.subtotal,
        total: current.total,
        paymentMethod: current.paymentMethod,
        paymentStatus: current.paymentStatus,
        paidAt: current.paidAt || null,
        sourceType: current.sourceType,
        appointmentId: current.appointmentId || null,
        serviceType: current.serviceType || null,
        mechanic: current.mechanic || null,
        date: current.date || null,
        time: current.time || null,
        appointmentStatus: current.appointmentStatus || null,
        customerName: current.customerName,
        customerPhone: current.customerPhone || null,
        customerEmail: current.customerEmail || null,
        items: current.items || [],
      };
    } else {
      // Order invoice JSON
      exportData = {
        invoiceNumber: current.invoiceNumber,
        referenceId: current.referenceId,
        subtotal: current.subtotal,
        total: current.total,
        paymentMethod: current.paymentMethod,
        paymentStatus: current.paymentStatus,
        paidAt: current.paidAt || null,
        sourceType: current.sourceType,
        customerName: current.customerName,
        customerPhone: current.customerPhone || null,
        customerEmail: current.customerEmail || null,
        items: current.items || [],
      };
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice-${current.invoiceNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    let headers: string[] = [];
    const rows: string[] = [];

    if (current.sourceType === "Appointment") {
      headers = [
        "InvoiceNumber",
        "ReferenceId",
        "Subtotal",
        "Total",
        "PaymentMethod",
        "PaymentStatus",
        "PaidAt",
        "SourceType",
        "AppointmentId",
        "ServiceType",
        "Mechanic",
        "Date",
        "Time",
        "AppointmentStatus",
        "CustomerName",
        "CustomerPhone",
        "CustomerEmail",
        "ItemDescription",
        "ItemQuantity",
        "ItemPrice",
      ];

      (current.items || []).forEach((item) => {
        const values = [
          current.invoiceNumber,
          current.referenceId,
          current.subtotal.toString(),
          current.total.toString(),
          current.paymentMethod,
          current.paymentStatus,
          current.paidAt || "",
          current.sourceType,
          current.appointmentId || "",
          current.serviceType || "",
          current.mechanic || "",
          current.date || "",
          current.time || "",
          current.appointmentStatus || "",
          current.customerName || "",
          current.customerPhone || "",
          current.customerEmail || "",
          item.description || "",
          item.quantity?.toString() || "",
          (item as any).price?.toString() || "",
        ];
        rows.push(values.map((v) => `"${v}"`).join(","));
      });
    } else {
      headers = [
        "InvoiceNumber",
        "ReferenceId",
        "Subtotal",
        "Total",
        "PaymentMethod",
        "PaymentStatus",
        "PaidAt",
        "SourceType",
        "CustomerName",
        "CustomerPhone",
        "CustomerEmail",
        "ItemDescription",
        "ItemQuantity",
        "ItemPrice",
      ];

      (current.items || []).forEach((item) => {
        const values = [
          current.invoiceNumber,
          current.referenceId,
          current.subtotal.toString(),
          current.total.toString(),
          current.paymentMethod,
          current.paymentStatus,
          current.paidAt || "",
          current.sourceType,
          current.customerName || "",
          current.customerPhone || "",
          current.customerEmail || "",
          item.description || "",
          item.quantity?.toString() || "",
          (item as any).price?.toString() || "",
        ];
        rows.push(values.map((v) => `"${v}"`).join(","));
      });
    }

    const csvContent = headers.join(",") + "\n" + rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice-${current.invoiceNumber}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const TransactionDetails = () => (
    <Section title="Transaction Details">
      <div className="flex flex-row gap-14">
        <div className="w-[700px] flex flex-col gap-4">
          <DetailRow label="Transaction ID" value={current.invoiceNumber} />
          <DetailRow label="Reference ID" value={current.referenceId} />
          <DetailRow
            label="Subtotal"
            value={formatCurrency(current.subtotal)}
          />
          <DetailRow label="Total" value={formatCurrency(current.total)} />
        </div>
        <div className="flex flex-col gap-4">
          <DetailRow label="Payment Method" value={current.paymentMethod} />
          <DetailRow label="Status" value={current.paymentStatus} />
          <DetailRow
            label="Completed on"
            value={current.paidAt ? formatDate(current.paidAt) : "—"}
          />
        </div>
      </div>
    </Section>
  );

  const CustomerInfo = () => (
    <Section title="Customer Info">
      <div className="flex flex-row gap-14">
        <div className="w-[700px] flex flex-col gap-4">
          <DetailRow label="Customer" value={current.customerName} />
          {!isAppointment && (
            <DetailRow label="Address" value={current.customerAddress || "—"} />
          )}
        </div>
        <div className="flex flex-col gap-4">
          <DetailRow label="Contact" value={current.customerPhone || "—"} />
          <DetailRow label="Email" value={current.customerEmail || "—"} />
        </div>
      </div>
    </Section>
  );

  const AuditLog = () =>
    current.createdAt && current.updatedAt ? (
      <div className="mt-6">
        <h3 className="text-sm text-gray-600 font-medium">Audit Log</h3>
        <div className="flex flex-row justify-between mt-6">
          <p className="text-sm">
            <span className="font-medium">Created At:</span>{" "}
            {formatDate(current.createdAt)}
          </p>
          <p className="text-sm">
            <span className="font-medium">Last Updated:</span>{" "}
            {formatDate(current.updatedAt)}
          </p>
        </div>
      </div>
    ) : null;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-7">
        <div className="flex flex-row gap-2 items-center">
          <button onClick={onBack} aria-label="Go back">
            <img
              src="/images/icons/back.png"
              alt="Back"
              className="w-8 h-8 cursor-pointer hover:opacity-80 transition"
            />
          </button>
          <h2 className="text-[21px] font-bold">
            Invoice #{current.invoiceNumber}
          </h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownloadJson}
            className="text-md font-medium rounded-2xl shadow-md bg-green-600 px-5 py-2 flex items-center gap-3 cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Download JSON
          </button>
          <button
            onClick={handleDownloadCsv}
            className="text-md font-medium rounded-2xl shadow-md bg-blue-600 px-5 py-2 flex items-center gap-3 cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Download CSV
          </button>
        </div>
      </div>

      {/* Transaction Details */}
      <TransactionDetails />

      {/* Appointment vs Order summary */}
      {isAppointment ? (
        <Section title="Appointment Summary">
          <div className="flex flex-row gap-14">
            <div className="w-[700px] flex flex-col gap-4">
              <DetailRow
                label="Appointment ID"
                value={appointment?._id || current.appointmentId}
              />
              <DetailRow
                label="Service Type"
                value={appointment?.service_Type || current.serviceType}
              />
              <DetailRow
                label="Mechanic"
                value={appointment?.mechanic || "Unassigned"}
              />
            </div>
            <div className="flex flex-col gap-4">
              <DetailRow
                label="Date"
                value={appointment?.date ? formatDate(appointment.date) : "—"}
              />
              <DetailRow
                label="Time"
                value={appointment?.time ? formatTime(appointment.time) : "—"}
              />
              <DetailRow
                label="Status"
                value={appointment?.status || current.appointmentStatus}
              />
            </div>
          </div>
        </Section>
      ) : (
        <Section title="Order Items">
          <ItemsTable items={current.items} />
        </Section>
      )}

      {/* Customer Info */}
      <CustomerInfo />

      {/* Audit Log */}
      <AuditLog />
    </div>
  );
}
