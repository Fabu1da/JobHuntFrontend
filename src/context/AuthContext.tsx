import React, { useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContextOnly";
import { validateUser } from "../service/userValidation";

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
      const storedToken = localStorage.getItem("authToken");
      const storedData = localStorage.getItem("authData");

      if (storedToken && storedData) {
        try {
          // Set token in axios headers
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${storedToken}`;

          // Validate the token with the backend
          const response = await validateUser(storedToken);

          if (response && response.success) {
            setToken(storedToken);
            setAuthData(JSON.parse(storedData));
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem("authToken");
            localStorage.removeItem("authData");
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Session restore error:", error);
          // Clear invalid session
          localStorage.removeItem("authToken");
          localStorage.removeItem("authData");
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/login`,
        {
          username,
          password,
        },
      );
      const responseData = res.data;

      if (responseData.success) {
        const authToken = responseData.token;
        console.log("Login successful, received token:", authToken);

        // Store token and user data in localStorage
        localStorage.setItem("authToken", authToken);
        localStorage.setItem(
          "authData",
          JSON.stringify({
            user_id: responseData.data.user_id,
            username: responseData.data.username,
            email: responseData.data.email,
          }),
        );

        // Set token in axios headers for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

        setToken(authToken);
        setIsAuthenticated(true);
        setAuthData({
          user_id: responseData.data.user_id,
          username: responseData.data.username,
          email: responseData.data.email,
        });
      } else {
        throw new Error(responseData.message || "Login failed");
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
    localStorage.removeItem("authToken");
    localStorage.removeItem("authData");
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
