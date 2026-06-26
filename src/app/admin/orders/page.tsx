import type { Prisma } from '@prisma/client';
import { AdminPageHeader } from '../_components/admin-page-header';
import { AdminSection } from '../_components/admin-section';
import { AdminText } from '../_components/admin-text';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

const ORDER_STATUSES = ['PENDING', 'PAID', 'FAILED', 'CANCELLED'] as const;
const ORDER_NUMBER_PREFIX = 'NTR';
const ORDER_NUMBER_SUFFIX_LENGTH = 6;
const AMD_FORMATTER = new Intl.NumberFormat('en-US');
const ORDER_DATE_FORMATTER = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

type PaymentOrderStatus = (typeof ORDER_STATUSES)[number];

type PaymentAttemptWithProduct = Prisma.PaymentAttemptGetPayload<{
  include: { product: true };
}>;

type PaymentOrder = {
  id: string;
  orderNumber: string;
  productName: string;
  customerName: string;
  amountAmd: number;
  status: PaymentOrderStatus;
  createdAt: Date;
  paidAt: Date | null;
};

function readOrderStatus(status: string): PaymentOrderStatus {
  const normalizedStatus = status?.toUpperCase();

  return ORDER_STATUSES.includes(normalizedStatus as PaymentOrderStatus) ? (normalizedStatus as PaymentOrderStatus) : 'PENDING';
}

function createDisplayOrderNumber(attempt: PaymentAttemptWithProduct): string {
  const suffix = attempt.id.slice(-ORDER_NUMBER_SUFFIX_LENGTH).toUpperCase();

  return `${ORDER_NUMBER_PREFIX}-${attempt.createdAt.getTime()}-${suffix}`;
}

function serializeOrder(attempt: PaymentAttemptWithProduct): PaymentOrder {
  return {
    amountAmd: attempt.amountAmd,
    createdAt: attempt.createdAt,
    customerName: '',
    id: attempt.id,
    orderNumber: createDisplayOrderNumber(attempt),
    paidAt: attempt.paidAt,
    productName: attempt.product.name,
    status: readOrderStatus(attempt.status),
  };
}

async function getPaymentOrders(): Promise<PaymentOrder[]> {
  try {
    const attempts = await prisma.paymentAttempt.findMany({
      include: { product: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return attempts.map(serializeOrder);
  } catch (error) {
    logger.error('Failed to load admin payment orders.', { error });
    return [];
  }
}

function PaymentOrderItem({ order }: { order: PaymentOrder }): React.JSX.Element {
  return (
    <article className="admin-order-row">
      <div className="admin-order-content">
        <div className="admin-order-title">
          <h2>{order.orderNumber}</h2>
          <span className={`admin-order-status admin-order-status--${order.status.toLowerCase()}`}>{order.status}</span>
        </div>
        <p className="admin-order-product">{order.productName}</p>
        <p className="admin-order-meta">
          {order.customerName || <AdminText path="orders.noCustomer" />} - {AMD_FORMATTER.format(order.amountAmd)} AMD -{' '}
          {ORDER_DATE_FORMATTER.format(order.paidAt ?? order.createdAt)}
        </p>
      </div>
      <span className="admin-order-chevron" aria-hidden>
        &gt;
      </span>
    </article>
  );
}

export default async function AdminOrdersPage(): Promise<React.JSX.Element> {
  const orders = await getPaymentOrders();

  return (
    <>
      <AdminPageHeader sectionKey="orders" />
      <AdminSection className="admin-order-list" ariaLabelPath="orders.listAria">
        {orders.length > 0 ? (
          orders.map((order) => <PaymentOrderItem key={order.id} order={order} />)
        ) : (
          <div className="admin-empty">
            <AdminText path="orders.empty" />
          </div>
        )}
      </AdminSection>
    </>
  );
}
