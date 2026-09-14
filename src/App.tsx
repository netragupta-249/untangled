import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen =
  | "welcome"
  | "personalization"
  | "sources"
  | "processing"
  | "dashboard"
  | "update-detail"
  | "conflict-detail"
  | "all-updates";

type NavItem = "overview" | "actions" | "schedule" | "opportunities" | "updates" | "sources";
type Priority = "urgent" | "important" | "upcoming" | "opportunity" | "missing";

// ─── Icons (inline SVG) ────────────────────────────────────────────────────────
function IconArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7.5l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 6l7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconMessage() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M15 2H3a1 1 0 00-1 1v9a1 1 0 001 1h2v3l4-3h6a1 1 0 001-1V3a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2a5 5 0 00-5 5v3L2 12h14l-2-2V7a5 5 0 00-5-5zM7 14a2 2 0 004 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconBuilding() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="3" y="3" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 9h6M6 12h6M6 6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="7" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 15c0-3 2.5-5 5-5s5 2 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 7a3 3 0 010 6M15.5 15c0-2.5-1.5-4-3.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function IconFilter() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M2 4h11M4.5 7.5h6M7 11h1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function IconInfo() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7.5 10V7M7.5 5v-.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconClose() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Priority Badge ────────────────────────────────────────────────────────────
function PriorityBadge({ level, small }: { level: Priority; small?: boolean }) {
  const map: Record<Priority, { label: string; cls: string }> = {
    urgent: { label: "Urgent", cls: "bg-red-50 text-red-600 border border-red-100" },
    important: { label: "Important", cls: "bg-amber-50 text-amber-600 border border-amber-100" },
    upcoming: { label: "Upcoming", cls: "bg-slate-100 text-slate-500 border border-slate-200" },
    opportunity: { label: "Opportunity", cls: "bg-emerald-50 text-emerald-600 border border-emerald-100" },
    missing: { label: "Missing info", cls: "bg-orange-50 text-orange-500 border border-orange-100" },
  };
  const { label, cls } = map[level];
  return (
    <span className={`inline-flex items-center font-mono ${small ? "text-[10px] px-1.5 py-0.5" : "text-[11px] px-2 py-0.5"} rounded-full font-medium tracking-wide ${cls}`}>
      {level === "urgent" && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1 animate-pulse" />}
      {label}
    </span>
  );
}

// ─── Source Chip ───────────────────────────────────────────────────────────────
function SourceChip({ source }: { source: string }) {
  const icons: Record<string, React.ReactNode> = {
    "College Email": <IconMail />,
    "Class Groups": <IconMessage />,
    "Society Channels": <IconUsers />,
    "College Notices": <IconBuilding />,
  };
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
      <span className="opacity-60">{icons[source] ?? <IconBell />}</span>
      {source}
    </span>
  );
}

