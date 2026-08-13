import React from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  data: {
    user_id: number;
    username: string;
    email: string;
  };
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
  isLoading: boolean;
}

export interface AuthResponseData {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: {
    user_id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const AuthContext = React.createContext<AuthContextType | undefined>(
  undefined,
);
