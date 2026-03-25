import React from "react";
import { useAuth } from "../hooks/useAuth";
import { LoginRegister } from "../sections/LoginRegister";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useAuth();
  console.log("ProtectedRoute auth state:", auth);

  if (!auth.isAuthenticated) {
    return <LoginRegister />;
  }

  return <>{children}</>;
};
