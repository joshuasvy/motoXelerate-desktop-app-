import { useState, useEffect } from "react";
import { useAppointments } from "../../../hooks/useAppointment";
import type {
  Appointment,
  AppointmentInvoice,
} from "../../../hooks/useAppointment";
import PanelHeader from "../PanelHeader";
import RecentAppointment from "../card/RecentAppointment";
import AppointmentModal from "../modals/AppointmentModal";
import FilteringBtn from "../FilteringBtn";
import Invoice from "./Invoice";

export default function Appointment() {
  const { appointments, fetchAppointments, fetchInvoiceFromAppointment } =
    useAppointments();

  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(
    null
  );
  const [selectedInvoice, setSelectedInvoice] =
    useState<AppointmentInvoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const filteredList = appointments.filter((a) => {
      const matchesSearch =
        a.customer_Name?.toLowerCase().includes(search.toLowerCase()) ||
        a.service_Type?.toLowerCase().includes(search.toLowerCase()) ||
        a.mechanic?.toLowerCase().includes(search.toLowerCase()) ||
        a.payment?.referenceId?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        a.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    setFiltered(filteredList);
  }, [search, appointments, statusFilter]);

  const statusOptions = [
    "All",
    "Pending",
    "Confirmed",
    "Completed",
    "Cancelled",
  ];

  const handleViewInvoice = async (appointment: Appointment) => {
    const invoice = await fetchInvoiceFromAppointment(appointment._id);
    if (invoice) {
      setSelectedInvoice(invoice);
    } else {
      console.warn(
        "⚠️ Could not fetch invoice for appointment:",
        appointment._id
      );
    }
  };

  if (selectedInvoice) {
    return (
      <div className="flex flex-col h-full w-full bg-gray-50 overflow-hidden">
        <PanelHeader name="Transactions" />
        <div className="flex-1 overflow-y-auto pr-4 pb-6">
          <Invoice
            invoice={selectedInvoice}
            onBack={() => {
              fetchAppointments();
              setSelectedInvoice(null);
            }}
            fetchInvoiceFromAppointment={fetchInvoiceFromAppointment}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-20 bg-gray-50">
      <PanelHeader name="Appointments" />
      <div className="flex flex-row justify-between items-center mt-4 px-6 mb-4 pb-4 border-b border-gray-200">
        {/* 🗂 Status filter buttons */}
        <div className="flex gap-3">
          {statusOptions.map((status) => (
            <FilteringBtn
              key={status}
              label={status}
              isActive={statusFilter === status}
              onClick={() => setStatusFilter(status)}
            />
          ))}
        </div>

        {/* 🔍 Search input */}
        <div className="relative w-full sm:w-[300px]">
          <img
            src="/images/icons/search.png"
            alt="Search"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search appointments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-md border border-gray-400 rounded-md shadow pl-12 pr-3 py-2 w-full focus:ring-1 focus:ring-black focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto rounded-md shadow-md">
        {filtered.length === 0 ? (
          <p className="text-gray-500 italic px-6 py-5">
            No appointments found for {statusFilter}.
          </p>
        ) : (
          <div className="bg-white px-4 py-5 rounded-md shadow-lg">
            {/* Table header */}
            <div className="grid grid-cols-[3fr_3fr_3fr_3fr_4fr_3fr_1fr] text-sm text-white font-medium mb-3 py-2 items-center rounded-md bg-gray-800 border-b border-gray-300">
              <div className="px-2 sm:px-4">Appointment ID</div>
              <div className="px-2 sm:px-4">Customer</div>
              <div className="px-2 sm:px-2">Service Type</div>
              <div className="px-2 sm:px-2">Mechanic</div>
              <div className="px-2 sm:px-2">Schedule</div>
              <div className="px-2 sm:px-2">Status</div>
              <div className="px-2 sm:px-2">Actions</div>
            </div>

            <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
              {filtered.map((appointment) => (
                <RecentAppointment
                  key={appointment._id}
                  appointment={appointment}
                  onView={() => handleViewInvoice(appointment)}
                  onEdit={() => {
                    setSelectedAppointment(appointment);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedAppointment && (
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          appointment={selectedAppointment}
          refresh={fetchAppointments}
        />
      )}
    </div>
  );
}
