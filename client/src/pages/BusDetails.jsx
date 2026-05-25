import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { scheduleService } from "../services/scheduleService";
import { bookingService } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";
import SeatLayout from "../components/booking/SeatLayout";
import Loader from "../components/common/Loader";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Modal from "../components/common/Modal";
import { formatCurrency, formatDateTime } from "../utils/formatters";

const unwrap = (response) => response.data?.data ?? response.data;

const BusDetails = () => {
  const { id: scheduleId } = useParams(); // URL param is actually a scheduleId
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [schedule, setSchedule] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [passenger, setPassenger] = useState({ name: "", age: "", gender: "Male" });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    scheduleService
      .getById(scheduleId)
      .then((response) => {
        if (cancelled) return null;
        const sched = unwrap(response);
        setSchedule(sched);
        // Now fetch seats for this bus + schedule
        return scheduleService.getSeats(sched.bus.id, sched.id);
      })
      .then((response) => {
        if (cancelled || !response) return;
        const seatList = unwrap(response);
        setSeats(Array.isArray(seatList) ? seatList : []);
      })
      .catch((error) => {
        if (!cancelled) toast.error(error.message || "Failed to load schedule");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [scheduleId]);

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  const fare = schedule?.fare || 0;
  const totalAmount = fare * selectedSeats.length;

  // Display fields from nested schedule shape
  const busName = schedule?.bus?.busName || "Bus";
  const busType = schedule?.bus?.busType || "";
  const busNumber = schedule?.bus?.busNumber || "";
  const fromCity = schedule?.bus?.route?.sourceCity || "";
  const toCity = schedule?.bus?.route?.destinationCity || "";

  const selectedLabels = useMemo(() => {
    return seats
      .filter((seat) => selectedSeats.includes(seat.id))
      .map((seat) => seat.label)
      .join(", ");
  }, [seats, selectedSeats]);

  const handleProceed = () => {
    if (!isAuthenticated) {
      toast.info("Please login to continue");
      navigate("/login", { state: { from: { pathname: `/bus/${scheduleId}` } } });
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
      // Build a passenger entry per selected seat
      const passengers = selectedSeats.map((seatId) => ({
        seatId,
        passengerName: passenger.name,
        passengerAge: Number(passenger.age),
        passengerGender: passenger.gender,
      }));

      await bookingService.create({
        scheduleId: Number(scheduleId),
        passengers,
      });
      toast.success("Booking confirmed! 🎉");
      setShowPassengerModal(false);
      navigate("/my-bookings");
    } catch (error) {
      toast.error(error.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <Loader message="Loading schedule details..." />;
  if (!schedule)
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">
        Schedule not found.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Card className="p-5 mb-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{busName}</h1>
            <p className="text-sm text-gray-500">
              {busType} {busNumber && `• ${busNumber}`}
            </p>
            <p className="text-sm text-gray-700 mt-2">
              {fromCity} → {toCity}
            </p>
            <p className="text-xs text-gray-500">
              Departure: {formatDateTime(schedule.departureTime)}
            </p>
            <p className="text-xs text-gray-500">
              Arrival: {formatDateTime(schedule.arrivalTime)}
            </p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-xs text-gray-500">Fare per seat</div>
            <div className="text-2xl font-bold text-primary-700">
              {formatCurrency(fare)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {schedule.availableSeats} seats left
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
                    {selectedLabels}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Fare per seat</span>
                <span className="text-gray-900">{formatCurrency(fare)}</span>
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
            onChange={(e) => setPassenger({ ...passenger, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Age"
              type="number"
              min="1"
              max="120"
              value={passenger.age}
              onChange={(e) => setPassenger({ ...passenger, age: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Gender
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                value={passenger.gender}
                onChange={(e) =>
                  setPassenger({ ...passenger, gender: e.target.value })
                }
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="bg-primary-50 border border-primary-100 rounded-lg p-3 text-sm">
            <div className="flex justify-between">
              <span>Seats:</span>
              <span className="font-medium text-gray-900">{selectedLabels}</span>
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