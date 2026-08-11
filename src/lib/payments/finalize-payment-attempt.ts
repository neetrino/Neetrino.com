import type { Prisma } from '@prisma/client';

type PaymentAttemptWriter = {
  paymentAttempt: {
    updateMany: (args: {
      where: {
        id: string;
        status: { not: string };
      };
      data: {
        failureMessage: string | null;
        paidAt: Date | null;
        providerResponse: Prisma.InputJsonValue;
        status: string;
      };
    }) => Promise<{ count: number }>;
  };
};

type ClaimPaidInput = {
  attemptId: string;
  paidAt: Date;
  providerResponse: Prisma.InputJsonValue;
};

/**
 * Atomically transitions a payment attempt to PAID only when it is not already PAID.
 * Returns true when this caller performed the first successful transition (idempotent).
 */
export async function claimPaymentPaidTransition(
  input: ClaimPaidInput,
  db?: PaymentAttemptWriter,
): Promise<boolean> {
  const writer = db ?? (await import('../prisma')).prisma;
  const result = await writer.paymentAttempt.updateMany({
    where: {
      id: input.attemptId,
      status: { not: 'PAID' },
    },
    data: {
      failureMessage: null,
      paidAt: input.paidAt,
      providerResponse: input.providerResponse,
      status: 'PAID',
    },
  });

  return result.count === 1;
}

type MarkFailedInput = {
  attemptId: string;
  failureMessage: string;
  providerResponse: Prisma.InputJsonValue;
};

/** Marks an attempt FAILED without overwriting an already-PAID row. */
export async function markPaymentAttemptFailed(
  input: MarkFailedInput,
  db?: PaymentAttemptWriter,
): Promise<void> {
  const writer = db ?? (await import('../prisma')).prisma;
  await writer.paymentAttempt.updateMany({
    where: {
      id: input.attemptId,
      status: { not: 'PAID' },
    },
    data: {
      failureMessage: input.failureMessage,
      paidAt: null,
      providerResponse: input.providerResponse,
      status: 'FAILED',
    },
  });
}
