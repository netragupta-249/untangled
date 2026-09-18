"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Filter,
  IdCard,
  Layers,
  LogOut,
  Mail,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  User,
} from "lucide-react"

type View = "auth" | "dashboard" | "howItWorks" | "forStudents"

type StoredUser = {
  name: string
  email: string
  provider: "email" | "google"
}

const STORAGE_KEY = "untangled_user"

function loadUser(): StoredUser | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredUser) : null
  } catch {
    return null
  }
}

export function UntangledApp() {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null)
  const [activeView, setActiveView] = useState<View>("auth")
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const user = loadUser()
    if (user) {
      setCurrentUser(user)
      setActiveView("dashboard")
    }
    setHydrated(true)
  }, [])

  function signIn(user: StoredUser) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    setCurrentUser(user)
    setActiveView("dashboard")
  }

  function signOut() {
    window.localStorage.removeItem(STORAGE_KEY)
    setCurrentUser(null)
    setActiveView("auth")
  }

  function goHome() {
    setActiveView(currentUser ? "dashboard" : "auth")
  }

  // Avoid a flash of the auth screen before we know the stored state.
  if (!hydrated) {
    return <div className="min-h-screen bg-[#F9F8F6]" />
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-slate-800">
      <TopBar
        activeView={activeView}
        isAuthed={!!currentUser}
        onHome={goHome}
        onNavigate={setActiveView}
        onSignOut={signOut}
      />

      <AnimatePresence mode="wait">
        {activeView === "auth" && (
          <PageTransition key="auth">
            <AuthScreen onSignIn={signIn} />
          </PageTransition>
        )}
        {activeView === "dashboard" && currentUser && (
          <PageTransition key="dashboard">
            <Dashboard user={currentUser} />
          </PageTransition>
        )}
        {activeView === "howItWorks" && (
          <PageTransition key="howItWorks">
            <HowItWorks />
          </PageTransition>
        )}
        {activeView === "forStudents" && (
          <PageTransition key="forStudents">
            <ForStudents />
          </PageTransition>
        )}
      </AnimatePresence>
    </div>
  )
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-6xl px-6 pb-24 pt-10 md:px-10"
    >
      {children}
    </motion.main>
  )
}

function BrandMark() {
  return (
    <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 via-rose-400 to-purple-500 font-serif text-lg font-bold text-white shadow-sm">
      U
    </span>
  )
}

