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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.source || !form.destination || !form.date) return;
    const params = new URLSearchParams(form).toString();
    navigate(`/search?${params}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-xl shadow-md ${
        compact ? "" : "md:p-6"
      }`}
    >
      <Input
        label="From"
        placeholder="e.g. Hyderabad"
        value={form.source}
        onChange={(event) => setForm({ ...form, source: event.target.value })}
      />
      <Input
        label="To"
        placeholder="e.g. Bengaluru"
        value={form.destination}
        onChange={(event) => setForm({ ...form, destination: event.target.value })}
      />
      <Input
        label="Date"
        type="date"
        min={todayISO()}
        value={form.date}
        onChange={(event) => setForm({ ...form, date: event.target.value })}
      />
      <div className="flex items-end">
        <Button type="submit" size="lg" className="w-full">
          Search Buses
        </Button>
      </div>
    </form>
  );
};

export default SearchForm;
