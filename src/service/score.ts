import axios from "axios";
import type { Job, Profile } from "../types";

export const scoreJob = async (jobs:Job[], profile: Profile) => {
    try {
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

      const scores = scoreRes.data as Array<{ id: string; score: number; summary: string; matched_skills: string[]; missing_skills: string[] }>;


      return scores

    } catch (error) {
        console.error('Error scoring job:', error);
        return []
    }

}