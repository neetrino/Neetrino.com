import type { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getArcaConfig } from '@/lib/payments/arca/config';
import { registerArcaOrder } from '@/lib/payments/arca/client';
import { ARCA_PAYMENT_PROVIDER } from '@/lib/payments/arca/types';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

function readProductId(formData: FormData): string {
  const productId = formData.get('productId');

  if (typeof productId !== 'string' || productId.trim().length === 0) {
    throw new Error('productId is required.');
  }

  return productId.trim();
}

function toJsonValue(value: Record<string, unknown>): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function productRedirect(secretSlug: string, payment: 'failed'): NextResponse {
  return NextResponse.redirect(new URL(`/p/${secretSlug}?payment=${payment}`, getArcaConfig().appUrl), 303);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let paymentAttemptId: string | undefined;
  let secretSlug: string | undefined;

  try {
    const productId = readProductId(await request.formData());
    const product = await prisma.paymentProduct.findFirst({
      where: { id: productId, status: 'ACTIVE' },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    secretSlug = product.secretSlug;
    const paymentAttempt = await prisma.paymentAttempt.create({
      data: {
        amountAmd: product.priceAmd,
        productId: product.id,
        provider: ARCA_PAYMENT_PROVIDER,
      },
    });
    paymentAttemptId = paymentAttempt.id;

    const config = getArcaConfig();
    const result = await registerArcaOrder({
      amountAmd: product.priceAmd,
      description: product.name,
      orderNumber: paymentAttempt.id,
      returnUrl: `${config.appUrl}/api/v1/payments/arca/callback?payment=${paymentAttempt.id}`,
    });

    await prisma.paymentAttempt.update({
      where: { id: paymentAttempt.id },
      data: {
        providerResponse: toJsonValue(result.rawResponse),
        providerTransactionId: result.orderId,
        redirectUrl: result.formUrl,
      },
    });

    return NextResponse.redirect(result.formUrl, 303);
  } catch (error) {
    logger.error('Failed to initialize Arca payment.', { error, paymentAttemptId });

    if (paymentAttemptId) {
      await prisma.paymentAttempt.update({
        where: { id: paymentAttemptId },
        data: { failureMessage: 'Arca initialization failed.', status: 'FAILED' },
      });
    }

    return secretSlug ? productRedirect(secretSlug, 'failed') : NextResponse.json({ error: 'Payment failed.' }, { status: 400 });
  }
}
