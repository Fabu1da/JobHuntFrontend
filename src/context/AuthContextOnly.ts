import React from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  data: {
    user_id: number;
    username: string;
    email: string;
    role: string;
  };
  permissions: string[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
  isLoading: boolean;
}

export interface AuthResponseType {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: {
    user_id: number;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
  };
}

export const AuthContext = React.createContext<AuthContextType | undefined>(
  undefined,
);
