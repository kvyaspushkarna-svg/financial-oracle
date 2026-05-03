/**
 * KnowledgeHub.jsx — The Financial Oracle: Ramen to Riches
 *
 * Task 4: A dedicated learning page for the four Ramen to Riches pillars.
 * Each pillar card is collapsed by default and expands on click to reveal
 * deep-dive concept breakdowns and premium fintech CTA links.
 *
 * No props required. Self-contained.
 */

import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// DATA — Four pillar definitions with concepts and CTAs
// ─────────────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    id: "foundation",
    number: "01",
    icon: "🏛️",
    title: "The Foundation",
    subtitle: "Cash Flow Architecture",
    tagline: "How money moves through your life determines how much of it stays.",
    color: "#818CF8",         // lighter indigo — readable on dark
    rawColor: "#6366F1",
    glowColor: "rgba(99,102,241,0.18)",
    bgColor: "rgba(99,102,241,0.06)",
    borderColor: "rgba(99,102,241,0.22)",
    tags: ["30:30:30:10 Rule", "CapEx Vault", "Automation"],
    summary:
      "The Foundation pillar is the plumbing of your financial life. Without it, every other strategy leaks. It answers one question: where does your money go the moment it arrives?",
    concepts: [
      {
        number: "1",
        title: "The 30:30:30:10 Rule",
        body: "Your income gets allocated on Day 1 — before you can spend it. 30% to essential needs (rent, food, transport). 30% to wealth-building investments (SIPs, PPF, debt instruments). 30% to lifestyle (dining, entertainment, subscriptions — entirely guilt-free). 10% to an Opportunity Vault (lump-sum deployment during market dips or high-ROI skill purchases). The entire architecture is automated: all four transfers execute before your hands touch the money. Systems, not willpower.",
        callout: "₹60,000 salary → ₹18K needs · ₹18K investments · ₹18K lifestyle · ₹6K opportunity",
      },
      {
        number: "2",
        title: "The Capital Expenditure Vault",
        body: "CapEx events are large, irregular — but entirely predictable: laptop replacement, car servicing, annual insurance premiums, medical top-ups, vacation, tax deposits. Most people fund these from their emergency fund or a credit card — both are wrong. A CapEx Vault is a separate account funded monthly during high-income periods. When the laptop dies, you make a scheduled withdrawal, not a panicked decision. Your emergency fund stays untouched; its job is genuine emergencies only.",
        callout: "Separate account · Monthly contributions · No credit card debt for predictable costs",
      },
      {
        number: "3",
        title: "Automating Every Savings Action",
        body: "Financial willpower is a finite, depletable resource. The research is clear: people who rely on active monthly saving decisions save less than people whose saving is automated. The architecture: Day 1 auto-transfers split income into the 30:30:30:10 buckets. SIP auto-debits execute on the 2nd. PPF contribution lands on April 1st. Nothing requires a decision. Your financial system runs identically whether you are motivated or exhausted.",
        callout: "Automate on Day 1 · No active decisions = no willpower required",
      },
    ],
    ctas: [
      { label: "Track Expenses", sub: "Moneyfy App", url: "https://moneyfy.onelink.me/app/web", icon: "📊" },
      { label: "High-Yield Savings", sub: "Fi Money", url: "https://fi.money/", icon: "🏦" },
      { label: "Jar — Round-Up Savings", sub: "Jar App", url: "https://www.myjar.app/", icon: "🫙" },
      { label: "Automate your SIPs", sub: "Groww", url: "https://groww.in/", icon: "⚡" },
    ],
    readMoreUrl: "https://zerodha.com/varsity/chapter/the-need-to-save/",
  },
  {
    id: "growthEngine",
    number: "02",
    icon: "🚀",
    title: "The Growth Engine",
    subtitle: "Compounding & Tax Efficiency",
    tagline: "Saving is not investing. Compounding is the only wealth that earns while you sleep.",
    color: "#34D399",         // lighter emerald
    rawColor: "#10B981",
    glowColor: "rgba(16,185,129,0.18)",
    bgColor: "rgba(16,185,129,0.06)",
    borderColor: "rgba(16,185,129,0.22)",
    tags: ["SIP / RCA", "PPF (EEE)", "Fixed Income Ballast"],
    summary:
      "The Growth Engine converts saved capital into a compounding machine. The instruments are not complex — the discipline of deploying them consistently is the entire strategy. Start boring. Get rich.",
    concepts: [
      {
        number: "1",
        title: "SIPs & Rupee Cost Averaging (RCA)",
        body: "A Systematic Investment Plan (SIP) auto-invests a fixed amount monthly into a mutual fund regardless of market conditions. When markets are high, you buy fewer units. When markets fall, you buy more. Over time, your average cost per unit smooths automatically — this is Rupee Cost Averaging. The result: you outperform most retail investors not through skill or timing, but through mechanical, emotion-free consistency. A ₹5,000/month Nifty 50 index SIP started at 25 grows to approximately ₹1.75 crore by 55 at 12% historical CAGR. The number is not the point — the principle is: start now, never stop.",
        callout: "₹5,000/month × 30 years × 12% CAGR ≈ ₹1.75 crore",
      },
      {
        number: "2",
        title: "PPF — The Triple Tax Shield (EEE Status)",
        body: "The Public Provident Fund is the most underutilised wealth-building instrument in India. It carries EEE status: Exempt on contribution (Section 80C deduction up to ₹1.5 lakh per year), Exempt on interest accrual (currently 7.1% — completely tax-free), and Exempt on maturity (the full corpus is yours, untaxed). No other legal Indian instrument provides all three shields simultaneously. Maximise the full ₹1.5L every year, ideally deposited on April 1st — this earns you one full extra month of interest versus a March contribution.",
        callout: "EEE = 3x tax-free · Max ₹1.5L/year · Front-load on April 1st",
      },
      {
        number: "3",
        title: "Fixed Income as Strategic Ballast",
        body: "Holding 20–30% of your portfolio in debt instruments (liquid funds, short-duration debt funds, Government Securities, PPF) serves two critical functions. First, it reduces volatility so you do not panic-sell equity during corrections. Second, it is dry powder — liquid capital that can be redeployed into equity when markets fall 15% or more, when other investors are panic-exiting and assets are temporarily discounted. Fixed income is not 'safe but boring'. It is the stabiliser that lets you stay in equity long enough to benefit from it.",
        callout: "20–30% debt allocation · Reduces volatility · Dry powder for corrections",
      },
    ],
    ctas: [
      { label: "Start SIP on Groww", sub: "Mutual Funds", url: "https://groww.in/mutual-funds/category/best-sip-mutual-funds", icon: "📈" },
      { label: "Open Demat Account", sub: "Zerodha", url: "https://zerodha.com/open-account/", icon: "🚀" },
      { label: "Explore HDFC Sky", sub: "Invest & Trade", url: "https://www.hdfcsky.com/", icon: "🏦" },
      { label: "Open PPF Account", sub: "India Post Office", url: "https://www.indiapost.gov.in/Financial/pages/content/ppf.aspx", icon: "🛡️" },
    ],
    readMoreUrl: "https://zerodha.com/varsity/chapter/rupee-cost-averaging/",
  },
  {
    id: "strategy",
    number: "03",
    icon: "♟️",
    title: "Strategy & Mindset",
    subtitle: "Execution Over Optimisation",
    tagline: "The enemy of your wealth is not market volatility. It is your own analysis paralysis.",
    color: "#FCD34D",         // lighter amber
    rawColor: "#F59E0B",
    glowColor: "rgba(245,158,11,0.18)",
    bgColor: "rgba(245,158,11,0.06)",
    borderColor: "rgba(245,158,11,0.22)",
    tags: ["Competence Trap", "Index Funds", "Salary Architecture"],
    summary:
      "Strategy is about making fewer, better decisions — then automating them so execution is mechanical, not emotional. The highest-ROI financial activities are simpler than your intelligence wants them to be.",
    concepts: [
      {
        number: "1",
        title: "The Competence Trap — Intelligence vs. Execution",
        body: "High-knowledge individuals are statistically more likely to delay financial action than those with less information. The mechanism: expertise reveals complexity → complexity triggers search for the 'optimal' solution → the search replaces action indefinitely. This is the Competence Trap. The antidote is a pre-commitment device: 'If I have not decided within 2 weeks, I default to a Nifty 50 index fund SIP and start immediately.' Every month of inaction is approximately 1% of annual equity returns lost permanently — a cost that compounds in reverse just as powerfully as returns compound forward.",
        callout: "2-Week Rule: undecided → default to Nifty 50 index SIP immediately",
      },
      {
        number: "2",
        title: "Index Funds Beat Active Funds — The Data",
        body: "Over any 10-year period in India, more than 85% of actively managed large-cap equity funds underperform the Nifty 50 index after fees. The index does not require you to research individual companies, predict earnings, manage a fund manager's career incentives, or time the market. It holds all 50 large-cap companies proportionally and rebalances automatically. A low-cost Nifty 50 index fund has an expense ratio of approximately 0.1%, versus 1.5–2.0% for active funds. That 1.5% compounding difference over 25 years is not academic — it is lakhs of rupees.",
        callout: "85%+ of active large-cap funds underperform the index over 10 years",
      },
      {
        number: "3",
        title: "Corporate Tax Architecture — Your Highest-ROI Activity",
        body: "For salaried employees, salary restructuring is the highest-ROI annual activity available. Two focused hours every April reviewing HRA, LTA, meal vouchers, NPS employer contribution (Section 80CCD(2) — an additional ₹50,000 deduction beyond 80C), and uniform allowance can legally save ₹50,000–₹2,00,000 in tax per year. For a ₹15L CTC employee paying 30% tax, this represents a ₹60,000+ annual return on 2 hours of work. No SIP can match that per-hour ROI. Many salaried professionals leave this money unclaimed simply by accepting the default HR benefits structure.",
        callout: "2 hours/year in April can save ₹50K–₹2L in tax legally",
      },
    ],
    ctas: [
      { label: "Open Demat Account", sub: "Zerodha", url: "https://zerodha.com/open-account/", icon: "🚀" },
      { label: "Tax Calculator", sub: "ClearTax", url: "https://cleartax.in/s/income-tax-calculator", icon: "🧮" },
      { label: "Salary Restructuring Guide", sub: "ClearTax", url: "https://cleartax.in/s/how-to-restructure-salary-for-tax-savings", icon: "📖" },
      { label: "Learn Strategy (Free)", sub: "Zerodha Varsity", url: "https://zerodha.com/varsity/", icon: "🎓" },
    ],
    readMoreUrl: "https://zerodha.com/varsity/module/personalfinance/",
  },
  {
    id: "psychology",
    number: "04",
    icon: "🧠",
    title: "The Mind-Body Ledger",
    subtitle: "Psychological Capital & Resilience",
    tagline: "Your ability to earn is your most valuable asset. Protect it with the same rigour you apply to your portfolio.",
    color: "#F472B6",         // lighter pink
    rawColor: "#EC4899",
    glowColor: "rgba(236,72,153,0.18)",
    bgColor: "rgba(236,72,153,0.06)",
    borderColor: "rgba(236,72,153,0.22)",
    tags: ["Feast-Famine Protocol", "72-Hour Rule", "Burnout & Bias"],
    summary:
      "Financial psychology is not soft science — it is quantifiable. Burnout costs money. Anxiety impairs decisions. The Mind-Body Ledger treats your mental state as a balance sheet item, because that is precisely what it is.",
    concepts: [
      {
        number: "1",
        title: "The Feast-or-Famine Protocol",
        body: "Variable-income earners — freelancers, commission-based salespeople, business owners — face income volatility that salaried employees do not. The Feast-or-Famine Protocol converts unpredictability into artificial stability. Architecture: all client income lands in a Pool Account. A fixed monthly 'founder salary' is transferred to your personal account on Day 1, regardless of what revenue came in. High-income months build the pool. Low-income months draw from it. Your financial behaviour — spending, saving, investing — stays identical regardless of revenue spikes or droughts. Psychological consistency is the output. Compounding is the consequence.",
        callout: "Pool Account → fixed monthly salary → surplus funds lean months",
      },
      {
        number: "2",
        title: "The 72-Hour Rule for Financial Shocks",
        body: "When a significant negative financial event occurs — a large unexpected expense, a market crash notification, a sudden income disruption — the 72-Hour Rule applies unconditionally: make no financial decisions for 72 hours. Acute psychological stress releases cortisol, which measurably increases loss aversion, reduces risk tolerance, accelerates temporal discounting (the future feels less real), and triggers the fight-or-flight panic response in financial contexts. These effects peak within 24 hours and largely subside by 72. The most expensive financial decisions most people ever make happen in the first few hours after a shock. Waiting costs nothing. Acting costs everything.",
        callout: "Shock occurs → wait 72 hours → then and only then make decisions",
      },
      {
        number: "3",
        title: "How Burnout Amplifies Cognitive Biases",
        body: "Financial anxiety and chronic overwork do not just feel bad — they make you measurably worse at financial decision-making. Under sustained stress: loss aversion intensifies (you hold losing investments too long to avoid the emotional pain of realising the loss), present bias increases (future compound growth feels abstract and unreal, so you spend now), overconfidence oscillates (alternating between over-trading and paralysis), and confirmation bias strengthens (you seek news that confirms your fear, not data). Protecting your psychological capital through a pre-funded joy budget, scheduled rest, and hard work-rest boundaries is not indulgence. It is the most rational risk-management decision in your financial plan.",
        callout: "Burnout → 4 amplified biases → expensive financial mistakes",
      },
    ],
    ctas: [
      { label: "Track Net Worth", sub: "Smallcase", url: "https://www.smallcase.com/", icon: "📊" },
      { label: "Get Term Insurance", sub: "PolicyBazaar", url: "https://www.policybazaar.com/life-insurance/term-insurance/", icon: "🛡️" },
      { label: "Behavioural Finance (Free)", sub: "Zerodha Varsity", url: "https://zerodha.com/varsity/module/trading-psychology/", icon: "🧠" },
      { label: "Health Insurance", sub: "Ditto Insurance", url: "https://joinditto.in/", icon: "💊" },
    ],
    readMoreUrl: "https://zerodha.com/varsity/module/trading-psychology/",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const expandVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.28, ease: [0.4, 0, 1, 0.6] },
  },
};

const conceptVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/** Tag chip displayed on collapsed card header */
function TagChip({ label, color }) {
  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full"
      style={{
        background: `${color}15`,
        color: color,
        border: `1px solid ${color}28`,
      }}
    >
      {label}
    </span>
  );
}

/** Concept breakdown card within expanded panel */
function ConceptCard({ concept, index, color, bgColor, borderColor }) {
  return (
    <motion.div
      custom={index}
      variants={conceptVariants}
      initial="hidden"
      animate="visible"
      className="rounded-xl p-5"
      style={{ background: bgColor, border: `1px solid ${borderColor}` }}
    >
      {/* Concept header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
          style={{ background: `${color}22`, color }}
        >
          {concept.number}
        </div>
        <h4 className="font-bold text-white leading-snug">{concept.title}</h4>
      </div>

      {/* Body */}
      <p
        className="text-sm leading-relaxed mb-4"
        style={{ color: "rgba(226,232,240,0.75)" }}
      >
        {concept.body}
      </p>

      {/* Callout highlight */}
      {concept.callout && (
        <div
          className="rounded-lg px-4 py-2.5 text-xs font-mono leading-relaxed"
          style={{
            background: `${color}10`,
            border: `1px solid ${color}20`,
            color: color,
          }}
        >
          ⟶ {concept.callout}
        </div>
      )}
    </motion.div>
  );
}

