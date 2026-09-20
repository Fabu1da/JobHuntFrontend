import { type KeyboardEvent } from "react";
import { MapPin, Search, Sparkles } from "lucide-react";
import { useFilterContext } from "../hooks/useContext";

export const Filter = () => {
  const {
    profile,
    searchJobs,
    isLoading,
    query,
    setQuery,
    location,
    setLocation,
    buttonText,
  } = useFilterContext();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") void searchJobs();
  };

  return (
    <section className="mt-4 w-full rounded-xl border border-[#2a2a38] bg-[#13131a] p-4 shadow-lg shadow-black/10 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4fd1c5]/10 text-[#4fd1c5]">
            <Search size={16} />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-[#e8e8f0]">Find your next role</h2>
            <p className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[#6b6b80]">
              Search by fit, not noise
            </p>
          </div>
        </div>
        <Sparkles size={16} className="text-[#7c6af7]" />
      </div>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(12rem,0.8fr)_auto]">
        <label className="group relative block">
          <span className="sr-only">Search query</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#6b6b80] transition-colors group-focus-within:text-[#7c6af7]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Role, skill, or keyword"
            className="h-11 w-full rounded-lg border border-[#2a2a38] bg-[#0f0f15] pl-10 pr-3 text-sm text-[#e8e8f0] outline-none transition-colors placeholder:text-[#6b6b80] hover:border-[#4a466f] focus:border-[#7c6af7] focus:ring-4 focus:ring-[#7c6af7]/15"
          />
        </label>

        <label className="group relative block">
          <span className="sr-only">Location</span>
          <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#6b6b80] transition-colors group-focus-within:text-[#4fd1c5]" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Location or remote"
            className="h-11 w-full rounded-lg border border-[#2a2a38] bg-[#0f0f15] pl-10 pr-3 text-sm text-[#e8e8f0] outline-none transition-colors placeholder:text-[#6b6b80] hover:border-[#4a466f] focus:border-[#4fd1c5] focus:ring-4 focus:ring-[#4fd1c5]/10"
          />
        </label>

        <button
          type="button"
          onClick={() => void searchJobs()}
          disabled={isLoading || !profile}
          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#7c6af7] px-5 text-sm font-semibold text-white shadow-lg shadow-[#7c6af7]/15 transition-all hover:enabled:-translate-y-0.5 hover:enabled:bg-[#6857e8] disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Search size={16} />
          {buttonText}
        </button>
        </div>

      {!profile && (
        <p className="mt-3 font-mono text-[0.65rem] text-[#6b6b80]">
          Upload a CV above to activate personalized matching.
        </p>
      )}
    </section>
  );
};
