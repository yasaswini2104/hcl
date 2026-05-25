import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { adminService } from "../../services/adminService";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

// Backend wraps everything in ApiResponse { success, message, data }
const unwrapList = (response) => {
  const payload = response.data?.data ?? response.data;
  if (Array.isArray(payload)) return payload;
  return payload?.content || [];
};

const ManageRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    sourceCity: "",
    destinationCity: "",
    distanceKm: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchRoutes = () => {
    setLoading(true);
    adminService
      .listRoutes()
      .then((response) => setRoutes(unwrapList(response)))
      .catch(() => setRoutes([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.sourceCity || !form.destinationCity || !form.distanceKm) {
      toast.warning("Source, destination and distance are required");
      return;
    }
    setSubmitting(true);
    try {
      await adminService.createRoute({
        sourceCity: form.sourceCity,
        destinationCity: form.destinationCity,
        distanceKm: Number(form.distanceKm),
      });
      toast.success("Route added");
      setForm({ sourceCity: "", destinationCity: "", distanceKm: "" });
      fetchRoutes();
    } catch (error) {
      toast.error(error.message || "Failed to add route");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Routes</h1>
      <p className="text-sm text-gray-500 mb-5">
        Define source-destination pairs your buses operate on
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-5 lg:col-span-1">
          <h2 className="font-semibold text-gray-900 mb-4">Add new route</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              label="Source"
              placeholder="e.g. Hyderabad"
              value={form.sourceCity}
              onChange={(e) => setForm({ ...form, sourceCity: e.target.value })}
            />
            <Input
              label="Destination"
              placeholder="e.g. Bengaluru"
              value={form.destinationCity}
              onChange={(e) =>
                setForm({ ...form, destinationCity: e.target.value })
              }
            />
            <Input
              label="Distance (km)"
              type="number"
              min="1"
              value={form.distanceKm}
              onChange={(e) => setForm({ ...form, distanceKm: e.target.value })}
            />
            <Button type="submit" loading={submitting} className="w-full">
              Add Route
            </Button>
          </form>
        </Card>

        <div className="lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-3">Existing routes</h2>
          {loading ? (
            <Loader />
          ) : routes.length === 0 ? (
            <EmptyState
              icon="🛣️"
              title="No routes yet"
              description="Add your first route using the form."
            />
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-gray-700">From</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">To</th>
                      <th className="px-4 py-3 font-semibold text-gray-700">Distance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {routes.map((route) => (
                      <tr key={route.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900">{route.sourceCity}</td>
                        <td className="px-4 py-3 text-gray-900">{route.destinationCity}</td>
                        <td className="px-4 py-3 text-gray-900">
                          {route.distanceKm ? `${route.distanceKm} km` : "—"}
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

export default ManageRoutes;