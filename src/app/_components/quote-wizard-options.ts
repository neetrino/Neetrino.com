/**
 * Stable quote-wizard option ids (API allowlist + i18n keys).
 * Labels live in locales contact.json under quote.questions.*.options.
 */
export const QUOTE_PROJECT_TYPE_IDS = [
  'website',
  'mobile',
  'crm',
  'saas',
  'ai',
  'integration',
  'notSure',
] as const;

export const QUOTE_PROJECT_GOAL_IDS = [
  'leads',
  'automate',
  'experience',
  'launch',
  'connect',
  'replace',
  'other',
] as const;

export const QUOTE_BUDGET_IDS = [
  'under5k',
  '5to10k',
  '10to25k',
  '25to50k',
  'over50k',
  'notSure',
] as const;

export const QUOTE_TIMELINE_IDS = [
  'asap',
  'month',
  '1to3months',
  'over3months',
  'flexible',
  'exploring',
] as const;

export type QuoteProjectTypeId = (typeof QUOTE_PROJECT_TYPE_IDS)[number];
export type QuoteProjectGoalId = (typeof QUOTE_PROJECT_GOAL_IDS)[number];
export type QuoteBudgetId = (typeof QUOTE_BUDGET_IDS)[number];
export type QuoteTimelineId = (typeof QUOTE_TIMELINE_IDS)[number];

export type QuoteAnswers = {
  projectType: QuoteProjectTypeId;
  projectGoal: QuoteProjectGoalId;
  budget: QuoteBudgetId;
  timeline: QuoteTimelineId;
};

function isOneOf<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value);
}

export function isQuoteProjectTypeId(value: unknown): value is QuoteProjectTypeId {
  return isOneOf(value, QUOTE_PROJECT_TYPE_IDS);
}

export function isQuoteProjectGoalId(value: unknown): value is QuoteProjectGoalId {
  return isOneOf(value, QUOTE_PROJECT_GOAL_IDS);
}

export function isQuoteBudgetId(value: unknown): value is QuoteBudgetId {
  return isOneOf(value, QUOTE_BUDGET_IDS);
}

export function isQuoteTimelineId(value: unknown): value is QuoteTimelineId {
  return isOneOf(value, QUOTE_TIMELINE_IDS);
}
