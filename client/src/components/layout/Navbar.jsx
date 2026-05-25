import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      isActive
        ? "text-primary-700 bg-primary-50"
        : "text-gray-600 hover:text-primary-700 hover:bg-gray-50"
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🚌</span>
            <span className="font-bold text-lg text-gray-900">
              GoBus
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/search" className={navLinkClass}>
              Search
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/my-bookings" className={navLinkClass}>
                  My Bookings
                </NavLink>
                <NavLink to="/notifications" className={navLinkClass}>
                  <span className="relative">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-4 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </span>
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin" className={navLinkClass}>
                    Admin
                  </NavLink>
                )}
              </>
            )}
          </div>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">
                  Hi, <span className="font-semibold">{user?.name || "User"}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            <NavLink to="/" className={navLinkClass} end onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/search" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Search
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  Dashboard
                </NavLink>
                <NavLink to="/my-bookings" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  My Bookings
                </NavLink>
                <NavLink to="/notifications" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  Notifications {unreadCount > 0 && `(${unreadCount})`}
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                    Admin
                  </NavLink>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  Login
                </NavLink>
                <NavLink to="/register" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
