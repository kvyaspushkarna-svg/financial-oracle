/**
 * store.js — The Financial Oracle: Ramen to Riches
 *
 * Shared data layer: constants, reducers, score computation, and custom hooks.
 * Extracted from App.jsx so that QuizEngine.jsx can import from here without
 * creating an App → QuizEngine → App circular dependency.
 *
 * Consumers:
 *   · App.jsx         — imports constants for display purposes
 *   · QuizEngine.jsx  — imports useDemographics, useAssessment, computeResults
 *   · ResultsDashboard.jsx — optionally imports computeResults
 */

import { useState, useReducer, useCallback, useMemo } from "react";
import {
  ALL_QUESTIONS,
  PILLARS,
  SCORE_TIERS,
  getTier,
} from "./questionsData";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const APP_PHASES = {
  LANDING:      "LANDING",
  DEMOGRAPHICS: "DEMOGRAPHICS",
  ASSESSMENT:   "ASSESSMENT",
  RESULTS:      "RESULTS",
};

export const PROFESSION_CATEGORIES = [
  { value: "corporate", label: "Corporate / Salaried" },
  { value: "gig",       label: "Gig / Freelancer"    },
  { value: "student",   label: "Student"              },
  { value: "business",  label: "Business Owner"       },
];

export const INCOME_BRACKETS = [
  { value: "below_25k", label: "Below ₹25,000 / month"          },
  { value: "25k_50k",   label: "₹25,000 – ₹50,000 / month"      },
  { value: "50k_1L",    label: "₹50,000 – ₹1,00,000 / month"    },
  { value: "1L_2L",     label: "₹1,00,000 – ₹2,00,000 / month"  },
  { value: "above_2L",  label: "Above ₹2,00,000 / month"        },
];

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TOTAL_QUESTIONS      = ALL_QUESTIONS.length; // 20
const MAX_SCORE_PER_PILLAR = 20;                   // 5 questions × 4 pts
const MAX_TOTAL_SCORE      = 80;                   // 4 pillars × 20

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL STATE SHAPES
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_DEMOGRAPHICS = {
  age:                         "",
  professionCategory:          "",
  monthlyIncomeBracket:        "",
  selfRatedFinancialKnowledge: 5,
};

const INITIAL_ASSESSMENT_STATE = {
  currentQuestionIndex: 0,
  answers:              {},
  isComplete:           false,
};

const INITIAL_SCORES = {
  foundation:   0,
  growthEngine: 0,
  strategy:     0,
  psychology:   0,
};

// ─────────────────────────────────────────────────────────────────────────────
// ASSESSMENT REDUCER
// ─────────────────────────────────────────────────────────────────────────────

