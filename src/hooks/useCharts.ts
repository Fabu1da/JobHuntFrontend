import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import type { DayChart } from "@/types";

const REFRESH_MS = 5 * 60 * 1000; // 5 minutes

export const useChart = () => {
  const [data, setData] = useState<DayChart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const { data: userData } = useAuth();

  console.log("useChart userData:", userData);

  const fetchChartData = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const user = userData;
      const userId = user?.user_id;
      if (!userId) {
        setError("User ID not available");
        return;
      }
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/chart/data/${userId}`;
      const response = await axios.get<DayChart[]>(url, {
        signal: controller.signal,
      });
      setData(response.data);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      if (axios.isCancel(err)) return; // ignore our own aborts
      console.error("Error fetching chart data:", err);
      setError("Error fetching chart data");
      // keep the old data so the chart doesn't vanish on a failed refresh
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChartData(); // initial load

    const id = setInterval(fetchChartData, REFRESH_MS);

    return () => {
      clearInterval(id); // stop polling on unmount
      abortRef.current?.abort();
    };
  }, [fetchChartData]);

  return { data, loading, error, lastUpdated, refetch: fetchChartData };
};
