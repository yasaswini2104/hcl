import { NavLink } from "react-router-dom";

const items = [
  { to: "/admin", label: "Dashboard", icon: "📊", end: true },
  { to: "/admin/routes", label: "Routes", icon: "🛣️" },
  { to: "/admin/buses", label: "Buses", icon: "🚌" },
  { to: "/admin/schedules", label: "Schedules", icon: "📅" },
];

const AdminSidebar = () => {
  return (
    <aside className="bg-gray-900 text-gray-200 w-full md:w-60 md:min-h-screen p-4">
      <h2 className="text-white font-bold text-lg mb-6 hidden md:block">
        Admin Panel
      </h2>
      <nav className="flex md:flex-col gap-1 overflow-x-auto">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${
                isActive
                  ? "bg-primary-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
