import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import LandingPage from "@/pages/public/LandingPage";
import Register from "@/pages/public/Register";
import Success from "@/pages/public/Success";
import StatusCheck from "@/pages/public/StatusCheck";
import AuthPage from "@/pages/public/AuthPage";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import VerifyDetail from "@/pages/admin/VerifyDetail";
import RecapReport from "@/pages/admin/RecapReport";

/** Redirect to /login if not authenticated */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/cek-status" element={<StatusCheck />} />

        {/* Protected public routes */}
        <Route
          path="/register"
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <Success />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin Login (standalone, no layout) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Protected Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route
          path="/admin/verifikasi"
          element={<AdminDashboard isVerification />}
        />
        <Route path="/admin/verify/:id" element={<VerifyDetail />} />
        <Route path="/admin/rekap" element={<RecapReport />} />
      </Route>
    </Routes>
  );
}
