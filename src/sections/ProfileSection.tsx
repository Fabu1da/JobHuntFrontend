import { useFilterContext } from "../hooks/useContext";

export const ProfileSection = () => {
  const { profile } = useFilterContext();

  return (
    <div>
      {/* Profile Card */}
      {profile && (
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {(profile.name || "U")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="profile-info">
              <div className="profile-name">{profile.name || "Unknown"}</div>
              <div className="profile-title">
                {profile.title || "Professional"}
              </div>
            </div>
          </div>
          <div className="profile-summary">{profile.summary || ""}</div>
          <div className="profile-details">
            <div className="profile-detail">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="10" r="3" />
                <path d="M12 2a8 8 0 0 0-8 8c0 5.4 7.4 12.3 7.7 12.6a.5.5 0 0 0 .6 0C12.6 22.3 20 15.4 20 10a8 8 0 0 0-8-8z" />
              </svg>
              <span>{profile.location}</span>
            </div>
            <div className="profile-detail">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span>{profile.experience}</span>
            </div>
            <div className="profile-detail">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <span>{profile.education}</span>
            </div>
          </div>
          <div className="profile-skills">
            {(profile.skills || []).map((skill, i) => (
              <span key={i} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
