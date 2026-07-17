'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { AdminPaymentOrder } from './admin-order';
import { useAdminI18n } from './admin-i18n-provider';

const AMD_FORMATTER = new Intl.NumberFormat('en-US');

type OrderSheetProps = {
  order: AdminPaymentOrder;
  onClose: () => void;
};

function formatOrderDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function OrderSheet({ order, onClose }: OrderSheetProps): React.JSX.Element | null {
  const { copy, locale } = useAdminI18n();
  const [mounted, setMounted] = useState(false);
  const customerLabel = order.customerName.trim() || copy.orders.noCustomer;

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);

    return () => {
      window.clearTimeout(timer);
    };
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

  return createPortal(
    <div className="admin-drawer-layer" role="presentation">
      <button
        type="button"
        className="admin-drawer-backdrop"
        aria-label={copy.common.closePanel}
        onClick={onClose}
      />
      <section
        className="admin-drawer admin-order-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-order-sheet-title"
      >
        <div className="admin-drawer-header">
          <div>
            <h2 id="admin-order-sheet-title">{order.orderNumber}</h2>
            <p>{copy.orders.sheetDescription}</p>
          </div>
          <button type="button" className="admin-drawer-close" aria-label={copy.common.closePanel} onClick={onClose}>
            x
          </button>
        </div>

        <div className="admin-order-sheet-summary">
          <span className={`admin-order-status admin-order-status--${order.status.toLowerCase()}`}>{order.status}</span>
          <p className="admin-order-sheet-amount">
            {AMD_FORMATTER.format(order.amountAmd)} {order.currency}
          </p>
        </div>

        <dl className="admin-order-sheet-meta">
          <div>
            <dt>{copy.orders.metaProduct}</dt>
            <dd>{order.productName}</dd>
          </div>
          <div>
            <dt>{copy.orders.metaCustomer}</dt>
            <dd>{customerLabel}</dd>
          </div>
          <div>
            <dt>{copy.orders.metaProvider}</dt>
            <dd>{order.provider}</dd>
          </div>
          <div>
            <dt>{copy.orders.metaTransactionId}</dt>
            <dd>{order.providerTransactionId || copy.orders.notAvailable}</dd>
          </div>
          <div>
            <dt>{copy.orders.metaCreated}</dt>
            <dd>{formatOrderDate(order.createdAt, locale)}</dd>
          </div>
          <div>
            <dt>{copy.orders.metaPaid}</dt>
            <dd>{order.paidAt ? formatOrderDate(order.paidAt, locale) : copy.orders.notPaidYet}</dd>
          </div>
          <div>
            <dt>{copy.orders.metaUpdated}</dt>
            <dd>{formatOrderDate(order.updatedAt, locale)}</dd>
          </div>
          {order.failureMessage ? (
            <div className="admin-order-sheet-meta-wide">
              <dt>{copy.orders.metaFailure}</dt>
              <dd>{order.failureMessage}</dd>
            </div>
          ) : null}
        </dl>

        <div className="admin-order-sheet-actions">
          <button type="button" className="admin-primary-button" onClick={onClose}>
            {copy.common.closePanel}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
