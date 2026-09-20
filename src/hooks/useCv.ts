import type { Cv } from "@/types";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export const useCvContext = () => {
  const {
    data: userData,
    isAuthenticated,
    isLoading: authLoading,
    token,
  } = useAuth();
  const [cvs, setCvs] = useState<Cv[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const tokenUserId = token
    ? (() => {
        try {
          const payload = JSON.parse(atob(token.split(".")[1] ?? ""));
          return typeof payload.sub === "string" ? payload.sub : "";
        } catch {
          return "";
        }
      })()
    : "";
  const userId = String(userData.user_id || tokenUserId);

  const getCvs = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!userId) {
      setError("Unable to identify the logged-in user.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cv/${userId}/list`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        },
      );
      if (!response) {
        throw new Error("Failed to fetch CVs");
      }
      const payload = response.data;
      const nextCvs = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.cvs)
          ? payload.cvs
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

      setCvs(nextCvs);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  const addCv = (cv: Cv) => {
    setCvs((prevCvs) => [...prevCvs, cv]);
  };

  const removeCv = (cvId: string) => {
    setCvs((prevCvs) => prevCvs.filter((cv) => cv.id !== cvId));
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated && userId && token) {
      void getCvs();
    }
  }, [authLoading, getCvs, isAuthenticated, token, userId]);

  return {
    cvs,
    loading,
    error,
    addCv,
    removeCv,
    setLoading,
    setError,
  };
};
