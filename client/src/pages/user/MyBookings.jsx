import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { bookingService } from "../../services/bookingService";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

const STATUS_STYLES = {
  CONFIRMED: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-gray-200 text-gray-700",
};

// Backend wraps in ApiResponse { success, message, data: [...] }
const unwrapList = (response) => {
  const payload = response.data?.data ?? response.data;
  if (Array.isArray(payload)) return payload;
  return payload?.content || [];
};

// Flatten the deep nested booking shape into something easy to render
const flattenBooking = (booking) => ({
  id: booking.id,
  bookingReference: booking.bookingReference,
  status: booking.bookingStatus || "CONFIRMED",
  totalAmount: booking.totalAmount,
  bookedAt: booking.bookedAt,
  busName: booking.schedule?.bus?.busName,
  busNumber: booking.schedule?.bus?.busNumber,
  source: booking.schedule?.bus?.route?.sourceCity,
  destination: booking.schedule?.bus?.route?.destinationCity,
  travelDate: booking.schedule?.travelDate,
  departureTime: booking.schedule?.departureTime,
  arrivalTime: booking.schedule?.arrivalTime,
  seatLabels: (booking.bookingSeats || [])
    .map((bs) => bs.seat?.seatNumber)
    .filter(Boolean),
  passengers: (booking.bookingSeats || []).map((bs) => ({
    name: bs.passengerName,
    age: bs.passengerAge,
    gender: bs.passengerGender,
    seat: bs.seat?.seatNumber,
  })),
});

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = () => {
    setLoading(true);
    bookingService
      .getUserBookings()
      .then((response) => {
        const list = unwrapList(response).map(flattenBooking);
        setBookings(list);
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await bookingService.cancel(cancelTarget.id);
      toast.success("Booking cancelled");
      setCancelTarget(null);
      fetchBookings();
    } catch (error) {
      toast.error(error.message || "Cancellation failed");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">My Bookings</h1>
      <p className="text-sm text-gray-500 mb-5">
        Track and manage all your bus bookings
      </p>

      {bookings.length === 0 ? (
        <EmptyState
          icon="🎫"
          title="No bookings yet"
          description="Once you book a bus, it'll show up here."
        />
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const isCancellable =
              booking.status !== "CANCELLED" && booking.status !== "COMPLETED";
            return (
              <Card key={booking.id} className="p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">
                        {booking.busName || "Bus"}
                      </h3>
                      {booking.busNumber && (
                        <span className="text-xs text-gray-500">
                          • {booking.busNumber}
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          STATUS_STYLES[booking.status] || STATUS_STYLES.PENDING
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      {booking.source || "—"} → {booking.destination || "—"}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Departure: {formatDateTime(booking.departureTime)}
                    </p>
                    {booking.bookingReference && (
                      <p className="text-xs text-gray-500 mt-1">
                        Ref:{" "}
                        <span className="font-mono text-gray-700">
                          {booking.bookingReference}
                        </span>
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Seats:{" "}
                      <span className="font-medium text-gray-700">
                        {booking.seatLabels.length > 0
                          ? booking.seatLabels.join(", ")
                          : "—"}
                      </span>
                    </p>
                    {booking.passengers.length > 0 && (
                      <div className="mt-2 text-xs text-gray-600">
                        <span className="font-medium text-gray-700">
                          Passengers:
                        </span>{" "}
                        {booking.passengers
                          .map(
                            (p) =>
                              `${p.name} (${p.age}, ${p.gender}) — ${p.seat}`
                          )
                          .join("; ")}
                      </div>
                    )}
                  </div>
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-2 md:gap-1">
                    <div className="text-lg font-bold text-primary-700">
                      {formatCurrency(booking.totalAmount)}
                    </div>
                    {isCancellable && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setCancelTarget(booking)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="Cancel booking?"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCancelTarget(null)}>
              Keep it
            </Button>
            <Button
              variant="danger"
              onClick={handleCancel}
              loading={cancelling}
            >
              Yes, cancel
            </Button>
          </div>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to cancel this booking? This action cannot be
          undone, and cancellation charges may apply per operator policy.
        </p>
      </Modal>
    </div>
  );
};

export default MyBookings;