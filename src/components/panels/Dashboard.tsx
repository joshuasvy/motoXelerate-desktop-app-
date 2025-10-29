import PanelHeader from "../PanelHeader";
import ReviewCard from "../card/ReviewCard";
import StatCard from "../StatCard";
import RecentAppointment from "../RecentAppointment";

const appointmentData = [
  {
    name: "John Doe",
    service: "Change Oil",
    mechanic: "Joshua Cortez",
    schedule: "October 21, 2025",
    status: "On going",
  },
  {
    name: "Jane Smith",
    service: "Tire Rotation",
    mechanic: "Joshua Cortez",
    schedule: "October 22, 2025",
    status: "Completed",
  },
  {
    name: "Mark Lee",
    service: "Brake Inspection",
    mechanic: "Joshua Cortez",
    schedule: "October 23, 2025",
    status: "Pending",
  },
];

export default function Dashboard() {
  return (
    <div>
      <PanelHeader name="Dashboard" />
      <div className="flex flex-row justify-between gap-5">
        {/* Left Column */}
        <div className="w-full space-y-3">
          <StatCard
            title="Sales"
            value="₱ 120,000"
            icon="/images/icons/sales.png"
          >
            <button className="py-2 px-6 rounded-md bg-green-600 text-white font-semibold text-md mt-2">
              Cash out
            </button>
          </StatCard>
          <StatCard
            title="Revenue"
            value="₱ 120,000"
            icon="/images/icons/sales.png"
          />
          <StatCard
            title="Orders"
            value="₱ 120,000"
            icon="/images/icons/order-history.png"
          />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <StatCard
            title="Reservations"
            value="₱ 120,000"
            icon="/images/icons/reservation.png"
          />
          <ReviewCard />
        </div>
      </div>
      <div>
        <RecentAppointment appointments={appointmentData} />
      </div>
    </div>
  );
}
