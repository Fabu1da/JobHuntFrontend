import { useFilterContext } from "../hooks/useContext";
import { Summary } from "./subsections/Summary";
import { CardActions } from "./subsections/CardActions";
import type { JobBreakdown } from "@/types";
import { clean, parseJob } from "@/utils/jobTypes";

const TIER = {
  strong: {
    text: "text-[#e8a23d]",
    bg: "bg-[#e8a23d]/10",
    border: "border-l-[#e8a23d]",
    bar: "bg-[#e8a23d]",
  },
  mid: {
    text: "text-[#6c8fb8]",
    bg: "bg-[#6c8fb8]/10",
    border: "border-l-[#6c8fb8]",
    bar: "bg-[#6c8fb8]",
  },
  weak: {
    text: "text-[#8890a0]",
    bg: "bg-[#8890a0]/10",
    border: "border-l-[#262c38]",
    bar: "bg-[#8890a0]",
  },
};

const tierFor = (score: number) => {
  if (score >= 70) return TIER.strong;
  if (score >= 40) return TIER.mid;
  return TIER.weak;
};

const breakdownLabels: Record<keyof JobBreakdown, string> = {
  semantic: "Overall fit",
  skills: "Skills",
  experience: "Experience",
  education: "Education",
  languages: "Languages",
  location: "Location",
};

