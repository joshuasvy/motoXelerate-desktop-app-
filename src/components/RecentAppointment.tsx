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

      {/* Labels (rendered once) */}
      <div className="flex flex-row flex-wrap gap-6 text-sm text-gray-600 font-medium mb-3">
        <div className="min-w-[140px] mt-2">Name</div>
        <div className="min-w-[160px] mt-2">Service</div>
        <div className="min-w-[160px] mt-2">Mechanic</div>
        <div className="min-w-[180px] mt-2">Schedule</div>
        <div className="min-w-[140px] mt-2">Status</div>
      </div>

      {/* Values (repeated per appointment) */}
      {appointments.map((appt, index) => (
        <div key={index} className="flex flex-row flex-wrap gap-6 text-sm pt-3">
          <div className="min-w-[140px] mt-2">
            <p className="font-semibold">{appt.name}</p>
          </div>
          <div className="min-w-[160px] mt-2">
            <p className="font-semibold">{appt.service}</p>
          </div>
          <div className="min-w-[160px] mt-2">
            <p className="font-semibold">{appt.mechanic}</p>
          </div>
          <div className="min-w-[180px] mt-2">
            <p className="font-semibold">{appt.schedule}</p>
          </div>
          <div className="min-w-[140px] mt-2">
            <p className="font-semibold text-yellow-600">{appt.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
