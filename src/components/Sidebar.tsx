type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const navItems = [
  { label: "Dashboard", icon: "/images/panel-icons/dashboard.png" },
  { label: "Orders", icon: "/images/panel-icons/order.png" },
  { label: "Products", icon: "/images/panel-icons/product.png" },
  { label: "Appointment", icon: "/images/panel-icons/reservations.png" },
  { label: "Customers", icon: "/images/panel-icons/customer.png" },
];

const bottomItems = [
  { label: "Settings", icon: "/images/panel-icons/settings.png" },
  { label: "Logout", icon: "/images/panel-icons/logout.png" },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="bg-gray-700 w-[285px] border-r border-gray-800 flex flex-col justify-between h-screen">
      <div>
        <div className="flex items-center gap-3 py-8 px-6">
          <img
            src="/images/logo/Starter pfp.jpg"
            alt="Logo"
            className="w-[45px] h-[45px] object-cover rounded-full"
          />
          <h1 className="text-2xl font-bold text-white">MotoXelerate</h1>
        </div>

        <nav className="flex flex-col gap-4 mt-8 px-4">
          {navItems.map((item) => (
            <div
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`text-white flex items-center gap-x-10 pl-5 px-4 py-3 rounded-md cursor-pointer transition-all duration-300 ${
                activeTab === item.label ? "bg-gray-500" : "hover:bg-gray-600"
              }`}
            >
              <img
                src={item.icon}
                alt={item.label}
                className="w-[24px] h-[24px] object-contain"
              />
              <span className="text-white text-md font-medium">
                {item.label}
              </span>
            </div>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-2 px-4 pb-6">
        {bottomItems.map((item) => (
          <div
            key={item.label}
            onClick={() => setActiveTab(item.label)}
            className={`flex items-center gap-x-10 pl-5 px-4 py-3 rounded-md cursor-pointer transition-all duration-300 ${
              activeTab === item.label ? "bg-sidebarbg" : "hover:bg-gray-600"
            }`}
          >
            <img
              src={item.icon}
              alt={item.label}
              className="w-[24px] h-[24px] object-contain"
            />
            <span className="text-white text-md font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
