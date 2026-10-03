import { ProfileSection } from "@/sections/ProfileSection";
import { Filter } from "@/sections/Filter";
import { ErrorSection } from "@/sections/ErrorSection";
import { JobLists } from "@/sections/JobLists";
import { JobContainer } from "@/sections/JobContainer";
import { CvList } from "@/sections/CvList";
import { Chart } from "@/sections/Chart";

export const Home = () => {
  return (
    <div>
      <Chart />
      <CvList />
      <ProfileSection />
      <Filter />
      <ErrorSection />
      <JobLists />
      <JobContainer />
    </div>
  );
};
