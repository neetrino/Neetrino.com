'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { submitContactMessage, type ContactActionState } from '../_actions/contact-actions';
import { useHomeI18n } from './home-i18n-provider';

const INITIAL_CONTACT_STATE: ContactActionState = {
  status: 'idle',
  message: '',
};

const SUCCESS_FEEDBACK_MS = 2500;

export function ContactForm(): React.JSX.Element {
  const { contactCopy } = useHomeI18n();
  const { form } = contactCopy;
  const formRef = useRef<HTMLFormElement>(null);
  const [showSent, setShowSent] = useState(false);
  const [state, formAction, isPending] = useActionState(submitContactMessage, INITIAL_CONTACT_STATE);

  useEffect(() => {
    if (state.status !== 'success') {
      return;
    }

    formRef.current?.reset();

    const showTimer = window.setTimeout(() => {
      setShowSent(true);
    }, 0);

    const hideTimer = window.setTimeout(() => {
      setShowSent(false);
    }, SUCCESS_FEEDBACK_MS);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [state.status]);

  return (
    <article className="contact-card contact-form-card">
      <h2 className="contact-card-title">{form.title}</h2>
      <p className="contact-card-copy">{form.copy}</p>

      <form ref={formRef} className="contact-form" action={formAction}>
        <label className="sr-only" htmlFor="contact-name">
          {form.nameLabel}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          placeholder={form.namePlaceholder}
          required
          maxLength={120}
          autoComplete="name"
        />

        <label className="sr-only" htmlFor="contact-email">
          {form.emailLabel}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          placeholder={form.emailPlaceholder}
          required
          maxLength={254}
          autoComplete="email"
        />

        <label className="sr-only" htmlFor="contact-message">
          {form.messageLabel}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder={form.messagePlaceholder}
          required
          maxLength={4000}
        />

        <div className="contact-form-actions">
          <button type="submit" disabled={isPending}>
            {isPending ? form.submitting : form.submit}
          </button>
          {showSent ? (
            <span className="contact-form-sent" role="status" aria-live="polite">
              {form.sentLabel}
            </span>
          ) : null}
          {state.status === 'error' ? (
            <span className="contact-form-error" role="alert">
              {form.errorMessage}
            </span>
          ) : null}
        </div>
      </form>
    </article>
  );
}
