import { type KeyboardEvent } from 'react'
import { useFilterContext } from '../hooks/useContext';

export const Filter = () => {
  const { profile, searchJobs, isLoading, query, setQuery, location, setLocation, buttonText } = useFilterContext();
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') searchJobs();
  };
  return (
    <div>
           <div className="search-section">
        <div className="search-row">
          <div className="input-wrap">
            <div className="input-label">Search Query</div>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. full stack developer python react"
            />
          </div>
          <div className="input-wrap">
            <div className="input-label">Location</div>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Germany, Berlin"
            />
          </div>
          <button
            className="search-btn"
            onClick={searchJobs}
            disabled={isLoading || !profile}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}
