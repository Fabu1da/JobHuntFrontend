import { useFilterContext } from '../hooks/useContext';
import { filterButtons } from '../service/parsePdf';

export const JobLists = () => {

  const { allJobs, currentFilter, setCurrentFilter } = useFilterContext();

    const getStats = () => {
    const scored = allJobs.filter(j => j.score != null);
    const high = scored.filter(j => (j.score || 0) >= 70).length;
    const avg = scored.length ? Math.round(scored.reduce((s, j) => s + (j.score || 0), 0) / scored.length) : 0;
    return { total: allJobs.length, high, avg: scored.length ? avg : null };
  };

  const stats = getStats();


  return (
    <div>
        {allJobs.length > 0 && (
        <>
          <div className="stats-bar">
            <div className="stat">
              <div>
                <div className="stat-num">{stats.total}</div>
                <div className="stat-label">jobs found</div>
              </div>
            </div>
            <div className="divider" />
            <div className="stat">
              <div>
                <div className="stat-num" style={{ color: 'var(--success)' }}>{stats.high}</div>
                <div className="stat-label">strong matches</div>
              </div>
            </div>
            <div className="divider" />
            <div className="stat">
              <div>
                <div className="stat-num" style={{ color: 'var(--accent)' }}>
                  {stats.avg !== null ? stats.avg : '—'}
                </div>
                <div className="stat-label">avg score</div>
              </div>
            </div>
          </div>

          <div className="filters">
            {filterButtons.map(({ filter, label }) => (
              <button
                key={filter}
                className={`filter-btn ${currentFilter === filter ? 'active' : ''}`}
                onClick={() => setCurrentFilter(filter)}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}

    </div>
  )
}
