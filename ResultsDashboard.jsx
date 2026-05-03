/**
 * ResultsDashboard.jsx — The Financial Oracle: Ramen to Riches
 *
 * Task 3: The Results Dashboard & Personalization Algorithm
 *
 * Props:
 *   results  — output of computeResults(demographics, answers) from App.jsx
 *   onReset  — callback to restart the assessment
 *
 * Integration:
 *   In QuizEngine.jsx, replace the internal <ResultsScreen /> render with:
 *   <ResultsDashboard results={finalResults} onReset={handleReset} />
 *
 *   Where finalResults = computeResults(demographics, finalAnswersRef.current)
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// ARCHETYPE DEFINITIONS — keyed by weakest pillar ID
// Requirement: lowest-scoring pillar determines the primary archetype
// ─────────────────────────────────────────────────────────────────────────────

const ARCHETYPES = {
  foundation: {
    name: "The Blocked Earner",
    focus: "Cashflow & Bootstrap Hustling",
    emoji: "🧱",
    color: "#F97316",
    glowColor: "rgba(249,115,22,0.2)",
    tagline: "Your income arrives — but it leaks before it can build anything.",
    challenge:
      "Design a cash flow system that operates before willpower ever gets involved.",
    description:
      "Money enters your life but exits without allocation. There is no automated system separating needs, investments, lifestyle, and opportunity — every rupee competes for the same account, and the loudest expense always wins.",
  },
  growthEngine: {
    name: "The Stagnant Saver",
    focus: "SIPs & Compounding",
    emoji: "💤",
    color: "#3B82F6",
    glowColor: "rgba(59,130,246,0.2)",
    tagline: "You save well — but your money is barely working.",
    challenge:
      "Convert your savings from a storage habit into a compounding engine that outpaces inflation.",
    description:
      "Savings are accumulating, but in instruments that erosion to inflation in real terms. The compound interest engine — the single most powerful force in personal finance — is either switched off or running far below capacity.",
  },
  strategy: {
    name: "The Competence Trap Victim",
    focus: "Overcoming Analysis Paralysis",
    emoji: "♟️",
    color: "#8B5CF6",
    glowColor: "rgba(139,92,246,0.2)",
    tagline: "You know enough to start. You just haven't started.",
    challenge:
      "Deploy a pre-commitment device that makes inaction structurally impossible.",
    description:
      "Over-researching and under-deploying. High intelligence is being weaponized against wealth creation. Every month of inaction is approximately 1% of annual equity returns lost permanently — a cost that compounds in reverse just as powerfully as returns compound forward.",
  },
  psychology: {
    name: "The Burned-Out Hustler",
    focus: "Boundaries & Psychological Capital",
    emoji: "🔥",
    color: "#EC4899",
    glowColor: "rgba(236,72,153,0.2)",
    tagline: "You grind hard — but your mental capital is your real balance sheet.",
    challenge:
      "Protect your psychological capital as fiercely as you protect your savings rate.",
    description:
      "Wealth-building has become a source of anxiety rather than a designed system. Without a joy budget and psychological recovery mechanism, the trajectory leads to burnout, binge spending, or both — outcomes that erase more wealth than poor investment decisions ever could.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PILLAR UI TOKENS — visual styling per pillar (lighter variants for dark bg)
// ─────────────────────────────────────────────────────────────────────────────

const PILLAR_UI = {
  foundation: {
    color: "#818CF8",
    bg: "rgba(99,102,241,0.07)",
    border: "rgba(99,102,241,0.22)",
    icon: "🏛️",
    label: "Foundation",
  },
  growthEngine: {
    color: "#34D399",
    bg: "rgba(16,185,129,0.07)",
    border: "rgba(16,185,129,0.22)",
    icon: "🚀",
    label: "Growth Engine",
  },
  strategy: {
    color: "#FCD34D",
    bg: "rgba(245,158,11,0.07)",
    border: "rgba(245,158,11,0.22)",
    icon: "♟️",
    label: "Strategy",
  },
  psychology: {
    color: "#F472B6",
    bg: "rgba(236,72,153,0.07)",
    border: "rgba(236,72,153,0.22)",
    icon: "🧠",
    label: "Psychology",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TIER BADGE STYLES
// ─────────────────────────────────────────────────────────────────────────────

const TIER_STYLES = {
  Oracle:     { bg: "rgba(99,102,241,0.15)",  color: "#A5B4FC", border: "rgba(99,102,241,0.35)"  },
  Strategist: { bg: "rgba(16,185,129,0.15)",  color: "#6EE7B7", border: "rgba(16,185,129,0.35)"  },
  Apprentice: { bg: "rgba(245,158,11,0.15)",  color: "#FDE68A", border: "rgba(245,158,11,0.35)"  },
  Wanderer:   { bg: "rgba(239,68,68,0.15)",   color: "#FCA5A5", border: "rgba(239,68,68,0.35)"   },
};

// ─────────────────────────────────────────────────────────────────────────────
// PROFESSION DISPLAY LABELS
// ─────────────────────────────────────────────────────────────────────────────

const PROFESSION_LABELS = {
  corporate: "Salaried Professional",
  gig:       "Freelancer / Gig Worker",
  student:   "Student",
  business:  "Business Owner",
};

// ─────────────────────────────────────────────────────────────────────────────
// EMPATHY COPY — profession × archetype matrix
// Dynamic paragraph personalised by who you are + what your gap is
// ─────────────────────────────────────────────────────────────────────────────

const EMPATHY_COPY = {
  foundation: {
    corporate:
      "As a salaried professional, you have the rarest gift in personal finance: a predictable income. But the habit of spending first and saving last is quietly eroding the foundation that predictability could build. The solution is not more discipline — it is better architecture. Systems, not willpower.",
    gig:
      "Freelancing rewards hustle but punishes financial disorganization ruthlessly. When income is irregular, having no cash flow system means feast months fund lifestyle instead of future security. Your income is not the problem. Your system is. And systems can be redesigned.",
    student:
      "Starting without a cash flow system at your stage is entirely normal — but the habits you build now compound for decades. Even ₹500 moved to savings on Day 1 creates a psychological and financial foundation that will reshape your relationship with money before your career properly begins.",
    business:
      "Running a business without separating personal and business finances is one of the top reasons promising ventures stall. Your greatest Foundation risk is not revenue — it is cash flow confusion between what your business owns and what you personally own. Clarity is the first fix.",
  },
  growthEngine: {
    corporate:
      "You save consistently — but your money is not working hard enough. Your EPF is accumulating, yet without equity SIPs and PPF optimization, you are running the world's most powerful compounding machine at roughly 30% capacity. The gap between where you are and where you could be is not income. It is deployment.",
    gig:
      "You have resisted the feast-famine trap and save consistently — that is genuinely rare among freelancers. The next leap is converting those savings from an FD mentality into a compounding mentality. Every month without an equity SIP is a month you are underpaying your future self.",
    student:
      "You are ahead of 90% of your peers simply by saving at all. The next move is critical: shift from saving to compounding. A PPF account opened today and a ₹500 SIP started this week will, over 25 years, outperform most financial decisions you will make in the next decade.",
    business:
      "Your instinct to reinvest in the business is sound — but personal wealth compounding is being quietly neglected. A profitable business can collapse overnight. Your personal financial engine needs to run independently, automatically, and tax-efficiently, regardless of what the business does.",
  },
  strategy: {
    corporate:
      "Your analytical skills — the exact ones that make you exceptional at work — are working against your wealth. You are over-optimizing and under-deploying. The simplest ₹1,000 Nifty 50 SIP started today will, in 20 years, outperform the perfect portfolio you are still designing.",
    gig:
      "Freelancers are resourceful by nature, but your biggest financial threat right now is not a lack of knowledge. It is a lack of action. You have always known enough to begin. The SIP you have not started, the tax structure you have not reviewed — these are costing you compound time that cannot be recovered.",
    student:
      "Financial information overload is real and it is engineered to paralyse. Here is the antidote: one platform, one fund, one amount — execute. Everything else is optimization for after you are already in motion. The habit of beginning is worth more than the perfect beginning.",
    business:
      "As a business owner, every week brings ten new strategic decisions. Financial complexity layers on top. The prescription is aggressive simplification: automate personal finance entirely so your cognitive bandwidth is reserved for the business. Complexity is your enemy in both domains.",
  },
  psychology: {
    corporate:
      "The corporate environment rewards performance and implicitly punishes rest — but your earning capacity does not care about your KPIs. Burnout is not a personal failure; it is a design flaw in how you have structured your relationship with work and money. Wealth that costs you your health is a notoriously bad trade.",
    gig:
      "You are your business. If you burn out, revenue stops. If revenue stops, savings stop. If savings stop, financial anxiety spikes — which accelerates the next burnout. This is a reinforcing loop that only breaks when you protect your psychological capital as ferociously as you protect your savings rate.",
    student:
      "Financial stress at your stage correlates with worse academic performance, poorer career decisions, and higher burnout risk in your first job. Building a psychological safety net now — even a small one — is not self-indulgence. It is the most strategic investment you can make in your future earning capacity.",
    business:
      "Founders often wear financial anxiety as a badge of dedication. The data disagrees: founders who maintain sustainable work-rest cycles make better strategic decisions, build more resilient teams, and create more durable companies. Your mental capital is your primary business asset — not your bank balance.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PRESCRIPTION DATA — The Gap + The Fix (per pillar × profession) + CTAs
// All 'Fix' advice is grounded in Ramen to Riches framework:
//   Foundation: 30:30:30:10 rule, CapEx Vault, income smoothing
//   Growth:     SIPs/RCA, PPF (EEE), fixed income ballast
//   Strategy:   Competence Trap protocol, corporate tax matches, social capital
//   Psychology: Psychological Capital budget, Feast-or-Famine protocol, liquidity tiers
// ─────────────────────────────────────────────────────────────────────────────

const PRESCRIPTIONS = {
  foundation: {
    gap:
      "Money is leaving your account before it has been assigned a job. There is no automated system separating needs, investments, lifestyle, and opportunity — every expense competes for the same pool, and the loudest one always wins. This is not an income problem. It is an architecture problem.",
    fix: {
      corporate: [
        {
          icon: "⚡",
          title: "Automate the 30:30:30:10 split on Day 1",
          body:
            "Set standing instructions to auto-transfer on salary day: 30% to a needs account, 30% to an investments account, 30% stays as lifestyle budget, 10% sweeps to an opportunity vault. This runs before you can see or spend the money.",
        },
        {
          icon: "📅",
          title: "SIP auto-debit on the 2nd of every month",
          body:
            "Schedule your equity and ELSS SIPs for the 2nd — one day after the typical salary credit. Pay your future self before you can spend. If it does not auto-execute, it will not execute.",
        },
        {
          icon: "📈",
          title: "Pre-commit: 50% of every salary hike goes to SIP top-up",
          body:
            "The single most powerful anti-lifestyle-creep rule. When a raise lands, your spending stays flat and your SIP amount rises. This converts income inflation into wealth inflation automatically.",
        },
      ],
      gig: [
        {
          icon: "🏦",
          title: "Create a Pool Account and pay yourself a fixed monthly salary",
          body:
            "All client payments land in a dedicated Pool Account. Each month, transfer a fixed founder salary to your personal account — the same amount regardless of revenue. Surplus stays in the pool and funds future months. This creates artificial salaried predictability.",
        },
        {
          icon: "🧰",
          title: "Fund your CapEx Vault aggressively during peak months",
          body:
            "The CapEx Vault covers predictable large expenses: laptop replacement, upskilling courses, GST deposits, advance tax provisioning, equipment. Fund it during high-income months. This prevents lean months from creating debt.",
        },
        {
          icon: "📊",
          title: "The Feast-or-Famine Protocol: 1/3 × 3 surplus split",
          body:
            "When a surplus month hits, pre-commit to: ⅓ into Income Smoothing Reserve, ⅓ into investments (SIP top-up or lump sum), ⅓ into Tax Vault (advance tax provision). Pre-defined rules remove emotional spending decisions from high-income months.",
        },
      ],
      student: [
        {
          icon: "💡",
          title: "Start with a ₹500 micro-SIP this week",
          body:
            "The amount is almost irrelevant. The automation habit is everything. Open a Zerodha or Groww account, start a ₹500 Nifty 50 index fund SIP. The habit you build managing ₹500 will manage ₹50,000 the same way in 5 years.",
        },
        {
          icon: "📋",
          title: "Name every rupee in your stipend or allowance",
          body:
            "Apply 50:30:20 — 50% needs, 30% lifestyle, 20% savings and investments. Any money without a designated name will be spent on something you will not remember spending it on.",
        },
      ],
      business: [
        {
          icon: "🔒",
          title: "Separate business and personal accounts completely",
          body:
            "Create distinct accounts: Business Operating, Business Tax Provision, Business CapEx, Personal Living, Personal Investments. Money flows from business to you via a fixed monthly founder salary transfer — nothing else crosses.",
        },
        {
          icon: "🧰",
          title: "The Business CapEx Vault is non-negotiable",
          body:
            "Machinery, tech upgrades, certifications, and tax liabilities are predictable. Fund a CapEx Vault monthly from revenue so these events are never crises. Every rupee in the vault is a future emergency that has been pre-solved.",
        },
      ],
    },
    cta: [
      {
        label: "Set up a SIP on Groww",
        url: "https://groww.in/mutual-funds/category/best-index-funds",
        icon: "📈",
      },
      {
        label: "Open a Zerodha account",
        url: "https://zerodha.com/open-account/",
        icon: "🚀",
      },
      {
        label: "Learn the 30:30:30:10 Rule (Zerodha Varsity)",
        url: "https://zerodha.com/varsity/chapter/the-need-to-save/",
        icon: "📖",
      },
    ],
  },

  growthEngine: {
    gap:
      "Savings are accumulating but stagnating in low-yield instruments — savings accounts, FDs, or nowhere at all. Inflation is eroding purchasing power in real terms. The compounding engine (equity SIPs, tax-free PPF, fixed income ballast) is either switched off or running at a fraction of its potential.",
    fix: {
      corporate: [
        {
          icon: "🏦",
          title: "Max PPF on April 1st every year — the triple tax shield",
          body:
            "Contribute the full ₹1.5L to PPF on April 1st to earn 12 extra months of interest vs. a March contribution. PPF is EEE status: Exempt on contribution (80C deduction), Exempt on interest accrual, Exempt on maturity. No other legal instrument offers this triple shield.",
        },
        {
          icon: "⚡",
          title: "Add VPF up to the employer match ceiling — 100% instant return",
          body:
            "If your employer matches VPF contributions, every rupee you add earns a guaranteed 100% return before any market movement. Skipping an employer match is leaving free money on the table that no market instrument can replicate.",
        },
        {
          icon: "📊",
          title: "Build the barbell: EPF (safe anchor) + Nifty 50 SIP (growth engine)",
          body:
            "Your EPF is the safe ballast. A ₹5,000/month Nifty 50 index fund SIP started at 28 grows to approximately ₹3.5 crore by 60 at 12% CAGR. The barbell provides stability and growth without complex active management.",
        },
      ],
      gig: [
        {
          icon: "🏦",
          title: "Open and max a PPF account every April 1st",
          body:
            "As a freelancer, you have no EPF. PPF is your risk-free backbone. Maxing it every year (₹1.5L) at 7.1% compounds to approximately ₹40L over 15 years — entirely tax-free. Front-load on April 1st for one extra month of interest.",
        },
        {
          icon: "📈",
          title: "Start an index fund SIP from your Pool Account",
          body:
            "Set a Nifty 50 index fund SIP that auto-debits from your Pool Account on Day 1 of each month. Even ₹2,000/month creates structural compounding. The discipline of doing it during lean months is what separates wealth builders from savers.",
        },
        {
          icon: "💸",
          title: "Deploy lump sums at pre-set market correction triggers",
          body:
            "Pre-commit: if the Nifty corrects 10%+ from its last peak, deploy a lump sum from your Income Smoothing Reserve. The trigger is pre-set so you act on logic, not fear. You are buying units at a discount while others are panic-selling.",
        },
      ],
      student: [
        {
          icon: "🎯",
          title: "Open a PPF account before your next birthday",
          body:
            "The 15-year lock-in feels long at 20. It will not feel long at 35 when the tax-free corpus matures. ₹500/month from age 20 at 7.1% tax-free interest builds to ₹1.8L+ at maturity. The earlier you open it, the longer your compound runway.",
        },
        {
          icon: "📈",
          title: "Start a ₹500 Nifty 50 index fund SIP this week",
          body:
            "The platform (Groww, Zerodha), the fund (Nifty 50 index), the amount (whatever you can start with). The habit and market exposure matter far more than the quantum at this stage. Increase automatically with every income increase.",
        },
      ],
      business: [
        {
          icon: "💼",
          title: "Use NPS (80CCD(1B)) for ₹50,000 additional deduction",
          body:
            "The NPS Tier-I account provides an additional ₹50,000 tax deduction over and above the ₹1.5L 80C limit. It generates market-linked returns and is frequently overlooked by self-employed individuals and business owners.",
        },
        {
          icon: "🏦",
          title: "PPF for founders — the most underused tax-free compounder",
          body:
            "Business income is taxed at slab rates. PPF contributions are 80C deductible, interest is tax-free, and maturity is tax-free. It is the safest, highest-returning 'boring' instrument that most business owners ignore in favour of reinvestment.",
        },
      ],
    },
    cta: [
      {
        label: "Open a PPF account (Post Office / SBI)",
        url: "https://www.indiapost.gov.in/Financial/pages/content/ppf.aspx",
        icon: "🏦",
      },
      {
        label: "Start a Nifty 50 SIP on Zerodha Coin",
        url: "https://coin.zerodha.com/",
        icon: "📈",
      },
      {
        label: "Learn Rupee Cost Averaging (Zerodha Varsity)",
        url: "https://zerodha.com/varsity/chapter/rupee-cost-averaging/",
        icon: "📖",
      },
    ],
  },

  strategy: {
    gap:
      "You are over-researching and under-deploying. The Competence Trap — where intelligence becomes the enemy of action — is costing compound time that can never be recovered. Every month of inaction is approximately 1% of annual equity returns lost permanently. The cost is not abstract: it is measurable and it is compounding in reverse.",
    fix: {
      corporate: [
        {
          icon: "💰",
          title: "Restructure your salary this April — save ₹50,000–₹2,00,000/year",
          body:
            "Spend 2 focused hours each April reviewing HRA, LTA, meal vouchers, NPS employer contribution (80CCD(2)), and uniform allowance. Model both old and new tax regimes. For higher earners, salary structure engineering is the single highest-ROI financial activity available — it pays more than most investments.",
        },
        {
          icon: "⚡",
          title: "The 2-Week Rule: if undecided in 14 days, default to Nifty 50",
          body:
            "Pre-commit: any investment decision that takes more than 2 weeks defaults to a Nifty 50 index fund SIP. This is a precommitment device that breaks analysis paralysis by making inaction structurally impossible. Optimization is a continuous process — not a prerequisite for starting.",
        },
        {
          icon: "📊",
          title: "Audit your employer benefits portal this quarter",
          body:
            "Check for VPF employer match, NPS employer contribution (80CCD(2)), ESOP vesting schedule, group health insurance coverage, and flexible benefit plan components. Many salaried employees leave ₹30,000–₹1,00,000 annually unclaimed through simple non-review.",
        },
      ],
      gig: [
        {
          icon: "⚡",
          title: "Apply the 2-Week Rule to every financial decision",
          body:
            "If undecided in 2 weeks, default: Nifty 50 index SIP for investments, term plan for insurance, liquid fund for emergency buffer. Start and optimize continuously. Waiting for perfect information is indistinguishable from not starting.",
        },
        {
          icon: "📋",
          title: "Hire a CA with freelancer and startup expertise",
          body:
            "Professional tax advice for the self-employed costs ₹5,000–₹15,000/year and typically recovers 10–20x through proper ITR filing, GST input credit optimization, and legitimate expense structuring. This is your highest-ROI strategy expenditure.",
        },
        {
          icon: "🤝",
          title: "Audit your social capital portfolio this month",
          body:
            "Identify 3 people in your network who could provide referrals, co-project opportunities, or industry access. Reach out this week with genuine value, not a request. Social capital has a measurable ROI: the wealthiest freelancers grow through network, not platforms.",
        },
      ],
      student: [
        {
          icon: "🎯",
          title: "One platform. One fund. One amount. Execute today.",
          body:
            "Open Zerodha or Groww. Choose the Nifty 50 index fund. Set a SIP for the smallest amount the platform allows. You do not need more information. You need more action. Everything else is optimization for after you are already in motion.",
        },
        {
          icon: "📚",
          title: "Learn through doing, not through watching",
          body:
            "Watching your own ₹500 portfolio drop 5% and recover teaches you more about emotional resilience than any financial course. The visceral experience of real-money market movements is irreplaceable preparation for managing larger sums.",
        },
      ],
      business: [
        {
          icon: "🔧",
          title: "Automate personal finance to free your cognitive bandwidth",
          body:
            "Set up monthly auto-transfers to PPF, equity SIPs, and tax provisioning. Personal finance should require zero active decisions from you. Your cognitive capacity belongs to the business. Automation is not laziness — it is strategic resource allocation.",
        },
        {
          icon: "💼",
          title: "Model your optimal compensation structure annually",
          body:
            "Director salary, LLP partner remuneration, dividend structuring, and business expense treatment have significant tax implications. Engage a CA each financial year to re-optimise. This exercise saves high-earning founders ₹1L–₹5L annually.",
        },
      ],
    },
    cta: [
      {
        label: "Open a Zerodha account (start investing today)",
        url: "https://zerodha.com/open-account/",
        icon: "🚀",
      },
      {
        label: "Salary restructuring guide (ClearTax)",
        url: "https://cleartax.in/s/how-to-restructure-salary-for-tax-savings",
        icon: "📖",
      },
      {
        label: "Explore NPS for additional ₹50K deduction (PFRDA)",
        url: "https://www.npscra.nsdl.co.in/",
        icon: "🏛️",
      },
    ],
  },

  psychology: {
    gap:
      "Wealth-building is operating as a source of chronic anxiety rather than a designed system. The absence of a Psychological Capital budget creates a cycle: deprivation → resentment → binge spending → guilt → more deprivation. This costs far more than the 'savings' it was supposed to protect — and it makes burnout the most likely outcome.",
    fix: {
      corporate: [
        {
          icon: "🎯",
          title: "Create a pre-funded Psychological Capital Budget",
          body:
            "Add a Joy line item to your 30:30:30:10 system — minimum ₹3,000–₹5,000/month for intentional, guilt-free experiences. Pre-funding removes the guilt entirely. Guilt-free spending is not financial weakness. It is maintenance for your primary asset: your earning capacity.",
        },
        {
          icon: "🏖️",
          title: "One annual vacation is a non-negotiable maintenance investment",
          body:
            "Model the downside: a burnout-induced career break costs 3–6 months of income (₹3L–₹10L+ for most salaried professionals). An annual ₹30,000–₹50,000 vacation as burnout prevention has an asymmetric return. This is not a reward — it is infrastructure maintenance.",
        },
        {
          icon: "🔒",
          title: "Hard-code one financial-free evening per week",
          body:
            "One evening per week: zero financial apps, zero portfolio checking, zero money-related content. Your nervous system needs recovery from financial vigilance to make better decisions the other six days. Chronic financial monitoring elevates cortisol and impairs decision quality.",
        },
      ],
      gig: [
        {
          icon: "🛡️",
          title: "Implement the Feast-or-Famine Protocol immediately",
          body:
            "Pay yourself a fixed monthly salary from a Pool Account. This removes income volatility from your day-to-day psychology. Knowing exactly how much you have this month — regardless of client payments — dramatically reduces financial anxiety and prevents feast-month overconsumption.",
        },
        {
          icon: "💆",
          title: "Psychological Capital Budget: minimum ₹5,000/month",
          body:
            "As a freelancer, your mental state directly determines your output quality, creative capacity, and client retention. Budget a minimum of ₹5,000/month for intentional recovery: gym, enjoyable courses, social experiences, short trips. This is a business operating expense, not a luxury.",
        },
        {
          icon: "📊",
          title: "Quantify your burnout risk in rupees",
          body:
            "Calculate your average monthly revenue. Multiply by 3 — that is the approximate cost of one burnout episode (lost income + recovery time). A ₹5,000/month prevention budget against a ₹1.5L+ downside is a straightforward risk-management decision.",
        },
      ],
      student: [
        {
          icon: "🧘",
          title: "Build a ₹1,000/month Psychological Capital fund",
          body:
            "Even on a limited budget, designate ₹1,000/month explicitly for guilt-free experiences. Financial anxiety at your stage compounds into worse academic performance and poorer career decisions. The investment in your mental state is an investment in your future income.",
        },
        {
          icon: "📊",
          title: "Track net worth, not just savings balance",
          body:
            "Watching total assets grow (even slowly) provides psychological momentum that a savings balance alone cannot. A simple spreadsheet tracking total assets and investments provides the 'number going up' signal that sustains motivation through lean months.",
        },
      ],
      business: [
        {
          icon: "⏰",
          title: "Two 'no-finance' evenings per week — hard boundary",
          body:
            "Sustainable businesses are built by sustainable founders. Chronic financial anxiety impairs decision-making quality not just mood. Two evenings per week completely disconnected from financial apps and revenue tracking is cognitive maintenance — as essential as sleep.",
        },
        {
          icon: "🎯",
          title: "Separate your identity from your business's monthly numbers",
          body:
            "Your business's revenue is not your self-worth. Build a personal financial floor — emergency fund, personal investments — that is completely independent of business performance. This financial independence removes fear from strategic decisions and allows you to make bolder, better choices.",
        },
      ],
    },
    cta: [
      {
        label: "Track net worth with Smallcase",
        url: "https://www.smallcase.com/",
        icon: "📊",
      },
      {
        label: "Get term insurance coverage (PolicyBazaar)",
        url: "https://www.policybazaar.com/life-insurance/term-insurance/",
        icon: "🛡️",
      },
      {
        label: "Learn about behavioural finance (Zerodha Varsity)",
        url: "https://zerodha.com/varsity/module/trading-psychology/",
        icon: "📖",
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/** Animated score bar — width animates from 0 to percentage on mount */
function ScoreBar({ percentage, color, delay = 0 }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(percentage), 500 + delay * 120);
    return () => clearTimeout(t);
  }, [percentage, delay]);

  return (
    <div
      className="w-full h-2.5 rounded-full overflow-hidden"
      style={{ background: "rgba(255,255,255,0.06)" }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${width}%`,
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}70`,
          transition: "width 1.1s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  );
}

/** Tier badge chip */
function TierBadge({ tier }) {
  const s = TIER_STYLES[tier?.label] ?? TIER_STYLES.Wanderer;
  return (
    <span
      className="text-xs font-bold px-2.5 py-0.5 rounded-full border tracking-widest uppercase"
      style={{ background: s.bg, color: s.color, borderColor: s.border }}
    >
      {tier?.label ?? "—"}
    </span>
  );
}

/** Single Fix action card */
function FixCard({ item, index }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="flex gap-4 p-4 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
      <div>
        <p className="font-semibold text-white text-sm mb-1.5 leading-snug">
          {item.title}
        </p>
        <p className="text-gray-400 text-sm leading-relaxed">{item.body}</p>
      </div>
    </motion.div>
  );
}