/** Premium fintech CTA button linking to an external platform */
function ActionButton({ cta, accentColor }) {
  return (
    <motion.a
      href={cta.url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid rgba(255,255,255,0.09)`,
        textDecoration: "none",
        transition: "all 0.18s ease",
      }}
    >
      {/* Icon badge */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: `${accentColor}15` }}
      >
        {cta.icon}
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white leading-tight">
          {cta.label}
        </div>
        {cta.sub && (
          <div className="text-xs mt-0.5" style={{ color: "#64748B" }}>
            {cta.sub}
          </div>
        )}
      </div>

      {/* Arrow */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="flex-shrink-0"
        style={{ color: accentColor, opacity: 0.7 }}
      >
        <path
          d="M1 13L13 1M13 1H5M13 1V9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.a>
  );
}

/** Main expandable pillar card */
function PillarCard({ pillar, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl overflow-hidden"
      style={{
        background: isOpen
          ? `linear-gradient(160deg, ${pillar.rawColor}10 0%, rgba(255,255,255,0.02) 50%)`
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${isOpen ? pillar.borderColor : "rgba(255,255,255,0.07)"}`,
        boxShadow: isOpen ? `0 0 40px ${pillar.glowColor}` : "none",
        transition: "box-shadow 0.4s ease, border-color 0.3s ease, background 0.3s ease",
      }}
    >
      {/* ── CARD HEADER (always visible) ─────────────────────────────── */}
      <button
        className="w-full text-left p-6 focus:outline-none"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Left: number + icon + title */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Number badge */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{
                background: pillar.bgColor,
                border: `1px solid ${pillar.borderColor}`,
                color: pillar.color,
              }}
            >
              {pillar.number}
            </div>

            <div className="flex-1 min-w-0">
              {/* Title row */}
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <span className="text-xl leading-none">{pillar.icon}</span>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {pillar.title}
                </h3>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium hidden sm:inline-block"
                  style={{
                    background: pillar.bgColor,
                    color: pillar.color,
                    border: `1px solid ${pillar.borderColor}`,
                  }}
                >
                  {pillar.subtitle}
                </span>
              </div>

              {/* Tagline */}
              <p
                className="text-sm leading-relaxed mb-3"
                style={{ color: "rgba(148,163,184,0.85)" }}
              >
                {pillar.tagline}
              </p>

              {/* Tag chips */}
              <div className="flex flex-wrap gap-1.5">
                {pillar.tags.map((tag) => (
                  <TagChip key={tag} label={tag} color={pillar.color} />
                ))}
              </div>
            </div>
          </div>

          {/* Right: expand toggle */}
          <div className="flex-shrink-0 pt-1">
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: isOpen ? `${pillar.rawColor}18` : "rgba(255,255,255,0.05)",
                border: `1px solid ${isOpen ? pillar.borderColor : "rgba(255,255,255,0.08)"}`,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                style={{ color: isOpen ? pillar.color : "#64748B" }}
              >
                <path
                  d="M2 4.5L7 9.5L12 4.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Open hint when collapsed */}
        {!isOpen && (
          <p
            className="text-xs mt-3 font-medium"
            style={{ color: pillar.color, opacity: 0.7 }}
          >
            Click to explore concepts + take action →
          </p>
        )}
      </button>

      {/* ── EXPANDABLE CONTENT ────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="expanded"
            variants={expandVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ overflow: "hidden" }}
          >
            {/* Divider */}
            <div
              className="mx-6"
              style={{ borderTop: `1px solid ${pillar.borderColor}`, opacity: 0.5 }}
            />

            <div className="p-6 pt-5 space-y-6">
              {/* Summary paragraph */}
              <p
                className="text-[15px] leading-relaxed"
                style={{ color: "rgba(226,232,240,0.9)" }}
              >
                {pillar.summary}
              </p>

              {/* Concept breakdown cards */}
              <div className="space-y-3">
                <p
                  className="text-xs font-mono uppercase tracking-widest"
                  style={{ color: "#475569" }}
                >
                  Core Concepts
                </p>
                {pillar.concepts.map((concept, i) => (
                  <ConceptCard
                    key={concept.title}
                    concept={concept}
                    index={i}
                    color={pillar.color}
                    bgColor={pillar.bgColor}
                    borderColor={pillar.borderColor}
                  />
                ))}
              </div>

              {/* CTA Action buttons */}
              <div>
                <p
                  className="text-xs font-mono uppercase tracking-widest mb-3"
                  style={{ color: "#475569" }}
                >
                  Take Action
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {pillar.ctas.map((cta) => (
                    <ActionButton
                      key={cta.label}
                      cta={cta}
                      accentColor={pillar.color}
                    />
                  ))}
                </div>
              </div>

              {/* Learn More footer link */}
              <div className="flex items-center justify-between pt-1">
                <a
                  href={pillar.readMoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium flex items-center gap-1.5 transition-opacity hover:opacity-100"
                  style={{ color: pillar.color, opacity: 0.6, textDecoration: "none" }}
                >
                  <span>📚</span>
                  <span>Deep-dive: Zerodha Varsity</span>
                  <span>↗</span>
                </a>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs transition-opacity hover:opacity-100"
                  style={{ color: "#475569", opacity: 0.6 }}
                >
                  ▲ Collapse
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KNOWLEDGE HUB — STAT BAR (decorative metrics at the top)
// ─────────────────────────────────────────────────────────────────────────────

const HUB_STATS = [
  { value: "4", label: "Pillars of Wealth", icon: "🏛️" },
  { value: "20", label: "Core Concepts", icon: "💡" },
  { value: "16+", label: "Action Links", icon: "🔗" },
  { value: "∞", label: "Compounding Runway", icon: "📈" },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export default function KnowledgeHub() {
  const [allOpen, setAllOpen] = useState(false);
  // We use a key-based trick to reset all cards open/closed
  const [expandKey, setExpandKey] = useState(0);
  const [defaultOpen, setDefaultOpen] = useState(false);

  const handleExpandAll = () => {
    setDefaultOpen(true);
    setExpandKey((k) => k + 1);
  };

  const handleCollapseAll = () => {
    setDefaultOpen(false);
    setExpandKey((k) => k + 1);
  };

  return (
    <div
      className="min-h-screen w-full font-sans antialiased"
      style={{ background: "#070B14", color: "#E2E8F0" }}
    >
      {/* Ambient gradient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% -15%, rgba(99,102,241,0.1) 0%, transparent 60%), " +
            "radial-gradient(ellipse 60% 30% at 85% 80%, rgba(16,185,129,0.07) 0%, transparent 50%)",
          zIndex: 0,
        }}
      />

      <div
        className="relative max-w-3xl mx-auto px-4 py-10 pb-24 space-y-8"
        style={{ zIndex: 1 }}
      >
        {/* ══════════════════════════════════════════════════════════════
            HERO HEADER
        ══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#64748B" }}
          >
            <span>📚</span>
            <span>Ramen to Riches · Knowledge Hub</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            The Four Pillars of{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #818CF8 0%, #34D399 50%, #FCD34D 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Financial Freedom
            </span>
          </h1>

          <p
            className="text-[15px] leading-relaxed max-w-xl mx-auto"
            style={{ color: "rgba(148,163,184,0.85)" }}
          >
            Every concept from the Ramen to Riches framework, explained from
            first principles — with direct links to put each one into practice
            today.
          </p>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════
            STAT BAR
        ══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {HUB_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.15 + i * 0.07 }}
              className="rounded-xl p-4 text-center"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-white mb-0.5">
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: "#475569" }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════
            PILLAR NAVIGATION PILLS (anchor links)
        ══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex flex-wrap gap-2">
            {PILLARS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  document
                    .getElementById(`pillar-${p.id}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: `${p.rawColor}10`,
                  border: `1px solid ${p.borderColor}`,
                  color: p.color,
                }}
              >
                <span>{p.icon}</span>
                <span className="hidden sm:inline">{p.title}</span>
                <span className="sm:hidden">{p.number}</span>
              </button>
            ))}
          </div>

          {/* Expand / Collapse all */}
          <div className="flex gap-2">
            <button
              onClick={handleExpandAll}
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#94A3B8",
              }}
            >
              Expand All
            </button>
            <button
              onClick={handleCollapseAll}
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#64748B",
              }}
            >
              Collapse All
            </button>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════
            PILLAR CARDS
            Single full-width column for clean expand behaviour.
        ══════════════════════════════════════════════════════════════ */}
        <div className="space-y-4">
          {PILLARS.map((pillar, i) => (
            <div key={`${pillar.id}-${expandKey}`} id={`pillar-${pillar.id}`}>
              <PillarCardControlled
                pillar={pillar}
                index={i}
                defaultOpen={defaultOpen}
              />
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            FOOTER CTA — Take the Assessment
        ══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="rounded-2xl p-7 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(16,185,129,0.05) 100%)",
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        >
          <div className="text-3xl mb-3">🔮</div>
          <h3 className="font-bold text-white text-lg mb-2">
            Ready to know your Financial DNA?
          </h3>
          <p
            className="text-sm leading-relaxed max-w-sm mx-auto mb-5"
            style={{ color: "#94A3B8" }}
          >
            Take the 20-question Oracle Assessment to discover your archetype,
            score all four pillars, and receive a personalised prescription.
          </p>

          {/* This button uses window.dispatchEvent to signal a tab change.
              The parent App.jsx listens and switches to the assessment tab.
              This keeps KnowledgeHub decoupled from App state. */}
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("oracle:switch-tab", { detail: "assessment" })
              )
            }
            className="px-8 py-3 rounded-xl font-bold text-sm text-white"
            style={{
              background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
              boxShadow: "0 0 24px rgba(99,102,241,0.35)",
            }}
          >
            Take the Assessment →
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PillarCardControlled — variant that accepts defaultOpen prop
// Used by the Expand All / Collapse All mechanism
// ─────────────────────────────────────────────────────────────────────────────

function PillarCardControlled({ pillar, index, defaultOpen }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl overflow-hidden"
      style={{
        background: isOpen
          ? `linear-gradient(160deg, ${pillar.rawColor}10 0%, rgba(255,255,255,0.02) 50%)`
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${isOpen ? pillar.borderColor : "rgba(255,255,255,0.07)"}`,
        boxShadow: isOpen ? `0 0 40px ${pillar.glowColor}` : "none",
        transition: "box-shadow 0.4s ease, border-color 0.3s ease, background 0.3s ease",
      }}
    >
      {/* ── CARD HEADER ─────────────────────────────────────────────── */}
      <button
        className="w-full text-left p-6 focus:outline-none"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Number badge */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{
                background: pillar.bgColor,
                border: `1px solid ${pillar.borderColor}`,
                color: pillar.color,
              }}
            >
              {pillar.number}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <span className="text-xl leading-none">{pillar.icon}</span>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {pillar.title}
                </h3>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium hidden sm:inline-block"
                  style={{
                    background: pillar.bgColor,
                    color: pillar.color,
                    border: `1px solid ${pillar.borderColor}`,
                  }}
                >
                  {pillar.subtitle}
                </span>
              </div>

              <p
                className="text-sm leading-relaxed mb-3"
                style={{ color: "rgba(148,163,184,0.85)" }}
              >
                {pillar.tagline}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {pillar.tags.map((tag) => (
                  <TagChip key={tag} label={tag} color={pillar.color} />
                ))}
              </div>
            </div>
          </div>

          {/* Chevron toggle */}
          <div className="flex-shrink-0 pt-1">
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: isOpen ? `${pillar.rawColor}18` : "rgba(255,255,255,0.05)",
                border: `1px solid ${isOpen ? pillar.borderColor : "rgba(255,255,255,0.08)"}`,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                style={{ color: isOpen ? pillar.color : "#64748B" }}
              >
                <path
                  d="M2 4.5L7 9.5L12 4.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </div>
        </div>

        {!isOpen && (
          <p
            className="text-xs mt-3 font-medium"
            style={{ color: pillar.color, opacity: 0.7 }}
          >
            Click to explore concepts + take action →
          </p>
        )}
      </button>

      {/* ── EXPANDABLE BODY ──────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="expanded"
            variants={expandVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ overflow: "hidden" }}
          >
            <div
              className="mx-6"
              style={{ borderTop: `1px solid ${pillar.borderColor}`, opacity: 0.5 }}
            />

            <div className="p-6 pt-5 space-y-6">
              <p
                className="text-[15px] leading-relaxed"
                style={{ color: "rgba(226,232,240,0.9)" }}
              >
                {pillar.summary}
              </p>

              <div className="space-y-3">
                <p
                  className="text-xs font-mono uppercase tracking-widest"
                  style={{ color: "#475569" }}
                >
                  Core Concepts
                </p>
                {pillar.concepts.map((concept, i) => (
                  <ConceptCard
                    key={concept.title}
                    concept={concept}
                    index={i}
                    color={pillar.color}
                    bgColor={pillar.bgColor}
                    borderColor={pillar.borderColor}
                  />
                ))}
              </div>

              <div>
                <p
                  className="text-xs font-mono uppercase tracking-widest mb-3"
                  style={{ color: "#475569" }}
                >
                  Take Action
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {pillar.ctas.map((cta) => (
                    <ActionButton
                      key={cta.label}
                      cta={cta}
                      accentColor={pillar.color}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <a
                  href={pillar.readMoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium flex items-center gap-1.5 hover:opacity-100"
                  style={{ color: pillar.color, opacity: 0.6, textDecoration: "none" }}
                >
                  <span>📚</span>
                  <span>Deep-dive: Zerodha Varsity</span>
                  <span>↗</span>
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs hover:opacity-100"
                  style={{ color: "#475569", opacity: 0.6 }}
                >
                  ▲ Collapse
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
