type Appointment = {
  name: string;
  service: string;
  mechanic: string;
  schedule: string;
  status: string;
};

type RecentAppointmentProps = {
  appointments: Appointment[];
};

export default function RecentAppointment({
  appointments,
}: RecentAppointmentProps) {
  return (
    <div className="bg-white p-6 rounded-md shadow-lg mt-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Recent Appointments</h2>
        <img
          src="/images/icons/recent.png"
          alt="Recent Appointments"
          className="w-7"
        />
      </div>

      {/* Labels */}
      <div className="grid grid-cols-5 gap-6 text-sm text-gray-600 font-medium mb-3">
        <div>Name</div>
        <div>Service</div>
        <div>Mechanic</div>
        <div>Schedule</div>
        <div>Status</div>
      </div>

      {/* Values */}
      {appointments.length === 0 ? (
        <p className="text-gray-500 italic">No recent appointments.</p>
      ) : (
        appointments.map((appt, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-6 text-sm py-2 border-t border-gray-100 items-center"
          >
            <div className="font-semibold truncate">{appt.name}</div>
            <div className="font-semibold truncate">{appt.service}</div>
            <div className="font-semibold truncate">{appt.mechanic}</div>
            <div className="font-semibold truncate">{appt.schedule}</div>
            <div
              className={`font-semibold ${
                appt.status === "Completed"
                  ? "text-green-700"
                  : appt.status === "Pending"
                  ? "text-yellow-500"
                  : appt.status === "Confirmed"
                  ? "text-blue-600"
                  : appt.status === "Cancelled"
                  ? "text-red-700"
                  : "text-gray-600"
              }`}
            >
              {appt.status}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
