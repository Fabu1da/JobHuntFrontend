export interface Job {
  id: string;
  title: string;
  company?: string;
  location?: string;
  description?: string;
  job_url?: string;
  site?: string;
  date_posted?: string;
  score?: number | null;
  ai_summary?: string | null;
  scoring?: boolean;
  matched_skills?: string[];
  missing_skills?: string[];
}

export interface AIScoreResult {
  score: number;
  summary: string;
}

export interface Profile {
  name: string;
  title: string;
  experience: string;
  skills: string[];
  education: string;
  location: string;
  summary: string;
}

export type FilterType = 'all' | 'high' | 'mid' | 'linkedin' | 'indeed' | 'glassdoor' | 'stepstone' | 'google';
