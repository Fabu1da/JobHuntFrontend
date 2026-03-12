import { createContext } from 'react';
import type { Job, FilterType, Profile } from '../types';

export interface DataContextType {
  query: string;
  setQuery: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  allJobs: Job[];
  setAllJobs: (jobs: Job[]) => void;
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

export const DataContext = createContext<DataContextType | undefined>(undefined);
