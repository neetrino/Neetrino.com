import { Suspense } from 'react';

import { AdminPageHeader } from '../_components/admin-page-header';
import type { AdminContactMessage } from '../_components/admin-contact-message';
import { MessageList } from '../_components/message-list';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

function asText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function serializeMessage(message: Record<string, unknown> & { id: string; createdAt: Date }): AdminContactMessage {
  return {
    id: message.id,
    name: asText(message.name),
    email: asText(message.email),
    phone: asText(message.phone),
    message: asText(message.message),
    projectType: asText(message.projectType),
    projectGoal: asText(message.projectGoal),
    budget: asText(message.budget),
    timeline: asText(message.timeline),
    createdAt: message.createdAt.toISOString(),
  };
}

async function getContactMessages(): Promise<AdminContactMessage[]> {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return messages.map((message) => serializeMessage(message));
  } catch (error) {
    logger.error('Failed to load admin contact messages.', { error });
    return [];
  }
}

export default async function AdminMessagesPage(): Promise<React.JSX.Element> {
  const messages = await getContactMessages();

  return (
    <>
      <AdminPageHeader sectionKey="messages" />
      <Suspense fallback={<div className="admin-empty">Loading messages…</div>}>
        <MessageList messages={messages} />
      </Suspense>
    </>
  );
}
