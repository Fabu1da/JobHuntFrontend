import React from "react";
import { useAuth } from "../hooks/useAuth";
import { LoginRegister } from "../sections/LoginRegister";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useAuth();
  if (!auth.isAuthenticated) {
    return <LoginRegister />;
  }

  return <>{children}</>;
};
