import AppLayout from "@sr/modules/private/layout/AppLayout";
import Corretores from "@sr/modules/private/Corretores";
import Dashboard from "@sr/modules/private/Dashboard";
import Proprietarios from "@sr/modules/private/Proprietarios";
import Login from "@sr/modules/public/Login";
import { useAuthStore } from "@sr/store/useAuthStore";
import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

function PrivateRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: ReactNode }) {
  const perfil = useAuthStore((state) => state.corretor?.perfil);
  return perfil === "ADMIN" ? children : <Navigate to="/" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/proprietarios" element={<Proprietarios />} />
        <Route
          path="/corretores"
          element={
            <AdminRoute>
              <Corretores />
            </AdminRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
