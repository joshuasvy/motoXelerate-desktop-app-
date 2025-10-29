import Customers from "./panels/Customers";
import Dashboard from "./panels/Dashboard";
import Orders from "./panels/Orders";
import Products from "./panels/Products";
import Appointment from "./panels/Appointment";

type PanelProps = {
  activeTab: string;
};

export default function Panel({ activeTab }: PanelProps) {
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <Dashboard />;
      case "Orders":
        return <Orders />;
      case "Products":
        return <Products />;
      case "Appointment":
        return <Appointment />;
      case "Customers":
        return <Customers />;
      case "Settings":
        return <h1 className="text-2xl font-bold">App Settings</h1>;
      case "Logout":
        return (
          <h1 className="text-2xl font-bold text-red-500">
            You have logged out.
          </h1>
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
      {renderContent()}
    </main>
  );
}
