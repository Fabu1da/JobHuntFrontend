import  { useState } from 'react'
import type { Job } from '../types';
import { parseJobDescription } from '../service/parseDescription';
import axios from 'axios';
import { getScoreClass } from '../service/parsePdf';
import { useFilterContext } from '../hooks/useContext';
import { Summary } from './subsections/summary';

export const JobContainer = () => {

    const { allJobs, profile, setError, currentFilter, isLoading, error } = useFilterContext();


      const [coverLetters, setCoverLetters] = useState<Map<string, string>>(new Map());
      const [generatingCoverLetter, setGeneratingCoverLetter] = useState<Set<string>>(new Set());
      const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());
      const [messageToRecruiter, setMessageToRecruiter] = useState<Map<string, string>>(new Map());
      const [generatingMessage, setGeneratingMessage] = useState<Set<string>>(new Set());



    const getSourceClass = (site: string | undefined) => {
    const s = (site || '').toLowerCase();
    if (s.includes('linkedin')) return 'source-linkedin';
    if (s.includes('indeed')) return 'source-indeed';
    if (s.includes('glassdoor')) return 'source-glassdoor';
    if (s.includes('google')) return 'source-google';
    return 'source-indeed';
  };


      const generateCoverLetterForJob = async (job: Job) => {
    if (!profile) {
      setError('Please upload your CV first to generate a cover letter.');
      return;
    }

    setGeneratingCoverLetter(prev => new Set(prev).add(job.id));

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/generateCoverLetter`, {
        profile: profile,
        job: {
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description
        }
      });

      setCoverLetters(prev => new Map(prev).set(job.id, response.data.coverLetter));
    } catch (err) {
      console.error('Error generating cover letter:', err);
      setError('Failed to generate cover letter. Please try again.');
    } finally {
      setGeneratingCoverLetter(prev => {
        const next = new Set(prev);
        next.delete(job.id);
        return next;
      });
    }
  };

  const generateMessageForJob = async (job: Job) => {
    if (!profile) {
      setError('Please upload your CV first to generate a message to the recruiter.');
      return;
    }

    setGeneratingMessage(prev => new Set(prev).add(job.id));
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/generateMessageToRecruiter`, {
        profile: profile,
        job: {
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description
        }
      });

      setMessageToRecruiter(prev => new Map(prev).set(job.id, response.data.message));
    } catch (err) {
      console.error('Error generating message to recruiter:', err);
      setError('Failed to generate message to recruiter. Please try again.');
    } finally {
      setGeneratingMessage(prev => {
        const next = new Set(prev);
        next.delete(job.id);
        return next;
      });
    }
  }

    const getFilteredJobs = () => {
    if (currentFilter === 'high') return allJobs.filter(j => (j.score || 0) >= 70);
    if (currentFilter === 'mid') return allJobs.filter(j => (j.score || 0) >= 40);
    if (['linkedin', 'indeed', 'glassdoor', 'google'].includes(currentFilter)) {
      return allJobs.filter(j => (j.site || '').toLowerCase().includes(currentFilter));
    }

    return allJobs;
  };
  const filteredJobs = getFilteredJobs();

