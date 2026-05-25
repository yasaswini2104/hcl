import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { scheduleService } from "../services/scheduleService";
import { busService } from "../services/busService";
import SearchForm from "../components/booking/SearchForm";
import BusCard from "../components/booking/BusCard";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";

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

    // Try schedule search first; fall back to bus search
    const params = { source, destination, date };
    scheduleService
      .search(params)
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data?.content || [];
        if (list.length) {
          setResults(list);
        } else {
          // fallback to plain bus search
          return busService.search(params).then(({ data: busData }) => {
            setResults(Array.isArray(busData) ? busData : busData?.content || []);
          });
        }
      })
      .catch(() => {
        // fallback to bus search on schedule error
        busService
          .search(params)
          .then(({ data }) =>
            setResults(Array.isArray(data) ? data : data?.content || [])
          )
          .catch(() => setResults([]));
      })
      .finally(() => setLoading(false));
  }, [source, destination, date]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search bar */}
      <div className="mb-6">
        <SearchForm initial={{ source, destination, date }} compact />
      </div>

      {/* Heading */}
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

      {/* Body */}
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
            <BusCard key={bus.id || bus.scheduleId} bus={bus} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
