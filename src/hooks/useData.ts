import { useState, useCallback } from 'react';
import type { Job, FilterType, Profile, JobEvaluation } from '../types';
import axios from 'axios';

export const useData = () => {
  const [query, setQuery] = useState('full stack developer');
  const [location, setLocation] = useState('Germany');
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState('Search Jobs');
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);



  const searchJobs = useCallback(async () => {
    if (!query.trim() || !profile) return;

    setIsLoading(true);
    setButtonText('Searching...');
    setError(null);
    setAllJobs([]);

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/jobs?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&results=20`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.error) throw new Error(data.error);
      if (!data.jobs?.length) throw new Error('No jobs found. Try a different search term.');

      let jobs: Job[] = data.jobs.map((j: Job, i: number) => ({
        ...j,
        id: j.id || String(i),
        score: null,
        ai_summary: null,
        scoring: true
      }));

      setAllJobs(jobs);
      setButtonText('Scoring with AI...');

      // Score all jobs in a single API call
      const scoreRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/scoreJobs`, {
        profile,
        jobs: jobs.map(j => ({
          id: j.id,
          title: j.title,
          company: j.company,
          location: j.location,
          description: j.description
        }))
      });

      console.log('Score response:', scoreRes.data);

      const scores = scoreRes.data as Array<JobEvaluation>;
      console.log('Received scores:', scores);
      
      // Map scores back to jobs
      jobs = jobs.map(job => {
        const scoreData = scores.find(s => s.id === job.id);
        if (scoreData) {
          return { ...job, 
            score: scoreData.score, 
            ai_summary: scoreData.summary, 
            scoring: false, 
            matched_skills: scoreData.matched_skills, 
            missing_skills: scoreData.missing_skills,
            Verdict: scoreData.Verdict,
            Gaps: scoreData.Gaps,
            Hard_blockers: scoreData.Hard_blockers,
            stand_out: scoreData.stand_out,
            Salary_target: scoreData.Salary_target,
            Recommendation: scoreData.Recommendation
          };
        }
        return { ...job, scoring: false };
      });

      // Sort by score descending
      jobs.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
      setAllJobs([...jobs]);
    } catch (e) {
      const err = e as Error;
      if (err.message.includes('fetch') || err.message.includes('Failed')) {
        setError('Backend not running. Start the server first: cd backend && python app.py');
      } else {
        setError(`Error: ${err.message}`);
      }
    }

    setIsLoading(false);
    setButtonText('Search Jobs');
  }, [query, location, profile]);

  return {
    query,
    setQuery,
    location,
    setLocation,
    allJobs,
    setAllJobs,
    currentFilter,
    setCurrentFilter,
    isLoading,
    setIsLoading,
    buttonText,
    setButtonText,
    error,
    setError,
    profile,
    setProfile,
    searchJobs
  };
};
