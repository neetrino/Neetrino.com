export const ARCA_PAYMENT_PROVIDER = 'ARCA';
export const ARCA_AMD_CURRENCY_CODE = '051';
export const ARCA_SUCCESS_ORDER_STATUS = 2;
export const ARCA_SUCCESS_PAYMENT_STATE = 'DEPOSITED';

export const PAYMENT_ATTEMPT_STATUSES = ['PENDING', 'PAID', 'FAILED'] as const;

export type PaymentAttemptStatus = (typeof PAYMENT_ATTEMPT_STATUSES)[number];

export type ArcaRegisterInput = {
  orderNumber: string;
  amountAmd: number;
  returnUrl: string;
  description: string;
};

export type ArcaRegisterResult = {
  orderId: string;
  formUrl: string;
  rawResponse: Record<string, unknown>;
};

export type ArcaOrderStatusResult = {
  orderStatus?: number;
  paymentState?: string;
  actionCode?: number;
  rawResponse: Record<string, unknown>;
};