// ─── SCREEN 1: Welcome ─────────────────────────────────────────────────────────
function WelcomeScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen bg-[#0E0E16] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(#5B4FE8 1px, transparent 1px), linear-gradient(90deg, #5B4FE8 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Glow orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#5B4FE8] opacity-[0.08] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#8B7FF0] opacity-[0.06] blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto px-8">
        {/* Logo mark */}
        <div className="animate-float mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5B4FE8] to-[#8B7FF0] flex items-center justify-center shadow-2xl shadow-[#5B4FE8]/30">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 10c0-2 1.5-4 4-4h8c2.5 0 4 2 4 4M8 22c0 2 1.5 4 4 4h8c2.5 0 4-2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M10 16h12M13 12l3 4-3 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Wordmark */}
        <h1 className="text-5xl font-[DM_Serif_Display,serif] text-white mb-3 tracking-tight">
          Untangled
        </h1>

        {/* Tagline */}
        <p className="text-lg text-[#8B7FF0] font-medium mb-6 tracking-wide">
          50 messages. One clear plan.
        </p>

        {/* Description */}
        <p className="text-[#9090A8] text-base leading-relaxed mb-12 max-w-md">
          Turn campus noise into clear actions, deadlines and opportunities.
        </p>

        {/* CTA */}
        <button
          onClick={onNext}
          className="group px-10 py-4 bg-[#5B4FE8] hover:bg-[#4B40D8] text-white font-semibold text-base rounded-xl transition-all duration-200 shadow-2xl shadow-[#5B4FE8]/40 hover:shadow-[#5B4FE8]/60 hover:scale-[1.02] active:scale-[0.98] mb-6"
        >
          Untangle my updates
          <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
        </button>

        <p className="text-[#5A5A72] text-sm">
          Connect your campus sources and let AI organize the noise.
        </p>

        {/* Bottom source pills */}
        <div className="flex items-center gap-3 mt-12 flex-wrap justify-center">
          {["College Email", "Class Groups", "Society Channels", "College Notices"].map((s) => (
            <span key={s} className="text-xs text-[#5A5A72] border border-[#2A2A3A] px-3 py-1.5 rounded-full">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 2: Personalization ─────────────────────────────────────────────────
function PersonalizationScreen({ onNext }: { onNext: () => void }) {
  const [year, setYear] = useState("First Year");
  const [branch, setBranch] = useState("Computer Science & Engineering");
  const [interests, setInterests] = useState(["AI", "Coding", "Hackathons", "Workshops"]);
  const [notifs, setNotifs] = useState({ urgent: true, opportunities: true, conflicts: true, daily: false });

  const allInterests = ["AI", "Coding", "Hackathons", "Workshops", "Research", "Sports", "Music", "Design", "Entrepreneurship", "Open Source"];

  function toggleInterest(i: string) {
    setInterests((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  }

  return (
    <div className="min-h-screen bg-[#F6F6F9] flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5B4FE8] to-[#8B7FF0] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                <path d="M8 10c0-2 1.5-4 4-4h8c2.5 0 4 2 4 4M8 22c0 2 1.5 4 4 4h8c2.5 0 4-2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M10 16h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-semibold text-[#0E0E16]">Untangled</span>
          </div>
          <h2 className="text-3xl font-[DM_Serif_Display,serif] text-[#0E0E16] mb-2">
            Make Untangled relevant to you
          </h2>
          <p className="text-[#6B6B80] text-sm">This helps us prioritize what matters to you specifically.</p>
        </div>

        <div className="space-y-5">
          {/* Year */}
          <div className="bg-white rounded-2xl border border-[#E4E4EF] p-5">
            <label className="block text-xs font-semibold text-[#6B6B80] uppercase tracking-widest mb-3">Year of Study</label>
            <div className="flex gap-2 flex-wrap">
              {["First Year", "Second Year", "Third Year", "Fourth Year"].map((y) => (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${year === y ? "bg-[#5B4FE8] text-white" : "bg-[#F6F6F9] text-[#6B6B80] hover:bg-[#EEEEF8]"}`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Branch */}
          <div className="bg-white rounded-2xl border border-[#E4E4EF] p-5">
            <label className="block text-xs font-semibold text-[#6B6B80] uppercase tracking-widest mb-3">Branch / Department</label>
            <div className="flex gap-2 flex-wrap">
              {["Computer Science & Engineering", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering", "Information Technology"].map((b) => (
                <button
                  key={b}
                  onClick={() => setBranch(b)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${branch === b ? "bg-[#5B4FE8] text-white" : "bg-[#F6F6F9] text-[#6B6B80] hover:bg-[#EEEEF8]"}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white rounded-2xl border border-[#E4E4EF] p-5">
            <label className="block text-xs font-semibold text-[#6B6B80] uppercase tracking-widest mb-3">
              Interests <span className="normal-case font-normal text-[#9090A8]">— select all that apply</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {allInterests.map((i) => (
                <button
                  key={i}
                  onClick={() => toggleInterest(i)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${interests.includes(i) ? "bg-[#5B4FE8] text-white" : "bg-[#F6F6F9] text-[#6B6B80] hover:bg-[#EEEEF8]"}`}
                >
                  {interests.includes(i) && <span className="mr-1">✓</span>}
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-[#E4E4EF] p-5">
            <label className="block text-xs font-semibold text-[#6B6B80] uppercase tracking-widest mb-3">Notification Preferences</label>
            <div className="space-y-3">
              {([
                ["urgent", "Urgent actions and deadlines"],
                ["opportunities", "New opportunities (hackathons, scholarships)"],
                ["conflicts", "Schedule conflicts detected"],
                ["daily", "Daily digest summary"],
              ] as [keyof typeof notifs, string][]).map(([key, label]) => (
                <label key={key} className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm text-[#3E3E56]">{label}</span>
                  <div
                    onClick={() => setNotifs((p) => ({ ...p, [key]: !p[key] }))}
                    className={`w-10 h-5 rounded-full transition-all relative ${notifs[key] ? "bg-[#5B4FE8]" : "bg-[#D8D8E8]"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${notifs[key] ? "left-5" : "left-0.5"} shadow-sm`} />
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full mt-6 py-4 bg-[#5B4FE8] hover:bg-[#4B40D8] text-white font-semibold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[#5B4FE8]/20"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

// ─── SCREEN 3: Connected Sources ───────────────────────────────────────────────
function SourcesScreen({ onNext }: { onNext: () => void }) {
  const sources = [
    { name: "College Email", icon: <IconMail />, updates: 23, time: "2 min ago", color: "#5B4FE8" },
    { name: "Class Groups", icon: <IconMessage />, updates: 47, time: "5 min ago", color: "#059669" },
    { name: "Society Channels", icon: <IconUsers />, updates: 18, time: "12 min ago", color: "#D97706" },
    { name: "College Notices", icon: <IconBuilding />, updates: 12, time: "1 hr ago", color: "#DC2626" },
  ];

  return (
    <div className="min-h-screen bg-[#F6F6F9] flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5B4FE8] to-[#8B7FF0] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
              <path d="M8 10c0-2 1.5-4 4-4h8c2.5 0 4 2 4 4M8 22c0 2 1.5 4 4 4h8c2.5 0 4-2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M10 16h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-semibold text-[#0E0E16]">Untangled</span>
        </div>

        <h2 className="text-3xl font-[DM_Serif_Display,serif] text-[#0E0E16] mb-2">Your campus sources</h2>
        <p className="text-[#6B6B80] text-sm mb-8">All sources connected and synced.</p>

        <div className="space-y-3">
          {sources.map((s) => (
            <div key={s.name} className="bg-white rounded-2xl border border-[#E4E4EF] p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.color + "15", color: s.color }}>
                {s.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm text-[#0E0E16]">{s.name}</span>
                  <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Connected
                  </span>
                </div>
                <p className="text-xs text-[#9090A8]">Last synced {s.time}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-[#0E0E16]">{s.updates}</div>
                <div className="text-xs text-[#9090A8]">new updates</div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-4 bg-[#F0F0F8] rounded-xl px-5 py-3 flex items-center justify-between">
          <span className="text-sm text-[#6B6B80]">Total updates to process</span>
          <span className="text-2xl font-bold text-[#5B4FE8]">100</span>
        </div>

        <button
          onClick={onNext}
          className="w-full mt-6 py-4 bg-[#5B4FE8] hover:bg-[#4B40D8] text-white font-semibold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[#5B4FE8]/20 text-base"
        >
          Sync all updates
        </button>
        <p className="text-center text-xs text-[#9090A8] mt-3">This is a simulated prototype. No real data is accessed.</p>
      </div>
    </div>
  );
}

// ─── SCREEN 4: AI Processing ───────────────────────────────────────────────────
function ProcessingScreen({ onNext }: { onNext: () => void }) {
  const steps = [
    { label: "100 announcements received", delay: 0 },
    { label: "67 unique updates found", delay: 900 },
    { label: "12 duplicate announcements grouped", delay: 1800 },
    { label: "5 urgent actions identified", delay: 2700 },
    { label: "2 schedule conflicts detected", delay: 3600 },
    { label: "8 opportunities discovered", delay: 4500 },
    { label: "3 information gaps detected", delay: 5400 },
  ];

  const [visible, setVisible] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    steps.forEach((s, i) => {
      setTimeout(() => setVisible((p) => [...p, i]), s.delay + 600);
    });
    setTimeout(() => setDone(true), 6800);
  }, []);

  return (
    <div className="min-h-screen bg-[#0E0E16] flex items-center justify-center px-6">
      <div className="w-full max-w-lg text-center">
        {/* Animated logo */}
        <div className="relative w-20 h-20 mx-auto mb-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#5B4FE8] to-[#8B7FF0] flex items-center justify-center shadow-2xl shadow-[#5B4FE8]/40">
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
              <path d="M8 10c0-2 1.5-4 4-4h8c2.5 0 4 2 4 4M8 22c0 2 1.5 4 4 4h8c2.5 0 4-2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M10 16h12M13 12l3 4-3 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {/* Orbit ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-28 h-28 rounded-full border border-[#5B4FE8]/20 animate-spin" style={{ animationDuration: "3s" }}>
              <div className="w-3 h-3 rounded-full bg-[#8B7FF0] -mt-1.5 mx-auto" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-[DM_Serif_Display,serif] text-white mb-2">
          Untangling your campus updates…
        </h2>
        <p className="text-[#5A5A72] text-sm mb-10">Processing 100 announcements from 4 sources</p>

        {/* Steps */}
        <div className="space-y-3 text-left mb-10">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 transition-all duration-500 ${visible.includes(i) ? "opacity-100" : "opacity-0 translate-y-2"}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${visible.includes(i) ? "bg-[#5B4FE8]" : "bg-[#2A2A3A]"}`}>
                {visible.includes(i) && <IconCheck />}
              </div>
              <span className="text-sm text-[#C4C4D4] font-medium">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#2A2A3A] rounded-full h-1.5 mb-8">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-[#5B4FE8] to-[#8B7FF0] transition-all duration-700"
            style={{ width: `${Math.min(100, (visible.length / steps.length) * 100)}%` }}
          />
        </div>

        <p className="text-[#4A4A62] text-xs leading-relaxed mb-8 max-w-sm mx-auto">
          Untangled groups repeated information, extracts deadlines, detects conflicts and identifies actions without inventing missing details.
        </p>

        {done && (
          <button
            onClick={onNext}
            className="animate-slide-in px-10 py-3.5 bg-[#5B4FE8] hover:bg-[#4B40D8] text-white font-semibold rounded-xl transition-all shadow-xl shadow-[#5B4FE8]/30"
          >
            View my action plan →
          </button>
        )}
      </div>
    </div>
  );
}

// ─── DASHBOARD ─────────────────────────────────────────────────────────────────
interface Task {
  id: string;
  title: string;
  deadline: string;
  priority: Priority;
  source: string;
  details?: string;
}

const TASKS: Task[] = [
  { id: "1", title: "Register for AI Workshop", deadline: "Today · 8:00 PM", priority: "urgent", source: "College Email", details: "12 seats remaining" },
  { id: "2", title: "Submit scholarship application", deadline: "Today · 11:59 PM", priority: "urgent", source: "College Notices" },
  { id: "3", title: "Check replacement DBMS classroom", deadline: "Tomorrow · 9:00 AM", priority: "important", source: "Class Groups" },
  { id: "4", title: "Complete Coding Society registration", deadline: "Deadline not mentioned", priority: "missing", source: "Society Channels" },
  { id: "5", title: "Register for National Hackathon", deadline: "Sep 25", priority: "upcoming", source: "College Email" },
];

function ActionPlan({ onViewDetail }: { onViewDetail: (id: string) => void }) {
  const [checked, setChecked] = useState<string[]>([]);

  return (
    <div className="bg-white rounded-2xl border border-[#E4E4EF] overflow-hidden">
      <div className="px-6 py-5 border-b border-[#F0F0F5]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-[DM_Serif_Display,serif] text-[#0E0E16]">Your Action Plan</h3>
            <p className="text-sm text-[#9090A8] mt-0.5">{TASKS.length - checked.length} things need your attention</p>
          </div>
          <span className="text-xs font-mono text-[#5B4FE8] bg-[#EEECFd] px-2.5 py-1 rounded-lg font-medium">
            {checked.length}/{TASKS.length} done
          </span>
        </div>
      </div>
      <div className="divide-y divide-[#F6F6F9]">
        {TASKS.map((task) => {
          const done = checked.includes(task.id);
          return (
            <div
              key={task.id}
              className={`px-6 py-4 flex items-center gap-4 transition-colors group hover:bg-[#FAFAFD] ${done ? "opacity-50" : ""}`}
            >
              <input
                type="checkbox"
                className="task-checkbox"
                checked={done}
                onChange={() => setChecked((p) => p.includes(task.id) ? p.filter((x) => x !== task.id) : [...p, task.id])}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`font-semibold text-sm text-[#0E0E16] ${done ? "line-through text-[#9090A8]" : ""}`}>
                    {task.title}
                  </span>
                  <PriorityBadge level={task.priority} small />
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-xs font-mono ${task.priority === "urgent" ? "text-red-500 font-semibold" : task.priority === "missing" ? "text-orange-400" : "text-[#9090A8]"}`}>
                    {task.deadline}
                  </span>
                  {task.details && (
                    <span className="text-xs text-[#9090A8] bg-[#F6F6F9] px-2 py-0.5 rounded">{task.details}</span>
                  )}
                  <SourceChip source={task.source} />
                </div>
              </div>
              <button
                onClick={() => onViewDetail(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-lg hover:bg-[#F0F0F8] flex items-center justify-center text-[#9090A8] hover:text-[#5B4FE8]"
              >
                <IconArrow />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NeedsAttention({ onViewDetail }: { onViewDetail: (id: string) => void }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#6B6B80] uppercase tracking-widest mb-3">Needs Attention</h3>
      <div className="grid grid-cols-1 gap-3">
        {/* Urgent card */}
        <div className="bg-white rounded-2xl border border-red-100 p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500 rounded-l-2xl" />
          <div className="pl-2">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-[#0E0E16]">AI Workshop</span>
                  <PriorityBadge level="urgent" small />
                </div>
                <p className="text-sm text-[#3E3E56]">Registration closes <strong>today at 8:00 PM</strong></p>
                <p className="text-xs text-red-500 mt-1 font-medium">12 seats remaining</p>
              </div>
              <SourceChip source="College Email" />
            </div>
            <button
              onClick={() => onViewDetail("1")}
              className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Register now
            </button>
          </div>
        </div>

        {/* Important card */}
        <div className="bg-white rounded-2xl border border-[#E4E4EF] p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 rounded-l-2xl" />
          <div className="pl-2 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-[#0E0E16]">DBMS Class Cancelled</span>
                <PriorityBadge level="important" small />
              </div>
              <p className="text-sm text-[#3E3E56]">Tomorrow's 10:00 AM class has been cancelled.</p>
              <p className="text-xs text-[#9090A8] mt-1">No action required</p>
            </div>
            <SourceChip source="Class Groups" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ConflictSection({ onViewConflict }: { onViewConflict: () => void }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#6B6B80] uppercase tracking-widest mb-3">Schedule Conflicts</h3>
      <div className="bg-white rounded-2xl border border-[#E4E4EF] p-5">
        <div className="flex items-start gap-4 mb-4">
          {/* Timeline */}
          <div className="flex flex-col items-center gap-0">
            <div className="text-xs font-mono text-[#9090A8] mb-1">3 PM</div>
            <div className="w-2 h-16 rounded-full bg-[#5B4FE8]" />
            <div className="text-xs font-mono text-[#9090A8] mt-1">5 PM</div>
          </div>
          <div className="flex flex-col items-center gap-0 -ml-2">
            <div className="text-xs font-mono text-[#9090A8] mb-1">4 PM</div>
            <div className="w-2 h-16 rounded-full bg-amber-400" />
            <div className="text-xs font-mono text-[#9090A8] mt-1">6 PM</div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5B4FE8]" />
              <span className="text-sm font-semibold text-[#0E0E16]">AI Workshop</span>
              <span className="text-xs font-mono text-[#9090A8]">3:00–5:00 PM</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-sm font-semibold text-[#0E0E16]">Coding Society Meeting</span>
              <span className="text-xs font-mono text-[#9090A8]">4:00–6:00 PM</span>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">
              <span className="text-xs text-red-600 font-semibold">Overlap: 4:00 PM – 5:00 PM</span>
            </div>
            <p className="text-xs text-[#9090A8] leading-relaxed">
              These commitments overlap. Untangled does not decide which one you should attend.
            </p>
          </div>
        </div>
        <button
          onClick={onViewConflict}
          className="w-full py-2.5 border border-[#E4E4EF] hover:border-[#5B4FE8] hover:text-[#5B4FE8] text-sm font-medium text-[#6B6B80] rounded-xl transition-colors"
        >
          Review conflict →
        </button>
      </div>
    </div>
  );
}

function UpcomingSection() {
  const items = [
    { title: "Coding Society Meeting", date: "Sep 18", priority: "upcoming" as Priority },
    { title: "Scholarship Application", date: "Sep 20", priority: "important" as Priority },
    { title: "National Hackathon", date: "Sep 25", priority: "opportunity" as Priority },
  ];
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#6B6B80] uppercase tracking-widest mb-3">Upcoming</h3>
      <div className="bg-white rounded-2xl border border-[#E4E4EF] divide-y divide-[#F6F6F9]">
        {items.map((item) => (
          <div key={item.title} className="px-5 py-3.5 flex items-center gap-3">
            <div className="text-center min-w-[40px]">
              <div className="text-xs font-mono text-[#5B4FE8] font-bold">{item.date.split(" ")[1]}</div>
              <div className="text-[10px] text-[#9090A8] uppercase">{item.date.split(" ")[0]}</div>
            </div>
            <div className="w-px h-8 bg-[#E4E4EF]" />
            <span className="flex-1 text-sm font-medium text-[#0E0E16]">{item.title}</span>
            <PriorityBadge level={item.priority} small />
          </div>
        ))}
      </div>
    </div>
  );
}

function OpportunitiesSection() {
  const items = [
    { title: "AI Workshop", date: "Today", cat: "Workshop", source: "College Email", seats: "12 seats" },
    { title: "Coding Society Recruitment", date: "Sep 18", cat: "Society", source: "Society Channels", seats: null },
    { title: "National Hackathon", date: "Sep 25", cat: "Hackathon", source: "College Email", seats: null },
    { title: "Research Internship Talk", date: "Sep 22", cat: "Career", source: "College Notices", seats: "30 seats" },
  ];
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#6B6B80] uppercase tracking-widest mb-3">Opportunities</h3>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div key={item.title} className="bg-white rounded-2xl border border-[#E4E4EF] p-4 hover:border-[#5B4FE8]/30 transition-colors group">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                {item.cat}
              </span>
              {item.seats && (
                <span className="text-[10px] text-orange-500 font-mono font-semibold">{item.seats}</span>
              )}
            </div>
            <p className="font-semibold text-sm text-[#0E0E16] mb-1">{item.title}</p>
            <p className="text-xs font-mono text-[#9090A8] mb-3">{item.date}</p>
            <div className="flex items-center justify-between">
              <SourceChip source={item.source} />
              <button className="text-xs text-[#5B4FE8] font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                Explore <IconArrow />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoGapsSection() {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#6B6B80] uppercase tracking-widest mb-3">Information Gaps</h3>
      <div className="space-y-3">
        {[
          { title: "Coding Society Recruitment", gap: "Deadline not mentioned in the announcement." },
          { title: "Research Internship Talk", gap: "Registration link not provided in the notice." },
          { title: "Technical Fest Registration", gap: "Venue and time not confirmed yet." },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-xl border border-[#E4E4EF] p-4 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-orange-400">
              <IconInfo />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-[#0E0E16] mb-0.5">{item.title}</p>
              <p className="text-xs text-[#9090A8] mb-2 italic">"{item.gap}"</p>
              <span className="text-[10px] font-mono text-orange-500 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full font-medium">
                Missing information
              </span>
            </div>
            <button className="text-xs text-[#6B6B80] hover:text-[#5B4FE8] font-medium transition-colors whitespace-nowrap">
              View original
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function OverviewPanel({ onViewDetail, onViewConflict }: { onViewDetail: (id: string) => void; onViewConflict: () => void }) {
  return (
    <div className="space-y-6">
      <ActionPlan onViewDetail={onViewDetail} />
      <NeedsAttention onViewDetail={onViewDetail} />
      <ConflictSection onViewConflict={onViewConflict} />
      <UpcomingSection />
      <OpportunitiesSection />
      <InfoGapsSection />
    </div>
  );
}

function AllUpdatesPanel() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filters = ["All", "Urgent", "Important", "Upcoming", "Opportunities", "No Action Required"];

  const updates = [
    {
      id: "u1", title: "AI Workshop", priority: "urgent" as Priority, deadline: "Today · 8:00 PM",
      sources: ["College Email", "Society Channels", "Class Groups"], grouped: 3, action: true,
    },
    {
      id: "u2", title: "Scholarship Application Deadline", priority: "urgent" as Priority, deadline: "Today · 11:59 PM",
      sources: ["College Notices"], grouped: 1, action: true,
    },
    {
      id: "u3", title: "DBMS Class Cancelled Tomorrow", priority: "important" as Priority, deadline: "Tomorrow · 10:00 AM",
      sources: ["Class Groups"], grouped: 1, action: false,
    },
    {
      id: "u4", title: "Coding Society Recruitment", priority: "opportunity" as Priority, deadline: "Deadline TBA",
      sources: ["Society Channels"], grouped: 2, action: true,
    },
    {
      id: "u5", title: "National Hackathon Registration", priority: "upcoming" as Priority, deadline: "Sep 25",
      sources: ["College Email"], grouped: 1, action: true,
    },
    {
      id: "u6", title: "Research Internship Talk", priority: "opportunity" as Priority, deadline: "Sep 22",
      sources: ["College Notices", "College Email"], grouped: 2, action: false,
    },
    {
      id: "u7", title: "Library Hours Extended", priority: "upcoming" as Priority, deadline: "Ongoing",
      sources: ["College Notices"], grouped: 1, action: false,
    },
  ];

  const filtered = updates.filter((u) => {
    const matchSearch = u.title.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === "All") return true;
    if (filter === "Urgent") return u.priority === "urgent";
    if (filter === "Important") return u.priority === "important";
    if (filter === "Upcoming") return u.priority === "upcoming";
    if (filter === "Opportunities") return u.priority === "opportunity";
    if (filter === "No Action Required") return !u.action;
    return true;
  });

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-[DM_Serif_Display,serif] text-[#0E0E16] mb-1">All Updates</h3>
        <p className="text-sm text-[#9090A8]">67 unique updates from 100 announcements</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9090A8]"><IconSearch /></span>
        <input
          type="text"
          placeholder="Search updates…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-[#E4E4EF] rounded-xl outline-none focus:border-[#5B4FE8] focus:ring-2 focus:ring-[#5B4FE8]/10 transition-all"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? "bg-[#5B4FE8] text-white" : "bg-white border border-[#E4E4EF] text-[#6B6B80] hover:border-[#5B4FE8]/40"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Updates list */}
      <div className="space-y-2">
        {filtered.map((u) => (
          <div key={u.id} className="bg-white rounded-2xl border border-[#E4E4EF] p-4 hover:shadow-sm transition-shadow group">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-sm text-[#0E0E16]">{u.title}</span>
                  <PriorityBadge level={u.priority} small />
                  {!u.action && (
                    <span className="text-[10px] text-[#9090A8] bg-[#F6F6F9] border border-[#E4E4EF] px-2 py-0.5 rounded-full font-medium">
                      No action required
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <span className="text-xs font-mono text-[#9090A8]">{u.deadline}</span>
                  {u.grouped > 1 && (
                    <span className="text-xs text-[#5B4FE8] font-medium">{u.grouped} announcements grouped</span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-[#9090A8]">Mentioned by:</span>
                  {u.sources.map((s) => <SourceChip key={s} source={s} />)}
                </div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 text-xs font-medium text-[#5B4FE8] border border-[#5B4FE8]/30 hover:bg-[#5B4FE8] hover:text-white rounded-lg transition-all">
                View details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SourcesPanel() {
  const sources = [
    { name: "College Email", icon: <IconMail />, updates: 23, time: "2 min ago", color: "#5B4FE8", synced: true },
    { name: "Class Groups", icon: <IconMessage />, updates: 47, time: "5 min ago", color: "#059669", synced: true },
    { name: "Society Channels", icon: <IconUsers />, updates: 18, time: "12 min ago", color: "#D97706", synced: true },
    { name: "College Notices", icon: <IconBuilding />, updates: 12, time: "1 hr ago", color: "#DC2626", synced: true },
  ];
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-[DM_Serif_Display,serif] text-[#0E0E16] mb-1">Connected Sources</h3>
        <p className="text-sm text-[#9090A8]">4 sources connected · 100 total updates</p>
      </div>
      <div className="space-y-3">
        {sources.map((s) => (
          <div key={s.name} className="bg-white rounded-2xl border border-[#E4E4EF] p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: s.color + "15", color: s.color }}>
              {s.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-semibold text-sm text-[#0E0E16]">{s.name}</span>
                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Connected
                </span>
              </div>
              <p className="text-xs text-[#9090A8]">Last synced {s.time}</p>
            </div>
            <div className="text-right mr-4">
              <div className="text-xl font-bold text-[#0E0E16]">{s.updates}</div>
              <div className="text-xs text-[#9090A8]">updates</div>
            </div>
            <button className="px-4 py-2 text-xs font-semibold border border-[#E4E4EF] hover:border-[#5B4FE8] hover:text-[#5B4FE8] rounded-lg transition-colors text-[#6B6B80]">
              Sync now
            </button>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-center text-[#9090A8]">This is a simulated prototype. No real external data is accessed.</p>
    </div>
  );
}

// ─── SCREEN 5: Main Dashboard ──────────────────────────────────────────────────
function DashboardScreen({
  onViewDetail,
  onViewConflict,
  onViewAllUpdates,
}: {
  onViewDetail: (id: string) => void;
  onViewConflict: () => void;
  onViewAllUpdates: () => void;
}) {
  const [nav, setNav] = useState<NavItem>("overview");

  const navItems: { id: NavItem; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" /><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" /><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" /><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" /></svg> },
    { id: "actions", label: "Action List", icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M3 8h10M3 12h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M11 11l1.5 1.5L15 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg> },
    { id: "schedule", label: "Schedule", icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M5 2v2M11 2v2M2 7h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg> },
    { id: "opportunities", label: "Opportunities", icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,2 10,6 14,6 11,9 12,13 8,11 4,13 5,9 2,6 6,6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg> },
    { id: "updates", label: "All Updates", icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 3H3a1 1 0 00-1 1v7a1 1 0 001 1h2l2 2 2-2h4a1 1 0 001-1V4a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg> },
    { id: "sources", label: "Sources", icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" /><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.22 3.22l1.42 1.42M11.36 11.36l1.42 1.42M11.36 4.64l1.42-1.42M3.22 12.78l1.42-1.42" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg> },
  ];

  function renderContent() {
    if (nav === "overview") return <OverviewPanel onViewDetail={onViewDetail} onViewConflict={onViewConflict} />;
    if (nav === "actions") return <ActionPlan onViewDetail={onViewDetail} />;
    if (nav === "schedule") return (
      <div className="space-y-4">
        <div className="mb-2">
          <h3 className="text-xl font-[DM_Serif_Display,serif] text-[#0E0E16] mb-1">Schedule</h3>
          <p className="text-sm text-[#9090A8]">Your upcoming commitments</p>
        </div>
        <ConflictSection onViewConflict={onViewConflict} />
        <UpcomingSection />
      </div>
    );
    if (nav === "opportunities") return (
      <div className="space-y-4">
        <div className="mb-2">
          <h3 className="text-xl font-[DM_Serif_Display,serif] text-[#0E0E16] mb-1">Opportunities</h3>
          <p className="text-sm text-[#9090A8]">Important opportunities, always visible</p>
        </div>
        <OpportunitiesSection />
        <InfoGapsSection />
      </div>
    );
    if (nav === "updates") return <AllUpdatesPanel />;
    if (nav === "sources") return <SourcesPanel />;
    return null;
  }

  return (
    <div className="h-screen flex bg-[#F6F6F9] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0E0E16] flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-[#1E1E2A]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5B4FE8] to-[#8B7FF0] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                <path d="M8 10c0-2 1.5-4 4-4h8c2.5 0 4 2 4 4M8 22c0 2 1.5 4 4 4h8c2.5 0 4-2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M10 16h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-[DM_Serif_Display,serif] text-white text-base tracking-tight">Untangled</span>
          </div>
        </div>

        {/* Stats pill */}
        <div className="mx-3 mt-4 bg-[#1A1A2A] rounded-xl px-3 py-3">
          <div className="flex justify-between text-xs text-[#5A5A72] mb-1.5">
            <span>Updates processed</span>
            <span className="text-[#8B7FF0] font-semibold">100</span>
          </div>
          <div className="w-full bg-[#2A2A3A] rounded-full h-1">
            <div className="h-1 rounded-full bg-gradient-to-r from-[#5B4FE8] to-[#8B7FF0] w-[67%]" />
          </div>
          <div className="text-[10px] text-[#4A4A62] mt-1">67 unique · 12 grouped · 5 urgent</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                nav === item.id
                  ? "bg-[#5B4FE8] text-white"
                  : "text-[#6A6A88] hover:text-[#C4C4D4] hover:bg-[#1A1A2A]"
              }`}
            >
              {item.icon}
              {item.label}
              {item.id === "actions" && (
                <span className="ml-auto text-[10px] bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold">5</span>
              )}
            </button>
          ))}
        </nav>

        {/* Profile */}
        <div className="px-3 py-4 border-t border-[#1E1E2A]">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5B4FE8] to-[#8B7FF0] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              A
            </div>
            <div>
              <p className="text-xs font-semibold text-[#C4C4D4]">Arjun Kumar</p>
              <p className="text-[10px] text-[#4A4A62]">CSE · First Year</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-[#E4E4EF] flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-[#9090A8]">
            <span className="text-[#0E0E16] font-medium">Good afternoon 👋</span>
            <span>·</span>
            <span>We've untangled 50 updates for you.</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-8 h-8 rounded-lg hover:bg-[#F6F6F9] flex items-center justify-center text-[#6B6B80] transition-colors">
              <IconBell />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5B4FE8] to-[#8B7FF0] flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {renderContent()}
          <div className="h-8" />
        </div>
      </main>
    </div>
  );
}

// ─── SCREEN 6: Update Detail ───────────────────────────────────────────────────
function UpdateDetailScreen({ taskId, onBack }: { taskId: string; onBack: () => void }) {
  const task = TASKS.find((t) => t.id === taskId) ?? TASKS[0];

  const originalAnnouncements: Record<string, string> = {
    "1": "📢 AI Workshop — Registration Open!\n\nDear Students,\n\nThe AI & ML Club is hosting an intensive AI Workshop on September 18th from 3:00 PM to 5:00 PM at Lab 204, CS Block.\n\nTopics covered: Intro to Neural Networks, Hands-on PyTorch, Computer Vision basics.\n\nRegistration is FREE but seats are limited to 12. Register by today at 8:00 PM.\n\nLink: [forms.college.edu/ai-workshop]\n\n— AI & ML Club",
    "2": "REMINDER: State Scholarship Application Deadline\n\nAll eligible students are reminded to complete their scholarship applications before 11:59 PM today.\n\nRequired documents: income certificate, marksheets, bank details.\n\nPortal: scholarship.state.gov.in\n\n— Academic Office",
    "3": "Important: DBMS Lab Cancelled Tomorrow\n\nDue to Prof. Sharma's absence, the DBMS lab session scheduled for tomorrow (Sep 13) at 10:00 AM has been cancelled.\n\nA replacement class will be held in Room 302 at 9:00 AM instead of the usual Lab 102. Please check the updated timetable.\n\n— Department Office",
    "4": "📣 Coding Society Recruitment!\n\nCoding Society is now recruiting new members for 2024-25. Interested students can fill the form linked below. All branches and years are welcome.\n\n[Join the society]\n\n— Coding Society",
    "5": "National Hackathon — Team Registration\n\nRegister your team of 2-4 for the National Level Hackathon on September 25.\n\nPrize pool: ₹1,00,000. Problem statements will be revealed on the day.\n\nDeadline: Sep 20 (Extended)\n\n— Hackathon Cell",
  };

  return (
    <div className="min-h-screen bg-[#F6F6F9]">
      {/* Header */}
      <header className="bg-white border-b border-[#E4E4EF] px-8 py-4 flex items-center gap-4">
        <button onClick={onBack} className="w-8 h-8 rounded-lg hover:bg-[#F6F6F9] flex items-center justify-center text-[#6B6B80] transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5B4FE8] to-[#8B7FF0] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
              <path d="M8 10c0-2 1.5-4 4-4h8c2.5 0 4 2 4 4M8 22c0 2 1.5 4 4 4h8c2.5 0 4-2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M10 16h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-[DM_Serif_Display,serif] text-[#0E0E16] text-base">Untangled</span>
        </div>
        <span className="text-[#D8D8E8]">/</span>
        <span className="text-sm text-[#6B6B80]">{task.title}</span>
      </header>

      <div className="max-w-2xl mx-auto px-8 py-8">
        {/* Title block */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <PriorityBadge level={task.priority} />
            <SourceChip source={task.source} />
          </div>
          <h1 className="text-3xl font-[DM_Serif_Display,serif] text-[#0E0E16] mb-2">{task.title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#9090A8]">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <span className={`text-sm font-mono font-semibold ${task.priority === "urgent" ? "text-red-500" : "text-[#6B6B80]"}`}>
                {task.deadline}
              </span>
            </div>
            {task.details && (
              <span className="text-sm text-orange-500 font-medium">{task.details}</span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Action */}
          {task.priority === "urgent" && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
              <p className="text-xs font-semibold text-red-500 uppercase tracking-widest mb-1">Action Required</p>
              <p className="text-sm text-[#3E3E56]">Register before the deadline to secure your spot.</p>
              <button className="mt-3 px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors">
                Register now
              </button>
            </div>
          )}

          {/* Why prioritized */}
          <div className="bg-white rounded-2xl border border-[#E4E4EF] p-5">
            <p className="text-xs font-semibold text-[#9090A8] uppercase tracking-widest mb-2">Why is this prioritized?</p>
            <p className="text-sm text-[#3E3E56] leading-relaxed">
              {task.priority === "urgent"
                ? "Registration closes today and seats are limited. Untangled flagged this because both time and availability constraints make this time-sensitive."
                : task.priority === "missing"
                ? "This opportunity is relevant to your interests but has missing deadline information. Untangled cannot determine urgency without a deadline."
                : "This event is upcoming and action may be required before the deadline. Matches your interests in " + task.source + "."}
            </p>
          </div>

          {/* What/Why/Do/When/Where */}
          <div className="bg-white rounded-2xl border border-[#E4E4EF] p-5 grid grid-cols-2 gap-4">
            {[
              ["What happened?", task.title + " has been announced."],
              ["Why does it matter?", task.priority === "urgent" ? "Deadline is today with limited seats." : "Relevant to your interests."],
              ["What do you need to do?", task.priority === "missing" ? "Check original source for deadline." : "Register or take action before the deadline."],
              ["When?", task.deadline],
              ["Where did this come from?", task.source],
            ].map(([q, a]) => (
              <div key={q} className={q === "Where did this come from?" ? "col-span-2" : ""}>
                <p className="text-[10px] font-semibold text-[#9090A8] uppercase tracking-widest mb-0.5">{q}</p>
                <p className="text-sm text-[#0E0E16]">{a}</p>
              </div>
            ))}
          </div>

          {/* Original announcement */}
          <div className="bg-white rounded-2xl border border-[#E4E4EF] p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-[#9090A8] uppercase tracking-widest">Original Announcement</p>
              <button className="text-xs text-[#5B4FE8] font-medium hover:underline">View original</button>
            </div>
            <div className="bg-[#F6F6F9] rounded-xl p-4 font-mono text-xs text-[#3E3E56] whitespace-pre-line leading-relaxed border border-[#E4E4EF]">
              {originalAnnouncements[task.id] ?? "Original announcement not available."}
            </div>
            <p className="text-[10px] text-[#9090A8] mt-2 italic">Untangled does not fabricate information. Only confirmed details are shown above.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 7: Conflict Detail ────────────────────────────────────────────────
function ConflictDetailScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#F6F6F9]">
      <header className="bg-white border-b border-[#E4E4EF] px-8 py-4 flex items-center gap-4">
        <button onClick={onBack} className="w-8 h-8 rounded-lg hover:bg-[#F6F6F9] flex items-center justify-center text-[#6B6B80] transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5B4FE8] to-[#8B7FF0] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
              <path d="M8 10c0-2 1.5-4 4-4h8c2.5 0 4 2 4 4M8 22c0 2 1.5 4 4 4h8c2.5 0 4-2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M10 16h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-[DM_Serif_Display,serif] text-[#0E0E16] text-base">Untangled</span>
        </div>
        <span className="text-[#D8D8E8]">/</span>
        <span className="text-sm text-[#6B6B80]">Schedule Conflict</span>
      </header>

      <div className="max-w-2xl mx-auto px-8 py-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-mono text-red-500 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full font-semibold tracking-wide">
            ⚡ CONFLICT DETECTED
          </span>
        </div>
        <h1 className="text-3xl font-[DM_Serif_Display,serif] text-[#0E0E16] mb-2">Schedule Conflict</h1>
        <p className="text-sm text-[#9090A8] mb-8">Two commitments overlap on September 18.</p>

        {/* Visual timeline */}
        <div className="bg-white rounded-2xl border border-[#E4E4EF] p-6 mb-5">
          <div className="flex gap-6">
            {/* Timeline axis */}
            <div className="relative w-12 flex-shrink-0">
              {["3 PM", "4 PM", "5 PM", "6 PM"].map((t, i) => (
                <div key={t} className="absolute flex items-center gap-1.5" style={{ top: `${i * 64}px` }}>
                  <span className="text-xs font-mono text-[#9090A8] w-10 text-right">{t}</span>
                  <div className="w-2 h-px bg-[#E4E4EF]" />
                </div>
              ))}
            </div>

            {/* Event bars */}
            <div className="relative flex-1" style={{ height: "220px" }}>
              {/* AI Workshop: 3-5 PM = top 0 to 128 */}
              <div
                className="absolute left-0 w-[45%] rounded-xl border border-[#5B4FE8]/20 bg-[#5B4FE8]/8 p-3"
                style={{ top: 0, height: "128px" }}
              >
                <div className="w-full h-full flex flex-col justify-between">
                  <div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#5B4FE8] mb-1" />
                    <p className="text-xs font-semibold text-[#5B4FE8] leading-tight">AI Workshop</p>
                  </div>
                  <p className="text-[10px] font-mono text-[#5B4FE8]/70">3:00 – 5:00 PM</p>
                </div>
              </div>

              {/* Coding Society: 4-6 PM = top 64 to 192 */}
              <div
                className="absolute right-0 w-[45%] rounded-xl border border-amber-300/30 bg-amber-50 p-3"
                style={{ top: "64px", height: "128px" }}
              >
                <div className="w-full h-full flex flex-col justify-between">
                  <div>
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mb-1" />
                    <p className="text-xs font-semibold text-amber-700 leading-tight">Coding Society Meeting</p>
                  </div>
                  <p className="text-[10px] font-mono text-amber-500">4:00 – 6:00 PM</p>
                </div>
              </div>

              {/* Overlap indicator: 4-5 PM = top 64 to 128 */}
              <div
                className="absolute left-[22%] right-[22%] flex items-center justify-center rounded-lg bg-red-100 border border-red-200"
                style={{ top: "64px", height: "64px" }}
              >
                <div className="text-center">
                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Overlap</p>
                  <p className="text-xs font-mono text-red-500 font-semibold">4:00 – 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-6">
          <p className="font-semibold text-sm text-[#0E0E16] mb-1">These commitments overlap.</p>
          <p className="text-sm text-[#3E3E56] leading-relaxed">
            Untangled surfaces the conflict so you can decide what works best for you. We don't recommend which event you should skip — that depends on your priorities and circumstances.
          </p>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-[#E4E4EF] p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#5B4FE8]" />
              <span className="font-semibold text-sm text-[#0E0E16]">AI Workshop</span>
            </div>
            <p className="text-xs text-[#9090A8] mb-3">Today · 3:00 PM – 5:00 PM · Lab 204, CS Block</p>
            <button className="w-full py-2 border border-[#5B4FE8]/30 text-[#5B4FE8] text-xs font-semibold rounded-lg hover:bg-[#5B4FE8] hover:text-white transition-colors">
              View AI Workshop
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-[#E4E4EF] p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="font-semibold text-sm text-[#0E0E16]">Coding Society Meeting</span>
            </div>
            <p className="text-xs text-[#9090A8] mb-3">Today · 4:00 PM – 6:00 PM · CS Seminar Hall</p>
            <button className="w-full py-2 border border-amber-200 text-amber-600 text-xs font-semibold rounded-lg hover:bg-amber-50 transition-colors">
              View Coding Society
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("1");

  function handleViewDetail(id: string) {
    setSelectedTaskId(id);
    setScreen("update-detail");
  }

  function handleViewConflict() {
    setScreen("conflict-detail");
  }

  return (
    <div className="min-h-screen">
      {screen === "welcome" && <WelcomeScreen onNext={() => setScreen("personalization")} />}
      {screen === "personalization" && <PersonalizationScreen onNext={() => setScreen("sources")} />}
      {screen === "sources" && <SourcesScreen onNext={() => setScreen("processing")} />}
      {screen === "processing" && <ProcessingScreen onNext={() => setScreen("dashboard")} />}
      {screen === "dashboard" && (
        <DashboardScreen
          onViewDetail={handleViewDetail}
          onViewConflict={handleViewConflict}
          onViewAllUpdates={() => {}}
        />
      )}
      {screen === "update-detail" && (
        <UpdateDetailScreen taskId={selectedTaskId} onBack={() => setScreen("dashboard")} />
      )}
      {screen === "conflict-detail" && (
        <ConflictDetailScreen onBack={() => setScreen("dashboard")} />
      )}
    </div>
  );
}
