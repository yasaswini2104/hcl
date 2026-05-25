import { Link } from "react-router-dom";
import { formatCurrency, formatTime } from "../../utils/formatters";

const BusCard = ({ bus }) => {
  const scheduleId = bus.scheduleId || bus.id;
  const name = bus.busName || bus.name || bus.operator || "Bus";
  const number = bus.busNumber || bus.number || "";
  const type = bus.busType || bus.type || "AC Sleeper";
  const from = bus.source || bus.from || bus.route?.sourceCity;
  const to = bus.destination || bus.to || bus.route?.destinationCity;
  const departure = bus.departureTime || bus.departure;
  const arrival = bus.arrivalTime || bus.arrival;
  const fare = bus.fare || bus.price || 0;
  const availableSeats = bus.availableSeats ?? bus.seatsAvailable ?? "—";

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-4 md:p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900">{name}</h3>
            {number && <span className="text-xs text-gray-500">• {number}</span>}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{type}</p>

          <div className="mt-3 flex items-center gap-3 text-sm">
            <div>
              <div className="font-semibold text-gray-900">
                {formatTime(departure)}
              </div>
              <div className="text-xs text-gray-500">{from}</div>
            </div>
            <div className="flex-1 border-t border-dashed border-gray-300 mx-2" />
            <div className="text-right">
              <div className="font-semibold text-gray-900">
                {formatTime(arrival)}
              </div>
              <div className="text-xs text-gray-500">{to}</div>
            </div>
          </div>
        </div>

        <div className="md:text-right border-t md:border-t-0 md:border-l md:pl-5 pt-3 md:pt-0">
          <div className="text-xs text-gray-500">Starting from</div>
          <div className="text-xl font-bold text-primary-700">
            {formatCurrency(fare)}
          </div>
          <div className="text-xs text-gray-500 mb-2">
            {availableSeats} seats left
          </div>
          <Link
            to={`/bus/${scheduleId}`}
            className="inline-block px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg"
          >
            View Seats
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusCard;