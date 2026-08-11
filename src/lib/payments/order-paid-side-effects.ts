/**
 * Runs ORDER_PAID side effects only after a real NOT_PAID → PAID transition.
 * Keeps payment success independent of notification delivery.
 */
export async function runOrderPaidSideEffects(
  transitionedToPaid: boolean,
  notify: () => Promise<void>,
): Promise<void> {
  if (!transitionedToPaid) {
    return;
  }

  await notify();
}
