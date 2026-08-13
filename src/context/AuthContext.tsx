import React, { useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { AuthContext, type AuthResponseData } from "./AuthContextOnly";
import { validateUser } from "../service/userValidation";

const setLocalStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error setting localStorage for key "${key}":`, error);
  }
};

const getLocalStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting localStorage for key "${key}":`, error);
    return null;
  }
};

const removeLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage for key "${key}":`, error);
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authData, setAuthData] = useState<{
    user_id: number;
    username: string;
    email: string;
  }>({
    user_id: 0,
    username: "",
    email: "",
  });
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on component mount
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = getLocalStorage("authToken");
      const storedData = getLocalStorage("authData");

      if (storedToken && storedData) {
        try {
          // Set token in axios headers
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${storedToken}`;

          // Validate the token with the backend
          const response = await validateUser(storedToken);

          if (response) {
            setToken(storedToken);
            setAuthData(JSON.parse(storedData));
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear storage
            removeLocalStorage("authToken");
            removeLocalStorage("authData");
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Session restore error:", error);
          // Clear invalid session
          removeLocalStorage("authToken");
          removeLocalStorage("authData");
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    console.log("Attempting login with email:", email);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        {
          email,
          password,
        },
      );
      console.log("Login response:", res.data);
      const responseData = res.data as AuthResponseData | null;

      if (responseData) {
        const accessToken = responseData.tokens.accessToken;
        console.log("Login successful, received token:", accessToken);

        // Store token and user data in localStorage
        setLocalStorage("authToken", accessToken);
        setLocalStorage("refreshToken", responseData.tokens.refreshToken);
        setLocalStorage(
          "authData",
          JSON.stringify({
            user_id: responseData.user.user_id,
            username:
              responseData.user.firstName + " " + responseData.user.lastName,
            email: responseData.user.email,
          }),
        );

        axios.defaults.headers.common["Content-Type"] = "application/json";
        // Set token in axios headers for future requests
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`;

        setToken(accessToken);
        setIsAuthenticated(true);
        setAuthData({
          user_id: responseData.user.user_id,
          username:
            responseData.user.firstName + " " + responseData.user.lastName,
          email: responseData.user.email,
        });
      } else {
        throw new Error(responseData || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsAuthenticated(false);
      setAuthData({
        user_id: 0,
        username: "",
        email: "",
      });
      throw error;
    }
  };

  const logout = () => {
    removeLocalStorage("authToken");
    removeLocalStorage("authData");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setIsAuthenticated(false);
    setAuthData({
      user_id: 0,
      username: "",
      email: "",
    });
  };

  const authValue = {
    isAuthenticated,
    data: authData,
    login,
    logout,
    token,
    isLoading,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};
