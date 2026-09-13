import AppLayout from "@sr/modules/private/layout/AppLayout";
import Corretores from "@sr/modules/private/Corretores";
import Dashboard from "@sr/modules/private/Dashboard";
import Login from "@sr/modules/public/Login";
import { useAuthStore } from "@sr/store/useAuthStore";
import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

function PrivateRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" replace />;
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
        <Route path="/corretores" element={<Corretores />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
