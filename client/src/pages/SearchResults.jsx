import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { scheduleService } from "../services/scheduleService";
import SearchForm from "../components/booking/SearchForm";
import BusCard from "../components/booking/BusCard";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";

const flattenSchedule = (schedule) => ({
  id: schedule.id, // schedule id — used to navigate to seat selection
  busId: schedule.bus?.id,
  scheduleId: schedule.id,
  busName: schedule.bus?.busName,
  busNumber: schedule.bus?.busNumber,
  busType: schedule.bus?.busType,
  source: schedule.bus?.route?.sourceCity,
  destination: schedule.bus?.route?.destinationCity,
  departureTime: schedule.departureTime,
  arrivalTime: schedule.arrivalTime,
  fare: schedule.fare,
  availableSeats: schedule.availableSeats,
  totalSeats: schedule.bus?.totalSeats,
});

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const source = searchParams.get("source") || "";
  const destination = searchParams.get("destination") || "";
  const date = searchParams.get("date") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!source || !destination || !date) {
      setResults([]);
      return;
    }
    setLoading(true);

    scheduleService
      .search({ source, destination, date })
      .then((response) => {
        // Backend wraps in ApiResponse: { success, message, data: [...] }
        const payload = response.data?.data ?? response.data;
        const list = Array.isArray(payload) ? payload : payload?.content || [];
        setResults(list.map(flattenSchedule));
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [source, destination, date]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <SearchForm initial={{ source, destination, date }} compact />
      </div>

      {source && destination && (
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            {source} → {destination}
          </h2>
          {!loading && (
            <span className="text-sm text-gray-500">
              {results.length} {results.length === 1 ? "bus" : "buses"} found
            </span>
          )}
        </div>
      )}

      {loading ? (
        <Loader message="Searching for buses..." />
      ) : !source || !destination ? (
        <EmptyState
          icon="🔍"
          title="Start your search"
          description="Pick a source, destination and travel date above."
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon="🚫"
          title="No buses found"
          description="Try a different route or date."
        />
      ) : (
        <div className="space-y-3">
          {results.map((bus) => (
            <BusCard key={bus.scheduleId} bus={bus} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;