import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { todayISO } from "../../utils/formatters";
import Input from "../common/Input";
import Button from "../common/Button";

const SearchForm = ({ initial = {}, compact = false }) => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    source: initial.source || "",
    destination: initial.destination || "",
    date: initial.date || todayISO(),
  });

  const cities = [
    "Hyderabad",
    "Bengaluru",
    "Mumbai",
    "Pune",
    "Chennai",
    "Delhi",
    "Kolkata",
    "Ahmedabad",
    "Goa",
    "Vizag",
    "Vijayawada"
  ];

  const handleSubmit = (event) => {

    event.preventDefault();

    if (
      !form.source ||
      !form.destination ||
      !form.date
    ) return;

    const params =
      new URLSearchParams(form).toString();

    navigate(`/search?${params}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-xl shadow-md text-black ${
        compact ? "" : "md:p-6"
      }`}
    >

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          From
        </label>

        <select
          value={form.source}
          onChange={(event) =>
            setForm({
              ...form,
              source: event.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">
            Select Source
          </option>

          {cities.map((city) => (
            <option
              key={city}
              value={city}
            >
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* TO DROPDOWN */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          To
        </label>

        <select
          value={form.destination}
          onChange={(event) =>
            setForm({
              ...form,
              destination: event.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">
            Select Destination
          </option>

          {cities.map((city) => (
            <option
              key={city}
              value={city}
              disabled={form.source === city}
            >
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* DATE INPUT */}
      <Input
        label="Date"
        type="date"
        min={todayISO()}
        value={form.date}
        onChange={(event) =>
          setForm({
            ...form,
            date: event.target.value,
          })
        }
      />

      {/* SEARCH BUTTON */}
      <div className="flex items-end">
        <Button
          type="submit"
          size="lg"
          className="w-full"
        >
          Search Buses
        </Button>
      </div>
    </form>
  );
};

export default SearchForm;