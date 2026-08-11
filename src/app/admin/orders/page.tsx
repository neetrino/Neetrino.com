import { Suspense } from 'react';
import type { Prisma } from '@prisma/client';

import { AdminPageHeader } from '../_components/admin-page-header';
import {
  readOrderStatus,
  type AdminPaymentOrder,
} from '../_components/admin-order';
import { OrderList } from '../_components/order-list';
import { logger } from '@/lib/logger';
import { createDisplayOrderNumber } from '@/lib/payments/order-number';
import { prisma } from '@/lib/prisma';

type PaymentAttemptWithProduct = Prisma.PaymentAttemptGetPayload<{
  include: { product: true };
}>;

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
      <Suspense fallback={<div className="admin-empty">Loading orders…</div>}>
        <OrderList orders={orders} />
      </Suspense>
    </>
  );
}
