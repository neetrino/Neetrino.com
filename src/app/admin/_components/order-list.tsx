'use client';

import { useState, type KeyboardEvent } from 'react';
import type { AdminPaymentOrder } from './admin-order';
import { formatAdminMessage, useAdminI18n } from './admin-i18n-provider';
import { OrderSheet } from './order-sheet';

const AMD_FORMATTER = new Intl.NumberFormat('en-US');

type OrderListProps = {
  orders: AdminPaymentOrder[];
};

function formatOrderListDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function OrderList({ orders }: OrderListProps): React.JSX.Element {
  const { copy, locale } = useAdminI18n();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? null;

  function handleRowKeyDown(orderId: string, event: KeyboardEvent<HTMLElement>): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedOrderId(orderId);
    }
  }

  return (
    <>
      <section className="admin-order-list" aria-label={copy.orders.listAria}>
        {orders.length > 0 ? (
          orders.map((order) => {
            const customerLabel = order.customerName.trim() || copy.orders.noCustomer;

            return (
              <article
                key={order.id}
                className="admin-order-row"
                role="button"
                tabIndex={0}
                aria-label={formatAdminMessage(copy.orders.openAria, { orderNumber: order.orderNumber })}
                onClick={() => setSelectedOrderId(order.id)}
                onKeyDown={(event) => handleRowKeyDown(order.id, event)}
              >
                <div className="admin-order-content">
                  <div className="admin-order-title">
                    <h2>{order.orderNumber}</h2>
                    <span className={`admin-order-status admin-order-status--${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="admin-order-product">{order.productName}</p>
                  <p className="admin-order-meta">
                    {customerLabel} - {AMD_FORMATTER.format(order.amountAmd)} {order.currency} -{' '}
                    {formatOrderListDate(order.paidAt ?? order.createdAt, locale)}
                  </p>
                </div>
                <span className="admin-order-chevron" aria-hidden>
                  &gt;
                </span>
              </article>
            );
          })
        ) : (
          <div className="admin-empty">{copy.orders.empty}</div>
        )}
      </section>
      {selectedOrder ? <OrderSheet order={selectedOrder} onClose={() => setSelectedOrderId(null)} /> : null}
    </>
  );
}
