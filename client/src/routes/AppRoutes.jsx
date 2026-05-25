import { Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";

// Guards
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

// Public
import Home from "../pages/Home";
import SearchResults from "../pages/SearchResults";
import BusDetails from "../pages/BusDetails";
import NotFound from "../pages/NotFound";

// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// User
import UserDashboard from "../pages/user/UserDashboard";
import MyBookings from "../pages/user/MyBookings";
import Notifications from "../pages/user/Notifications";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageRoutes from "../pages/admin/ManageRoutes";
import ManageBuses from "../pages/admin/ManageBuses";
import ManageSchedules from "../pages/admin/ManageSchedules";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth (separate layout) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Admin (separate layout, guarded) */}
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/routes" element={<ManageRoutes />} />
        <Route path="/admin/buses" element={<ManageBuses />} />
        <Route path="/admin/schedules" element={<ManageSchedules />} />
      </Route>

      {/* Public + User (main layout) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/bus/:id" element={<BusDetails />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
