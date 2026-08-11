'use client';

import type { ContactMessages } from './contact-messages';
import {
  QUOTE_BUDGET_IDS,
  QUOTE_PROJECT_GOAL_IDS,
  QUOTE_PROJECT_TYPE_IDS,
  QUOTE_TIMELINE_IDS,
  type QuoteBudgetId,
  type QuoteProjectGoalId,
  type QuoteProjectTypeId,
  type QuoteTimelineId,
} from './quote-wizard-options';

export type WizardStep = 'projectType' | 'projectGoal' | 'budget' | 'timeline' | 'contact' | 'success';
export type QuestionStep = 'projectType' | 'projectGoal' | 'budget' | 'timeline';
export type QuoteCopy = ContactMessages['quote'];

export const QUESTION_ORDER: readonly QuestionStep[] = [
  'projectType',
  'projectGoal',
  'budget',
  'timeline',
];

export const TOTAL_PROGRESS_STEPS = QUESTION_ORDER.length + 1;

export function formatQuoteStepLabel(template: string, current: number, total: number): string {
  return template.replace('{current}', String(current)).replace('{total}', String(total));
}

export function QuoteOptionList({
  ids,
  labels,
  selected,
  onSelect,
}: {
  ids: readonly string[];
  labels: Record<string, string>;
  selected: string | null;
  onSelect: (id: string) => void;
}): React.JSX.Element {
  return (
    <div className="quote-modal-options" role="radiogroup">
      {ids.map((id) => {
        const isActive = selected === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={isActive}
            className={isActive ? 'quote-modal-option quote-modal-option--active' : 'quote-modal-option'}
            onClick={() => onSelect(id)}
          >
            {labels[id]}
          </button>
        );
      })}
    </div>
  );
}

type QuestionBodyProps = {
  quote: QuoteCopy;
  questionStep: QuestionStep;
  projectType: QuoteProjectTypeId | null;
  projectGoal: QuoteProjectGoalId | null;
  budget: QuoteBudgetId | null;
  timeline: QuoteTimelineId | null;
  onBack: (step: WizardStep) => void;
  onSelectProjectType: (id: QuoteProjectTypeId) => void;
  onSelectProjectGoal: (id: QuoteProjectGoalId) => void;
  onSelectBudget: (id: QuoteBudgetId) => void;
  onSelectTimeline: (id: QuoteTimelineId) => void;
};

export function QuoteQuestionBody({
  quote,
  questionStep,
  projectType,
  projectGoal,
  budget,
  timeline,
  onBack,
  onSelectProjectType,
  onSelectProjectGoal,
  onSelectBudget,
  onSelectTimeline,
}: QuestionBodyProps): React.JSX.Element {
  const index = QUESTION_ORDER.indexOf(questionStep);
  const question = quote.questions[questionStep];
  const canGoBack = index > 0;
  const backStep: WizardStep | null = canGoBack ? QUESTION_ORDER[index - 1] : null;

  const config = {
    projectType: {
      ids: QUOTE_PROJECT_TYPE_IDS,
      selected: projectType,
      onSelect: (id: string) => onSelectProjectType(id as QuoteProjectTypeId),
    },
    projectGoal: {
      ids: QUOTE_PROJECT_GOAL_IDS,
      selected: projectGoal,
      onSelect: (id: string) => onSelectProjectGoal(id as QuoteProjectGoalId),
    },
    budget: {
      ids: QUOTE_BUDGET_IDS,
      selected: budget,
      onSelect: (id: string) => onSelectBudget(id as QuoteBudgetId),
    },
    timeline: {
      ids: QUOTE_TIMELINE_IDS,
      selected: timeline,
      onSelect: (id: string) => onSelectTimeline(id as QuoteTimelineId),
    },
  }[questionStep];

  return (
    <div className="quote-modal-body">
      <QuoteOptionList
        ids={config.ids}
        labels={question.options}
        selected={config.selected}
        onSelect={config.onSelect}
      />
      {canGoBack && backStep ? (
        <div className="quote-modal-nav">
          <button type="button" className="quote-modal-secondary" onClick={() => onBack(backStep)}>
            {quote.backLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}
