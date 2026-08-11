'use client';

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import { useHomeI18n } from './home-i18n-provider';
import {
  formatQuoteStepLabel,
  QUESTION_ORDER,
  QuoteQuestionBody,
  TOTAL_PROGRESS_STEPS,
  type QuestionStep,
  type WizardStep,
} from './quote-modal-steps';
import type {
  QuoteBudgetId,
  QuoteProjectGoalId,
  QuoteProjectTypeId,
  QuoteTimelineId,
} from './quote-wizard-options';
import './quote-modal.css';

type QuoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type SubmitState = 'idle' | 'submitting' | 'error';

function subscribeToNothing(): () => void {
  return () => undefined;
}

function useIsClient(): boolean {
  return useSyncExternalStore(subscribeToNothing, () => true, () => false);
}

function CloseIcon(): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 6l12 12" strokeLinecap="round" />
      <path d="M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function isQuestionStep(step: WizardStep): step is QuestionStep {
  return QUESTION_ORDER.includes(step as QuestionStep);
}

/** Multi-step quote wizard opened from the site header CTA. */
export function QuoteModal({ isOpen, onClose }: QuoteModalProps): React.JSX.Element | null {
  const { contactCopy } = useHomeI18n();
  const quote = contactCopy.quote;
  const titleId = useId();
  const descriptionId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isClient = useIsClient();

  const [step, setStep] = useState<WizardStep>('projectType');
  const [projectType, setProjectType] = useState<QuoteProjectTypeId | null>(null);
  const [projectGoal, setProjectGoal] = useState<QuoteProjectGoalId | null>(null);
  const [budget, setBudget] = useState<QuoteBudgetId | null>(null);
  const [timeline, setTimeline] = useState<QuoteTimelineId | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  const resetState = useCallback((): void => {
    setStep('projectType');
    setProjectType(null);
    setProjectGoal(null);
    setBudget(null);
    setTimeline(null);
    setName('');
    setPhone('');
    setSubmitState('idle');
  }, []);

  const resetAndClose = useCallback((): void => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        resetAndClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, resetAndClose]);

  if (!isClient || !isOpen) {
    return null;
  }

  const progressIndex =
    step === 'success'
      ? 0
      : step === 'contact'
        ? TOTAL_PROGRESS_STEPS
        : QUESTION_ORDER.indexOf(step) + 1;

  const isFirstQuestion = step === 'projectType';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (submitState === 'submitting' || !projectType || !projectGoal || !budget || !timeline) {
      return;
    }

    setSubmitState('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, projectType, projectGoal, budget, timeline }),
      });

      if (!response.ok) {
        setSubmitState('error');
        return;
      }

      setSubmitState('idle');
      setStep('success');
    } catch {
      setSubmitState('error');
    }
  }

  let body: React.JSX.Element;
  if (step === 'success') {
    body = (
      <div className="quote-modal-success">
        <button type="button" className="quote-modal-submit" onClick={resetAndClose}>
          {quote.sentLabel}
        </button>
      </div>
    );
  } else if (step === 'contact') {
    body = (
      <form className="quote-modal-form" onSubmit={handleSubmit} noValidate>
        <label className="quote-modal-field">
          <span>{quote.nameLabel}</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={120}
            placeholder={quote.namePlaceholder}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label className="quote-modal-field">
          <span>{quote.phoneLabel}</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            maxLength={40}
            placeholder={quote.phonePlaceholder}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </label>
        {submitState === 'error' ? (
          <p className="quote-modal-error" role="alert">
            {quote.errorMessage}
          </p>
        ) : null}
        <div className="quote-modal-nav">
          <button type="button" className="quote-modal-secondary" onClick={() => setStep('timeline')}>
            {quote.backLabel}
          </button>
          <button type="submit" className="quote-modal-submit" disabled={submitState === 'submitting'}>
            {submitState === 'submitting' ? quote.submitting : quote.submit}
          </button>
        </div>
      </form>
    );
  } else if (isQuestionStep(step)) {
    body = (
      <QuoteQuestionBody
        quote={quote}
        questionStep={step}
        projectType={projectType}
        projectGoal={projectGoal}
        budget={budget}
        timeline={timeline}
        onBack={setStep}
        onSelectProjectType={(id) => {
          setProjectType(id);
          setStep('projectGoal');
        }}
        onSelectProjectGoal={(id) => {
          setProjectGoal(id);
          setStep('budget');
        }}
        onSelectBudget={(id) => {
          setBudget(id);
          setStep('timeline');
        }}
        onSelectTimeline={(id) => {
          setTimeline(id);
          setStep('contact');
        }}
      />
    );
  } else {
    body = <div className="quote-modal-body" />;
  }

  return createPortal(
    <div className="quote-modal-layer" role="presentation">
      <button
        type="button"
        className="quote-modal-backdrop"
        aria-label={quote.closeAriaLabel}
        onClick={resetAndClose}
      />
      <div
        className="quote-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={isFirstQuestion || step === 'contact' || step === 'success' ? descriptionId : undefined}
      >
        <div className="quote-modal-glow" aria-hidden />
        <header className="quote-modal-header">
          <div>
            {isFirstQuestion ? (
              <>
                <h2 id={titleId} className="quote-modal-title">
                  {quote.introTitle}
                </h2>
                <p id={descriptionId} className="quote-modal-copy">
                  {quote.introCopy}
                </p>
                <p className="quote-modal-kicker quote-modal-kicker--after-intro">
                  {formatQuoteStepLabel(quote.stepLabel, progressIndex, TOTAL_PROGRESS_STEPS)}
                </p>
                <p className="quote-modal-question-title">{quote.questions.projectType.title}</p>
              </>
            ) : (
              <>
                {progressIndex > 0 ? (
                  <p className="quote-modal-kicker">
                    {formatQuoteStepLabel(quote.stepLabel, progressIndex, TOTAL_PROGRESS_STEPS)}
                  </p>
                ) : null}
                <h2 id={titleId} className="quote-modal-title">
                  {step === 'success'
                    ? quote.successTitle
                    : step === 'contact'
                      ? quote.contactTitle
                      : quote.questions[step].title}
                </h2>
                {step === 'contact' ? (
                  <p id={descriptionId} className="quote-modal-copy">
                    {quote.contactCopy}
                  </p>
                ) : null}
                {step === 'success' ? (
                  <p id={descriptionId} className="quote-modal-copy">
                    {quote.successCopy}
                  </p>
                ) : null}
              </>
            )}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="quote-modal-close"
            aria-label={quote.closeAriaLabel}
            onClick={resetAndClose}
          >
            <CloseIcon />
          </button>
        </header>
        {progressIndex > 0 ? (
          <div className="quote-modal-progress" aria-hidden>
            <span style={{ width: `${(progressIndex / TOTAL_PROGRESS_STEPS) * 100}%` }} />
          </div>
        ) : null}
        {body}
      </div>
    </div>,
    document.body,
  );
}
