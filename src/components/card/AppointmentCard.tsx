type AppointmentProps = {
  appointment: {
    _id: string;
    customer_Name: string;
    service_Type: string;
    mechanic: string;
    date: string;
    time: string;
    status: string;
    service_Charge?: number;
  };
  onEdit: () => void
};

const statusColor: Record<string, string> = {
  pending: "text-yellow-500",
  approved: "text-green-600",
  rejected: "text-red-500",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}

function formatTime(timeString: string): string {
  const [hourStr, minuteStr] = timeString.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr.padStart(2, "0");
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

export default function AppointmentCard({
  appointment,
  onEdit,
}: AppointmentProps) {
  return (
    <div className="bg-white rounded-xl w-full max-w-[280px] h-fit shadow-md px-5 py-6 relative">
      <div className="flex gap-2 mb-2 line-clamp-1 truncate w-[223px]">
        <p className="text-gray-600 text-sm">Appointment ID:</p>
        <p className="font-semibold text-sm">{appointment._id}</p>
      </div>

      <div className="flex gap-2 mb-2">
        <p className="text-gray-600 text-sm">Customer:</p>
        <p className="font-semibold text-sm">{appointment.customer_Name}</p>
      </div>

      <div className="flex gap-2 mb-2">
        <p className="text-gray-600 text-sm whitespace-nowrap">Service Type:</p>
        <p className="font-semibold text-sm truncate whitespace-nowrap overflow-hidden w-[180px]">
          {appointment.service_Type}
        </p>
      </div>

      <div className="flex gap-2 mb-2">
        <p className="text-gray-600 text-sm">Mechanic:</p>
        <p className="font-semibold text-sm">
          {appointment.mechanic || "Unassigned"}
        </p>
      </div>

      <div className="flex gap-2 mb-2 line-clamp-1 truncate w-[223px]">
        <p className="text-gray-600 text-sm">Schedule:</p>
        <p className="font-semibold text-sm">{formatDate(appointment.date)}</p>
      </div>

      <div className="flex gap-2 mb-2">
        <p className="text-gray-600 text-sm">Time:</p>
        <p className="font-semibold text-sm">{formatTime(appointment.time)}</p>
      </div>

      <div className="flex gap-2 mb-2">
        <p className="text-gray-600 text-sm">Service Fee:</p>
        <p className="font-semibold text-sm">
          ₱{appointment.service_Charge ?? "—"}
        </p>
      </div>

      <div className="flex gap-2 mb-2">
        <p className="text-gray-600 text-sm">Status:</p>
        <p
          className={`font-semibold text-sm ${
            statusColor[appointment.status] || "text-gray-500"
          }`}
        >
          {appointment.status}
        </p>
      </div>

      <button
        className="text-green-600 text-[16px] font-semibold absolute right-5 bottom-3"
        onClick={onEdit}
      >
        Edit
      </button>
    </div>
  );
}
