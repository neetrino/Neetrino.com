'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { AdminContactMessage } from './admin-contact-message';
import { useAdminI18n } from './admin-i18n-provider';
import { MessageDeleteButton } from './message-delete-button';
import { resolveQuoteOptionLabel } from './resolve-quote-option-label';

type MessageSheetProps = {
  message: AdminContactMessage;
  onClose: () => void;
};

function formatMessageDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function MessageSheet({ message, onClose }: MessageSheetProps): React.JSX.Element | null {
  const { copy, locale } = useAdminI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!mounted) {
    return null;
  }

  const phoneLabel = (message.phone ?? '').trim() || copy.messages.notAvailable;
  const emailLabel = (message.email ?? '').trim() || copy.messages.notAvailable;

  return createPortal(
    <div className="admin-drawer-layer" role="presentation">
      <button
        type="button"
        className="admin-drawer-backdrop"
        aria-label={copy.common.closePanel}
        onClick={onClose}
      />
      <section
        className="admin-drawer admin-message-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-message-sheet-title"
      >
        <div className="admin-drawer-header">
          <div>
            <h2 id="admin-message-sheet-title">{message.name}</h2>
            <p>{copy.messages.sheetDescription}</p>
          </div>
          <button type="button" className="admin-drawer-close" aria-label={copy.common.closePanel} onClick={onClose}>
            x
          </button>
        </div>

        <dl className="admin-message-sheet-meta">
          <div>
            <dt>{copy.messages.metaName}</dt>
            <dd>{message.name}</dd>
          </div>
          <div>
            <dt>{copy.messages.metaPhone}</dt>
            <dd>{phoneLabel}</dd>
          </div>
          <div>
            <dt>{copy.messages.metaEmail}</dt>
            <dd>{emailLabel}</dd>
          </div>
          <div>
            <dt>{copy.messages.metaCreated}</dt>
            <dd>{formatMessageDate(message.createdAt, locale)}</dd>
          </div>
          <div className="admin-message-sheet-meta-wide">
            <dt>{copy.messages.metaProjectType}</dt>
            <dd>
              {resolveQuoteOptionLabel(locale, 'projectType', message.projectType) ||
                copy.messages.notAvailable}
            </dd>
          </div>
          <div className="admin-message-sheet-meta-wide">
            <dt>{copy.messages.metaProjectGoal}</dt>
            <dd>
              {resolveQuoteOptionLabel(locale, 'projectGoal', message.projectGoal) ||
                copy.messages.notAvailable}
            </dd>
          </div>
          <div className="admin-message-sheet-meta-wide">
            <dt>{copy.messages.metaBudget}</dt>
            <dd>
              {resolveQuoteOptionLabel(locale, 'budget', message.budget) || copy.messages.notAvailable}
            </dd>
          </div>
          <div className="admin-message-sheet-meta-wide">
            <dt>{copy.messages.metaTimeline}</dt>
            <dd>
              {resolveQuoteOptionLabel(locale, 'timeline', message.timeline) ||
                copy.messages.notAvailable}
            </dd>
          </div>
        </dl>

        <div className="admin-message-sheet-actions">
          <MessageDeleteButton messageId={message.id} messageName={message.name} onDeleted={onClose} />
          <button type="button" className="admin-primary-button" onClick={onClose}>
            {copy.common.closePanel}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
