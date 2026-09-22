import { Routes, Route } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import LandingPage from "@/pages/public/LandingPage";
import Register from "@/pages/public/Register";
import Success from "@/pages/public/Success";
import StatusCheck from "@/pages/public/StatusCheck";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import VerifyDetail from "@/pages/admin/VerifyDetail";
import RecapReport from "@/pages/admin/RecapReport";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cek-status" element={<StatusCheck />} />
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
