'use client';

import { useState, type KeyboardEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import type { AdminContactMessage } from './admin-contact-message';
import { formatAdminMessage, useAdminI18n } from './admin-i18n-provider';
import { MessageSheet } from './message-sheet';
import { resolveQuoteOptionLabel } from './resolve-quote-option-label';

type MessageListProps = {
  messages: AdminContactMessage[];
};

function formatMessageListDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function MessageList({ messages }: MessageListProps): React.JSX.Element {
  const { copy, locale } = useAdminI18n();
  const searchParams = useSearchParams();
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(() => {
    const messageIdFromQuery = searchParams.get('messageId')?.trim();
    if (!messageIdFromQuery) {
      return null;
    }

    return messages.some((message) => message.id === messageIdFromQuery)
      ? messageIdFromQuery
      : null;
  });
  const selectedMessage = messages.find((message) => message.id === selectedMessageId) ?? null;

  function handleRowKeyDown(messageId: string, event: KeyboardEvent<HTMLElement>): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedMessageId(messageId);
    }
  }

  return (
    <>
      <section className="admin-message-list" aria-label={copy.messages.listAria}>
        {messages.length > 0 ? (
          messages.map((message) => {
            const phoneLabel = (message.phone ?? '').trim() || copy.messages.noPhone;
            const projectLabel =
              resolveQuoteOptionLabel(locale, 'projectType', message.projectType) ||
              copy.messages.notAvailable;

            return (
              <article
                key={message.id}
                className="admin-message-row"
                role="button"
                tabIndex={0}
                aria-label={formatAdminMessage(copy.messages.openAria, { name: message.name })}
                onClick={() => setSelectedMessageId(message.id)}
                onKeyDown={(event) => handleRowKeyDown(message.id, event)}
              >
                <div className="admin-message-content">
                  <div className="admin-message-title">
                    <h2>{message.name}</h2>
                    <span className="admin-message-badge">{projectLabel}</span>
                  </div>
                  <p className="admin-message-meta">
                    {phoneLabel} · {formatMessageListDate(message.createdAt, locale)}
                  </p>
                </div>
                <span className="admin-message-chevron" aria-hidden>
                  &gt;
                </span>
              </article>
            );
          })
        ) : (
          <div className="admin-empty">{copy.messages.empty}</div>
        )}
      </section>
      {selectedMessage ? (
        <MessageSheet message={selectedMessage} onClose={() => setSelectedMessageId(null)} />
      ) : null}
    </>
  );
}
