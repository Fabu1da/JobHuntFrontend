import  { Fragment, useState } from 'react'
import type { Job } from '../../types';
import { parseJobDescription } from '../../service/parseDescription';
import { useFilterContext } from '../../hooks/useContext';
import axios from 'axios';

export const CardActions = ({ job}: {job: Job}) => {

    const { setError, profile } = useFilterContext();

    const [generatingCoverLetter, setGeneratingCoverLetter] = useState<Set<string>>(new Set());
    const [generatingMessage, setGeneratingMessage] = useState<Set<string>>(new Set());
    const [messageToRecruiter, setMessageToRecruiter] = useState<Map<string, string>>(new Map());
    const [coverLetters, setCoverLetters] = useState<Map<string, string>>(new Map());
    const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());  
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
        

        const isExpanded = expandedJobs?.has(job.id);


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
    <Fragment>
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

    </Fragment>
  )
}
