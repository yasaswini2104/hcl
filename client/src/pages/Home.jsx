import { Link } from "react-router-dom";
import SearchForm from "../components/booking/SearchForm";

const features = [
  {
    icon: "🛡️",
    title: "Safe & Secure",
    desc: "Verified operators, secure payments, end-to-end JWT auth.",
  },
  {
    icon: "💺",
    title: "Live Seat Layout",
    desc: "Pick your favorite seat with a real-time visual layout.",
  },
  {
    icon: "🔔",
    title: "Instant Updates",
    desc: "Get in-app notifications for bookings, cancellations & alerts.",
  },
  {
    icon: "🎟️",
    title: "Easy Cancellations",
    desc: "Cancel anytime from your bookings dashboard.",
  },
];

const Home = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              Book Bus Tickets Across India
            </h1>
            <p className="text-base md:text-lg text-primary-100 max-w-2xl mx-auto">
              Compare schedules, pick your seat and travel comfortably — all in
              one place.
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Why travel with BusBook
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gray-900 text-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">Ready for your next trip?</h3>
            <p className="text-gray-300 mt-1">
              Sign up and book your seat in under a minute.
            </p>
          </div>
          <Link
            to="/register"
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
