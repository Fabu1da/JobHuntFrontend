import axios from "axios";
import { useEffect, useState } from "react";
import { ExternalLink, Trash2 } from "lucide-react";
import type { Job } from "../types";
import "./Bookmarks.css";

export const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/getAllJobs`,
        );

        if (res.status === 200) {
          setBookmarks(Array.isArray(res.data) ? res.data : []);
        } else {
          console.error("Failed to fetch bookmarks");
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (jobId: string) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/deleteJob/${jobId}`,
      );
      if (res.status !== 200) {
        console.error("Failed to remove bookmark");
        return;
      }
      setBookmarks((prev) => prev.filter((job) => job.id !== jobId));
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1>My Bookmarks</h1>
        <div className="loading">Loading your saved jobs...</div>
      </div>
    );
  }

  return (
    <div className="page-container bookmarks-container">
      <div className="bookmarks-header">
        <h1>My Bookmarks</h1>
        <span className="job-count">
          {bookmarks.length} saved job{bookmarks.length !== 1 ? "s" : ""}
        </span>
      </div>

      {bookmarks.length === 0 ? (
        <div className="empty-state">
          <p>No saved jobs yet</p>
          <p className="sub-text">
            Start exploring jobs and bookmark your favorites!
          </p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Salary</th>
                <th>Type</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookmarks.map((job: Job) => (
                <tr key={job.id} className="job-row">
                  <td className="job-title">
                    <strong>{job.title}</strong>
                  </td>
                  <td className="job-company">{job.company}</td>
                  <td className="job-location">{job.location}</td>
                  <td className="job-salary">{job.Salary_target || "N/A"}</td>
                  <td className="job-type">
                    <span className="type-badge">
                      {job.job_type || "Full-time"}
                    </span>
                  </td>
                  <td className="job-date">{job.date_posted}</td>
                  <td className="job-actions">
                    {job.job_url && job.job_url !== "nan" && (
                      <a
                        href={job.job_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-action btn-apply"
                        title="Apply on external site"
                      >
                        <ExternalLink size={18} />
                        Apply
                      </a>
                    )}
                    <button
                      className="btn-action btn-remove"
                      onClick={() => handleRemoveBookmark(job.id)}
                      title="Remove from bookmarks"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