const toggleDescription = (id: string) => {
    setExpandedJobs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isValidDescription = (desc?: string) => {
    if (!desc) return false;
    const cleanDesc = String(desc).toLowerCase().trim();
    return cleanDesc !== 'nan' && cleanDesc !== 'none' && desc.length > 0;
  };

  return (
    <div>
        <div id="jobsContainer">
        {isLoading && allJobs.length === 0 && (
          <div className="loading-wrap">
            <div className="spinner" />
            <div className="loading-text">Fetching jobs from LinkedIn, Indeed, Glassdoor, Google...</div>
          </div>
        )}

        {!isLoading && allJobs.length === 0 && !error && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">Ready to search</div>
            <div className="empty-sub">
              {!profile ? (
                <>Upload your CV above to get started.<br />AI will extract your profile and match jobs to your skills.</>
              ) : (
                <>Enter a search query and click Search Jobs.<br />AI will score each listing against your profile.</>
              )}
            </div>
          </div>
        )}

        {error && allJobs.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <div className="empty-title">Something went wrong</div>
            <div className="empty-sub">Make sure the backend server is running on port 8000.</div>
          </div>
        )}

        {filteredJobs.length > 0 && (
          <div className="jobs-grid">
            {filteredJobs.map(job => {

              
              const scoreClass = getScoreClass(job.score);
              const sourceClass = getSourceClass(job.site);
              const isExpanded = expandedJobs.has(job.id);

              return (
                <div key={job.id} className={`job-card ${scoreClass}`}>
                  <div className="card-header">
                    <div className="header-left">
                      <h3 className="job-title">{job.title}</h3>
                    </div>
                    <div className="header-right">
                      <div className={`score-badge ${scoreClass}`}>
                        <div className="score-num">{job.score ?? '?'}</div>
                        <div className="score-label">MATCH</div>
                      </div>
                    </div>
                  </div>

                  <div className="job-meta-line">
                    <span className="meta-company">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      </svg>
                      {job.company || 'Unknown'}
                    </span>
                    <span className="meta-separator">·</span>
                    <span className="meta-type">Full-time</span>
                    <span className="meta-separator">·</span>
                    <span className="meta-location">Remote OK</span>
                    <span className="meta-separator">·</span>
                    <span className={`source-badge ${sourceClass}`}>{job.site || 'job board'}</span>
                  </div>

                  <Summary job={job} />

                  <div className="card-actions">
                    {job.job_url && job.job_url !== 'nan' && (
                      <a className="btn-apply" href={job.job_url} target="_blank" rel="noopener noreferrer">
                        Apply
                      </a>
                    )}
                    <button className="btn-save" title="Save this job">
                      Save
                    </button>
                    {isValidDescription(job.description) && (
                      <button className="btn-details" onClick={() => toggleDescription(job.id)}>
                        {isExpanded ? 'Hide' : 'Show'} Details
                      </button>
                    )}
                    <button className="btn-skip" title="Skip this job">
                      SKIP &gt;
                    </button>
                  </div>

                  <div className="card-footer-links">
                    {profile && (
                      <button
                        className="link-button"
                        onClick={() => generateCoverLetterForJob(job)}
                        disabled={generatingCoverLetter.has(job.id)}
                      >
                        {generatingCoverLetter.has(job.id) ? 'Generating Letter...' : 'Generate Letter'}
                      </button>
                    )}
                    {profile && (
                      <>
                        <span className="link-separator">·</span>
                        <button
                          className="link-button"
                          onClick={() => generateMessageForJob(job)}
                          disabled={generatingMessage.has(job.id)}
                        >
                          {generatingMessage.has(job.id) ? 'Generating...' : 'Message Recruiter'}
                        </button>
                      </>
                    )}
                  </div>

                  {isValidDescription(job.description) && (
                    <div style={{ display: isExpanded ? 'block' : 'none' }}>
                      {parseJobDescription(job.description!)}
                    </div>
                  )}

                  {coverLetters.has(job.id) && (
                    <div className="cover-letter-section">
                      <div className="cover-letter-header">
                        <span className="cover-letter-title">📄 Generated Cover Letter</span>
                        <button
                          className="btn-close"
                          onClick={() => {
                            const newLetters = new Map(coverLetters);
                            newLetters.delete(job.id);
                            setCoverLetters(newLetters);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                      <div className="cover-letter-content">
                        {coverLetters.get(job.id)}
                      </div>
                      <button
                        className="btn-copy"
                        onClick={() => {
                          const letter = coverLetters.get(job.id);
                          if (letter) {
                            navigator.clipboard.writeText(letter);
                            alert('Cover letter copied to clipboard!');
                          }
                        }}
                      >
                        📋 Copy to Clipboard
                      </button>
                    </div>
                  )}

                  {messageToRecruiter.has(job.id) && (
                    <div className="message-to-recruiter-section">
                      <div className="message-header">
                        <span className="message-title">💬 Message to Recruiter</span>
                        <button
                          className="btn-close"
                          onClick={() => {
                            const newMessages = new Map(messageToRecruiter);
                            newMessages.delete(job.id);
                            setMessageToRecruiter(newMessages);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                      <div className="message-content">
                        {messageToRecruiter.get(job.id)}
                      </div>
                      <button
                        className="btn-copy"
                        onClick={() => {
                          const message = messageToRecruiter.get(job.id);
                          if (message) {
                            navigator.clipboard.writeText(message);
                            alert('Message copied to clipboard!');
                          }
                        }}
                      >
                        📋 Copy to Clipboard
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

        {allJobs.length > 0 && filteredJobs.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔎</div>
            <div className="empty-title">No jobs in this filter</div>
            <div className="empty-sub">Try a different filter or search query.</div>
          </div>
        )}
      </div>
    </div>
  )
}
