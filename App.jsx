/**
 * App.jsx — The Financial Oracle: Ramen to Riches
 *
 * Architecture:
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │  DATA LAYER lives in store.js (imported below).             │
 *  │  All shared constants, hooks, and computation functions     │
 *  │  are re-exported from here for backwards compatibility.     │
 *  │                                                             │
 *  │  ROOT COMPONENT (default export)                            │
 *  │   · TopNav  — fixed header with two tabs                    │
 *  │   · Tab "assessment" → <QuizEngine />  (all phases)         │
 *  │   · Tab "hub"        → <KnowledgeHub /> (learn & act)       │
 *  └─────────────────────────────────────────────────────────────┘
 *
 *  QuizEngine.jsx handles its own internal phase state (WELCOME →
 *  DEMOGRAPHICS → ASSESSMENT → LOADING → RESULTS) by consuming the
 *  hooks and functions exported from store.js — NOT from this file,
 *  which breaks the previous circular dependency.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Shared data layer (was previously inline here; moved to break the
//    App → QuizEngine → App circular import that caused the assessment
//    to silently fail at runtime).
export {
  APP_PHASES,
  PROFESSION_CATEGORIES,
  INCOME_BRACKETS,
  computeScores,
  computeResults,
  useAssessment,
  useDemographics,
} from "./store";

// ── Page-level components
import QuizEngine   from "./QuizEngine";
import KnowledgeHub from "./KnowledgeHub";

// ─────────────────────────────────────────────────────────────────────────────
// NAV TABS CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const NAV_TABS = [
  {
    id:    "assessment",
    label: "The Oracle Assessment",
    icon:  "🔮",
    shortLabel: "Assessment",
  },
  {
    id:    "hub",
    label: "Knowledge Hub",
    icon:  "📚",
    shortLabel: "Learn",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TOP NAVIGATION BAR
// ─────────────────────────────────────────────────────────────────────────────

function TopNav({ activeTab, onTabChange }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: "56px",
        background: scrolled
          ? "rgba(7,11,20,0.92)"
          : "rgba(7,11,20,0.8)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(255,255,255,0.04)",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between gap-4">

        {/* ── Brand ────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <span className="text-xl">🔮</span>
          <div className="hidden sm:block">
            <span className="font-bold text-white text-sm leading-none">
              Financial Oracle
            </span>
            <span
              className="block text-sm leading-none mt-0.5 font-medium"
              style={{ color: "#64748B" }}
            >
              Ramen to Riches
            </span>
          </div>
        </div>

        {/* ── Tab switcher ─────────────────────────────────────────── */}
        <div
          className="flex items-center rounded-xl p-1 gap-0.5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors focus:outline-none"
                style={{
                  color: isActive ? "#ffffff" : "#64748B",
                  zIndex: 1,
                }}
              >
                {/* Active background pill — slides between tabs */}
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.08)", zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}

                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>

                {/* Active indicator dot */}
                {isActive && (
                  <motion.span
                    layoutId="nav-dot"
                    className="w-1 h-1 rounded-full"
                    style={{ background: "#818CF8" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Right side: subtle brand tagline ────────────────────── */}
        <div
          className="hidden md:block text-xs font-mono flex-shrink-0"
          style={{ color: "#334155" }}
        >
          20 questions · 4 pillars
        </div>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE TRANSITION WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2,  ease: [0.4, 0, 1, 0.6]  } },
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState("assessment");

  // ── Listen for cross-component tab-switch events (e.g., from KnowledgeHub CTA) ──
  useEffect(() => {
    const handler = (e) => {
      if (e.detail === "assessment" || e.detail === "hub") {
        setActiveTab(e.detail);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    window.addEventListener("oracle:switch-tab", handler);
    return () => window.removeEventListener("oracle:switch-tab", handler);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen font-sans antialiased"
      style={{ background: "#070B14", color: "#E2E8F0" }}
    >
      {/* Fixed top navigation */}
      <TopNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Page content — offset by nav height (56px) */}
      <main style={{ paddingTop: "56px" }}>
        <AnimatePresence mode="wait">
          {activeTab === "assessment" ? (
            <motion.div
              key="assessment"
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              {/*
                QuizEngine is fully self-contained.
                It manages WELCOME → DEMOGRAPHICS → ASSESSMENT → LOADING → RESULTS
                internally, consuming the hooks/functions exported from this file.
              */}
              <QuizEngine />
            </motion.div>
          ) : (
            <motion.div
              key="hub"
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              <KnowledgeHub />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── DEV STATE INSPECTOR ─────────────────────────────────────── */}
      {process.env.NODE_ENV === "development" && (
        <details
          className="fixed bottom-4 right-4 z-50 rounded-lg p-3 text-xs max-w-xs"
          style={{
            background: "rgba(7,11,20,0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <summary
            className="cursor-pointer font-mono font-bold mb-2"
            style={{ color: "#818CF8" }}
          >
            🔍 Dev: App State
          </summary>
          <div className="font-mono space-y-1" style={{ color: "#94A3B8" }}>
            <div>
              <span style={{ color: "#FCD34D" }}>activeTab:</span> {activeTab}
            </div>
          </div>
        </details>
      )}
    </div>
  );
}
