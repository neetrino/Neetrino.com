import type { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getArcaOrderStatus, isSuccessfulArcaPayment } from '@/lib/payments/arca/client';
import { getArcaConfig } from '@/lib/payments/arca/config';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

type PaymentResult = 'paid' | 'failed';

type PaymentAttemptWithProduct = Prisma.PaymentAttemptGetPayload<{
  include: { product: true };
}>;

function toJsonValue(value: Record<string, unknown>): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function redirectToProduct(secretSlug: string, payment: PaymentResult): NextResponse {
  return NextResponse.redirect(new URL(`/p/${secretSlug}?payment=${payment}`, getArcaConfig().appUrl), 303);
}

async function findPaymentAttempt(searchParams: URLSearchParams): Promise<PaymentAttemptWithProduct | null> {
  const paymentId = searchParams.get('payment')?.trim();
  const arcaOrderId = searchParams.get('orderId')?.trim();

  if (paymentId) {
    return prisma.paymentAttempt.findUnique({
      where: { id: paymentId },
      include: { product: true },
    });
  }

  if (arcaOrderId) {
    return prisma.paymentAttempt.findUnique({
      where: { providerTransactionId: arcaOrderId },
      include: { product: true },
    });
  }

  return null;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const paymentAttempt = await findPaymentAttempt(request.nextUrl.searchParams);

    if (!paymentAttempt) {
      return NextResponse.json({ error: 'Payment not found.' }, { status: 404 });
    }

    if (paymentAttempt.status === 'PAID') {
      return redirectToProduct(paymentAttempt.product.secretSlug, 'paid');
    }

    const arcaOrderId = paymentAttempt.providerTransactionId ?? request.nextUrl.searchParams.get('orderId');

    if (!arcaOrderId) {
      throw new Error('Arca order id is missing.');
    }

    const status = await getArcaOrderStatus(arcaOrderId);
    const isPaid = isSuccessfulArcaPayment(status);
    await prisma.paymentAttempt.update({
      where: { id: paymentAttempt.id },
      data: {
        failureMessage: isPaid ? null : 'Arca payment was not deposited.',
        paidAt: isPaid ? new Date() : null,
        providerResponse: toJsonValue(status.rawResponse),
        status: isPaid ? 'PAID' : 'FAILED',
      },
    });

    return redirectToProduct(paymentAttempt.product.secretSlug, isPaid ? 'paid' : 'failed');
  } catch (error) {
    logger.error('Failed to handle Arca callback.', { error });

    return NextResponse.json({ error: 'Payment callback failed.' }, { status: 400 });
  }
}
