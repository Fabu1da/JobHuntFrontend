import { useState, useCallback } from "react";
import type { Job, FilterType, Profile } from "../types";
import axios from "axios";

export const useData = () => {
  const [query, setQuery] = useState("full stack developer");
  const [location, setLocation] = useState("Germany");
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Search Jobs");
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const searchJobs = useCallback(async () => {
    setIsLoading(true);
    setButtonText("Searching...");
    setError(null);
    setAllJobs([]);

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/job-search/search?q=${encodeURIComponent(query)}`;
      const res = await axios.get(url);
      const data = res.data;

      if (data.error) throw new Error(data.error);

      if (!data.jobs?.length)
        throw new Error("No jobs found. Try a different search term.");

      console.log("Jobs received:", data);
      setAllJobs([...data.jobs]);
    } catch (e) {
      const err = e as Error;
      if (err.message.includes("fetch") || err.message.includes("Failed")) {
        setError(
          "Backend not running. Start the server first: cd backend && python app.py",
        );
      } else {
        setError(`Error: ${err.message}`);
      }
    }

    setIsLoading(false);
    setButtonText("Search Jobs");
  }, [query]);

  return {
    query,
    setQuery,
    location,
    setLocation,
    allJobs,
    setAllJobs,
    currentFilter,
    setCurrentFilter,
    isLoading,
    setIsLoading,
    buttonText,
    setButtonText,
    error,
    setError,
    profile,
    setProfile,
    searchJobs,
  };
};
