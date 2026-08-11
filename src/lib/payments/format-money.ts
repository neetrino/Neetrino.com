const AMD_FORMATTER = new Intl.NumberFormat('en-US');

/** Formats integer AMD major units with thousands separators. */
export function formatAmdAmount(amountAmd: number, currency = 'AMD'): string {
  return `${AMD_FORMATTER.format(amountAmd)} ${currency}`;
}
