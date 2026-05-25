import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { adminService } from "../../services/adminService";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

const unwrapList = (response) => {
  const payload = response.data?.data ?? response.data;
  if (Array.isArray(payload)) return payload;
  return payload?.content || [];
};

const ManageSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    busId: "",
    travelDate: "",
    departureTime: "",
    arrivalTime: "",
    fare: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [schedResp, busResp] = await Promise.allSettled([
        adminService.listSchedules(),
        adminService.listBuses(),
      ]);
      setSchedules(
        schedResp.status === "fulfilled" ? unwrapList(schedResp.value) : []
      );
      setBuses(busResp.status === "fulfilled" ? unwrapList(busResp.value) : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !form.busId ||
      !form.travelDate ||
      !form.departureTime ||
      !form.arrivalTime ||
      !form.fare
    ) {
      toast.warning("All fields are required");
      return;
    }
    setSubmitting(true);
    try {
      await adminService.createSchedule({
        busId: Number(form.busId),
        travelDate: form.travelDate,
        departureTime: form.departureTime,
        arrivalTime: form.arrivalTime,
        fare: Number(form.fare),
      });
      toast.success("Schedule added");
      setForm({
        busId: "",
        travelDate: "",
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                value={form.busId}
                onChange={(e) => setForm({ ...form, busId: e.target.value })}
              >
                <option value="">Select bus</option>
                {buses.map((bus) => (
                  <option key={bus.id} value={bus.id}>
                    {bus.busName} ({bus.busNumber}) —{" "}
                    {bus.route
                      ? `${bus.route.sourceCity} → ${bus.route.destinationCity}`
                      : "no route"}
                  </option>
                ))}
              </select>
              {buses.length === 0 && (
                <p className="mt-1 text-xs text-amber-600">
                  No buses available — add a bus first.
                </p>
              )}
            </div>
            <Input
              label="Travel date"
              type="date"
              value={form.travelDate}
              onChange={(e) =>
                setForm({ ...form, travelDate: e.target.value })
              }
            />
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
              onChange={(e) =>
                setForm({ ...form, arrivalTime: e.target.value })
              }
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
                      <th className="px-4 py-3 font-semibold text-gray-700">Seats left</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {schedules.map((schedule) => (
                      <tr key={schedule.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {schedule.bus?.busName || "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          {schedule.bus?.route
                            ? `${schedule.bus.route.sourceCity} → ${schedule.bus.route.destinationCity}`
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          {formatDateTime(schedule.departureTime)}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          {formatCurrency(schedule.fare)}
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          {schedule.availableSeats}
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