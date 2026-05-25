import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { busService } from "../services/busService";
import { bookingService } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";
import SeatLayout from "../components/booking/SeatLayout";
import Loader from "../components/common/Loader";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Modal from "../components/common/Modal";
import { formatCurrency, formatDateTime } from "../utils/formatters";
import { SEAT_STATUS } from "../utils/constants";

// Generate a fallback seat layout if backend doesn't provide one
const generateFallbackSeats = (total = 40, bookedSeatIds = []) => {
  const seats = [];
  const rows = Math.ceil(total / 4);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < 4; c++) {
      const idx = r * 4 + c;
      if (idx >= total) break;
      const label = `${String.fromCharCode(65 + r)}${c + 1}`;
      const id = label;
      seats.push({
        id,
        label,
        status: bookedSeatIds.includes(id)
          ? SEAT_STATUS.BOOKED
          : SEAT_STATUS.AVAILABLE,
      });
    }
  }
  return seats;
};

const BusDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [passenger, setPassenger] = useState({ name: "", age: "", gender: "M" });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    busService
      .getById(id)
      .then(({ data }) => setBus(data))
      .catch((error) => toast.error(error.message || "Failed to load bus"))
      .finally(() => setLoading(false));
  }, [id]);

  const seats = useMemo(() => {
    if (!bus) return [];
    if (Array.isArray(bus.seats) && bus.seats.length) {
      return bus.seats.map((seat) => ({
        id: seat.id ?? seat.seatId ?? seat.label,
        label: seat.label ?? seat.seatNumber ?? seat.id,
        status:
          seat.status ||
          (seat.booked ? SEAT_STATUS.BOOKED : SEAT_STATUS.AVAILABLE),
      }));
    }
    return generateFallbackSeats(
      bus.totalSeats || 40,
      bus.bookedSeats || []
    );
  }, [bus]);

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  const fare = bus?.fare || bus?.price || 0;
  const totalAmount = fare * selectedSeats.length;

  const handleProceed = () => {
    if (!isAuthenticated) {
      toast.info("Please login to continue");
      navigate("/login", { state: { from: { pathname: `/bus/${id}` } } });
      return;
    }
    if (selectedSeats.length === 0) {
      toast.warning("Please select at least one seat");
      return;
    }
    setShowPassengerModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!passenger.name || !passenger.age) {
      toast.warning("Please fill passenger details");
      return;
    }
    setBookingLoading(true);
    try {
      const payload = {
        busId: bus.id || id,
        scheduleId: bus.scheduleId,
        seatIds: selectedSeats,
        seatNumbers: selectedSeats, // alternative shape for backend
        passenger,
        totalAmount,
      };
      await bookingService.create(payload);
      toast.success("Booking confirmed! 🎉");
      setShowPassengerModal(false);
      navigate("/my-bookings");
    } catch (error) {
      toast.error(error.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <Loader message="Loading bus details..." />;
  if (!bus)
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
        Bus not found.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header card */}
      <Card className="p-5 mb-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {bus.busName || bus.name || "Bus"}
            </h1>
            <p className="text-sm text-gray-500">
              {bus.busType || "AC Sleeper"} • {bus.busNumber || ""}
            </p>
            <p className="text-sm text-gray-700 mt-2">
              {bus.source || bus.from} → {bus.destination || bus.to}
            </p>
            <p className="text-xs text-gray-500">
              Departure: {formatDateTime(bus.departureTime || bus.departure)}
            </p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-xs text-gray-500">Fare per seat</div>
            <div className="text-2xl font-bold text-primary-700">
              {formatCurrency(fare)}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-3">Select your seats</h2>
          <SeatLayout
            seats={seats}
            selectedIds={selectedSeats}
            onToggle={toggleSeat}
          />
        </div>

        {/* Sticky summary */}
        <div>
          <Card className="p-5 sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-3">Booking summary</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Selected seats</span>
                <span className="font-medium text-gray-900">
                  {selectedSeats.length}
                </span>
              </div>
              {selectedSeats.length > 0 && (
                <div className="flex justify-between">
                  <span>Seat numbers</span>
                  <span className="font-medium text-gray-900">
                    {selectedSeats.join(", ")}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Fare per seat</span>
                <span>{formatCurrency(fare)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-primary-700">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
            <Button
              className="w-full mt-4"
              size="lg"
              onClick={handleProceed}
              disabled={selectedSeats.length === 0}
            >
              Proceed to Pay
            </Button>
          </Card>
        </div>
      </div>

      {/* Passenger details modal */}
      <Modal
        open={showPassengerModal}
        onClose={() => setShowPassengerModal(false)}
        title="Passenger details"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPassengerModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmBooking} loading={bookingLoading}>
              Confirm Booking
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <Input
            label="Full name"
            value={passenger.name}
            onChange={(event) =>
              setPassenger({ ...passenger, name: event.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Age"
              type="number"
              min="1"
              max="120"
              value={passenger.age}
              onChange={(event) =>
                setPassenger({ ...passenger, age: event.target.value })
              }
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Gender
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                value={passenger.gender}
                onChange={(event) =>
                  setPassenger({ ...passenger, gender: event.target.value })
                }
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
          </div>
          <div className="bg-primary-50 border border-primary-100 rounded-lg p-3 text-sm">
            <div className="flex justify-between">
              <span>Seats:</span>
              <span className="font-medium">{selectedSeats.join(", ")}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Total amount:</span>
              <span className="font-bold text-primary-700">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BusDetails;
