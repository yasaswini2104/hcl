import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { adminService } from "../../services/adminService";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

const ManageSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    busId: "",
    routeId: "",
    departureTime: "",
    arrivalTime: "",
    fare: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [schedRes, busRes, routeRes] = await Promise.allSettled([
        adminService.listSchedules(),
        adminService.listBuses(),
        adminService.listRoutes(),
      ]);
      const pluck = (result) => {
        if (result.status !== "fulfilled") return [];
        const { data } = result.value;
        return Array.isArray(data) ? data : data?.content || [];
      };
      setSchedules(pluck(schedRes));
      setBuses(pluck(busRes));
      setRoutes(pluck(routeRes));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.busId || !form.routeId || !form.departureTime) {
      toast.warning("Bus, route and departure time are required");
      return;
    }
    setSubmitting(true);
    try {
      await adminService.createSchedule({
        ...form,
        fare: Number(form.fare) || 0,
      });
      toast.success("Schedule added");
      setForm({
        busId: "",
        routeId: "",
        departureTime: "",
        arrivalTime: "",
        fare: "",
      });
      fetchAll();
    } catch (error) {
      toast.error(error.message || "Failed to add schedule");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Schedules</h1>
      <p className="text-sm text-gray-500 mb-5">
        Assign buses to routes with timings and fare
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-5 lg:col-span-1">
          <h2 className="font-semibold text-gray-900 mb-4">Add new schedule</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Bus
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.busId}
                onChange={(e) => setForm({ ...form, busId: e.target.value })}
              >
                <option value="">Select bus</option>
                {buses.map((bus) => (
                  <option key={bus.id} value={bus.id}>
                    {bus.busName || bus.name} ({bus.busNumber || bus.number})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Route
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={form.routeId}
                onChange={(e) => setForm({ ...form, routeId: e.target.value })}
              >
                <option value="">Select route</option>
                {routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.source} → {route.destination}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Departure"
              type="datetime-local"
              value={form.departureTime}
              onChange={(e) =>
                setForm({ ...form, departureTime: e.target.value })
              }
            />
            <Input
              label="Arrival"
              type="datetime-local"
              value={form.arrivalTime}
              onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })}
            />
            <Input
              label="Fare (₹)"
              type="number"
              min="0"
              value={form.fare}
              onChange={(e) => setForm({ ...form, fare: e.target.value })}
            />
            <Button type="submit" loading={submitting} className="w-full">
              Add Schedule
            </Button>
          </form>
        </Card>

        <div className="lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-3">Schedules</h2>
          {loading ? (
            <Loader />
          ) : schedules.length === 0 ? (
            <EmptyState
              icon="📅"
              title="No schedules yet"
              description="Create your first schedule above."
            />
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-gray-700">Bus</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Route</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Departure</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Fare</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {schedules.map((schedule) => (
                      <tr key={schedule.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {schedule.busName || schedule.bus?.busName || schedule.busId}
                        </td>
                        <td className="px-4 py-3">
                          {(schedule.source || schedule.route?.source) || "—"} →{" "}
                          {(schedule.destination || schedule.route?.destination) ||
                            "—"}
                        </td>
                        <td className="px-4 py-3">
                          {formatDateTime(schedule.departureTime)}
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          {formatCurrency(schedule.fare)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageSchedules;
