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

      <main className="relative mx-auto grid h-full w-full max-w-[1180px] grid-cols-1 gap-5 overflow-hidden px-4 py-3 sm:px-6 md:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] md:gap-6 md:px-7 md:py-5 lg:gap-10 lg:px-8 lg:py-6">
        <aside className="relative z-10 flex min-h-0 flex-col justify-between overflow-hidden rounded-2xl border border-[#2a2a38] bg-[#13131a] px-6 py-6 shadow-2xl shadow-black/25 sm:px-8 sm:py-8 md:h-full md:px-8 md:py-8 lg:px-10 lg:py-9">
          <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:36px_36px]" />
          <div className="absolute -right-28 top-28 h-72 w-72 rounded-full border-[3rem] border-[#4fd1c5]/10" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1c1c26] text-[#4fd1c5] shadow-lg shadow-[#7c6af7]/10">
                  <BriefcaseBusiness size={19} strokeWidth={2.4} />
                </span>
                <span className="font-sans text-xl font-bold tracking-tight text-[#e8e8f0]">
                  JobRadar
                </span>
              </div>
              <span className="rounded-full border border-[#4fd1c5]/20 bg-[#4fd1c5]/[0.08] px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[#4fd1c5]">
                Live engine
              </span>
            </div>
            <div
              className={`max-w-xl ${
                isLogin ? "mt-10 lg:mt-14" : "mt-6 lg:mt-8"
              }`}
            >
              <p className="mb-4 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#7c6af7]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7c6af7] shadow-[0_0_10px_#7c6af7]" />
                AI-powered job matcher
              </p>
              <h1
                className={`max-w-lg font-bold leading-[1.06] tracking-tight text-[#e8e8f0] ${
                  isLogin
                    ? "text-4xl sm:text-5xl lg:text-[3.35rem]"
                    : "text-3xl sm:text-4xl lg:text-[2.7rem]"
                }`}
              >
                {isLogin
                  ? "Find the roles that fit your story."
                  : "Turn your story into your next opportunity."}
              </h1>
              <p
                className={`max-w-md leading-6 text-[#6b6b80] ${
                  isLogin ? "mt-5 text-sm" : "mt-4 text-xs sm:text-sm"
                }`}
              >
                {isLogin
                  ? "Your CV, skills, and goals become a focused shortlist instead of another endless feed."
                  : "Build a profile once, then discover opportunities shaped around what you actually do well."}
              </p>
            </div>
            <div
              className={`relative z-10 mt-auto ${
                isLogin ? "pt-6" : "pt-4"
              }`}
            >
              <div className="mb-3 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[#6b6b80]">
                <span>Today&apos;s matches</span>
                <span className="text-[#4fd1c5]">03 found</span>
              </div>
              <div className="rounded-xl border border-[#2a2a38] bg-[#1c1c26]/80 p-4 backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#6b6b80]">
                    <Sparkles size={15} className="text-[#4fd1c5]" />
                    Match signal
                  </div>
                  <span className="rounded-full bg-[#4fd1c5]/10 px-2.5 py-1 font-mono text-xs font-semibold text-[#4fd1c5]">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-3xl font-bold text-[#e8e8f0]">87%</p>
                    <p className="mt-1 font-mono text-xs text-[#6b6b80]">
                      profile-to-role fit
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5 text-xs text-[#6b6b80]">
                      <MapPin size={14} className="text-[#4fd1c5]" />
                      Munich + remote
                    </div>
                    <p className="mt-2 text-xs text-[#e8e8f0]">
                      Senior Full-stack Engineer
                    </p>
                  </div>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#0a0a0f]">
                  <div className="h-full w-[87%] rounded-full bg-[#7c6af7]" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[#2a2a38] pt-4 text-xs text-[#6b6b80]">
                <span className="flex items-center gap-2">
                  <FileText size={16} className="text-[#7c6af7]" />
                  CV-informed discovery
                </span>
                <span className="flex items-center gap-2">
                  <Target size={16} className="text-[#4fd1c5]" />
                  Less noise
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3 text-xs text-[#6b6b80]">
                <ShieldCheck size={17} className="text-[#4fd1c5]" />
                <span>Private by design. Focused by AI.</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex min-h-0 items-center justify-center overflow-hidden px-1 py-5 sm:px-6 md:px-3 lg:px-6">
          <form
            className="w-full max-w-xl"
            onSubmit={isLogin ? handleLogin : handleRegister}
            noValidate
          >
            <div className="mb-7">
              <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#7c6af7]">
                {isLogin ? "Candidate workspace" : "Profile setup · 01 / 02"}
              </p>
              <h2 className="text-4xl font-bold tracking-tight text-[#e8e8f0] sm:text-5xl">
                {isLogin ? "Welcome back" : "Start your search"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#6b6b80]">
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

            {!isLogin && (
              <div className="mt-5 flex items-start gap-3 rounded-lg border border-[#7c6af7]/15 bg-[#7c6af7]/[0.06] px-3.5 py-3 text-xs leading-5 text-[#8f8aa8]">
                <Sparkles size={16} className="mt-0.5 shrink-0 text-[#7c6af7]" />
                <span>
                  Your profile becomes the signal we use to surface roles that fit your experience.
                </span>
              </div>
            )}

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
            {!isLogin && (
              <p className="mt-4 text-center font-mono text-[0.65rem] leading-5 text-[#6b6b80]">
                By creating an account, you keep control of your profile and job preferences.
              </p>
            )}
          </form>
        </section>
      </main>
    </div>
  );
};
