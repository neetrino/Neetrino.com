import type { Prisma } from '@prisma/client';
import { AdminPageHeader } from '../_components/admin-page-header';
import {
  readOrderStatus,
  type AdminPaymentOrder,
} from '../_components/admin-order';
import { OrderList } from '../_components/order-list';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

const ORDER_NUMBER_PREFIX = 'NTR';
const ORDER_NUMBER_SUFFIX_LENGTH = 6;

type PaymentAttemptWithProduct = Prisma.PaymentAttemptGetPayload<{
  include: { product: true };
}>;

function createDisplayOrderNumber(attempt: PaymentAttemptWithProduct): string {
  const suffix = attempt.id.slice(-ORDER_NUMBER_SUFFIX_LENGTH).toUpperCase();

  return `${ORDER_NUMBER_PREFIX}-${attempt.createdAt.getTime()}-${suffix}`;
}

function serializeOrder(attempt: PaymentAttemptWithProduct): AdminPaymentOrder {
  return {
    amountAmd: attempt.amountAmd,
    createdAt: attempt.createdAt.toISOString(),
    currency: attempt.currency,
    customerName: '',
    failureMessage: attempt.failureMessage,
    id: attempt.id,
    orderNumber: createDisplayOrderNumber(attempt),
    paidAt: attempt.paidAt?.toISOString() ?? null,
    productName: attempt.product.name,
    provider: attempt.provider,
    providerTransactionId: attempt.providerTransactionId,
    status: readOrderStatus(attempt.status),
    updatedAt: attempt.updatedAt.toISOString(),
  };
}

async function getPaymentOrders(): Promise<AdminPaymentOrder[]> {
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

export default async function AdminOrdersPage(): Promise<React.JSX.Element> {
  const orders = await getPaymentOrders();

  return (
    <>
      <AdminPageHeader sectionKey="orders" />
      <OrderList orders={orders} />
    </>
  );
}
