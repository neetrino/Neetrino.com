import { AdminPageHeader } from '../_components/admin-page-header';
import { ContactDeleteButton } from '../_components/contact-delete-button';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

const CONTACT_DATE_FORMATTER = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

async function getContactMessages() {
  try {
    return await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    logger.error('Failed to load contact messages.', { error });
    return [];
  }
}

type ContactMessageItem = Awaited<ReturnType<typeof getContactMessages>>[number];

function ContactMessageCard({ message }: { message: ContactMessageItem }): React.JSX.Element {
  return (
    <article className="admin-card admin-contact-card">
      <span className="admin-card-icon" aria-hidden>
        M
      </span>
      <div>
        <h2>{message.name}</h2>
        <p>
          <a href={`mailto:${message.email}`}>{message.email}</a>
        </p>
        <p className="admin-contact-message">{message.message}</p>
        <p className="admin-contact-date">{CONTACT_DATE_FORMATTER.format(message.createdAt)}</p>
      </div>
      <div className="admin-card-meta">
        <div className="admin-card-actions">
          <ContactDeleteButton messageId={message.id} senderName={message.name} />
        </div>
      </div>
    </article>
  );
}

export default async function AdminContactPage(): Promise<React.JSX.Element> {
  const messages = await getContactMessages();

  return (
    <>
      <AdminPageHeader
        title="Messages"
        description="Contact form submissions from the public /contact page."
      />
      <section className="admin-list" aria-label="Contact message list">
        {messages.length > 0 ? (
          messages.map((message) => <ContactMessageCard key={message.id} message={message} />)
        ) : (
          <div className="admin-empty">No messages yet. Submissions from /contact will appear here.</div>
        )}
      </section>
    </>
  );
}
