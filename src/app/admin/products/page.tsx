import { AdminPageHeader } from '../_components/admin-page-header';

const PRODUCT_PREVIEW_ITEMS = ['Catalog structure', 'Pricing', 'Availability'] as const;

export default function AdminProductsPage(): React.JSX.Element {
  return (
    <>
      <AdminPageHeader title="Products" description="Product management shell is ready for the next requirements." />
      <section className="admin-list" aria-label="Products setup">
        {PRODUCT_PREVIEW_ITEMS.map((item) => (
          <article key={item} className="admin-card">
            <span className="admin-card-icon" aria-hidden>
              P
            </span>
            <div>
              <h2>{item}</h2>
              <p>Prepared admin block. Details can be connected when the product rules are confirmed.</p>
            </div>
            <span className="admin-status">Ready</span>
          </article>
        ))}
      </section>
    </>
  );
}
