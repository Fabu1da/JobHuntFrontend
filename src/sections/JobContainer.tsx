import { getScoreClass } from "../service/parsePdf";
import { useFilterContext } from "../hooks/useContext";
import { Summary } from "./subsections/Summary";
import { CardActions } from "./subsections/CardActions";

export const JobContainer = () => {
  const { allJobs, profile, currentFilter, isLoading, error } =
    useFilterContext();

  const getSourceClass = (site: string | undefined) => {
    const s = (site || "").toLowerCase();
    if (s.includes("linkedin")) return "source-linkedin";
    if (s.includes("indeed")) return "source-indeed";
    if (s.includes("glassdoor")) return "source-glassdoor";
    if (s.includes("google")) return "source-google";
    return "source-indeed";
  };

  const getFilteredJobs = () => {
    if (currentFilter === "high")
      return allJobs.filter((j) => (j.score || 0) >= 70);
    if (currentFilter === "mid")
      return allJobs.filter((j) => (j.score || 0) >= 40);
    if (["linkedin", "indeed", "glassdoor", "google"].includes(currentFilter)) {
      return allJobs.filter((j) =>
        (j.site || "").toLowerCase().includes(currentFilter),
      );
    }

    return allJobs;
  };
  const filteredJobs = getFilteredJobs();

  return (
    <div>
      <div id="jobsContainer">
        {isLoading && allJobs.length === 0 && (
          <div className="loading-wrap">
            <div className="spinner" />
            <div className="loading-text">
              Fetching jobs from LinkedIn, Indeed, Glassdoor, Google...
            </div>
          </div>
        )}

        {!isLoading && allJobs.length === 0 && !error && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">Ready to search</div>
            <div className="empty-sub">
              {!profile ? (
                <>
                  Upload your CV above to get started.
                  <br />
                  AI will extract your profile and match jobs to your skills.
                </>
              ) : (
                <>
                  Enter a search query and click Search Jobs.
                  <br />
                  AI will score each listing against your profile.
                </>
              )}
            </div>
          </div>
        )}

        {error && allJobs.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <div className="empty-title">Something went wrong</div>
            <div className="empty-sub">
              Make sure the backend server is running on port 8000.
            </div>
          </div>
        )}

        {filteredJobs.length > 0 && (
          <div className="jobs-grid">
            {filteredJobs.map((job) => {
              const scoreClass = getScoreClass(job.score);
              const sourceClass = getSourceClass(job.site);

              return (
                <div key={job.id} className={`job-card ${scoreClass}`}>
                  <div className="card-header">
                    <div className="header-left">
                      <h3 className="job-title">{job.title}</h3>
                    </div>
                    <div className="header-right">
                      <div className={`score-badge ${scoreClass}`}>
                        <div className="score-num">{job.score ?? "?"}</div>
                        <div className="score-label">MATCH</div>
                      </div>
                    </div>
                  </div>

                  <div className="job-meta-line">
                    <span className="meta-company">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      </svg>
                      {job.company || "Unknown"}
                    </span>
                    <span className="meta-separator">·</span>
                    <span className="meta-type">
                      {job.job_type || "Not specified"}
                    </span>
                    <span className="meta-separator">·</span>
                    <span className="meta-location">
                      {job.location || "Not specified"}
                    </span>
                    <span className="meta-separator">·</span>
                    <span className={`source-badge ${sourceClass}`}>
                      {job.site || "job board"}
                    </span>
                    <span className="meta-separator">·</span>
                    <span className="meta-salary">
                      {job.Salary_target || "Not specified"}
                    </span>
                  </div>

                  <Summary job={job} />
                  <CardActions job={job} />
                </div>
              );
            })}
          </div>
        )}

        {allJobs.length > 0 && filteredJobs.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔎</div>
            <div className="empty-title">No jobs in this filter</div>
            <div className="empty-sub">
              Try a different filter or search query.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
