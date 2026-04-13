import { Upload } from "../sections/Upload";
import { ProfileSection } from "../sections/ProfileSection";
import { Filter } from "../sections/Filter";
import { ErrorSection } from "../sections/ErrorSection";
import { JobLists } from "../sections/JobLists";
import { JobContainer } from "../sections/JobContainer";

export const Home = () => {
  return (
    <div>
      <Upload />
      <ProfileSection />
      <Filter />
      <ErrorSection />
      <JobLists />
      <JobContainer />
    </div>
  );
};
