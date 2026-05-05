import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuthStore } from "../store/authStore";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const session = useAuthStore((s) => s.session);

  if (!session || !session.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
