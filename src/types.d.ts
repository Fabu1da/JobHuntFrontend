export interface JobBreakdown {
  semantic: number;
  skills: number;
  experience: number;
  education: number;
  languages: number;
  location: number;
}

export interface JobLocation {
  city: string | null;
  country: string | null;
  remote: boolean;
  hybrid: boolean;
  relocationRequired: boolean | null;
}

export interface JobSalary {
  min: number | null;
  max: number | null;
  currency: string | null;
  interval: string | null;
}

export interface JobExperience {
  minYears: number | null;
  maxYears: number | null;
  seniority: string | null;
}

export interface JobEmployment {
  type: string | null;
  contract: string | null;
}

export interface JobEducationRequirement {
  degree: string | null;
  field: string | null;
  required: boolean;
}

export interface JobCertification {
  name: string | null;
  issuer: string | null;
  required: boolean;
}

export interface Job {
  // identity
  jobId: string;
  title: string;
  site: string;

  // scoring
  score: number;
  breakdown: JobBreakdown;
  matchedSkills: string[];
  missingRequiredSkills: string[];
  matchedPreferredSkills: string[];

  // job details
  summary: string | null;
  responsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  technologies: string[];
  experience: JobExperience;
  education: JobEducationRequirement[];
  certifications: JobCertification[];
  languages: string[];
  location: JobLocation;
  employment: JobEmployment;
  salary: JobSalary;
  industry: string[];
  domain: string[];
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

export interface Cv {
  id: string;
  originalFileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  rawText: string;
  data: string;
  status: "pending" | "processed" | "error";
  parserModel: string;
  parserVersion: string;
  createdAt: string;
  updatedAt: string;
}

export type FilterType =
  | "all"
  | "high"
  | "mid"
  | "linkedin"
  | "indeed"
  | "glassdoor"
  | "stepstone"
  | "google";
