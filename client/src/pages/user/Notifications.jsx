import { useNotifications } from "../../context/NotificationContext";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Card from "../../components/common/Card";
import { formatDateTime } from "../../utils/formatters";

const Notifications = () => {
  const { notifications, loading, markAsRead } = useNotifications();

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Notifications</h1>
      <p className="text-sm text-gray-500 mb-5">
        Tap a notification to mark it as read
      </p>

      {notifications.length === 0 ? (
        <EmptyState
          icon="🔕"
          title="No notifications"
          description="You're all caught up!"
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 cursor-pointer transition ${
                !notification.read
                  ? "border-l-4 border-l-primary-500 bg-primary-50/30"
                  : "opacity-80"
              }`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {notification.title || "Notification"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDateTime(notification.createdAt || notification.timestamp)}
                  </p>
                </div>
                {!notification.read && (
                  <span className="inline-block h-2 w-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
