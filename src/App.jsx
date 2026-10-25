import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Tenants from "./pages/Tenants";
import Invoices from "./pages/Invoices";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import ComponentPreview from "./pages/ComponentPreview";

// Kalau sudah login, halaman /login langsung melempar ke beranda.
function LoginRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : <Login />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />

      {/* Halaman pratinjau komponen: hanya ada saat npm run dev */}
      {import.meta.env.DEV && (
        <Route path="/komponen" element={<ComponentPreview />} />
      )}

      {/* Semua halaman di bawah ini wajib login */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tagihan" element={<Invoices />} />

          {/* Khusus pemilik kos */}
          <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
            <Route path="kamar" element={<Rooms />} />
            <Route path="penghuni" element={<Tenants />} />
            <Route path="laporan" element={<Reports />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
