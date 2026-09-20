import type { Cv } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

export const useCvContext = () => {
  const [cvs, setCvs] = useState<Cv[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getCvs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios("/api/cv/list");
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
  };

  const addCv = (cv: Cv) => {
    setCvs((prevCvs) => [...prevCvs, cv]);
  };

  const removeCv = (cvId: string) => {
    setCvs((prevCvs) => prevCvs.filter((cv) => cv.id !== cvId));
  };

  useEffect(() => {
    getCvs();
  }, []);

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
