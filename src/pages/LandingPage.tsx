import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  FileText,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0f] font-sans text-[#e8e8f0]">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(124,106,247,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(124,106,247,0.035)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="pointer-events-none absolute -right-48 -top-48 h-[38rem] w-[38rem] rounded-full border-[5rem] border-[#7c6af7]/[0.07]" />
      <div className="pointer-events-none absolute -bottom-60 -left-48 h-[34rem] w-[34rem] rounded-full border-[4rem] border-[#4fd1c5]/[0.05]" />

      <header className="relative mx-auto flex max-w-[1180px] items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1c1c26] text-[#4fd1c5] shadow-lg shadow-[#7c6af7]/10">
            <BriefcaseBusiness size={19} strokeWidth={2.4} />
          </span>
          <div>
            <span className="block text-xl font-bold tracking-tight">
              JobRadar
            </span>
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[#6b6b80]">
              AI-powered job matcher
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="rounded-lg border border-[#2a2a38] px-4 py-2.5 text-sm font-semibold text-[#e8e8f0] transition-colors hover:border-[#7c6af7] hover:text-[#4fd1c5]"
        >
          Log in
        </button>
      </header>

      <main className="relative mx-auto max-w-[1180px] px-5 pb-12 pt-12 sm:px-8 sm:pt-20 lg:px-10 lg:pt-24">
        <section className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7c6af7]/20 bg-[#7c6af7]/[0.07] px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[#a59cfb]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4fd1c5] shadow-[0_0_10px_#4fd1c5]" />
              Search with signal
            </div>
            <h1 className="max-w-3xl text-5xl font-bold leading-[0.98] tracking-[-0.04em] text-[#e8e8f0] sm:text-6xl lg:text-7xl">
              Your experience deserves a better shortlist.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-[#8a8a9c] sm:text-lg">
              JobRadar turns your CV, skills, and goals into focused job
              matches, so you can spend less time scrolling and more time moving
              forward.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="group inline-flex items-center justify-center gap-3 rounded-lg bg-[#7c6af7] px-5 py-3.5 font-semibold text-white shadow-lg shadow-[#7c6af7]/20 transition-all hover:-translate-y-0.5 hover:bg-[#6857e8]"
              >
                Build your shortlist
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
              <span className="flex items-center justify-center gap-2 px-3 py-3.5 text-sm text-[#6b6b80] sm:justify-start">
                <Check size={16} className="text-[#4fd1c5]" />
                Start with your CV
              </span>
            </div>
          </div>

          <div className="relative rounded-2xl border border-[#2a2a38] bg-[#13131a]/90 p-4 shadow-2xl shadow-black/25 backdrop-blur-sm sm:p-5">
            <div className="absolute -right-3 -top-3 rounded-full border border-[#4fd1c5]/20 bg-[#13131a] px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.13em] text-[#4fd1c5]">
              Live match preview
            </div>
            <div className="mb-5 flex items-center justify-between border-b border-[#2a2a38] pb-4">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#6b6b80]">
                <Sparkles size={15} className="text-[#4fd1c5]" />
                Profile signal
              </div>
              <span className="rounded-full bg-[#4fd1c5]/10 px-2.5 py-1 font-mono text-xs text-[#4fd1c5]">
                Active
              </span>
            </div>
            <div className="mb-5 grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-[#1c1c26] p-3">
                <p className="text-xl font-bold">87%</p>
                <p className="mt-1 font-mono text-[0.6rem] uppercase text-[#6b6b80]">
                  Fit score
                </p>
              </div>
              <div className="rounded-lg bg-[#1c1c26] p-3">
                <p className="text-xl font-bold">03</p>
                <p className="mt-1 font-mono text-[0.6rem] uppercase text-[#6b6b80]">
                  New roles
                </p>
              </div>
              <div className="rounded-lg bg-[#1c1c26] p-3">
                <p className="text-xl font-bold">24h</p>
                <p className="mt-1 font-mono text-[0.6rem] uppercase text-[#6b6b80]">
                  Fresh data
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-[#2a2a38] bg-[#0f0f15] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#e8e8f0]">
                    Senior Full-stack Engineer
                  </p>
                  <p className="mt-1 text-xs text-[#6b6b80]">
                    Product studio · Munich + remote
                  </p>
                </div>
                <span className="text-lg font-bold text-[#4fd1c5]">87%</span>
              </div>
              <div className="mt-4 h-1.5 rounded-full bg-[#1c1c26]">
                <div className="h-full w-[87%] rounded-full bg-[#7c6af7]" />
              </div>
              <div className="mt-4 flex items-center justify-between font-mono text-[0.62rem] text-[#6b6b80]">
                <span>TypeScript</span>
                <span>React</span>
                <span>PostgreSQL</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-3 border-t border-[#2a2a38] pt-5 sm:grid-cols-3">
          <div className="flex gap-3 rounded-xl p-4">
            <FileText size={20} className="shrink-0 text-[#7c6af7]" />
            <div>
              <p className="text-sm font-semibold">Your profile, understood</p>
              <p className="mt-1 text-xs leading-5 text-[#6b6b80]">
                Turn your CV into a living search signal.
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-xl p-4">
            <Target size={20} className="shrink-0 text-[#4fd1c5]" />
            <div>
              <p className="text-sm font-semibold">Less noise, more fit</p>
              <p className="mt-1 text-xs leading-5 text-[#6b6b80]">
                See roles aligned with what you actually do.
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-xl p-4">
            <Search size={20} className="shrink-0 text-[#a59cfb]" />
            <div>
              <p className="text-sm font-semibold">A calmer workflow</p>
              <p className="mt-1 text-xs leading-5 text-[#6b6b80]">
                Keep your search, matches, and next steps together.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
