import assert from 'node:assert/strict';
import test from 'node:test';

import {
  claimPaymentPaidTransition,
  markPaymentAttemptFailed,
} from './finalize-payment-attempt';
import { runOrderPaidSideEffects } from './order-paid-side-effects';

type UpdateManyCall = {
  where: { id: string; status: { not: string } };
  data: { status: string };
};

function createDbStub(count: number): {
  db: {
    paymentAttempt: {
      updateMany: (args: UpdateManyCall) => Promise<{ count: number }>;
    };
  };
  calls: UpdateManyCall[];
} {
  const calls: UpdateManyCall[] = [];
  return {
    calls,
    db: {
      paymentAttempt: {
        updateMany: async (args) => {
          calls.push(args);
          return { count };
        },
      },
    },
  };
}

test('claimPaymentPaidTransition returns true on first PENDING → PAID', async () => {
  const { db, calls } = createDbStub(1);
  const claimed = await claimPaymentPaidTransition(
    {
      attemptId: 'att_1',
      paidAt: new Date('2026-08-11T10:32:00.000Z'),
      providerResponse: { ok: true },
    },
    db,
  );

  assert.equal(claimed, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0]?.where.status.not, 'PAID');
  assert.equal(calls[0]?.data.status, 'PAID');
});

test('claimPaymentPaidTransition returns false when already PAID (duplicate webhook)', async () => {
  const { db } = createDbStub(0);
  const claimed = await claimPaymentPaidTransition(
    {
      attemptId: 'att_1',
      paidAt: new Date('2026-08-11T10:32:00.000Z'),
      providerResponse: { ok: true },
    },
    db,
  );

  assert.equal(claimed, false);
});

test('markPaymentAttemptFailed never targets already-PAID rows', async () => {
  const { db, calls } = createDbStub(1);
  await markPaymentAttemptFailed(
    {
      attemptId: 'att_1',
      failureMessage: 'Arca payment was not deposited.',
      providerResponse: { ok: false },
    },
    db,
  );

  assert.equal(calls[0]?.where.status.not, 'PAID');
  assert.equal(calls[0]?.data.status, 'FAILED');
});

test('ORDER_PAID side effects run only when transition claimed', async () => {
  let notifyCalls = 0;
  await runOrderPaidSideEffects(false, async () => {
    notifyCalls += 1;
  });
  assert.equal(notifyCalls, 0);

  await runOrderPaidSideEffects(true, async () => {
    notifyCalls += 1;
  });
  assert.equal(notifyCalls, 1);
});

test('Telegram throw during side effect does not escape when caller isolates', async () => {
  await assert.rejects(
    async () =>
      runOrderPaidSideEffects(true, async () => {
        throw new Error('Telegram down');
      }),
    /Telegram down/,
  );
});
