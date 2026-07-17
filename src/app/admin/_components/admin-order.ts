export const ORDER_STATUSES = ['PENDING', 'PAID', 'FAILED', 'CANCELLED'] as const;

export type PaymentOrderStatus = (typeof ORDER_STATUSES)[number];

export type AdminPaymentOrder = {
  id: string;
  orderNumber: string;
  productName: string;
  customerName: string;
  amountAmd: number;
  currency: string;
  status: PaymentOrderStatus;
  provider: string;
  providerTransactionId: string | null;
  failureMessage: string | null;
  createdAt: string;
  paidAt: string | null;
  updatedAt: string;
};

export function readOrderStatus(status: string): PaymentOrderStatus {
  const normalizedStatus = status?.toUpperCase();

  return ORDER_STATUSES.includes(normalizedStatus as PaymentOrderStatus)
    ? (normalizedStatus as PaymentOrderStatus)
    : 'PENDING';
}
