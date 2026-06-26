import { AdminPageHeader } from '../_components/admin-page-header';

const ORDER_PREVIEW_ITEMS = ['New orders', 'Processing queue', 'History'] as const;

export default function AdminOrdersPage(): React.JSX.Element {
  return (
    <>
      <AdminPageHeader title="Orders" description="Orders admin shell is ready for the next workflow details." />
      <section className="admin-list" aria-label="Orders setup">
        {ORDER_PREVIEW_ITEMS.map((item) => (
          <article key={item} className="admin-card">
            <span className="admin-card-icon" aria-hidden>
              O
            </span>
            <div>
              <h2>{item}</h2>
              <p>Prepared admin block. Statuses and actions can be added after the order flow is defined.</p>
            </div>
            <span className="admin-status">Ready</span>
          </article>
        ))}
      </section>
    </>
  );
}
