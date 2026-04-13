export interface Job {
  id: string;
  title: string;
  company?: string;
  location?: string;
  description?: string;
  job_url?: string;
  job_type: string;
  site?: string;
  date_posted?: string;
  score?: number | null;
  ai_summary?: string | null;
  scoring?: boolean;
  matched_skills?: string[];
  missing_skills?: string[];
  Salary_target?: string;
  action?: string;
  Verdict?: string;
  Gaps?: string;
  Hard_blockers?: string;
  Stand_out?: string;
  Recommendation?: string;
  summary: string;
  stand_out: string ;
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