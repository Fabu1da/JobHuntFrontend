import type { Job } from '../../types'

export const Summary = ({ job }: { job: Job }) => {
  return job.ai_summary ? (
                    <div className="ai-group">
                    <div className="ai-summary">
                      <div className="ai-summary-label">AI Analysis</div>
                      {job.ai_summary}
                    </div>
                    <div className="skills-section">
                        {job.matched_skills && job.matched_skills.length > 0 && (
                          <div className="skills-group matched-group">
                            <div className="skills-header">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                              </svg>
                              <span className="skills-title">Matched Skills</span>
                            </div>
                            <div className="skills-tags">
                              {job.matched_skills.map((skill, idx) => (
                                <span key={idx} className="skill-tag matched-tag">{skill}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {job.missing_skills && job.missing_skills.length > 0 && (
                          <div className="skills-group missing-group">
                            <div className="skills-header">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                              </svg>
                              <span className="skills-title">Missing Skills</span>
                            </div>
                            <div className="skills-tags">
                              {job.missing_skills.map((skill, idx) => (
                                <span key={idx} className="skill-tag missing-tag">{skill}</span>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                    </div>
            
                  ) : job.scoring ? (
                    <div className="ai-summary">
                      <div className="ai-summary-label">AI Analysis</div>
                      <span style={{ color: 'var(--muted)' }}>Scoring...</span>
                    </div>
                  ) : null
            }
  
  