function TopBar({
  activeView,
  isAuthed,
  onHome,
  onNavigate,
  onSignOut,
}: {
  activeView: View
  isAuthed: boolean
  onHome: () => void
  onNavigate: (v: View) => void
  onSignOut: () => void
}) {
  const links: { label: string; view: View }[] = [
    { label: "How it works", view: "howItWorks" },
    { label: "For students", view: "forStudents" },
  ]

  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-[#F9F8F6]/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <button
          onClick={onHome}
          className="flex items-center gap-3 rounded-xl transition-transform hover:-translate-y-0.5"
          aria-label="Go to home"
        >
          <BrandMark />
          <span className="font-serif text-2xl font-semibold tracking-tight text-slate-900">Untangled</span>
        </button>

        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => (
            <button
              key={link.view}
              onClick={() => onNavigate(link.view)}
              className={`rounded-full px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
                activeView === link.view ? "bg-slate-900/5 text-slate-900" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {link.label}
            </button>
          ))}

          {isAuthed ? (
            <button
              onClick={onSignOut}
              className="ml-1 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              <LogOut className="size-4" />
              Log out
            </button>
          ) : (
            <button
              onClick={onHome}
              className="ml-1 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              Sign in
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}

function AuthScreen({ onSignIn }: { onSignIn: (u: StoredUser) => void }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState<"email" | "google" | null>(null)

  const [name, setName] = useState("")
  const [dob, setDob] = useState("")
  const [collegeId, setCollegeId] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading("email")
    setTimeout(() => {
      const derivedName = isSignUp ? name.trim() || "Student" : email.split("@")[0] || "Student"
      onSignIn({
        name: derivedName.charAt(0).toUpperCase() + derivedName.slice(1),
        email: email.trim() || "student@campus.edu",
        provider: "email",
      })
      setLoading(null)
    }, 900)
  }

  function handleGoogle() {
    setLoading("google")
    setTimeout(() => {
      onSignIn({ name: "Aditi Sharma", email: "aditi.sharma@gmail.com", provider: "google" })
      setLoading(null)
    }, 900)
  }

  return (
    <div className="flex flex-col items-center pt-6">
      <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-500">
        <span className="size-1.5 rounded-full bg-rose-500" />
        AI Campus Assistant
      </span>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -4 }}
        className="w-full max-w-md rounded-2xl border border-black/5 bg-white p-8 shadow-2xl transition-all"
      >
        <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-900">
          {isSignUp ? "Let's untangle it." : "Welcome back."}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {isSignUp
            ? "Create your account to turn campus chaos into clarity."
            : "Sign in to see the five things that need your attention."}
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          {isSignUp && (
            <>
              <Field
                icon={<User className="size-4" />}
                label="Full name"
                value={name}
                onChange={setName}
                placeholder="Aditi Sharma"
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  icon={<Calendar className="size-4" />}
                  label="Date of birth"
                  type="date"
                  value={dob}
                  onChange={setDob}
                  required
                />
                <Field
                  icon={<IdCard className="size-4" />}
                  label="College ID"
                  value={collegeId}
                  onChange={setCollegeId}
                  placeholder="21BCE1234"
                  required
                />
              </div>
            </>
          )}

          <Field
            icon={<Mail className="size-4" />}
            label={isSignUp ? "College email (.edu / .ac.in)" : "Email"}
            type="email"
            value={email}
            onChange={setEmail}
            placeholder={isSignUp ? "you@vitstudent.ac.in" : "you@campus.edu"}
            required
          />

          {!isSignUp && (
            <Field
              icon={<ShieldCheck className="size-4" />}
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              required
            />
          )}

          <button
            type="submit"
            disabled={loading !== null}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading === "email" ? (
              <>
                <Spinner />
                {isSignUp ? "Creating account…" : "Signing in…"}
              </>
            ) : (
              <>
                {isSignUp ? "Create Account" : "Sign in"}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-slate-400">
          <span className="h-px flex-1 bg-black/10" />
          or
          <span className="h-px flex-1 bg-black/10" />
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading !== null}
          className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading === "google" ? (
            <Spinner className="text-slate-400" />
          ) : (
            <GoogleIcon />
          )}
          Sign in with Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-500">
          {isSignUp ? "Already have an account?" : "New to Untangled?"}{" "}
          <button
            onClick={() => setIsSignUp((v) => !v)}
            className="font-semibold text-orange-600 hover:text-orange-700"
          >
            {isSignUp ? "Sign in" : "Create one"}
          </button>
        </p>
      </motion.div>
    </div>
  )
}

function Field({
  icon,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  icon: React.ReactNode
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">{label}</span>
      <span className="relative flex items-center">
        <span className="pointer-events-none absolute left-3 text-slate-400">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl border border-black/10 bg-[#F9F8F6] py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-400/20"
        />
      </span>
    </label>
  )
}

function Dashboard({ user }: { user: StoredUser }) {
  const stats = [
    { label: "Updates", value: "50" },
    { label: "Actions", value: "5" },
    { label: "Conflicts", value: "2" },
  ]

  const items = [
    {
      tag: "CLASH DETECTED",
      tagClass: "bg-rose-100 text-rose-600",
      title: "OS Lab moved to Block C · 2:00 PM",
      detail: "Overlaps with your Physics tutorial. Reschedule one to avoid an attendance hit.",
      icon: <TriangleAlert className="size-5 text-rose-500" />,
    },
    {
      tag: "ACTION REQUIRED",
      tagClass: "bg-emerald-100 text-emerald-600",
      title: "Physics assignment due tomorrow · 11:59 PM",
      detail: "Submit on the portal. Add to Google Calendar with one tap.",
      icon: <CheckCircle2 className="size-5 text-emerald-500" />,
    },
    {
      tag: "OPPORTUNITY",
      tagClass: "bg-purple-100 text-purple-600",
      title: "National Hackathon registration · Sep 25",
      detail: "Team of up to 4. Matches your interest in AI projects.",
      icon: <Sparkles className="size-5 text-purple-500" />,
    },
  ]

  return (
    <div className="pt-4">
      <p className="text-sm font-medium text-slate-500">Good afternoon,</p>
      <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900">{user.name}</h1>

      <div className="mt-6 flex flex-wrap gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-baseline gap-2 rounded-xl border border-black/5 bg-white px-5 py-3 shadow-sm"
          >
            <span className="font-serif text-2xl font-bold text-slate-900">{s.value}</span>
            <span className="text-sm text-slate-500">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 shadow-xl">
        <h2 className="font-serif text-xl font-semibold text-slate-900">Your action plan</h2>
        <p className="text-sm text-slate-500">Five things need your attention today.</p>

        <ul className="mt-5 space-y-3">
          {items.map((item, i) => (
            <motion.li
              key={item.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-4 rounded-xl border border-black/5 bg-[#F9F8F6] p-4"
            >
              <span className="mt-0.5">{item.icon}</span>
              <div className="flex-1">
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${item.tagClass}`}>
                  {item.tag}
                </span>
                <p className="mt-1.5 font-medium text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-500">{item.detail}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function HowItWorks() {
  const steps = [
    {
      icon: <Layers className="size-5 text-orange-500" />,
      title: "Unified ingestion",
      body: "Consolidates 50+ WhatsApp and email alerts into one stream.",
    },
    {
      icon: <Filter className="size-5 text-rose-500" />,
      title: "Deduplication",
      body: "Filters 80% noise and merges identical circulars.",
    },
    {
      icon: <Sparkles className="size-5 text-purple-500" />,
      title: "Extraction",
      body: "Identifies hard deadlines and venues without hallucinating.",
    },
    {
      icon: <ShieldCheck className="size-5 text-emerald-500" />,
      title: "Deterministic defense",
      body: "Cross-references notices with your timetable to flag attendance clashes instantly.",
    },
  ]

  return (
    <div className="pt-6">
      <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">The Untangled Engine</h1>
      <p className="mt-3 max-w-2xl text-lg text-slate-500">
        Four deterministic stages turn the firehose of campus announcements into a plan you can trust.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#F9F8F6]">{step.icon}</span>
              <span className="font-serif text-sm font-bold text-slate-400">0{i + 1}</span>
            </div>
            <h3 className="mt-4 font-serif text-xl font-semibold text-slate-900">{step.title}</h3>
            <p className="mt-1.5 text-sm text-slate-500">{step.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function ForStudents() {
  const points = [
    "Converts passive circulars into 1-tap Google Calendar actions.",
    "Detects schedule conflicts before you commit to them.",
    "Explicitly flags missing details like unconfirmed venues instead of guessing.",
  ]

  return (
    <div className="pt-6">
      <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
        Fifty Messages. Five Priorities.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-500">
        Turn chaotic campus announcements into a clear action plan.
      </p>

      <ul className="mt-8 max-w-2xl space-y-3">
        {points.map((point, i) => (
          <motion.li
            key={point}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-start gap-3 rounded-xl border border-black/5 bg-white p-4 shadow-sm"
          >
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-orange-500" />
            <span className="text-slate-700">{point}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`size-4 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      aria-hidden="true"
    />
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75Z"
      />
    </svg>
  )
}
