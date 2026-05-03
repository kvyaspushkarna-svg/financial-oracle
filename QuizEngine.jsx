/**
 * QuizEngine.jsx — The Financial Oracle: Ramen to Riches
 *
 * Complete assessment UI across 5 strictly linear phases:
 *   WELCOME → DEMOGRAPHICS → ASSESSMENT → LOADING → RESULTS
 *
 * Architecture:
 *  - State management delegates to useDemographics() + useAssessment() from App.jsx
 *  - computeResults() from App.jsx produces the final results object
 *  - This file is the pure UI/experience layer — zero business logic duplication
 *
 * Usage: Replace the existing App.jsx render tree with <QuizEngine />
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  ArrowRight,
  CheckCircle,
  Zap,
  BarChart2,
  TrendingUp,
  Shield,
  Brain,
  Target,
} from "lucide-react";
import { ALL_QUESTIONS, getTier } from "./questionsData";
import {
  useDemographics,
  useAssessment,
  computeResults,
} from "./store";

// ─────────────────────────────────────────────────────────────────────────────
// PHASE CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PHASES = {
  WELCOME:      "WELCOME",
  DEMOGRAPHICS: "DEMOGRAPHICS",
  ASSESSMENT:   "ASSESSMENT",
  LOADING:      "LOADING",
  RESULTS:      "RESULTS",
};

const TOTAL_Q   = 20;
const MAX_SCORE = 80;

// ─────────────────────────────────────────────────────────────────────────────
// PILLAR VISUAL METADATA  (richer colour tokens for dark UI)
// ─────────────────────────────────────────────────────────────────────────────

const PILLAR_UI = {
  foundation: {
    label: "Foundation",    icon: "🏛️",
    color:  "#818CF8",
    glow:   "rgba(129,140,248,0.22)",
    bg:     "rgba(99,102,241,0.07)",
    border: "rgba(129,140,248,0.22)",
    ring:   "rgba(129,140,248,0.55)",
    dark:   "#1E1B4B",
  },
  growthEngine: {
    label: "Growth Engine", icon: "🚀",
    color:  "#34D399",
    glow:   "rgba(52,211,153,0.22)",
    bg:     "rgba(16,185,129,0.07)",
    border: "rgba(52,211,153,0.22)",
    ring:   "rgba(52,211,153,0.55)",
    dark:   "#064E3B",
  },
  strategy: {
    label: "Strategy",      icon: "♟️",
    color:  "#FCD34D",
    glow:   "rgba(252,211,77,0.22)",
    bg:     "rgba(245,158,11,0.07)",
    border: "rgba(252,211,77,0.22)",
    ring:   "rgba(252,211,77,0.55)",
    dark:   "#451A03",
  },
  psychology: {
    label: "Psychology",    icon: "🧠",
    color:  "#F472B6",
    glow:   "rgba(244,114,182,0.22)",
    bg:     "rgba(236,72,153,0.07)",
    border: "rgba(244,114,182,0.22)",
    ring:   "rgba(244,114,182,0.55)",
    dark:   "#4A044E",
  },
};

const PILLAR_ORDER = ["foundation", "growthEngine", "strategy", "psychology"];
const OPTION_LETTERS = ["A", "B", "C", "D"];

// ─────────────────────────────────────────────────────────────────────────────
// ARCHETYPE PROFILES  (keyed by SCORE_TIERS label)
// ─────────────────────────────────────────────────────────────────────────────

const ARCHETYPES = {
  Oracle: {
    name:     "The Financial Architect",
    tagline:  "You don't manage money. You engineer it.",
    emoji:    "🏛️",
    gradient: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)",
    color:    "#818CF8",
    portrait:
      "You operate at a rare level of financial intentionality. Your money has a job before it arrives in your account. You've systematically replaced willpower with automation, guesswork with frameworks like the 30:30:30:10 rule, and reactive spending with pre-committed protocols. In a world where most people chase financial literacy, you've built financial infrastructure.",
    challenge:
      "Your primary risk is overengineering — spending more cognitive energy optimising the system than letting it compound undisturbed. Trust the architecture you've already built and let compounding do the heavy lifting.",
  },
  Strategist: {
    name:     "The Disciplined Builder",
    tagline:  "The foundation is solid. Now raise the architecture.",
    emoji:    "🏗️",
    gradient: "linear-gradient(135deg, #064E3B 0%, #065F46 100%)",
    color:    "#34D399",
    portrait:
      "You've done the genuinely hard part — you've moved beyond financial instinct and built real discipline. You invest regularly, understand how compounding works, and don't panic during market corrections. What separates the Strategist from the Oracle is the shift from deliberate discipline to automated inevitability. You make the right moves consciously. The next level makes them structurally unavoidable.",
    challenge:
      "Identify two financial decisions that still require willpower and automate them before the end of this month. Discipline is finite. Systems compound forever.",
  },
  Apprentice: {
    name:     "The Aware Explorer",
    tagline:  "You have the map. The path is waiting.",
    emoji:    "🗺️",
    gradient: "linear-gradient(135deg, #451A03 0%, #78350F 100%)",
    color:    "#FCD34D",
    portrait:
      "You're intellectually engaged with financial concepts — you understand the vocabulary and feel the gap between where you are and where you could be. The challenge isn't knowledge; it's converting awareness into consistent, systemised behavior. Many high-intelligence people stay at this stage indefinitely, caught in the Competence Trap: researching forever, starting never.",
    challenge:
      "Pick one financial system — a SIP, a PPF contribution, a 30:30:30:10 account sweep — and activate it today. Not tomorrow. The act of starting is the skill you're actually building.",
  },
  Wanderer: {
    name:     "The Instinctive Navigator",
    tagline:  "Every financial architect started without a blueprint.",
    emoji:    "🧭",
    gradient: "linear-gradient(135deg, #4A044E 0%, #701A75 100%)",
    color:    "#F472B6",
    portrait:
      "Right now, your financial behavior is largely reactive — you respond to money as it arrives rather than direct it in advance. That's the default state for anyone without explicit financial system training. The fact that you completed this assessment honestly is significant. Most people at this stage never seek feedback. That act of self-reflection is the first and most important step. Your foundation-building phase starts from this exact moment.",
    challenge:
      "This week, open a separate savings account and set up an auto-transfer of any amount — even ₹500 — to trigger on payday. The rupee amount is irrelevant. Building the automation reflex is everything.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PER-PILLAR TIER DESCRIPTIONS  (shown in results breakdown)
// ─────────────────────────────────────────────────────────────────────────────

const PILLAR_TIER_TEXT = {
  foundation: {
    Oracle:
      "Your cash flow architecture is exceptional. The 30:30:30:10 framework, CapEx Vaults, and full automation mean your money works without active intervention. This tier is genuinely rare.",
    Strategist:
      "Strong savings habits with real automation in place. The gap to Oracle is replacing occasional manual discipline with fully structural triggers that fire regardless of mood or market conditions.",
    Apprentice:
      "You understand good practices but execution is inconsistent. Single highest-leverage move: automate at least one savings trigger that fires before any spending is possible on payday.",
    Wanderer:
      "Your financial base needs foundational attention. A single automated savings action — however small — begins compounding the habit that eventually becomes a complete architecture.",
  },
  growthEngine: {
    Oracle:
      "You understand Rupee Cost Averaging mechanically, maximise PPF's EEE triple tax shield, and use fixed income as strategic dry powder. Your growth engine runs at near-full capacity.",
    Strategist:
      "You invest consistently and understand compounding. Two upgrades complete this pillar: front-loading PPF on April 1st, and building a fixed income tranche you can deploy tactically during corrections.",
    Apprentice:
      "You invest sometimes, but not systematically. A SIP auto-debit on the 2nd of each month and an active PPF account would move this score by 4–6 points immediately.",
    Wanderer:
      "Your growth engine needs to be switched on. A single monthly SIP in a low-cost index fund is the highest-leverage first action available to you right now.",
  },
  strategy: {
    Oracle:
      "You think like an institutional investor — harvesting every employer match, engineering your salary structure for maximum tax efficiency, and treating your network as a compounding financial asset.",
    Strategist:
      "Strategically aware and paralysis-resistant. Fully mapping your Flexible Benefits Plan (NPS, LTA, meal vouchers) to exempt allowances would unlock material additional tax-free income.",
    Apprentice:
      "The Competence Trap may be costing you compounding time. Start with the easiest win: verify if your employer offers a VPF match and harvest it completely — guaranteed 100% instant return.",
    Wanderer:
      "Significant value is being left unclaimed — employer matches, salary structure optimisation, and network leverage. Begin with one: read your company's benefits document this week.",
  },
  psychology: {
    Oracle:
      "You've mastered the hardest domain in personal finance: your own cognition. Pre-committed drawdown protocols, Psychological Capital budgeting, and income smoothing show elite behavioral architecture.",
    Strategist:
      "You manage financial anxiety well and market volatility doesn't drive decisions. Adding a formal Psychological Capital budget — a pre-funded joy allocation — would complete this pillar.",
    Apprentice:
      "Financial stress influences decisions more than it should. A tiered liquidity buffer (Tier 1: liquid fund, Tier 2: FD, Tier 3: accessible investments) removes anxiety structurally.",
    Wanderer:
      "Financial psychology is your biggest growth lever. Creating a small dedicated joy budget alongside your savings can break the guilt-and-binge cycle that silently sabotages most financial plans.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// LOADING SCREEN MESSAGES
// ─────────────────────────────────────────────────────────────────────────────

const LOADING_MSGS = [
  "Mapping your financial neural pathways...",
  "Cross-referencing 847 behavioural patterns...",
  "Identifying cognitive money biases...",
  "Calibrating risk psychology matrix...",
  "Benchmarking against financial archetypes...",
  "Synthesising your Financial DNA report...",
];

// ─────────────────────────────────────────────────────────────────────────────
// FRAMER MOTION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 22 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0, y: -12,
    transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
  },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.09 } },
};

const scaleIn = {
  hidden:  { opacity: 0, scale: 0.93 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit:    { opacity: 0, scale: 0.96, transition: { duration: 0.25 } },
};

// Direction-aware question card slide
// custom = slide direction (+1 forward, -1 backward)
const questionVariants = {
  hidden:  (dir) => ({
    opacity: 0,
    x: dir >= 0 ? 64 : -64,
    scale: 0.975,
  }),
  visible: {
    opacity: 1, x: 0, scale: 1,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (dir) => ({
    opacity: 0,
    x: dir >= 0 ? -64 : 64,
    scale: 0.975,
    transition: { duration: 0.26, ease: [0.4, 0, 1, 1] },
  }),
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED MICRO-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/** Ambient radial glow blobs — purely decorative */
function AmbientGlows() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <div
        className="absolute rounded-full blur-3xl opacity-20"
        style={{
          width: 520, height: 520,
          top: "-10%", left: "-8%",
          background: "radial-gradient(circle, #6366F1, transparent 70%)",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl opacity-15"
        style={{
          width: 480, height: 480,
          bottom: "-8%", right: "-6%",
          background: "radial-gradient(circle, #F59E0B, transparent 70%)",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl opacity-10"
        style={{
          width: 360, height: 360,
          top: "40%", right: "20%",
          background: "radial-gradient(circle, #10B981, transparent 70%)",
        }}
      />
    </div>
  );
}

/** Pillar badge chip */
function PillarBadge({ pillarId, size = "sm" }) {
  const m = PILLAR_UI[pillarId];
  if (!m) return null;
  const pad = size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-mono font-bold uppercase tracking-widest ${pad}`}
      style={{
        background: m.bg,
        border: `1px solid ${m.border}`,
        color: m.color,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: m.color, boxShadow: `0 0 5px ${m.color}` }}
      />
      {m.label}
    </span>
  );
}

/** Animated score bar used in results */
function ScoreBar({ pct, color, glow, delay = 0 }) {
  return (
    <div
      className="w-full h-1.5 rounded-full overflow-hidden"
      style={{ background: "rgba(255,255,255,0.06)" }}
    >
      <motion.div
        className="h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: color, boxShadow: `0 0 8px ${glow}` }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 1 — WELCOME
// ─────────────────────────────────────────────────────────────────────────────

function WelcomeScreen({ onBegin }) {
  const pillars = PILLAR_ORDER.map((id) => ({
    id,
    desc: {
      foundation:   "Cash flow & savings architecture",
      growthEngine: "SIPs, PPF & compounding returns",
      strategy:     "Corporate benefits & social capital",
      psychology:   "Behavioral finance & resilience",
    }[id],
  }));

  return (
    <motion.div
      key="welcome"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="max-w-3xl w-full flex flex-col items-center text-center gap-7"
      >
        {/* Category chip */}
        <motion.div variants={fadeUp}>
          <span
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest px-4 py-1.5 rounded-full"
            style={{
              color: "#FCD34D",
              border: "1px solid rgba(252,211,77,0.28)",
              background: "rgba(245,158,11,0.08)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#FCD34D", boxShadow: "0 0 6px #FCD34D" }}
            />
            Financial DNA Assessment
          </span>
        </motion.div>

        {/* Hero title */}
        <motion.div variants={fadeUp} className="space-y-1">
          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white leading-none">
            The Financial
          </h1>
          <h1
            className="text-6xl md:text-8xl font-black tracking-tight leading-none"
            style={{
              background:
                "linear-gradient(90deg, #818CF8 0%, #34D399 35%, #FCD34D 65%, #F472B6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Oracle
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="text-lg text-slate-400 max-w-xl leading-relaxed"
        >
          20 behavioural questions. 4 financial pillars.
          <br />
          One complete blueprint of your money psychology.
        </motion.p>

        {/* Four pillar preview cards */}
        <motion.div
          variants={fadeUp}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mt-1"
        >
          {pillars.map(({ id, desc }) => {
            const m = PILLAR_UI[id];
            return (
              <motion.div
                key={id}
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
                className="rounded-2xl p-4 text-left cursor-default"
                style={{
                  background: m.bg,
                  border: `1px solid ${m.border}`,
                }}
              >
                <div className="text-2xl mb-2">{m.icon}</div>
                <div
                  className="text-sm font-bold mb-1"
                  style={{ color: m.color }}
                >
                  {m.label}
                </div>
                <div className="text-xs text-slate-500 leading-snug">
                  {desc}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center gap-3 mt-2"
        >
          <motion.button
            onClick={onBegin}
            whileHover={{
              scale: 1.04,
              boxShadow: "0 0 36px rgba(245,158,11,0.45)",
            }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 px-9 py-4 rounded-2xl text-base font-bold text-black"
            style={{
              background: "linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)",
            }}
          >
            Begin Your Assessment
            <ArrowRight size={18} />
          </motion.button>
          <p className="text-xs text-slate-600">
            ~8–10 minutes · No account required · Results stay on-device
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 2 — DEMOGRAPHICS
// ─────────────────────────────────────────────────────────────────────────────

const PROFESSION_OPTIONS = [
  { value: "corporate",  label: "Corporate / Salaried", icon: "🏢" },
  { value: "gig",        label: "Gig / Freelancer",      icon: "💻" },
  { value: "student",    label: "Student",                icon: "🎓" },
  { value: "business",   label: "Business Owner",         icon: "🏪" },
];

const INCOME_OPTIONS = [
  { value: "below_25k", label: "Below ₹25,000" },
  { value: "25k_50k",   label: "₹25,000 – ₹50,000" },
  { value: "50k_1L",    label: "₹50,000 – ₹1,00,000" },
  { value: "1L_2L",     label: "₹1,00,000 – ₹2,00,000" },
  { value: "above_2L",  label: "Above ₹2,00,000" },
];

/** Reusable styled input wrapper */
function InputShell({ active, children }) {
  return (
    <div
      className="w-full rounded-xl transition-all duration-200"
      style={{
        border: `1.5px solid ${active ? "#818CF8" : "rgba(255,255,255,0.06)"}`,
        boxShadow: active ? "0 0 0 3px rgba(129,140,248,0.12)" : "none",
      }}
    >
      {children}
    </div>
  );
}

function DemographicsForm({ demographics, onChange, onSubmit, isComplete }) {
  return (
    <motion.div
      key="demographics"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16"
    >
      <div className="w-full max-w-lg">
        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-mono uppercase tracking-widest mb-3"
            style={{ color: "#818CF8" }}
          >
            Step 1 of 2 — Your Profile
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-black text-white mb-3"
          >
            Tell us about yourself
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-slate-400 text-sm leading-relaxed"
          >
            Your profile personalises insights in your results.
            <br />
            Nothing is stored or shared externally.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="space-y-7"
        >
          {/* ── Age ── */}
          <motion.div variants={fadeUp}>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
              Your Age
            </label>
            <InputShell active={Boolean(demographics.age)}>
              <input
                type="number"
                min="16"
                max="80"
                value={demographics.age}
                onChange={(e) => onChange("age", e.target.value)}
                placeholder="e.g. 28"
                className="w-full rounded-xl px-4 py-3 text-white placeholder-slate-700 bg-transparent focus:outline-none text-sm"
              />
            </InputShell>
          </motion.div>

          {/* ── Profession ── */}
          <motion.div variants={fadeUp}>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              Profession Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PROFESSION_OPTIONS.map((opt) => {
                const active = demographics.professionCategory === opt.value;
                return (
                  <motion.button
                    key={opt.value}
                    onClick={() => onChange("professionCategory", opt.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-200"
                    style={{
                      background: active
                        ? "rgba(129,140,248,0.1)"
                        : "rgba(255,255,255,0.03)",
                      border: `1.5px solid ${active
                        ? "#818CF8"
                        : "rgba(255,255,255,0.06)"}`,
                      color: active ? "#818CF8" : "#94A3B8",
                      boxShadow: active
                        ? "0 0 0 3px rgba(129,140,248,0.1)"
                        : "none",
                    }}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <span className="leading-tight">{opt.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* ── Income ── */}
          <motion.div variants={fadeUp}>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
              Monthly Income Bracket
            </label>
            <InputShell active={Boolean(demographics.monthlyIncomeBracket)}>
              <select
                value={demographics.monthlyIncomeBracket}
                onChange={(e) =>
                  onChange("monthlyIncomeBracket", e.target.value)
                }
                className="w-full rounded-xl px-4 py-3 text-sm bg-transparent focus:outline-none appearance-none cursor-pointer"
                style={{
                  color: demographics.monthlyIncomeBracket
                    ? "#F8FAFC"
                    : "#64748B",
                }}
              >
                <option value="" disabled style={{ background: "#0D1525" }}>
                  Select your bracket…
                </option>
                {INCOME_OPTIONS.map((o) => (
                  <option
                    key={o.value}
                    value={o.value}
                    style={{ background: "#0D1525", color: "#F8FAFC" }}
                  >
                    {o.label} / month
                  </option>
                ))}
              </select>
            </InputShell>
          </motion.div>

          {/* ── Financial Knowledge Slider ── */}
          <motion.div variants={fadeUp}>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
              Self-Rated Financial Knowledge
              <span
                className="ml-2 text-sm font-black normal-case tracking-normal"
                style={{ color: "#818CF8" }}
              >
                {demographics.selfRatedFinancialKnowledge}
                <span className="text-slate-600">/10</span>
              </span>
            </label>
            <div className="px-1">
              <input
                type="range"
                min="1"
                max="10"
                value={demographics.selfRatedFinancialKnowledge}
                onChange={(e) =>
                  onChange(
                    "selfRatedFinancialKnowledge",
                    Number(e.target.value)
                  )
                }
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "#818CF8" }}
              />
              <div className="flex justify-between text-xs text-slate-700 mt-1.5">
                <span>Complete Beginner</span>
                <span>Finance Expert</span>
              </div>
            </div>
          </motion.div>

          {/* ── Submit ── */}
          <motion.div variants={fadeUp} className="pt-1">
            <motion.button
              onClick={onSubmit}
              disabled={!isComplete}
              whileHover={
                isComplete
                  ? { scale: 1.02, boxShadow: "0 0 32px rgba(245,158,11,0.38)" }
                  : {}
              }
              whileTap={isComplete ? { scale: 0.97 } : {}}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base transition-all"
              style={{
                background: isComplete
                  ? "linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)"
                  : "rgba(255,255,255,0.04)",
                color: isComplete ? "#000" : "#475569",
                cursor: isComplete ? "pointer" : "not-allowed",
                border: isComplete
                  ? "none"
                  : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {isComplete ? (
                <>
                  Start Assessment
                  <ChevronRight size={18} />
                </>
              ) : (
                "Complete all fields to continue"
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 3 — ASSESSMENT  (progress bar + question card)
// ─────────────────────────────────────────────────────────────────────────────

/** Fixed top progress bar — colour tracks the active pillar */
function TopProgressBar({ answeredCount, total, pillarId }) {
  const m = PILLAR_UI[pillarId] || PILLAR_UI.foundation;
  const pct = Math.min((answeredCount / total) * 100, 100);
  return (
    <div className="fixed left-0 right-0 z-40 h-0.5 bg-slate-900" style={{ top: "56px" }}>
      <motion.div
        className="h-full rounded-full"
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: `linear-gradient(90deg, ${m.color}, ${m.color}BB)`,
          boxShadow: `0 0 10px ${m.glow}`,
        }}
      />
    </div>
  );
}

/** Single question card with option buttons */
function QuestionCard({
  question,
  questionNumber,
  selectedId,
  pendingId,
  onSelect,
  onBack,
  liveScores,
}) {
  const m = PILLAR_UI[question.pillar];
  const answeredCount = Object.values(liveScores).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-7">
      {/* Theme tag */}
      <p
        className="text-xs font-mono font-bold uppercase tracking-widest"
        style={{ color: m.color }}
      >
        {question.theme}
      </p>

      {/* Question text */}
      <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug">
        {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((opt, i) => {
          const isSelected = selectedId === opt.id || pendingId === opt.id;
          const isPending  = pendingId === opt.id;
          const isLocked   = pendingId !== null && !isPending;

          return (
            <motion.button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              disabled={pendingId !== null}
              whileHover={!pendingId ? { x: 5 } : {}}
              whileTap={!pendingId ? { scale: 0.99 } : {}}
              className="w-full flex items-start gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-200"
              style={{
                background: isSelected
                  ? m.bg.replace("0.07", "0.14")
                  : "rgba(255,255,255,0.02)",
                border: `1.5px solid ${isSelected ? m.ring : "rgba(255,255,255,0.06)"}`,
                boxShadow: isSelected
                  ? `0 0 0 3px ${m.glow}, inset 0 0 24px ${m.bg}`
                  : "none",
                opacity: isLocked ? 0.45 : 1,
                cursor: pendingId ? "default" : "pointer",
              }}
            >
              {/* Letter badge */}
              <span
                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black mt-0.5"
                style={{
                  background: isSelected
                    ? m.color
                    : "rgba(255,255,255,0.06)",
                  color: isSelected ? "#000" : "#64748B",
                  boxShadow: isSelected ? `0 0 8px ${m.glow}` : "none",
                }}
              >
                {OPTION_LETTERS[i]}
              </span>

              {/* Option text */}
              <span
                className="flex-1 text-sm leading-relaxed"
                style={{ color: isSelected ? "#F8FAFC" : "#94A3B8" }}
              >
                {opt.text}
              </span>

              {/* Check mark */}
              {isSelected && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex-shrink-0 mt-0.5"
                >
                  <CheckCircle size={17} style={{ color: m.color }} />
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Bottom row: back button + pillar mini-trackers */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          disabled={questionNumber === 1}
          className="flex items-center gap-1.5 text-sm transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          style={{ color: "#64748B" }}
          onMouseEnter={(e) =>
            questionNumber > 1 && (e.currentTarget.style.color = "#94A3B8")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "#64748B")
          }
        >
          <ChevronLeft size={15} />
          Previous
        </button>

        {/* Pillar progress dots */}
        <div className="flex gap-2">
          {PILLAR_ORDER.map((pid) => {
            const pm   = PILLAR_UI[pid];
            const qs   = ALL_QUESTIONS.filter((q) => q.pillar === pid);
            const done = qs.filter(
              (q) => liveScores[pid] > 0 || false
            ).length;
            // Count answered questions per pillar
            const answeredInPillar = qs.filter((q, _i) => {
              // approximate: use position in answeredCount
              return false; // will be overridden by liveScores > 0 approach
            }).length;
            // Simpler: use pillar order position to determine answered count
            const pillarIdx = PILLAR_ORDER.indexOf(pid);
            const questionsPerPillar = 5;
            const overallAnswered = answeredCount > 0
              ? Math.min(
                  Math.max(0, answeredCount - pillarIdx * questionsPerPillar),
                  questionsPerPillar
                )
              : 0;

            const isCurrent = pid === question.pillar;
            return (
              <div
                key={pid}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono"
                style={{
                  background: isCurrent ? pm.bg : "transparent",
                  border: `1px solid ${isCurrent ? pm.border : "rgba(255,255,255,0.05)"}`,
                  color: isCurrent ? pm.color : "#334155",
                }}
              >
                <span>{pm.icon}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AssessmentScreen({
  currentQuestion,
  currentQuestionIndex,
  answers,
  liveScores,
  onAnswer,
  onBack,
}) {
  const [pendingOption, setPendingOption] = useState(null);
  const [direction, setDirection]         = useState(1);
  const prevIndexRef                      = useRef(currentQuestionIndex);

  // Detect navigation direction and reset pending state on question change
  useEffect(() => {
    setDirection(currentQuestionIndex >= prevIndexRef.current ? 1 : -1);
    prevIndexRef.current = currentQuestionIndex;
    setPendingOption(null);
  }, [currentQuestionIndex]);

  const handleSelect = useCallback(
    (optionId) => {
      if (pendingOption !== null) return; // locked while transitioning
      setPendingOption(optionId);
      // Brief visual confirmation delay, then commit + advance
      setTimeout(() => {
        onAnswer(currentQuestion.id, optionId);
      }, 360);
    },
    [pendingOption, currentQuestion, onAnswer]
  );

  const handleBack = useCallback(() => {
    setDirection(-1);
    onBack();
  }, [onBack]);

  if (!currentQuestion) return null;

  const answeredCount   = Object.keys(answers).length;
  const currentAnswer   = answers[currentQuestion.id];
  const resolvedSelected = pendingOption ?? currentAnswer ?? null;

  return (
    <motion.div
      key="assessment"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 min-h-screen flex flex-col"
    >
      {/* Fixed progress bar */}
      <TopProgressBar
        answeredCount={answeredCount}
        total={TOTAL_Q}
        pillarId={currentQuestion.pillar}
      />

      {/* Top navigation row */}
      <div className="flex items-center justify-between px-5 pt-8 pb-3 max-w-2xl mx-auto w-full">
        <button
          onClick={handleBack}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-1.5 text-sm transition-colors disabled:opacity-20 disabled:cursor-not-allowed text-slate-500 hover:text-slate-300"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        <PillarBadge pillarId={currentQuestion.pillar} />

        <span className="text-xs font-mono text-slate-600">
          <span className="text-slate-400 font-bold">
            {currentQuestionIndex + 1}
          </span>
          {" / "}
          {TOTAL_Q}
        </span>
      </div>

      {/* Question area — direction-aware AnimatePresence */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestion.id}
              custom={direction}
              variants={questionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <QuestionCard
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                selectedId={resolvedSelected}
                pendingId={pendingOption}
                onSelect={handleSelect}
                onBack={handleBack}
                liveScores={liveScores}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 4 — LOADING / CALCULATION
// ─────────────────────────────────────────────────────────────────────────────

function LoadingScreen({ onComplete }) {
  const [msgIdx,   setMsgIdx]   = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % LOADING_MSGS.length);
    }, 520);

    const progInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(progInterval); return 100; }
        // Accelerate at start, decelerate at end for organic feel
        const step = p < 30 ? 3 : p < 70 ? 1.8 : p < 90 ? 0.9 : 0.4;
        return Math.min(p + step, 100);
      });
    }, 40);

    const doneTimer = setTimeout(onComplete, 3400);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progInterval);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  // Activate pillar icons one by one as progress fills
  const activePillarCount = Math.ceil((progress / 100) * 4);

  return (
    <motion.div
      key="loading"
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 gap-12"
    >
      {/* Pillar icon cluster */}
      <div className="flex gap-5">
        {PILLAR_ORDER.map((pid, i) => {
          const m       = PILLAR_UI[pid];
          const isLit   = i < activePillarCount;
          return (
            <motion.div
              key={pid}
              animate={{
                scale:     isLit ? [1, 1.18, 1] : 1,
                opacity:   isLit ? 1 : 0.2,
              }}
              transition={{
                duration: 0.55,
                delay:    i * 0.28,
                repeat:   isLit ? 0 : 0,
              }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{
                background: isLit ? m.bg : "rgba(255,255,255,0.02)",
                border: `1.5px solid ${isLit ? m.border : "rgba(255,255,255,0.04)"}`,
                boxShadow: isLit ? `0 0 24px ${m.glow}` : "none",
              }}
            >
              {m.icon}
            </motion.div>
          );
        })}
      </div>

      {/* Title + cycling message */}
      <div className="text-center space-y-3">
        <motion.h2
          className="text-3xl font-black text-white"
          animate={{ opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          Decoding Your Financial DNA
        </motion.h2>

        <AnimatePresence mode="wait">
          <motion.p
            key={msgIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-slate-500 h-5"
          >
            {LOADING_MSGS[msgIdx]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Multi-colour progress bar */}
      <div
        className="w-72 h-1 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        <motion.div
          className="h-full rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.15 }}
          style={{
            background:
              "linear-gradient(90deg, #818CF8 0%, #34D399 33%, #FCD34D 66%, #F472B6 100%)",
          }}
        />
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 5 — RESULTS
// ─────────────────────────────────────────────────────────────────────────────

/** Per-pillar expandable insight card in behavioral breakdown */
function PillarInsightCard({ pr, questionInsights, index }) {
  const [open, setOpen] = useState(false);
  const m = pr.meta || PILLAR_UI[pr.pillarId];

  // Growth area = lowest-scoring question in this pillar
  const pillarQInsights = questionInsights.filter(
    (qi) => qi.pillar === pr.pillarId
  );
  const growthQ = [...pillarQInsights].sort(
    (a, b) => a.points - b.points
  )[0];
  const strengthQ = [...pillarQInsights].sort(
    (a, b) => b.points - a.points
  )[0];

  const tierKey = pr.tier?.label ?? "Wanderer";
  const tierText =
    PILLAR_TIER_TEXT[pr.pillarId]?.[tierKey] ?? "";

  // Resolve color from PILLAR_UI (since pillarMeta from computeResults uses raw colors)
  const uiMeta = PILLAR_UI[pr.pillarId];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.45 }}
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Pillar header row (always visible) */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
        style={{
          background: uiMeta.bg,
          borderBottom: open
            ? `1px solid ${uiMeta.border}`
            : "none",
        }}
      >
        <span className="text-xl">{uiMeta.icon}</span>
        <span
          className="font-bold text-sm flex-1"
          style={{ color: uiMeta.color }}
        >
          {uiMeta.label}
        </span>

        <span
          className="text-xs px-2.5 py-0.5 rounded-full font-bold mr-2"
          style={{
            background: "rgba(0,0,0,0.25)",
            color: uiMeta.color,
            border: `1px solid ${uiMeta.border}`,
          }}
        >
          {pr.score}/20 · {tierKey}
        </span>

        {/* Chevron */}
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: uiMeta.color }}
        >
          <ChevronRight size={16} />
        </motion.span>
      </button>

      {/* Expandable detail */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="px-5 py-5 space-y-4"
              style={{ background: "rgba(255,255,255,0.01)" }}
            >
              {/* Tier interpretation */}
              <p className="text-sm text-slate-400 leading-relaxed">
                {tierText}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Growth area */}
                {growthQ && growthQ.points < 4 && (
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(239,68,68,0.05)",
                      border: "1px solid rgba(239,68,68,0.15)",
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                      <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
                        Growth Area · {growthQ.theme}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <span className="text-slate-600">Your response revealed: </span>
                      {growthQ.selectedOption?.insight ?? "—"}
                    </p>
                  </div>
                )}

                {/* Strength */}
                {strengthQ && strengthQ.points >= 3 && (
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: uiMeta.bg,
                      border: `1px solid ${uiMeta.border}`,
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: uiMeta.color }}
                      />
                      <span
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: uiMeta.color }}
                      >
                        Strength · {strengthQ.theme}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {strengthQ.selectedOption?.insight ?? "—"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ResultsScreen({ results, onReset }) {
  const {
    totalScore,
    percentageScore,
    pillarResults,
    weakestPillar,
    strongestPillar,
    overallTier,
    questionInsights,
    demographics,
  } = results;

  const archetype = ARCHETYPES[overallTier?.label] ?? ARCHETYPES.Wanderer;

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 min-h-screen px-4 py-12 max-w-3xl mx-auto"
    >
      {/* ── 1. Archetype Hero Card ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl p-8 mb-7 relative overflow-hidden"
        style={{ background: archetype.gradient }}
      >
        {/* Decorative glow blob */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 80% 0%, ${archetype.color}30, transparent 60%)`,
          }}
        />

        <div className="relative z-10">
          {/* Top row: emoji + score */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">
                Your Financial Archetype
              </span>
              <span className="text-5xl">{archetype.emoji}</span>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black text-white leading-none">
                {totalScore}
              </div>
              <div className="text-xs text-white/40 mt-0.5">
                out of {MAX_SCORE}
              </div>
              <div
                className="text-2xl font-black mt-1"
                style={{ color: archetype.color }}
              >
                {percentageScore}%
              </div>
            </div>
          </div>

          {/* Name + tagline */}
          <h2 className="text-2xl md:text-3xl font-black text-white mb-1.5">
            {archetype.name}
          </h2>
          <p
            className="text-sm italic mb-5"
            style={{ color: `${archetype.color}CC` }}
          >
            "{archetype.tagline}"
          </p>

          {/* Portrait */}
          <p className="text-sm text-white/75 leading-relaxed">
            {archetype.portrait}
          </p>
        </div>
      </motion.div>

      {/* ── 2. Four Pillar Score Cards ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7"
      >
        {pillarResults.map((pr, i) => {
          const uiMeta  = PILLAR_UI[pr.pillarId];
          const tierKey = pr.tier?.label ?? "Wanderer";

          return (
            <motion.div
              key={pr.pillarId}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.09, duration: 0.45 }}
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{uiMeta.icon}</span>
                  <span className="font-bold text-white text-sm">
                    {uiMeta.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-white">
                    {pr.score}
                  </span>
                  <span className="text-slate-600 text-xs">/20</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{
                      background: uiMeta.bg,
                      color: uiMeta.color,
                      border: `1px solid ${uiMeta.border}`,
                    }}
                  >
                    {tierKey}
                  </span>
                </div>
              </div>

              {/* Score bar */}
              <ScoreBar
                pct={pr.percentage}
                color={uiMeta.color}
                glow={uiMeta.glow}
                delay={0.5 + i * 0.1}
              />

              {/* Tier description */}
              <p className="text-xs text-slate-500 leading-relaxed mt-3">
                {PILLAR_TIER_TEXT[pr.pillarId]?.[tierKey] ?? ""}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── 3. Strongest / Weakest Callouts ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.45 }}
        className="grid grid-cols-2 gap-4 mb-7"
      >
        {/* Strongest */}
        <div
          className="rounded-2xl p-4 text-center"
          style={{
            background: "rgba(52,211,153,0.06)",
            border: "1px solid rgba(52,211,153,0.18)",
          }}
        >
          <TrendingUp
            size={16}
            className="mx-auto mb-2"
            style={{ color: "#34D399" }}
          />
          <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
            Strongest Pillar
          </div>
          <div className="text-2xl mb-1">
            {PILLAR_UI[strongestPillar?.pillarId]?.icon}
          </div>
          <div className="font-bold text-white text-sm">
            {PILLAR_UI[strongestPillar?.pillarId]?.label}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {strongestPillar?.score}/20 pts
          </div>
        </div>

        {/* Weakest / Growth area */}
        <div
          className="rounded-2xl p-4 text-center"
          style={{
            background: "rgba(244,114,182,0.06)",
            border: "1px solid rgba(244,114,182,0.18)",
          }}
        >
          <Target
            size={16}
            className="mx-auto mb-2"
            style={{ color: "#F472B6" }}
          />
          <div className="text-xs font-mono uppercase tracking-widest text-pink-400 mb-1">
            Primary Growth Area
          </div>
          <div className="text-2xl mb-1">
            {PILLAR_UI[weakestPillar?.pillarId]?.icon}
          </div>
          <div className="font-bold text-white text-sm">
            {PILLAR_UI[weakestPillar?.pillarId]?.label}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {weakestPillar?.score}/20 pts
          </div>
        </div>
      </motion.div>

      {/* ── 4. Oracle Challenge ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.45 }}
        className="rounded-2xl p-6 mb-7"
        style={{
          background: "rgba(245,158,11,0.05)",
          border: "1px solid rgba(252,211,77,0.18)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Zap size={15} style={{ color: "#FCD34D" }} />
          <span
            className="text-xs font-mono font-bold uppercase tracking-widest"
            style={{ color: "#FCD34D" }}
          >
            Your Oracle Challenge
          </span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          {archetype.challenge}
        </p>
      </motion.div>

      {/* ── 5. Behavioral Profile Breakdown ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.45 }}
        className="mb-10"
      >
        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
          <BarChart2 size={17} style={{ color: "#818CF8" }} />
          Behavioral Profile Breakdown
        </h3>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          Click any pillar to reveal your specific behavioral signals —
          the growth areas and strengths surfaced by your individual answers.
        </p>

        <div className="space-y-3">
          {pillarResults.map((pr, i) => (
            <PillarInsightCard
              key={pr.pillarId}
              pr={pr}
              questionInsights={questionInsights}
              index={i}
            />
          ))}
        </div>
      </motion.div>

      {/* ── 6. Personalised note based on profession ────────────────────── */}
      {demographics?.professionCategory === "gig" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.88, duration: 0.4 }}
          className="rounded-2xl p-5 mb-7"
          style={{
            background: "rgba(129,140,248,0.05)",
            border: "1px solid rgba(129,140,248,0.18)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Brain size={14} style={{ color: "#818CF8" }} />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">
              Freelancer / Gig Specific Note
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            As a gig worker, the Foundation and Psychology pillars carry
            extra weight for you. Income smoothing (paying yourself a fixed
            monthly salary from a pool account) and a CapEx Vault for
            predictable large expenses are the two systems that convert
            volatile income into salaried-equivalent financial stability.
          </p>
        </motion.div>
      )}

      {demographics?.professionCategory === "corporate" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.88, duration: 0.4 }}
          className="rounded-2xl p-5 mb-7"
          style={{
            background: "rgba(52,211,153,0.05)",
            border: "1px solid rgba(52,211,153,0.18)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} style={{ color: "#34D399" }} />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
              Corporate / Salaried Specific Note
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your Strategy pillar is where the biggest untapped gains live.
            Most salaried employees leave 15–20% of their net take-home on
            the table through sub-optimal salary structure and unclaimed
            employer matches. One afternoon spent with your HR's flexible
            benefits portal can be worth more than a year of SIP returns.
          </p>
        </motion.div>
      )}

      {/* ── Retake ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="flex justify-center pb-8"
      >
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-400 transition-colors"
        >
          <RotateCcw size={13} />
          Retake Assessment
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT — QuizEngine
// Orchestrates all phases; delegates state to Task 1 hooks.
// ─────────────────────────────────────────────────────────────────────────────

export default function QuizEngine() {
  // ── Phase ──────────────────────────────────────────────────────────────────
  const [phase,   setPhase]   = useState(PHASES.WELCOME);
  const [results, setResults] = useState(null);

  // Store final answers ref to avoid stale-closure issues on loading completion
  const finalAnswersRef = useRef(null);

  // ── State from Task 1 hooks ────────────────────────────────────────────────
  const {
    demographics,
    updateDemographic,
    resetDemographics,
    isDemographicsComplete,
  } = useDemographics();

  const {
    currentQuestion,
    currentQuestionIndex,
    answers,
    liveScores,
    answerQuestion,
    goBack,
    resetAssessment,
    totalQuestions,
  } = useAssessment();

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleAnswer = useCallback(
    (questionId, optionId) => {
      // Commit to Task 1 reducer
      answerQuestion(questionId, optionId);

      // If this was the last question, preserve the complete answers and
      // move to the loading phase
      if (currentQuestionIndex === TOTAL_Q - 1) {
        finalAnswersRef.current = { ...answers, [questionId]: optionId };
        // Small delay so the selected-state animation finishes before unmount
        setTimeout(() => setPhase(PHASES.LOADING), 200);
      }
    },
    [answerQuestion, currentQuestionIndex, answers]
  );

  const handleLoadingComplete = useCallback(() => {
    const finalAnswers = finalAnswersRef.current ?? answers;
    const computed = computeResults(demographics, finalAnswers);
    setResults(computed);
    setPhase(PHASES.RESULTS);
  }, [demographics, answers]);

  const handleReset = useCallback(() => {
    resetDemographics();
    resetAssessment();
    setResults(null);
    finalAnswersRef.current = null;
    setPhase(PHASES.WELCOME);
  }, [resetDemographics, resetAssessment]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          "linear-gradient(160deg, #060B14 0%, #090E1B 50%, #070A13 100%)",
        fontFamily:
          "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Persistent ambient background glows */}
      <AmbientGlows />

      <AnimatePresence mode="wait">
        {/* ── WELCOME ── */}
        {phase === PHASES.WELCOME && (
          <WelcomeScreen
            key="welcome"
            onBegin={() => setPhase(PHASES.DEMOGRAPHICS)}
          />
        )}

        {/* ── DEMOGRAPHICS ── */}
        {phase === PHASES.DEMOGRAPHICS && (
          <DemographicsForm
            key="demographics"
            demographics={demographics}
            onChange={updateDemographic}
            onSubmit={() =>
              isDemographicsComplete && setPhase(PHASES.ASSESSMENT)
            }
            isComplete={isDemographicsComplete}
          />
        )}

        {/* ── ASSESSMENT ── */}
        {phase === PHASES.ASSESSMENT && (
          <AssessmentScreen
            key="assessment"
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            liveScores={liveScores}
            onAnswer={handleAnswer}
            onBack={goBack}
          />
        )}

        {/* ── LOADING / CALCULATION ── */}
        {phase === PHASES.LOADING && (
          <LoadingScreen
            key="loading"
            onComplete={handleLoadingComplete}
          />
        )}

        {/* ── RESULTS ── */}
        {phase === PHASES.RESULTS && results && (
          <ResultsScreen
            key="results"
            results={results}
            onReset={handleReset}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
