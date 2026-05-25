import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";

// Unwrap backend's ApiResponse { success, message, data }
const unwrapList = (response) => {
  const payload = response.data?.data ?? response.data;
  if (Array.isArray(payload)) return payload;
  return payload?.content || [];
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ routes: 0, buses: 0, schedules: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      adminService.listRoutes(),
      adminService.listBuses(),
      adminService.listSchedules(),
    ])
      .then((results) => {
        const count = (result) =>
          result.status === "fulfilled" ? unwrapList(result.value).length : 0;
        setStats({
          routes: count(results[0]),
          buses: count(results[1]),
          schedules: count(results[2]),
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const cards = [
    { label: "Total Routes", value: stats.routes, icon: "🛣️", color: "bg-blue-50" },
    { label: "Total Buses", value: stats.buses, icon: "🚌", color: "bg-green-50" },
    { label: "Schedules", value: stats.schedules, icon: "📅", color: "bg-purple-50" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">System overview at a glance</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card key={card.label} className={`p-5 ${card.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">{card.label}</div>
                <div className="text-3xl font-bold text-gray-900 mt-1">
                  {card.value}
                </div>
              </div>
              <div className="text-4xl">{card.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-5">
        <h2 className="font-semibold text-gray-900 mb-2">Quick tips</h2>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>Add new routes from the Routes section before creating schedules.</li>
          <li>Assign buses to routes via the Schedules page.</li>
          <li>Check booking analytics from your backend monitoring dashboard.</li>
        </ul>
      </Card>
    </div>
  );
};

export default AdminDashboard;