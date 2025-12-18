import { formatDate, formatTime } from "../../../utils/dateHelpers";

type AppointmentProps = {
  appointment: {
    _id: string;
    customer_Name: string;
    service_Type: string;
    mechanic?: string;
    date: string;
    time: string;
    status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  };
  onView: () => void; // ✅ invoice view
  onEdit: () => void;
};

// ✅ Status badge colors
const statusColor: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-blue-100 text-blue-700",
  Completed: "bg-green-200 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function RecentAppointment({
  appointment,
  onView,
  onEdit,
}: AppointmentProps) {
  const getStatusClass = (status: string) =>
    statusColor[status] || "bg-gray-100 text-gray-600";

  return (
    <div
      key={appointment._id}
      className="grid grid-cols-[3fr_3fr_3fr_3fr_4fr_3fr_1fr] items-center text-sm py-3 border-b border-gray-200 hover:bg-gray-50 transition"
    >
      {/* Appointment ID */}
      <div className="px-2 sm:px-4 font-semibold truncate">
        {appointment._id}
      </div>

      {/* Customer */}
      <div className="px-2 sm:px-4 font-medium truncate">
        {appointment.customer_Name}
      </div>

      {/* Service Type */}
      <div className="px-2 sm:px-2 font-medium truncate">
        {appointment.service_Type}
      </div>

      {/* Mechanic */}
      <div className="px-2 sm:px-2 font-medium truncate">
        {appointment.mechanic || "Unassigned"}
      </div>

      {/* Schedule (Date + Time) */}
      <div className="px-2 sm:px-2 font-medium truncate">
        {appointment.date ? formatDate(appointment.date) : "—"} {" | "}
        {appointment.time ? formatTime(appointment.time) : ""}
      </div>

      {/* Status as badge */}
      <div className="px-2 sm:px-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
            appointment.status
          )}`}
        >
          {appointment.status}
        </span>
      </div>

      {/* Actions */}
      <div className="px-2 sm:px-2 flex gap-3">
        <button
          onClick={onView}
          className="text-blue-600 font-semibold hover:underline"
        >
          View
        </button>
        <button
          onClick={onEdit}
          className="text-red-600 font-semibold hover:underline"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