const BreakdownRow = ({ breakdown }: { breakdown: JobBreakdown }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 mb-4">
    {(Object.keys(breakdown) as (keyof JobBreakdown)[]).map((key) => {
      const value = breakdown[key];
      const tier = tierFor(value);
      return (
        <div key={key} className="flex items-center gap-2">
          <span className="text-[0.72rem] text-[#8890a0] w-[5.5rem] shrink-0">
            {breakdownLabels[key]}
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-[#1c222e] overflow-hidden">
            <div
              className={`h-full rounded-full ${tier.bar}`}
              style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
            />
          </div>
          <span
            className={`font-mono text-[0.7rem] font-medium ${tier.text} w-7 text-right`}
          >
            {value}
          </span>
        </div>
      );
    })}
  </div>
);

export const JobContainer = () => {
  const { allJobs, profile, currentFilter, isLoading, error } =
    useFilterContext();

  const getFilteredJobs = () => {
    if (currentFilter === "high")
      return allJobs.filter((match) => (match.score || 0) >= 70);
    if (currentFilter === "mid")
      return allJobs.filter((match) => (match.score || 0) >= 40);
    if (["linkedin", "indeed", "glassdoor", "google"].includes(currentFilter)) {
      return allJobs.filter((match) =>
        (match.site || "").toLowerCase().includes(currentFilter),
      );
    }
    return allJobs;
  };

  const filteredJobs = getFilteredJobs();

  return (
    <div className="font-sans text-[#edeef3] bg-[#10141c]">
      <div id="jobsContainer">
        {isLoading && allJobs.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3.5 py-16 px-6 text-center">
            <div className="h-5 w-5 rounded-full border-2 border-[#262c38] border-t-[#e8a23d] animate-spin motion-reduce:animate-[spin_1.6s_linear_infinite]" />
            <div className="max-w-md text-sm leading-relaxed text-[#8890a0]">
              Fetching jobs from LinkedIn, Indeed, Glassdoor, Google…
            </div>
          </div>
        )}

        {!isLoading && allJobs.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center gap-3.5 py-16 px-6 text-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="text-[#8890a0]/70"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <div className="font-display font-semibold text-base text-[#edeef3]">
              Ready to search
            </div>
            <div className="max-w-md text-sm leading-relaxed text-[#8890a0]">
              {!profile ? (
                <>
                  Upload your CV above to get started.
                  <br />
                  We'll extract your profile and match jobs to your skills.
                </>
              ) : (
                <>
                  Enter a search query and search jobs.
                  <br />
                  Each listing gets scored against your profile.
                </>
              )}
            </div>
          </div>
        )}

        {error && allJobs.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3.5 py-16 px-6 text-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="text-[#8890a0]/70"
              aria-hidden="true"
            >
              <path d="M12 9v4M12 17h.01" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            <div className="font-display font-semibold text-base text-[#edeef3]">
              Something went wrong
            </div>
            <div className="max-w-md text-sm leading-relaxed text-[#8890a0]">
              Make sure the backend server is running on port 8000.
            </div>
          </div>
        )}

        {filteredJobs.length > 0 && (
          <div className="flex flex-col gap-3 py-1">
            {filteredJobs
              .sort((a, b) => (b.score || 0) - (a.score || 0))
              .map((match, index) => {
                const job = parseJob(match);
                const tier = tierFor(job.score);
                const seniority = clean(job.experience.seniority);
                const employmentType = clean(job.employment.type);
                const requiredEducation = job.education
                  .filter((e) => e.required && e.degree)
                  .map((e) => e.degree)
                  .join(", ");

                return (
                  <article
                    key={`${job.title}-${job.site}-${index}`}
                    className={`relative bg-[#171c26] border border-[#262c38] border-l-[3px] rounded-md px-5 py-[1.1rem] transition-colors hover:border-[#33394a] focus-within:outline focus-within:outline-2 focus-within:outline-[#e8a23d] focus-within:outline-offset-2 ${tier.border}`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3 flex-col sm:flex-row">
                      <h3 className="font-display font-semibold text-[1.05rem] leading-snug text-[#edeef3] m-0">
                        {job.title}
                      </h3>
                      <div
                        className={`flex-shrink-0 flex items-baseline gap-1.5 px-2.5 py-1.5 rounded font-mono ${tier.bg} ${tier.text}`}
                      >
                        <span className="font-bold text-base">{job.score}</span>
                        <span className="text-[0.68rem] opacity-75">match</span>
                      </div>
                    </div>

                    <BreakdownRow breakdown={job.breakdown} />

                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 mb-3.5">
                      <span className="text-[0.78rem] font-medium px-2.5 py-0.5 rounded border border-[#262c38] text-[#8890a0]">
                        {job.site}
                      </span>

                      <span className="inline-flex items-center text-[0.83rem] text-[#8890a0] border border-[#262c38] rounded px-2 py-0.5">
                        {job.location.remote
                          ? "Remote"
                          : job.location.city || job.location.country
                            ? [job.location.city, job.location.country]
                                .filter(Boolean)
                                .join(", ")
                            : "Location not specified"}
                        {job.location.hybrid ? " · Hybrid" : ""}
                      </span>

                      {employmentType && (
                        <span className="inline-flex items-center text-[0.83rem] text-[#8890a0] border border-[#262c38] rounded px-2 py-0.5">
                          {employmentType}
                        </span>
                      )}

                      {(job.experience.minYears ||
                        job.experience.maxYears ||
                        seniority) && (
                        <span className="inline-flex items-center text-[0.83rem] text-[#8890a0] border border-[#262c38] rounded px-2 py-0.5">
                          {seniority ? `${seniority} · ` : ""}
                          {job.experience.minYears ?? "0"}
                          {job.experience.maxYears
                            ? `–${job.experience.maxYears}`
                            : "+"}{" "}
                          yrs
                        </span>
                      )}

                      {job.salary.min !== null && job.salary.max !== null && (
                        <span className="inline-flex items-center font-mono text-[0.8rem] text-[#8890a0] border border-[#262c38] rounded px-2 py-0.5 tabular-nums">
                          {job.salary.currency ?? ""}{" "}
                          {job.salary.min.toLocaleString()}–
                          {job.salary.max.toLocaleString()}
                        </span>
                      )}

                      {requiredEducation && (
                        <span className="inline-flex items-center text-[0.83rem] text-[#8890a0] border border-[#262c38] rounded px-2 py-0.5">
                          {requiredEducation}
                        </span>
                      )}
                    </div>

                    <Summary job={job} />
                    <CardActions job={job} />
                  </article>
                );
              })}
          </div>
        )}

        {allJobs.length > 0 && filteredJobs.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3.5 py-16 px-6 text-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="text-[#8890a0]/70"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <div className="font-display font-semibold text-base text-[#edeef3]">
              No jobs in this filter
            </div>
            <div className="max-w-md text-sm leading-relaxed text-[#8890a0]">
              Try a different filter or search query.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
