import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
    <div className="text-7xl mb-4">🚦</div>
    <h1 className="text-3xl font-bold text-gray-900 mb-2">404</h1>
    <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
    <Link
      to="/"
      className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg"
    >
      Back to home
    </Link>
  </div>
);

export default NotFound;
