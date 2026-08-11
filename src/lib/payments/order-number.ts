const ORDER_NUMBER_PREFIX = 'NTR';
const ORDER_NUMBER_SUFFIX_LENGTH = 6;

/** Builds the admin-facing display order number from a payment attempt. */
export function createDisplayOrderNumber(attempt: { id: string; createdAt: Date }): string {
  const suffix = attempt.id.slice(-ORDER_NUMBER_SUFFIX_LENGTH).toUpperCase();
  return `${ORDER_NUMBER_PREFIX}-${attempt.createdAt.getTime()}-${suffix}`;
}
