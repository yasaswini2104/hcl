import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { bookingService } from "../../services/bookingService";
import { useNotifications } from "../../context/NotificationContext";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import { formatDateTime, formatCurrency } from "../../utils/formatters";

const UserDashboard = () => {
  const { user } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService
      .getUserBookings()
      .then(({ data }) =>
        setBookings(Array.isArray(data) ? data : data?.content || [])
      )
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = bookings.filter(
    (booking) =>
      booking.status !== "CANCELLED" &&
      new Date(booking.travelDate || booking.departureTime || 0) >= new Date()
  );
  const totalSpent = bookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((sum, b) => sum + (b.totalAmount || b.amount || 0), 0);

  const stats = [
    { label: "Total Bookings", value: bookings.length, icon: "🎟️" },
    { label: "Upcoming Trips", value: upcoming.length, icon: "🚌" },
    { label: "Unread Alerts", value: unreadCount, icon: "🔔" },
    { label: "Total Spent", value: formatCurrency(totalSpent), icon: "💰" },
  ];

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user?.name || "Traveller"} 👋
        </h1>
        <p className="text-sm text-gray-500">
          Here's an overview of your recent activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="text-2xl">{stat.icon}</div>
            <div className="mt-1 text-xs text-gray-500">{stat.label}</div>
            <div className="text-xl font-bold text-gray-900">{stat.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Upcoming trips */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Upcoming trips</h2>
            <Link
              to="/my-bookings"
              className="text-sm text-primary-600 hover:underline"
            >
              View all
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <Card className="p-6 text-center text-sm text-gray-500">
              No upcoming trips.{" "}
              <Link to="/search" className="text-primary-600 hover:underline">
                Book one →
              </Link>
            </Card>
          ) : (
            <div className="space-y-2">
              {upcoming.slice(0, 4).map((booking) => (
                <Card key={booking.id || booking.bookingId} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {booking.source || booking.from} →{" "}
                        {booking.destination || booking.to}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDateTime(
                          booking.travelDate || booking.departureTime
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-primary-700">
                      {formatCurrency(booking.totalAmount || booking.amount)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent notifications */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Recent alerts</h2>
            <Link
              to="/notifications"
              className="text-sm text-primary-600 hover:underline"
            >
              View all
            </Link>
          </div>
          {notifications.length === 0 ? (
            <Card className="p-6 text-center text-sm text-gray-500">
              No notifications yet.
            </Card>
          ) : (
            <div className="space-y-2">
              {notifications.slice(0, 4).map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-3 text-sm ${
                    !notification.read ? "border-l-4 border-l-primary-500" : ""
                  }`}
                >
                  <div className="font-medium text-gray-900">
                    {notification.title || "Notification"}
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-2">
                    {notification.message}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
