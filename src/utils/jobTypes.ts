// ---- Shared sub-shapes ----

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

// ---- What the API actually returns per item in allJobs ----
// score/site/matched-skill arrays live here, NOT inside rawData.

export interface RawJobMatch {
  score: number;
  breakdown: JobBreakdown;
  matchedSkills: string[];
  missingRequiredSkills: string[];
  matchedPreferredSkills: string[];
  jobId: string;
  title: string;
  site: string;
  rawData: string; // JSON-encoded JobDetails
}

// ---- What's encoded inside the rawData JSON string ----

export interface JobDetails {
  jobId: string;
  title: string;
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

// ---- The flat, merged shape the UI actually works with ----
// (RawJobMatch's score/site/matched-arrays + JobDetails' fields, combined)

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

  // details
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

// ---- Helpers ----

/** The API sometimes sends the literal string "null" instead of real null. */
export function clean<T>(value: T | "null" | null | undefined): T | null {
  if (value === "null" || value === null || value === undefined) return null;
  return value;
}

/** Parses rawData and merges it with the match-level fields into one flat Job. */
export function parseJob(match: RawJobMatch): Job {
  const details = JSON.parse(match.rawData) as JobDetails;
  return {
    ...details,
    title: match.title,
    site: match.site,
    score: match.score,
    breakdown: match.breakdown,
    matchedSkills: match.matchedSkills,
    missingRequiredSkills: match.missingRequiredSkills,
    matchedPreferredSkills: match.matchedPreferredSkills,
  };
}
