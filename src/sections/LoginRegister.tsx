import React, { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  FileText,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export const LoginRegister: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const pollRegistrationStatus = async (processId: string) => {
    const maxAttempts = 20;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/status/${processId}`,
      );

      if (!response.ok) {
        throw new Error("Could not verify registration status");
      }

      const data = await response.json();

      if (data.status === true) {
        return data;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    throw new Error("Registration is still processing. Please try again soon.");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await auth.login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
          }),
        },
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Registration failed");

      if (data.processId) {
        await pollRegistrationStatus(data.processId);
      }

      setSuccess(
        data.message ||
          "Registration accepted. You can log in after the background task completes.",
      );
      setIsLogin(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const inputClasses =
    "w-full rounded-lg border border-[#2a2a38] bg-[#13131a] px-4 py-3.5 text-[0.95rem] text-[#e8e8f0] shadow-sm outline-none transition-all placeholder:text-[#6b6b80] hover:border-[#4a466f] focus:border-[#7c6af7] focus:ring-4 focus:ring-[#7c6af7]/15";

  const labelClasses =
    "mb-2 block font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#6b6b80]";

  return (
    <div className="relative h-screen overflow-hidden bg-[#0a0a0f] font-sans text-[#e8e8f0]">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(124,106,247,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(124,106,247,0.035)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full border-[5rem] border-[#7c6af7]/[0.06]" />

      <main className="relative mx-auto grid h-full w-full max-w-[1180px] grid-cols-1 gap-8 overflow-hidden px-5 py-5 sm:px-8 md:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] md:gap-10 md:px-8 md:py-8 lg:gap-20 lg:px-10 lg:py-10">
        <aside className="relative z-10 flex min-h-0 flex-col justify-between overflow-hidden rounded-2xl border border-[#2a2a38] bg-[#13131a] px-7 py-8 shadow-2xl shadow-black/25 sm:px-10 sm:py-10 md:h-full md:px-9 md:py-9 lg:px-12 lg:py-11">
          <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:36px_36px]" />
          <div className="absolute -right-28 top-28 h-72 w-72 rounded-full border-[3rem] border-[#4fd1c5]/10" />
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1c1c26] text-[#4fd1c5] shadow-lg shadow-[#7c6af7]/10">
                <BriefcaseBusiness size={19} strokeWidth={2.4} />
              </span>
              <span className="font-sans text-xl font-bold tracking-tight text-[#e8e8f0]">
                JobRadar
              </span>
            </div>
            <div className="max-w-xl lg:mt-32">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#7c6af7]">
                AI-powered job matcher
              </p>
              <h1 className="max-w-lg text-4xl font-bold leading-[1.04] tracking-tight text-[#e8e8f0] sm:text-5xl lg:text-6xl">
                {isLogin
                  ? "Your next role is closer than you think."
                  : "Build a sharper job search."}
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-[#6b6b80]">
                {isLogin
                  ? "Upload your CV, discover relevant roles, and spend less time sorting through noise."
                  : "Let your profile, skills, and goals guide the search instead of generic keywords."}
              </p>
            </div>
          </div>
          <div className="relative z-10 mt-12 space-y-5">
            <div className="rounded-xl border border-[#2a2a38] bg-[#1c1c26]/70 p-4 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#6b6b80]">
                  <Sparkles size={15} className="text-[#4fd1c5]" />
                  Match preview
                </div>
                <span className="rounded-full bg-[#4fd1c5]/10 px-2.5 py-1 font-mono text-xs font-semibold text-[#4fd1c5]">
                  Active
                </span>
              </div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-3xl font-bold text-[#e8e8f0]">87%</p>
                  <p className="mt-1 font-mono text-xs text-[#6b6b80]">
                    profile-to-role fit
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#6b6b80]">
                  <MapPin size={14} className="text-[#4fd1c5]" />
                  Munich + remote
                </div>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#0a0a0f]">
                <div className="h-full w-[87%] rounded-full bg-[#7c6af7]" />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[#2a2a38] pt-5 text-xs text-[#6b6b80]">
              <span className="flex items-center gap-2">
                <FileText size={16} className="text-[#7c6af7]" />
                CV-informed discovery
              </span>
              <span className="flex items-center gap-2">
                <Target size={16} className="text-[#4fd1c5]" />
                Less noise
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#6b6b80]">
              <ShieldCheck size={18} className="text-[#4fd1c5]" />
              <span>Your profile stays private and in your control.</span>
            </div>
          </div>
        </aside>

        <section className="flex min-h-0 items-center justify-center overflow-hidden px-1 py-8 sm:px-8 md:px-4 lg:px-8">
          <form
            className="w-full max-w-xl"
            onSubmit={isLogin ? handleLogin : handleRegister}
            noValidate
          >
            <div className="mb-9">
              <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#7c6af7]">
                Candidate workspace
              </p>
              <h2 className="text-4xl font-bold tracking-tight text-[#e8e8f0] sm:text-5xl">
                {isLogin ? "Welcome back" : "Start your search"}
              </h2>
              <p className="mt-4 text-sm leading-6 text-[#6b6b80]">
                {isLogin ? "New to JobRadar? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="font-semibold text-[#4fd1c5] underline decoration-[#4fd1c5]/30 underline-offset-4 transition-colors hover:text-[#7c6af7]"
                >
                  {isLogin ? "Register" : "Log in"}
                </button>
              </p>
            </div>

            <div className="space-y-5">
              {!isLogin && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className={labelClasses}>
                      First name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                      className={inputClasses}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className={labelClasses}>
                      Last name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="family-name"
                      className={inputClasses}
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className={labelClasses}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className={labelClasses}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className={inputClasses}
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className={labelClasses}>
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className={inputClasses}
                    required
                  />
                </div>
              )}
            </div>

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-lg border border-[#f87171]/20 bg-[#f87171]/[0.08] px-4 py-3 text-sm leading-relaxed text-[#f87171]"
              >
                {error}
              </div>
            )}
            {success && (
              <div
                role="status"
                className="mt-6 rounded-lg border border-[#4fd1c5]/20 bg-[#4fd1c5]/10 px-4 py-3 text-sm leading-relaxed text-[#4fd1c5]"
              >
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group mt-7 flex w-full items-center justify-center gap-3 rounded-lg bg-[#7c6af7] px-5 py-4 font-semibold text-white shadow-lg shadow-[#7c6af7]/20 transition-all hover:enabled:-translate-y-0.5 hover:enabled:bg-[#6857e8] hover:enabled:shadow-xl active:enabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4fd1c5] focus-visible:outline-offset-4"
            >
              {loading
                ? "Please wait..."
                : isLogin
                  ? "Log in"
                  : "Create account"}
              {!loading && (
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              )}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};
