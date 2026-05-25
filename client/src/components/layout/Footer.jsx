const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 mt-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h4 className="text-white font-bold text-lg mb-3">🚌 BusBook</h4>
        <p className="text-sm text-gray-400">
          Book your bus journey across the country with ease. Comfort, safety
          and reliability — every trip.
        </p>
      </div>
      <div>
        <h5 className="text-white font-semibold mb-3">Quick Links</h5>
        <ul className="space-y-2 text-sm">
          <li><a href="/" className="hover:text-white">Home</a></li>
          <li><a href="/search" className="hover:text-white">Search Buses</a></li>
          <li><a href="/my-bookings" className="hover:text-white">My Bookings</a></li>
        </ul>
      </div>
      <div>
        <h5 className="text-white font-semibold mb-3">Support</h5>
        <ul className="space-y-2 text-sm">
          <li>📞 +91 1800-XXX-XXXX</li>
          <li>✉️ support@busbook.example</li>
          <li>🕒 24×7 Helpdesk</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
      © {new Date().getFullYear()} BusBook. All rights reserved.
    </div>
  </footer>
);

export default Footer;
