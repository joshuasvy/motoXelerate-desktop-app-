import { useState, useEffect } from "react";
import axios from "axios";
import PanelHeader from "../PanelHeader";
import AppointmentCard from "../card/AppointmentCard";
import AppointmentModal from "../modals/AppointmentModal"; // ✅ import modal here

export default function Appointment() {
  const [search, setSearch] = useState("");
  const [rawAppointments, setRawAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        "https://api-motoxelerate.onrender.com/api/appointment"
      );
      setRawAppointments(response.data.appointments);
    } catch (error) {
      console.error("❌ Fetch error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchAppointments();

    const interval = setInterval(() => {
      if (!isModalOpen) {
        fetchAppointments();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isModalOpen]);

  useEffect(() => {
    const filteredList = rawAppointments.filter(
      (a) =>
        a.customer_Name.toLowerCase().includes(search.toLowerCase()) ||
        a.service_Type.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredList);
  }, [search, rawAppointments]);

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 overflow-hidden">
      <div className="sticky top-0 z-20 bg-gray-50 pb-4 border-b border-gray-200">
        <PanelHeader name="Appointments" />
        <div className="flex flex-row justify-between items-center mt-4 px-6">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px] bg-white border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((appointment) => (
          <AppointmentCard
            key={appointment._id}
            appointment={appointment}
            onEdit={() => {
              setSelectedAppointment(appointment);
              setIsModalOpen(true);
            }}
          />
        ))}
      </div>

      {/* ✅ Lifted Modal */}
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
