/**
 * questionsData.js
 * The Financial Oracle: Ramen to Riches
 *
 * 20 Behavioral Questions — 5 per Pillar
 * Each option awards points: 1 (least aligned) → 4 (most aligned)
 *
 * Pillar 1 — Foundation     : 30:30:30:10 rule, CapEx Vaults, automating savings
 * Pillar 2 — Growth Engine  : SIPs/RCA, PPF/EEE compounding, Fixed Income ballast
 * Pillar 3 — Strategy       : Competence Trap, corporate tax matches, social capital
 * Pillar 4 — Psychology     : Psychological Capital, Feast-or-Famine protocol, liquidity buffers
 */

export const PILLARS = {
  FOUNDATION: {
    id: "foundation",
    label: "Foundation",
    color: "#6366F1",        // Indigo
    icon: "🏛️",
    description: "How well you manage cash flow, automate savings, and protect yourself from lifestyle creep.",
    maxScore: 20,
  },
  GROWTH_ENGINE: {
    id: "growthEngine",
    label: "Growth Engine",
    color: "#10B981",        // Emerald
    icon: "🚀",
    description: "How effectively you deploy capital into compounding, tax-efficient, and diversified instruments.",
    maxScore: 20,
  },
  STRATEGY: {
    id: "strategy",
    label: "Strategy",
    color: "#F59E0B",        // Amber
    icon: "♟️",
    description: "How strategically you leverage institutional benefits, avoid analysis paralysis, and build networks.",
    maxScore: 20,
  },
  PSYCHOLOGY: {
    id: "psychology",
    label: "Psychology",
    color: "#EC4899",        // Pink
    icon: "🧠",
    description: "How well you manage financial anxiety, prevent burnout, and build mental resilience around money.",
    maxScore: 20,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PILLAR 1: FOUNDATION
// Themes: 30:30:30:10 rule | CapEx Vaults for gig workers | Automating savings
// ─────────────────────────────────────────────────────────────────────────────

const foundationQuestions = [
  {
    id: "F1",
    pillar: "foundation",
    pillarLabel: "Foundation",
    theme: "30:30:30:10 Rule",
    question:
      "After your salary or income hits your account, what is the FIRST financial action you take?",
    options: [
      {
        id: "F1_A",
        text: "I pay bills and spend freely — whatever is left at month-end gets saved.",
        points: 1,
        insight: "This 'save-what's-left' approach is the #1 cause of lifestyle creep.",
      },
      {
        id: "F1_B",
        text: "I mentally decide a rough savings amount, then cover expenses with the rest.",
        points: 2,
        insight: "Good intent, but mental budgets are easily overridden by impulse spending.",
      },
      {
        id: "F1_C",
        text: "I auto-transfer a fixed amount to a separate savings account before spending anything.",
        points: 3,
        insight: "Strong. Automation removes willpower from the equation.",
      },
      {
        id: "F1_D",
        text: "I auto-sweep 30% to needs, 30% to investments, 30% to lifestyle, and 10% to an opportunity fund — all before I touch a rupee.",
        points: 4,
        insight: "This is the 30:30:30:10 framework in action — the gold standard of cash flow architecture.",
      },
    ],
  },
  {
    id: "F2",
    pillar: "foundation",
    pillarLabel: "Foundation",
    theme: "30:30:30:10 Rule",
    question:
      "Your take-home income increases by ₹15,000 this month. What happens to your lifestyle spending?",
    options: [
      {
        id: "F2_A",
        text: "It feels like a raise, so my spending naturally expands to match the new number.",
        points: 1,
        insight: "Classic lifestyle creep — your expenses will always meet your income.",
      },
      {
        id: "F2_B",
        text: "I allow myself a small treat but spend most of the extra without tracking it.",
        points: 2,
        insight: "Partial discipline, but the lack of intentionality erodes the surplus.",
      },
      {
        id: "F2_C",
        text: "I keep lifestyle flat and route the entire ₹15,000 to savings or investments.",
        points: 3,
        insight: "Excellent — you are intercepting lifestyle creep at the source.",
      },
      {
        id: "F2_D",
        text: "I follow a pre-agreed rule: 50% goes to investments and 50% gets spent intentionally on a pre-defined joy category.",
        points: 4,
        insight: "Best of both worlds — disciplined growth with guilt-free enjoyment.",
      },
    ],
  },
  {
    id: "F3",
    pillar: "foundation",
    pillarLabel: "Foundation",
    theme: "CapEx Vault for Gig / Variable Income",
    question:
      "You are a freelancer or have a variable income. A high-paying project arrives. How do you handle the surplus?",
    options: [
      {
        id: "F3_A",
        text: "It's a good month — I spend freely, assuming more projects will come.",
        points: 1,
        insight: "Feast-and-famine thinking destroys financial stability for gig workers.",
      },
      {
        id: "F3_B",
        text: "I save a small fixed amount and use the rest to cover pending bills and desires.",
        points: 2,
        insight: "Better than nothing, but reactive — not a system.",
      },
      {
        id: "F3_C",
        text: "I pay myself a fixed monthly 'salary' from a pool account and park the surplus there.",
        points: 3,
        insight: "Smart income smoothing — this creates artificial salaried predictability.",
      },
      {
        id: "F3_D",
        text: "I maintain a CapEx Vault — a separate account for irregular large expenses (laptop, upskilling, taxes) funded during peak months so lean months don't break me.",
        points: 4,
        insight: "This is the Capital Expenditure Vault — the ultimate financial shock absorber for gig workers.",
      },
    ],
  },
  {
    id: "F4",
    pillar: "foundation",
    pillarLabel: "Foundation",
    theme: "CapEx Vault / Emergency Fund",
    question:
      "Your laptop, which you depend on for income, suddenly dies. How does your financial system respond?",
    options: [
      {
        id: "F4_A",
        text: "I panic and put it on a credit card or borrow from family — no plan was in place.",
        points: 1,
        insight: "Unplanned emergencies that hit credit cards are expensive debt traps.",
      },
      {
        id: "F4_B",
        text: "I dip into my emergency fund, which stings but works.",
        points: 2,
        insight: "Emergency funds are for true emergencies (medical, job loss). A predictable asset replacement is better handled by a CapEx fund.",
      },
      {
        id: "F4_C",
        text: "I have a separate tech/gear fund I contribute to monthly — I use that without stress.",
        points: 3,
        insight: "Excellent. You've correctly segregated predictable large costs from genuine emergencies.",
      },
      {
        id: "F4_D",
        text: "This is a non-event. My CapEx Vault covers planned asset replacements, my emergency fund stays untouched, and my income stream continues uninterrupted.",
        points: 4,
        insight: "Master-level financial architecture — every rupee has a specific job.",
      },
    ],
  },
  {
    id: "F5",
    pillar: "foundation",
    pillarLabel: "Foundation",
    theme: "Automating Savings",
    question:
      "How do you ensure you actually invest or save each month, even during stressful or tempting periods?",
    options: [
      {
        id: "F5_A",
        text: "I remind myself mentally and try to invest when I remember — some months I do, some I don't.",
        points: 1,
        insight: "Willpower is unreliable. Discipline that requires active effort fails under stress.",
      },
      {
        id: "F5_B",
        text: "I set a calendar reminder at month-end to manually move money.",
        points: 2,
        insight: "Better than nothing, but manual transfers at month-end compete with zero balance.",
      },
      {
        id: "F5_C",
        text: "I have SIP auto-debits on the 2nd of every month — right after salary day.",
        points: 3,
        insight: "Strong. Automation removes the decision entirely.",
      },
      {
        id: "F5_D",
        text: "My entire savings and investment architecture is automated on Day 1: SIPs, PPF contributions, RD installments, and vault transfers — all triggered without my intervention.",
        points: 4,
        insight: "Financial systems over financial willpower — the hallmark of a true financial architect.",
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PILLAR 2: GROWTH ENGINE
// Themes: Rupee Cost Averaging (SIPs) | PPF / EEE Tax-free compounding | Fixed Income ballast
// ─────────────────────────────────────────────────────────────────────────────

const growthEngineQuestions = [
  {
    id: "G1",
    pillar: "growthEngine",
    pillarLabel: "Growth Engine",
    theme: "Rupee Cost Averaging (SIPs)",
    question:
      "The Sensex drops 18% in two months. What do you do with your existing SIPs?",
    options: [
      {
        id: "G1_A",
        text: "I pause my SIPs immediately to avoid 'throwing good money after bad'.",
        points: 1,
        insight: "This destroys the entire logic of Rupee Cost Averaging — you buy fewer units at higher prices and skip buying more units at lower prices.",
      },
      {
        id: "G1_B",
        text: "I feel nervous and consider pausing, but I ultimately do nothing.",
        points: 2,
        insight: "Inaction out of fear is better than panicked stopping, but it is not a strategy.",
      },
      {
        id: "G1_C",
        text: "I continue my SIPs undisturbed — I understand that volatility is the price of returns.",
        points: 3,
        insight: "Correct. SIP discipline through downturns is where real wealth is built.",
      },
      {
        id: "G1_D",
        text: "I continue my SIPs AND deploy a pre-planned lump sum from my opportunity fund — I treat the dip as a discount sale.",
        points: 4,
        insight: "Elite-level RCA discipline — you are buying units at a deep discount while others panic-exit.",
      },
    ],
  },
  {
    id: "G2",
    pillar: "growthEngine",
    pillarLabel: "Growth Engine",
    theme: "Rupee Cost Averaging (SIPs)",
    question:
      "A colleague tells you that lump-sum investing beats SIPs if you time the market correctly. How do you respond?",
    options: [
      {
        id: "G2_A",
        text: "That makes sense — I try to time my investments to market dips.",
        points: 1,
        insight: "Studies consistently show that 'time in the market' beats 'timing the market' for retail investors.",
      },
      {
        id: "G2_B",
        text: "I agree with the theory but I don't have the lump sum, so I just do SIPs.",
        points: 2,
        insight: "Correct behavior for the wrong reason — SIPs are powerful because of RCA, not just because you lack a lump sum.",
      },
      {
        id: "G2_C",
        text: "I explain that lump-sum timing requires perfect information. SIPs leverage Rupee Cost Averaging to smooth out cost basis over time, reducing regret risk.",
        points: 3,
        insight: "Articulate and correct — you understand the mechanical advantage of SIPs.",
      },
      {
        id: "G2_D",
        text: "I use a barbell strategy: a monthly SIP for disciplined averaging AND a pre-defined trigger to deploy lump sums only after a 10%+ index correction.",
        points: 4,
        insight: "Sophisticated and evidence-backed — you combine the best of both worlds with pre-committed rules.",
      },
    ],
  },
  {
    id: "G3",
    pillar: "growthEngine",
    pillarLabel: "Growth Engine",
    theme: "PPF / EEE Tax-Free Compounding",
    question:
      "How do you currently use the Public Provident Fund (PPF) in your financial plan?",
    options: [
      {
        id: "G3_A",
        text: "I don't use it — the 15-year lock-in puts me off.",
        points: 1,
        insight: "Missing PPF means forfeiting tax-free compounding on both contribution (80C), interest, AND maturity (EEE status) — a triple tax shield.",
      },
      {
        id: "G3_B",
        text: "I contribute the minimum to keep the account active.",
        points: 2,
        insight: "Better than nothing, but minimizing PPF contributions is minimizing the world's most powerful legal tax-free compound machine available to Indian retail investors.",
      },
      {
        id: "G3_C",
        text: "I max out my ₹1.5L annual PPF contribution every year, ideally on April 1st for maximum compounding.",
        points: 3,
        insight: "Excellent. Front-loading on April 1st earns you one extra month of interest vs. year-end contributions.",
      },
      {
        id: "G3_D",
        text: "I max out my own PPF, have opened a PPF account for my spouse/minor child, and treat it as the risk-free backbone of my 30-year wealth ladder.",
        points: 4,
        insight: "Generational wealth thinking — you are building a tax-free compound engine across the entire family unit.",
      },
    ],
  },
  {
    id: "G4",
    pillar: "growthEngine",
    pillarLabel: "Growth Engine",
    theme: "Fixed Income as Portfolio Ballast",
    question:
      "What role does fixed income (FDs, Debt Funds, G-Secs, PPF) play in your portfolio?",
    options: [
      {
        id: "G4_A",
        text: "None — fixed income returns are lower than equity, so I avoid it entirely.",
        points: 1,
        insight: "A 100% equity portfolio has no ballast. During crashes, you have no dry powder and high volatility can force panic-selling.",
      },
      {
        id: "G4_B",
        text: "I have some FDs that my parents suggested — I haven't really thought about the strategy.",
        points: 2,
        insight: "Inherited habit rather than intention. Random fixed income without purpose doesn't serve as a true ballast.",
      },
      {
        id: "G4_C",
        text: "I allocate roughly 20-30% to debt instruments to reduce portfolio volatility and sleep better at night.",
        points: 3,
        insight: "Sound thinking — debt provides psychological comfort and rebalancing flexibility during equity corrections.",
      },
      {
        id: "G4_D",
        text: "My fixed income allocation is my strategic ammunition — I hold debt so I have liquid capital to redeploy into equity when markets correct 15%+.",
        points: 4,
        insight: "Advanced portfolio mechanics — fixed income as 'dry powder' is how institutional investors outperform during crashes.",
      },
    ],
  },
  {
    id: "G5",
    pillar: "growthEngine",
    pillarLabel: "Growth Engine",
    theme: "Fixed Income + Tax Efficiency",
    question:
      "You receive a ₹2 lakh annual bonus. It will be invested for at least 5 years. What is your approach?",
    options: [
      {
        id: "G5_A",
        text: "I put it in my savings account and move it somewhere when I figure out the plan.",
        points: 1,
        insight: "Keeping money in a savings account long-term is losing ~4% to inflation after tax.",
      },
      {
        id: "G5_B",
        text: "I put it all in an FD — safe and predictable.",
        points: 2,
        insight: "FD interest is taxed at your income slab rate. For a 30%+ taxpayer, post-tax FD returns barely beat inflation.",
      },
      {
        id: "G5_C",
        text: "I split it: partial lump sum into an equity fund, partial into a short-duration debt fund for rebalancing fuel.",
        points: 3,
        insight: "Good diversification. Debt mutual funds are tax-efficient vs. FDs for investors in higher slabs.",
      },
      {
        id: "G5_D",
        text: "I map it to my 'growth ladder': max out PPF first (EEE), then allocate the remainder across equity SIP top-up and a liquid fund for the next correction opportunity.",
        points: 4,
        insight: "Tax-optimized, goal-mapped, and strategically positioned — every rupee is working at peak efficiency.",
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PILLAR 3: STRATEGY
// Themes: Competence Trap / analysis paralysis | Corporate tax matches | Social capital
// ─────────────────────────────────────────────────────────────────────────────

const strategyQuestions = [
  {
    id: "S1",
    pillar: "strategy",
    pillarLabel: "Strategy",
    theme: "The Competence Trap (Analysis Paralysis)",
    question:
      "You have been researching which mutual fund to invest in for three months. You still haven't started. Why?",
    options: [
      {
        id: "S1_A",
        text: "There are too many options and I'm afraid to pick the wrong one — I'll start when I know more.",
        points: 1,
        insight: "This is the Competence Trap — high-knowledge individuals over-optimize and under-execute, losing months of compounding.",
      },
      {
        id: "S1_B",
        text: "I'm waiting for market conditions to be 'right' before I invest.",
        points: 2,
        insight: "Waiting for perfect conditions is still analysis paralysis disguised as strategy.",
      },
      {
        id: "S1_C",
        text: "I accept imperfect action over perfect inaction — I start with a simple index fund SIP and refine later.",
        points: 3,
        insight: "Correct. A Nifty 50 index fund SIP started today is worth infinitely more than the 'perfect' fund started in 6 months.",
      },
      {
        id: "S1_D",
        text: "I follow a pre-committed decision rule: if research exceeds 2 weeks, I default to a low-cost index fund and deploy capital immediately — optimization is an ongoing process, not a prerequisite.",
        points: 4,
        insight: "Precommitment devices that override analysis paralysis are used by the world's top investors. Simplicity deployed beats complexity delayed.",
      },
    ],
  },
  {
    id: "S2",
    pillar: "strategy",
    pillarLabel: "Strategy",
    theme: "The Competence Trap",
    question:
      "A STEM professional tells you: 'I'm building my own stock-screening model before I start investing.' They've been doing this for 8 months. Your advice?",
    options: [
      {
        id: "S2_A",
        text: "Sounds smart — a custom model will definitely outperform generic funds.",
        points: 1,
        insight: "Over 90% of actively managed funds underperform index funds over 10 years. A DIY model without institutional data infrastructure is unlikely to beat the market consistently.",
      },
      {
        id: "S2_B",
        text: "It's a great learning exercise, but maybe start investing something small meanwhile.",
        points: 2,
        insight: "Correct instinct — suggesting parallel action is better than full redirection.",
      },
      {
        id: "S2_C",
        text: "That's the Competence Trap — their expertise is being weaponized against their wealth. Starting with index funds today costs nothing and risks nothing.",
        points: 3,
        insight: "Spot on. Intelligence and financial expertise are negatively correlated in many studies due to over-analysis and overconfidence.",
      },
      {
        id: "S2_D",
        text: "I'd frame it as a decision cost analysis: every month of inaction is approximately 1% of annual equity returns lost forever due to compounding. The model needs to outperform by that opportunity cost plus management time just to break even.",
        points: 4,
        insight: "Quantifying the cost of inaction is the most persuasive way to break analysis paralysis — you think in opportunity costs, not just effort.",
      },
    ],
  },
  {
    id: "S3",
    pillar: "strategy",
    pillarLabel: "Strategy",
    theme: "Maximizing Corporate Tax Matches & Benefits",
    question:
      "Your employer offers a Voluntary Provident Fund (VPF) top-up option where they match contributions up to a limit. What is your approach?",
    options: [
      {
        id: "S3_A",
        text: "I skip it — the money is locked up and I need liquidity.",
        points: 1,
        insight: "Skipping an employer match is leaving guaranteed 100% instant returns on the table. No market instrument can offer that.",
      },
      {
        id: "S3_B",
        text: "I'm not sure if my employer offers this — I haven't checked.",
        points: 2,
        insight: "Awareness gap — many employees miss thousands of rupees in annual free money simply by not reading their HR benefits documents.",
      },
      {
        id: "S3_C",
        text: "I contribute exactly up to the employer match limit — no more, no less. Free money first.",
        points: 3,
        insight: "Correct. Always harvest the full employer match before optimizing anything else.",
      },
      {
        id: "S3_D",
        text: "I max the employer match AND use VPF strategically as tax-free debt-equivalent return, integrating it into my overall fixed income allocation so I'm not over-allocated to locked instruments.",
        points: 4,
        insight: "Sophisticated portfolio thinking — you treat VPF as a component of your overall asset allocation, not as an isolated product.",
      },
    ],
  },
  {
    id: "S4",
    pillar: "strategy",
    pillarLabel: "Strategy",
    theme: "Corporate Tax Benefits & Optimization",
    question:
      "Your company offers a Flexible Benefits Plan (LTA, meal vouchers, NPS contribution, etc.). How do you manage it?",
    options: [
      {
        id: "S4_A",
        text: "I just choose the default option HR gives me — it's not a big deal.",
        points: 1,
        insight: "The default is almost never optimal. Passive acceptance of a sub-optimal structure means paying higher tax than legally required.",
      },
      {
        id: "S4_B",
        text: "I optimize a couple of obvious items like HRA and LTA but don't dig deeper.",
        points: 2,
        insight: "Surface-level optimization. Components like NPS employer contribution (80CCD(2)) and meal vouchers offer additional tax-free income that is often missed.",
      },
      {
        id: "S4_C",
        text: "I spend 2-3 hours each April reviewing my entire salary structure to minimize my taxable CTC within legal limits.",
        points: 3,
        insight: "Excellent annual ritual — restructuring at the start of the fiscal year captures maximum benefit.",
      },
      {
        id: "S4_D",
        text: "I model my entire post-tax take-home across both tax regimes, maximize every exempt component (NPS, LTA, meal, uniform allowance), and review again after any salary hike or life event.",
        points: 4,
        insight: "This level of salary architecture engineering can save ₹50,000–₹2,00,000 per year for higher earners — a skill worth far more than most investments.",
      },
    ],
  },
  {
    id: "S5",
    pillar: "strategy",
    pillarLabel: "Strategy",
    theme: "Social Capital as a Financial Asset",
    question:
      "A former colleague reaches out asking for your help with something outside your immediate benefit. How do you approach this?",
    options: [
      {
        id: "S5_A",
        text: "I'm too busy — I politely decline unless there's something immediate in it for me.",
        points: 1,
        insight: "Transactional networking destroys social capital. The most valuable opportunities come from people you helped when you didn't 'need' to.",
      },
      {
        id: "S5_B",
        text: "I help if I have the time, but I don't keep track of these relationships systematically.",
        points: 2,
        insight: "Occasional generosity is good, but unsystematic — the compound interest of social capital requires consistent deposits.",
      },
      {
        id: "S5_C",
        text: "I help generously and view my network as a long-term asset — referrals, co-investments, and opportunities flow through relationships built over years.",
        points: 3,
        insight: "Correct framing — social capital has measurable ROI in career acceleration, deal flow, and co-investment access.",
      },
      {
        id: "S5_D",
        text: "I treat social capital as a portfolio: I invest time in high-trust nodes, give value first consistently, and periodically audit whether my network expands or contracts my financial opportunity set.",
        points: 4,
        insight: "The wealthiest individuals treat their networks with the same rigor as financial portfolios. You are building an invisible but compounding asset.",
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PILLAR 4: PSYCHOLOGY
// Themes: Psychological Capital (guilt-free spending) | Feast-or-Famine protocol | Dynamic liquidity buffers
// ─────────────────────────────────────────────────────────────────────────────

const psychologyQuestions = [
  {
    id: "P1",
    pillar: "psychology",
    pillarLabel: "Psychology",
    theme: "Psychological Capital (Guilt-Free Spending)",
    question:
      "You spend ₹8,000 on a concert ticket for an artist you love. How do you feel about this purchase?",
    options: [
      {
        id: "P1_A",
        text: "Guilty — I should have invested that money instead.",
        points: 1,
        insight: "Chronic financial guilt is a burnout signal. Sustainable wealth-building requires intentional joy, not permanent deprivation.",
      },
      {
        id: "P1_B",
        text: "Slightly guilty, but I rationalize it as a one-time thing.",
        points: 2,
        insight: "Rationalization without a system still leaves an emotional residue that can lead to binge spending as a reaction.",
      },
      {
        id: "P1_C",
        text: "Zero guilt — this came from my designated 'joy budget' which I fund every month alongside my investments.",
        points: 3,
        insight: "Perfect. A pre-funded joy budget transforms spending from guilt to intention.",
      },
      {
        id: "P1_D",
        text: "Pure joy — I track my Psychological Capital allocation the same way I track my SIPs. Experiences that prevent burnout are an investment in my earning capacity.",
        points: 4,
        insight: "Sophisticated self-awareness — burnout costs far more than any experience ever will. Protecting mental capital IS financial planning.",
      },
    ],
  },
  {
    id: "P2",
    pillar: "psychology",
    pillarLabel: "Psychology",
    theme: "Psychological Capital",
    question:
      "A high-performing friend tells you they haven't taken a vacation in 2 years to maximize savings. Your reaction?",
    options: [
      {
        id: "P2_A",
        text: "Respect — that's the kind of discipline needed to build real wealth.",
        points: 1,
        insight: "Deprivation without recovery is not discipline — it is deferred burnout. The eventual crash often reverses years of 'savings'.",
      },
      {
        id: "P2_B",
        text: "I feel like maybe I'm not being disciplined enough with my own spending.",
        points: 2,
        insight: "Dangerous comparison trap. Your financial plan should be calibrated to your psychology, not someone else's performance metrics.",
      },
      {
        id: "P2_C",
        text: "I'm concerned — extreme deprivation tends to cause binge spending or burnout that undermines the entire savings effort.",
        points: 3,
        insight: "Correct. Research on willpower depletion shows that extreme restriction often leads to overcorrection and financial self-sabotage.",
      },
      {
        id: "P2_D",
        text: "I'd offer to help them model a 'Psychological Capital Budget' — if burnout causes even one job loss, it can erase 2-3 years of savings in months. Protecting mental reserves IS a financial strategy.",
        points: 4,
        insight: "You understand that human capital preservation (your earning capacity) is the most valuable asset in your portfolio — more than any financial instrument.",
      },
    ],
  },
  {
    id: "P3",
    pillar: "psychology",
    pillarLabel: "Psychology",
    theme: "Feast-or-Famine Protocol",
    question:
      "As a freelancer, you land a contract worth 3x your typical monthly income. What is your financial protocol?",
    options: [
      {
        id: "P3_A",
        text: "I pay down any pending dues and enjoy the rest — high-income months deserve high-spending months.",
        points: 1,
        insight: "This is Feast-or-Famine behavior — volatile income requires counter-cyclical spending, not pro-cyclical.",
      },
      {
        id: "P3_B",
        text: "I invest a chunk and spend the rest more freely, knowing lean months will come eventually.",
        points: 2,
        insight: "Partially correct — but 'investing a chunk' without a system still leaves lean months under-funded.",
      },
      {
        id: "P3_C",
        text: "I pay myself my standard monthly 'salary' and route the surplus into a designated Income Smoothing Reserve.",
        points: 3,
        insight: "This is the Feast-or-Famine Protocol in action — smoothing income removes financial anxiety and enables consistent behavior.",
      },
      {
        id: "P3_D",
        text: "I follow a pre-defined surplus split: 1/3 to Income Smoothing Reserve, 1/3 to investments (lump sum top-up or SIP booster), 1/3 to a Tax Vault (advance tax provision). The protocol runs automatically — I am not tempted to deviate.",
        points: 4,
        insight: "Complete feast-month architecture — you provision for taxes (often missed by freelancers), smooth income, and accelerate compounding. All without emotional decision-making.",
      },
    ],
  },
  {
    id: "P4",
    pillar: "psychology",
    pillarLabel: "Psychology",
    theme: "Dynamic Liquidity Buffer",
    question:
      "How do you determine the size of your emergency fund / liquidity buffer?",
    options: [
      {
        id: "P4_A",
        text: "I don't have a formal emergency fund — my savings account balance doubles as a buffer.",
        points: 1,
        insight: "Savings account balance fluctuates with spending. It is not an intentional, sized buffer — it is just leftover money.",
      },
      {
        id: "P4_B",
        text: "I follow the standard '3-6 months of expenses' rule I've seen online.",
        points: 2,
        insight: "A static rule is better than nothing, but it ignores your specific income volatility, family situation, and market conditions.",
      },
      {
        id: "P4_C",
        text: "I recalibrate my liquidity buffer every 6 months based on my current income stability, dependents, and upcoming large expenses.",
        points: 3,
        insight: "Dynamic recalibration is far superior to a fixed rule — your buffer requirements change as your life changes.",
      },
      {
        id: "P4_D",
        text: "My liquidity buffer is dynamic and tiered: Tier 1 (instant access: 2 months expenses in liquid fund), Tier 2 (FD: 3 months), Tier 3 (accessible investments: 2 months). Size adjusts based on income stability score I review quarterly.",
        points: 4,
        insight: "Institutional-grade liquidity management — tiered buffers optimize for both security AND returns, unlike a single idle emergency fund.",
      },
    ],
  },
  {
    id: "P5",
    pillar: "psychology",
    pillarLabel: "Psychology",
    theme: "Financial Anxiety & Behavioral Resilience",
    question:
      "You check your portfolio during a market downturn and find it is down ₹1,20,000 from its peak. What is your emotional and behavioral response?",
    options: [
      {
        id: "P5_A",
        text: "I feel significant anxiety and start considering exiting my positions to 'stop the bleeding'.",
        points: 1,
        insight: "Selling during drawdowns is the most value-destroying behavior in investing — it converts paper losses into permanent ones.",
      },
      {
        id: "P5_B",
        text: "I feel uncomfortable but I've learned to do nothing — I just avoid checking the portfolio.",
        points: 2,
        insight: "Avoidance is better than panic-selling, but it is not the same as psychological resilience. You are not using the data constructively.",
      },
      {
        id: "P5_C",
        text: "I reframe the loss as 'units I'm buying cheaper' and check if my investment thesis has changed — if not, I stay the course.",
        points: 3,
        insight: "Correct cognitive reframe — drawdowns are the cost of returns, not evidence of failure.",
      },
      {
        id: "P5_D",
        text: "I follow a pre-committed drawdown protocol: at -15%, I review my thesis. At -20%, I deploy 10% of my Fixed Income ballast into equity. At -30%, I deploy another 10%. My responses are pre-programmed, so fear has no input.",
        points: 4,
        insight: "Pre-commitment devices that remove emotion from decision-making are the hallmark of elite investors. You have outsmarted your own psychology.",
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMBINED EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const ALL_QUESTIONS = [
  ...foundationQuestions,
  ...growthEngineQuestions,
  ...strategyQuestions,
  ...psychologyQuestions,
];

export const QUESTIONS_BY_PILLAR = {
  foundation: foundationQuestions,
  growthEngine: growthEngineQuestions,
  strategy: strategyQuestions,
  psychology: psychologyQuestions,
};

// Score tier labels per pillar (out of 20)
export const SCORE_TIERS = [
  { min: 18, max: 20, label: "Oracle",       color: "#6366F1", description: "Exceptional mastery. You operate at the top 5%." },
  { min: 14, max: 17, label: "Strategist",   color: "#10B981", description: "Strong foundations with clear strategic intent." },
  { min: 10, max: 13, label: "Apprentice",   color: "#F59E0B", description: "Aware but inconsistent — refine your systems." },
  { min:  5, max:  9, label: "Wanderer",     color: "#EC4899", description: "Flying blind. Significant blind spots to address." },
];

export const getTier = (score) =>
  SCORE_TIERS.find((t) => score >= t.min && score <= t.max) ?? SCORE_TIERS[SCORE_TIERS.length - 1];

export default ALL_QUESTIONS;
