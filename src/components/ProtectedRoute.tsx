import React from "react";
import { useAuth } from "../hooks/useAuth";
import { LandingPage } from "../pages/LandingPage";
import { LoginRegister } from "../sections/LoginRegister";
import { useLocation } from "react-router-dom";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return location.pathname === "/login" ||
      location.pathname === "/register" ? (
      <LoginRegister />
    ) : (
      <LandingPage />
    );
  }

  return <>{children}</>;
};
