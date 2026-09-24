import type { Job } from "@/types";

const toneStyles = {
  matched: { title: "text-[#e8a23d]", tag: "text-[#e8a23d] bg-[#e8a23d]/10" },
  preferred: { title: "text-[#6c8fb8]", tag: "text-[#6c8fb8] bg-[#6c8fb8]/10" },
  missing: {
    title: "text-[#8890a0]",
    tag: "text-[#8890a0] bg-[#1c222e] border border-[#262c38]",
  },
  neutral: {
    title: "text-[#8890a0]",
    tag: "text-[#8890a0] bg-[#1c222e] border border-[#262c38]",
  },
} as const;

const SkillRow = ({
  title,
  skills,
  tone,
}: {
  title: string;
  skills: string[];
  tone: keyof typeof toneStyles;
}) => {
  const s = toneStyles[tone];
  return (
    <div>
      <div className="mb-1.5">
        <span className={`text-[0.78rem] font-semibold ${s.title}`}>
          {title}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill, idx) => (
          <span
            key={idx}
            className={`text-[0.78rem] px-2.5 py-1 rounded ${s.tag}`}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export const Summary = ({ job }: { job: Job }) => {
  const hasMatchInfo =
    job.matchedSkills.length > 0 ||
    job.matchedPreferredSkills.length > 0 ||
    job.missingRequiredSkills.length > 0;

  if (!job.summary && !hasMatchInfo && job.responsibilities.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2.5 border-t border-[#262c38] pt-3.5 mt-1.5">
      {job.summary && (
        <div className="text-[0.87rem] leading-relaxed text-[#c7cad4]">
          <div className="font-display text-xs font-semibold text-[#e8a23d] mb-1">
            Analysis
          </div>
          {job.summary}
        </div>
      )}

      {job.missingRequiredSkills.length > 0 && (
        <div className="rounded px-3 py-2.5 text-[0.83rem] bg-[#1c222e] border border-[#262c38]">
          <div className="font-semibold mb-1 text-[#8890a0]">
            Gaps against required skills
          </div>
          <div className="leading-relaxed text-[#8890a0]">
            {job.missingRequiredSkills.join(", ")}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {job.matchedSkills.length > 0 && (
          <SkillRow
            title="Matched skills"
            skills={job.matchedSkills}
            tone="matched"
          />
        )}

        {job.matchedPreferredSkills.length > 0 && (
          <SkillRow
            title="Matched preferred skills"
            skills={job.matchedPreferredSkills}
            tone="preferred"
          />
        )}

        {job.missingRequiredSkills.length > 0 && (
          <SkillRow
            title="Missing required skills"
            skills={job.missingRequiredSkills}
            tone="missing"
          />
        )}

        {job.technologies.length > 0 && (
          <SkillRow
            title="Technologies"
            skills={job.technologies}
            tone="neutral"
          />
        )}
      </div>

      {job.responsibilities.length > 0 && (
        <div>
          <div className="text-[0.78rem] font-semibold text-[#8890a0] mb-1.5">
            Responsibilities
          </div>
          <ul className="list-disc list-outside pl-4 space-y-1">
            {job.responsibilities.map((item, idx) => (
              <li
                key={idx}
                className="text-[0.83rem] leading-relaxed text-[#8890a0]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