function assessmentReducer(state, action) {
  switch (action.type) {
    case "ANSWER_QUESTION": {
      const { questionId, optionId } = action.payload;
      const updatedAnswers = { ...state.answers, [questionId]: optionId };
      const nextIndex      = state.currentQuestionIndex + 1;
      const isComplete     = nextIndex >= TOTAL_QUESTIONS;
      return {
        ...state,
        answers:              updatedAnswers,
        currentQuestionIndex: isComplete ? state.currentQuestionIndex : nextIndex,
        isComplete,
      };
    }
    case "GO_BACK": {
      if (state.currentQuestionIndex === 0) return state;
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex - 1,
        isComplete: false,
      };
    }
    case "RESET":
      return { ...INITIAL_ASSESSMENT_STATE };
    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SCORE COMPUTATION — pure functions, no side effects
// ─────────────────────────────────────────────────────────────────────────────

export function computeScores(answers) {
  const scores = { ...INITIAL_SCORES };
  ALL_QUESTIONS.forEach((question) => {
    const selectedOptionId = answers[question.id];
    if (!selectedOptionId) return;
    const selectedOption = question.options.find((opt) => opt.id === selectedOptionId);
    if (!selectedOption) return;
    scores[question.pillar] += selectedOption.points;
  });
  return scores;
}

export function computeResults(demographics, answers) {
  const scores          = computeScores(answers);
  const totalScore      = Object.values(scores).reduce((a, b) => a + b, 0);
  const percentageScore = Math.round((totalScore / MAX_TOTAL_SCORE) * 100);

  const pillarResults = Object.entries(scores).map(([pillarId, score]) => {
    const pillarMeta = Object.values(PILLARS).find((p) => p.id === pillarId);
    const tier       = getTier(score);
    const percentage = Math.round((score / MAX_SCORE_PER_PILLAR) * 100);
    return { pillarId, pillarMeta, score, maxScore: MAX_SCORE_PER_PILLAR, percentage, tier };
  });

  const sorted          = [...pillarResults].sort((a, b) => a.score - b.score);
  const weakestPillar   = sorted[0];
  const strongestPillar = sorted[sorted.length - 1];

  const overallTier = SCORE_TIERS.find(
    (t) => percentageScore >= (t.min / MAX_SCORE_PER_PILLAR) * 100
  ) ?? SCORE_TIERS[SCORE_TIERS.length - 1];

  const questionInsights = ALL_QUESTIONS.map((q) => {
    const selectedOptionId = answers[q.id];
    const selectedOption   = q.options.find((o) => o.id === selectedOptionId);
    return {
      questionId:     q.id,
      question:       q.question,
      pillar:         q.pillar,
      theme:          q.theme,
      selectedOption,
      points:         selectedOption?.points ?? 0,
      maxPoints:      4,
    };
  });

  return {
    demographics,
    scores,
    totalScore,
    maxTotalScore: MAX_TOTAL_SCORE,
    percentageScore,
    pillarResults,
    weakestPillar,
    strongestPillar,
    overallTier,
    questionInsights,
    completedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM HOOKS — consumed by QuizEngine
// ─────────────────────────────────────────────────────────────────────────────

export function useAssessment() {
  const [assessmentState, dispatch] = useReducer(assessmentReducer, INITIAL_ASSESSMENT_STATE);

  const currentQuestion = ALL_QUESTIONS[assessmentState.currentQuestionIndex] ?? null;
  const progressPercent = Math.round(
    (Object.keys(assessmentState.answers).length / TOTAL_QUESTIONS) * 100
  );

  const answerQuestion  = useCallback((questionId, optionId) => {
    dispatch({ type: "ANSWER_QUESTION", payload: { questionId, optionId } });
  }, []);
  const goBack          = useCallback(() => dispatch({ type: "GO_BACK" }), []);
  const resetAssessment = useCallback(() => dispatch({ type: "RESET" }), []);

  const liveScores = useMemo(
    () => computeScores(assessmentState.answers),
    [assessmentState.answers]
  );

  return {
    ...assessmentState,
    currentQuestion,
    progressPercent,
    totalQuestions: TOTAL_QUESTIONS,
    liveScores,
    answerQuestion,
    goBack,
    resetAssessment,
  };
}

export function useDemographics() {
  const [demographics, setDemographics] = useState(INITIAL_DEMOGRAPHICS);

  const updateDemographic = useCallback((field, value) => {
    setDemographics((prev) => ({ ...prev, [field]: value }));
  }, []);
  const resetDemographics = useCallback(() => setDemographics(INITIAL_DEMOGRAPHICS), []);

  const isDemographicsComplete = useMemo(() => {
    const { age, professionCategory, monthlyIncomeBracket } = demographics;
    return (
      age !== "" &&
      Number(age) > 0 &&
      Number(age) < 120 &&
      professionCategory !== "" &&
      monthlyIncomeBracket !== ""
    );
  }, [demographics]);

  return {
    demographics,
    updateDemographic,
    resetDemographics,
    isDemographicsComplete,
    professionCategories: PROFESSION_CATEGORIES,
    incomeBrackets:       INCOME_BRACKETS,
  };
}
