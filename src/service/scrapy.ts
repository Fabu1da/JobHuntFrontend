import type { Job } from "../types";

export const scrapyJobs = async (query: string, location: string, results: number = 20, posted_within_hours: number = 72) => {
  try {

      const url = `${import.meta.env.VITE_BACKEND_URL}/api/jobs?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&results=${results}&posted_within_hours=${posted_within_hours}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.error) throw new Error(data.error);
      if (!data.jobs?.length) throw new Error('No jobs found. Try a different search term.');

      const jobs:Job[] = data.jobs.map((j: Job, i: number) => ({
        ...j,
        id: j.id || String(i),
        score: null,
        ai_summary: null,
        scoring: true
      }));

      return jobs;
    
  } catch (error) {
      console.error('Error scraping jobs:', error);
      return [];
  }
}