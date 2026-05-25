import { SEAT_STATUS } from "../../utils/constants";

const SeatLayout = ({ seats = [], selectedIds = [], onToggle, columnsPerRow = 4 }) => {
  if (!seats.length) {
    return (
      <div className="text-center text-sm text-gray-500 py-8">
        Seat layout unavailable.
      </div>
    );
  }

  const rows = [];
  for (let i = 0; i < seats.length; i += columnsPerRow) {
    rows.push(seats.slice(i, i + columnsPerRow));
  }
  const aisleAfter = Math.floor(columnsPerRow / 2);

  const seatStyle = (seat) => {
    const isSelected = selectedIds.includes(seat.id);
    if (seat.status === SEAT_STATUS.BOOKED)
      return "bg-red-500 text-white cursor-not-allowed";
    if (isSelected) return "bg-blue-500 text-white";
    return "bg-green-500 text-white hover:bg-green-600";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-4 mb-5 text-xs">
        <span className="flex items-center gap-2">
          <span className="inline-block h-4 w-4 rounded bg-green-500" /> Available
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-4 w-4 rounded bg-blue-500" /> Selected
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-4 w-4 rounded bg-red-500" /> Booked
        </span>
      </div>

      <div className="flex justify-end mb-4">
        <div className="text-xs text-gray-500 border border-gray-300 rounded px-2 py-1">
          🧑‍✈️ Driver
        </div>
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        {rows.map((row, rowIdx) => (
          <div key={`row-${rowIdx}`} className="flex items-center justify-center gap-2">
            {row.map((seat, colIdx) => (
              <div key={`seat-${seat.id}`} className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={seat.status === SEAT_STATUS.BOOKED}
                  onClick={() =>
                    seat.status !== SEAT_STATUS.BOOKED && onToggle?.(seat.id)
                  }
                  className={`h-10 w-10 md:h-12 md:w-12 rounded-md text-xs font-semibold transition ${seatStyle(seat)}`}
                  title={`Seat ${seat.label}`}
                >
                  {seat.label}
                </button>
                {colIdx === aisleAfter - 1 && colIdx !== row.length - 1 && (
                  <span className="w-4 md:w-6" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatLayout;