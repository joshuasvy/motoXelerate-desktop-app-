import { useEffect, useState } from "react";
import SaveBtn from "../SaveBtn";
import axios from "axios";

type AppointmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    _id: string;
    customer_Name: string;
    service_Type: string;
    mechanic: string;
    date: string;
    time: string;
    status: string;
    customer_Charge?: number;
  } | null;
  refresh: () => void; // ✅ added
};

export default function AppointmentModal({
  isOpen,
  onClose,
  appointment,
  refresh,
}: AppointmentModalProps) {
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [mechanic, setMechanic] = useState("");
  const [schedule, setSchedule] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");
  const [fee, setFee] = useState("");
  const [admin, setAdmin] = useState<{ role: string } | null>(null);

  useEffect(() => {
    if (isOpen && appointment) {
      setMounted(true);
      requestAnimationFrame(() => setAnimateIn(true));
      setMechanic(appointment.mechanic);
      setSchedule(new Date(appointment.date).toISOString().split("T")[0]);
      setTime(appointment.time);
      setFee(
        appointment.service_Charge ? appointment.service_Charge.toString() : ""
      );
      setStatus(appointment.status);
    } else {
      setAnimateIn(false);
      const timeout = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, appointment]);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          "https://api-motoxelerate.onrender.com/api/admin/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAdmin(response.data);
      } catch (error: any) {
        console.error(
          "❌ Admin fetch error:",
          error.response?.data || error.message
        );
      }
    };

    fetchAdmin();
  }, []);

  if (!mounted || !appointment) return null;

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      await axios.delete(
        `https://api-motoxelerate.onrender.com/api/appointment/${appointment._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Appointment deleted!");
      refresh(); // ✅ refresh list
      onClose();
    } catch (error: any) {
      console.error("❌ Delete error:", error.response?.data || error.message);
      alert("❌ Failed to delete appointment.");
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      const formattedDate = new Date(schedule).toISOString().split("T")[0];

      const updates = {
        mechanic,
        date: formattedDate,
        time,
        status,
        service_Charge: fee,
      };

      await axios.put(
        `https://api-motoxelerate.onrender.com/api/appointment/${appointment._id}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Appointment updated!");
      refresh(); // ✅ refresh list
      onClose();
    } catch (error: any) {
      console.error("❌ Update error:", error.response?.data || error.message);
      alert("❌ Failed to update appointment.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className={`bg-white rounded-lg shadow-lg w-full max-w-[700px] h-full max-h-[620px] p-6 relative transform transition-all duration-300 ease-in-out ${
          animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 text-xl"
        >
          <img src="/images/icons/close.png" alt="Close" className="w-4" />
        </button>

        <h2 className="text-2xl font-semibold mb-6">Appointment Details</h2>
        <div className="px-3 space-y-4 text-sm">
          <p>
            <span className="text-[17px] text-gray-600">Appointment ID:</span>{" "}
            <span className="text-[17px] font-semibold">{appointment._id}</span>
          </p>
          <p>
            <span className="text-[17px] text-gray-600">Customer:</span>{" "}
            <span className="text-[17px] font-semibold">
              {appointment.customer_Name}
            </span>
          </p>
          <p>
            <span className="text-[17px] text-gray-600">Service Type:</span>{" "}
            <span className="text-[17px] font-semibold">
              {appointment.service_Type}
            </span>
          </p>

          <div>
            <label className="text-[17px] text-gray-600 block mb-2">
              Mechanic:
            </label>
            <input
              type="text"
              value={mechanic}
              onChange={(e) => setMechanic(e.target.value)}
              className="w-full border rounded px-3 py-2 text-[15px]"
            />
          </div>

          <div>
            <label className="text-[17px] text-gray-600 block mb-2">
              Schedule:
            </label>
            <input
              type="date"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="w-full border rounded px-3 py-2 text-[15px]"
            />
          </div>

          <div>
            <label className="text-[17px] text-gray-600 block mb-2">
              Time:
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border rounded px-3 py-2 text-[15px] mb-2"
            />
          </div>

          <p>
            <span className="text-[17px] text-gray-600">Service Fee:</span>{" "}
            <span className="text-[17px] text-red-500 font-semibold">
              ₱{appointment.service_Charge ?? "—"}
            </span>
          </p>

          <div className="flex gap-2 items-center">
            <p className="text-[17px] text-gray-600">Status:</p>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="text-[15px] font-semibold text-black cursor-pointer bg-transparent border border-gray-500 rounded-md p-1"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex flex-row justify-between items-center py-3">
            {admin?.role === "admin" && (
              <SaveBtn
                label="Delete"
                onPress={handleDelete}
                color="red"
                icon="/images/icons/delete.png"
              />
            )}

            <SaveBtn
              label="Save"
              onPress={handleSave}
              color="green"
              icon="/images/icons/save.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
