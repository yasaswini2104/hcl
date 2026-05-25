import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { adminService } from "../../services/adminService";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const BUS_TYPES = ["AC Sleeper", "Non-AC Sleeper", "AC Seater", "Non-AC Seater", "Volvo"];

const unwrapList = (response) => {
  const payload = response.data?.data ?? response.data;
  if (Array.isArray(payload)) return payload;
  return payload?.content || [];
};

const ManageBuses = () => {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    busName: "",
    busNumber: "",
    busType: BUS_TYPES[0],
    totalSeats: 40,
    operatorName: "",
    routeId: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [busResp, routeResp] = await Promise.allSettled([
        adminService.listBuses(),
        adminService.listRoutes(),
      ]);
      setBuses(busResp.status === "fulfilled" ? unwrapList(busResp.value) : []);
      setRoutes(routeResp.status === "fulfilled" ? unwrapList(routeResp.value) : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.busName || !form.busNumber || !form.routeId) {
      toast.warning("Bus name, number and route are required");
      return;
    }
    setSubmitting(true);
    try {
      await adminService.createBus({
        busNumber: form.busNumber,
        busName: form.busName,
        busType: form.busType,
        totalSeats: Number(form.totalSeats),
        operatorName: form.operatorName,
        routeId: Number(form.routeId),
      });
      toast.success("Bus added");
      setForm({
        busName: "",
        busNumber: "",
        busType: BUS_TYPES[0],
        totalSeats: 40,
        operatorName: "",
        routeId: "",
      });
      fetchAll();
    } catch (error) {
      toast.error(error.message || "Failed to add bus");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Buses</h1>
      <p className="text-sm text-gray-500 mb-5">
        Add and view buses in your fleet
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-5 lg:col-span-1">
          <h2 className="font-semibold text-gray-900 mb-4">Add new bus</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              label="Bus name"
              placeholder="e.g. Orange Travels"
              value={form.busName}
              onChange={(e) => setForm({ ...form, busName: e.target.value })}
            />
            <Input
              label="Bus number"
              placeholder="e.g. TS09AB1234"
              value={form.busNumber}
              onChange={(e) => setForm({ ...form, busNumber: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Bus type
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                value={form.busType}
                onChange={(e) => setForm({ ...form, busType: e.target.value })}
              >
                {BUS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Total seats"
              type="number"
              min="1"
              value={form.totalSeats}
              onChange={(e) => setForm({ ...form, totalSeats: e.target.value })}
            />
            <Input
              label="Operator name"
              placeholder="Operator name"
              value={form.operatorName}
              onChange={(e) =>
                setForm({ ...form, operatorName: e.target.value })
              }
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Route
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                value={form.routeId}
                onChange={(e) => setForm({ ...form, routeId: e.target.value })}
              >
                <option value="">Select route</option>
                {routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.sourceCity} → {route.destinationCity}
                  </option>
                ))}
              </select>
              {routes.length === 0 && (
                <p className="mt-1 text-xs text-amber-600">
                  No routes available — add a route first.
                </p>
              )}
            </div>
            <Button type="submit" loading={submitting} className="w-full">
              Add Bus
            </Button>
          </form>
        </Card>

        <div className="lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-3">Fleet</h2>
          {loading ? (
            <Loader />
          ) : buses.length === 0 ? (
            <EmptyState
              icon="🚌"
              title="No buses yet"
              description="Add your first bus using the form."
            />
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Number</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Type</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Seats</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Route</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {buses.map((bus) => (
                      <tr key={bus.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {bus.busName}
                        </td>
                        <td className="px-4 py-3 text-gray-900">{bus.busNumber}</td>
                        <td className="px-4 py-3 text-gray-900">{bus.busType}</td>
                        <td className="px-4 py-3 text-gray-900">{bus.totalSeats}</td>
                        <td className="px-4 py-3 text-gray-900">
                          {bus.route
                            ? `${bus.route.sourceCity} → ${bus.route.destinationCity}`
                            : "—"}
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

export default ManageBuses;