import { createContext } from "react";
import type { FilterType, Profile } from "../types";
import type { RawJobMatch } from "@/utils/jobTypes";

export interface DataContextType {
  query: string;
  setQuery: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  allJobs: RawJobMatch[];
  setAllJobs: (jobs: RawJobMatch[]) => void;
  currentFilter: FilterType;
  setCurrentFilter: (filter: FilterType) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  buttonText: string;
  setButtonText: (text: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  searchJobs: () => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(
  undefined,
);