/** External CTA button with glow accent */
function CTAButton({ label, url, icon, accentColor }) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      variants={fadeUp}
      whileHover={{ scale: 1.015, y: -2 }}
      whileTap={{ scale: 0.985 }}
      className="flex items-center gap-3 px-5 py-3.5 rounded-xl font-semibold text-sm"
      style={{
        background: accentColor ? `${accentColor}12` : "rgba(255,255,255,0.04)",
        border: `1px solid ${accentColor ? `${accentColor}30` : "rgba(255,255,255,0.09)"}`,
        color: accentColor ? "#E2E8F0" : "#94A3B8",
        textDecoration: "none",
        transition: "all 0.2s ease",
      }}
    >
      <span className="text-base">{icon}</span>
      <span className="flex-1">{label}</span>
      <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>↗</span>
    </motion.a>
  );
}

/** Score ring SVG */
function ScoreRing({ percentage, color, score, maxScore }) {
  const R = 38;
  const CIRC = 2 * Math.PI * R;
  const [dash, setDash] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDash((percentage / 100) * CIRC), 600);
    return () => clearTimeout(t);
  }, [percentage, CIRC]);

  return (
    <svg width="90" height="90" viewBox="0 0 90 90">
      <circle
        cx="45" cy="45" r={R}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="9"
      />
      <circle
        cx="45" cy="45" r={R}
        fill="none"
        stroke={color}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={CIRC}
        strokeDashoffset={CIRC - dash}
        style={{
          transformOrigin: "45px 45px",
          transform: "rotate(-90deg)",
          transition: "stroke-dashoffset 1.3s cubic-bezier(0.22, 1, 0.36, 1) 0.6s",
          filter: `drop-shadow(0 0 6px ${color}80)`,
        }}
      />
      <text x="45" y="42" textAnchor="middle" fill="#E2E8F0" fontSize="15" fontWeight="700">
        {score}
      </text>
      <text x="45" y="55" textAnchor="middle" fill="#64748B" fontSize="9">
        / {maxScore}
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export default function ResultsDashboard({ results, onReset }) {
  const [expandedPillar, setExpandedPillar] = useState(null);

  // ── Guard ──────────────────────────────────────────────────────────────────
  if (!results) {
    return (
      <div
        className="flex items-center justify-center min-h-screen text-sm"
        style={{ color: "#64748B", background: "#070B14" }}
      >
        No results to display. Please complete the assessment first.
      </div>
    );
  }

  const {
    demographics,
    pillarResults,
    weakestPillar,
    strongestPillar,
    totalScore,
    maxTotalScore,
    percentageScore,
    overallTier,
    questionInsights,
  } = results;

  // ── Derived values ─────────────────────────────────────────────────────────
  const profession      = demographics?.professionCategory ?? "gig";
  const archetype       = ARCHETYPES[weakestPillar.pillarId];
  const prescription    = PRESCRIPTIONS[weakestPillar.pillarId];
  const empathyCopy     = EMPATHY_COPY[weakestPillar.pillarId]?.[profession]
                          ?? EMPATHY_COPY[weakestPillar.pillarId]?.gig;
  const fixItems        = prescription.fix[profession] ?? prescription.fix.gig;
  const professionLabel = PROFESSION_LABELS[profession] ?? "Professional";
  const ageStr          = demographics?.age ? `${demographics.age}-year-old` : "";
  const profileLine     = [ageStr, professionLabel].filter(Boolean).join(" ");
  const knowledgeScore  = demographics?.selfRatedFinancialKnowledge;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen w-full font-sans antialiased"
      style={{ background: "#070B14", color: "#E2E8F0" }}
    >
      {/* Ambient radial glow from archetype colour */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 90% 45% at 50% -10%, ${archetype.glowColor} 0%, transparent 65%)`,
          zIndex: 0,
        }}
      />

      {/* Scroll container */}
      <div
        className="relative max-w-2xl mx-auto px-4 py-10 pb-28 space-y-7"
        style={{ zIndex: 1 }}
      >

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 1 — PROFILE HEADER
        ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-3"
        >
          <p
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: "#475569" }}
          >
            Financial DNA Report · The Financial Oracle
          </p>

          {/* Profile pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}>
            <span className="text-base">👤</span>
            <span className="font-semibold text-white text-sm">Profile:</span>
            <span className="text-gray-300 text-sm">{profileLine}</span>
            {knowledgeScore && (
              <>
                <span style={{ color: "#1E293B" }}>·</span>
                <span className="text-gray-500 text-xs">Financial IQ: {knowledgeScore}/10</span>
              </>
            )}
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 2 — ARCHETYPE HERO CARD
        ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl overflow-hidden p-6"
          style={{
            background: `linear-gradient(140deg, ${archetype.color}18 0%, rgba(255,255,255,0.02) 55%)`,
            border: `1px solid ${archetype.color}30`,
            boxShadow: `0 0 48px ${archetype.glowColor}, inset 0 1px 0 ${archetype.color}18`,
          }}
        >
          {/* Watermark emoji */}
          <div
            className="absolute right-5 top-5 text-8xl pointer-events-none select-none"
            style={{ opacity: 0.09 }}
          >
            {archetype.emoji}
          </div>

          <div className="relative z-10">
            {/* Label + name */}
            <p
              className="text-xs font-mono uppercase tracking-widest mb-2"
              style={{ color: archetype.color }}
            >
              Primary Archetype
            </p>

            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                {archetype.name}
              </h1>
              <span className="text-4xl flex-shrink-0">{archetype.emoji}</span>
            </div>

            {/* Tagline */}
            <p
              className="text-[15px] leading-relaxed mb-4 italic"
              style={{ color: "rgba(226,232,240,0.8)" }}
            >
              "{archetype.tagline}"
            </p>

            {/* Focus pill */}
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold"
              style={{
                background: `${archetype.color}18`,
                color: archetype.color,
                border: `1px solid ${archetype.color}28`,
              }}
            >
              <span>🎯</span> Focus: {archetype.focus}
            </span>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3 — EMPATHY PARAGRAPH
        ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p
            className="text-xs font-mono uppercase tracking-widest mb-3"
            style={{ color: "#475569" }}
          >
            Your Context
          </p>
          <p
            className="leading-relaxed"
            style={{ color: "rgba(226,232,240,0.85)", fontSize: "15px" }}
          >
            {empathyCopy}
          </p>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 4 — OVERALL SCORE + 4 PILLAR BARS
        ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.33 }}
          className="rounded-2xl p-6 space-y-5"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Header: score number + ring */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p
                className="text-xs font-mono uppercase tracking-widest mb-1"
                style={{ color: "#475569" }}
              >
                Financial DNA Score
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">{totalScore}</span>
                <span className="text-xl" style={{ color: "#334155" }}>/ {maxTotalScore}</span>
                <span className="text-sm text-gray-500">({percentageScore}%)</span>
              </div>
              {overallTier && (
                <div className="mt-2">
                  <TierBadge tier={overallTier} />
                </div>
              )}
            </div>
            <ScoreRing
              percentage={percentageScore}
              color={archetype.color}
              score={totalScore}
              maxScore={maxTotalScore}
            />
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />

          {/* 4 pillar bars */}
          {pillarResults.map((pillar, idx) => {
            const ui = PILLAR_UI[pillar.pillarId];
            const isWeakest   = pillar.pillarId === weakestPillar.pillarId;
            const isStrongest = pillar.pillarId === strongestPillar.pillarId;

            return (
              <div key={pillar.pillarId}>
                {/* Pillar header row */}
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base">{ui.icon}</span>
                    <span className="font-semibold text-white text-sm">
                      {ui.label}
                    </span>
                    {isWeakest && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          background: "rgba(239,68,68,0.12)",
                          color: "#FCA5A5",
                          border: "1px solid rgba(239,68,68,0.22)",
                        }}
                      >
                        Growth Area
                      </span>
                    )}
                    {isStrongest && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          background: "rgba(16,185,129,0.12)",
                          color: "#6EE7B7",
                          border: "1px solid rgba(16,185,129,0.22)",
                        }}
                      >
                        Strength
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-mono"
                      style={{ color: ui.color }}
                    >
                      {pillar.score}/{pillar.maxScore}
                    </span>
                    <TierBadge tier={pillar.tier} />
                  </div>
                </div>

                {/* Progress bar */}
                <ScoreBar
                  percentage={pillar.percentage}
                  color={ui.color}
                  delay={idx}
                />

                {/* Expandable pillar insight (toggle) */}
                <div className="mt-2">
                  <button
                    onClick={() =>
                      setExpandedPillar(
                        expandedPillar === pillar.pillarId
                          ? null
                          : pillar.pillarId
                      )
                    }
                    className="text-xs text-left transition-colors"
                    style={{
                      color:
                        expandedPillar === pillar.pillarId
                          ? ui.color
                          : "#475569",
                    }}
                  >
                    {expandedPillar === pillar.pillarId
                      ? "▲ Hide details"
                      : "▼ View question insights"}
                  </button>

                  <AnimatePresence>
                    {expandedPillar === pillar.pillarId && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 space-y-2">
                          {questionInsights
                            .filter((q) => q.pillar === pillar.pillarId)
                            .map((q) => (
                              <div
                                key={q.questionId}
                                className="rounded-lg p-3 text-xs"
                                style={{
                                  background: ui.bg,
                                  border: `1px solid ${ui.border}`,
                                }}
                              >
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                  <span className="text-gray-400 leading-snug flex-1">
                                    {q.question}
                                  </span>
                                  <span
                                    className="font-bold text-xs px-1.5 py-0.5 rounded flex-shrink-0"
                                    style={{
                                      color: ui.color,
                                      background: `${ui.color}15`,
                                    }}
                                  >
                                    {q.points}/4
                                  </span>
                                </div>
                                {q.selectedOption?.insight && (
                                  <p
                                    className="leading-relaxed"
                                    style={{ color: "rgba(226,232,240,0.65)" }}
                                  >
                                    💡 {q.selectedOption.insight}
                                  </p>
                                )}
                              </div>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}

          {/* Strongest / Weakest summary chips */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div
              className="rounded-xl p-4 text-center"
              style={{
                background: "rgba(16,185,129,0.07)",
                border: "1px solid rgba(16,185,129,0.18)",
              }}
            >
              <div className="text-xl mb-1">
                {PILLAR_UI[strongestPillar.pillarId]?.icon}
              </div>
              <div className="text-xs mb-1" style={{ color: "#475569" }}>
                Top Pillar
              </div>
              <div className="font-bold text-sm" style={{ color: "#6EE7B7" }}>
                {PILLAR_UI[strongestPillar.pillarId]?.label}
              </div>
            </div>
            <div
              className="rounded-xl p-4 text-center"
              style={{
                background: "rgba(239,68,68,0.07)",
                border: "1px solid rgba(239,68,68,0.18)",
              }}
            >
              <div className="text-xl mb-1">
                {PILLAR_UI[weakestPillar.pillarId]?.icon}
              </div>
              <div className="text-xs mb-1" style={{ color: "#475569" }}>
                Biggest Gap
              </div>
              <div className="font-bold text-sm" style={{ color: "#FCA5A5" }}>
                {PILLAR_UI[weakestPillar.pillarId]?.label}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 5 — THE PRESCRIPTION (Gap + Fix)
        ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.43 }}
          className="rounded-2xl overflow-hidden"
          style={{ border: `1px solid ${archetype.color}28` }}
        >
          {/* Prescription header bar */}
          <div
            className="px-6 py-4"
            style={{
              background: `${archetype.color}10`,
              borderBottom: `1px solid ${archetype.color}22`,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">💊</span>
              <h2 className="font-bold text-white">Your Prescription</h2>
            </div>
            <p
              className="text-xs font-mono uppercase tracking-wider"
              style={{ color: "#475569" }}
            >
              {PILLAR_UI[weakestPillar.pillarId]?.label} ·{" "}
              {archetype.focus} · Specific to {professionLabel}s
            </p>
          </div>

          <div
            className="p-6 space-y-7"
            style={{ background: "rgba(255,255,255,0.012)" }}
          >
            {/* ── THE GAP ── */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: "rgba(239,68,68,0.18)",
                    color: "#FCA5A5",
                  }}
                >
                  !
                </div>
                <h3 className="font-bold text-white">The Gap</h3>
              </div>
              <div
                className="rounded-xl p-4 text-sm leading-relaxed"
                style={{
                  background: "rgba(239,68,68,0.05)",
                  border: "1px solid rgba(239,68,68,0.13)",
                  color: "rgba(226,232,240,0.8)",
                }}
              >
                {prescription.gap}
              </div>
            </div>

            {/* ── THE FIX ── */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: `${archetype.color}22`,
                    color: archetype.color,
                  }}
                >
                  ✓
                </div>
                <h3 className="font-bold text-white">The Fix</h3>
              </div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="space-y-3"
              >
                {fixItems.map((item, i) => (
                  <FixCard key={i} item={item} index={i} />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 6 — CTA BUTTONS
        ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <p
            className="text-xs font-mono uppercase tracking-widest mb-4"
            style={{ color: "#475569" }}
          >
            Take Action Now
          </p>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-2.5"
          >
            {/* Archetype-specific CTAs */}
            {prescription.cta.map((cta, i) => (
              <CTAButton
                key={i}
                label={cta.label}
                url={cta.url}
                icon={cta.icon}
                accentColor={archetype.color}
              />
            ))}

            {/* Universal CTAs — relevant for all archetypes */}
            <CTAButton
              label="Zerodha Varsity — Free Financial Education (All Topics)"
              url="https://zerodha.com/varsity/"
              icon="📚"
              accentColor={null}
            />
            <CTAButton
              label="Groww Learn — Mutual Funds & Investing Basics"
              url="https://groww.in/blog/"
              icon="📰"
              accentColor={null}
            />
          </motion.div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 7 — ORACLE CHALLENGE + RETAKE
        ═══════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.63 }}
          className="rounded-2xl p-7 text-center"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="text-3xl mb-3">🔮</div>
          <h3 className="font-bold text-white text-lg mb-2">
            The Oracle Challenge
          </h3>
          <p
            className="text-sm leading-relaxed max-w-sm mx-auto mb-6"
            style={{ color: "#94A3B8" }}
          >
            {archetype.challenge} Come back in 90 days and retake this
            assessment. The score change is your proof of execution — not
            intention.
          </p>

          <motion.button
            onClick={onReset}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="px-7 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#64748B",
            }}
          >
            ↺ Retake Assessment
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
}
