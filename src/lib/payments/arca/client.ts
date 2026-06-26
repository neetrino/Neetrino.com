import { getArcaConfig } from './config';
import {
  ARCA_AMD_CURRENCY_CODE,
  ARCA_SUCCESS_ORDER_STATUS,
  ARCA_SUCCESS_PAYMENT_STATE,
  type ArcaOrderStatusResult,
  type ArcaRegisterInput,
  type ArcaRegisterResult,
} from './types';

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readNumber(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string' && value.length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function toRecord(value: unknown): Record<string, unknown> {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  throw new Error('Arca returned an invalid response.');
}

async function postArcaForm(endpoint: string, params: URLSearchParams): Promise<Record<string, unknown>> {
  const config = getArcaConfig();
  const response = await fetch(`${config.baseUrl}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  if (!response.ok) {
    throw new Error(`Arca request failed with status ${response.status}.`);
  }

  return toRecord(await response.json());
}

export async function registerArcaOrder(input: ArcaRegisterInput): Promise<ArcaRegisterResult> {
  const config = getArcaConfig();
  const params = new URLSearchParams({
    userName: config.userName,
    password: config.password,
    orderNumber: input.orderNumber,
    amount: String(input.amountAmd * 100),
    currency: ARCA_AMD_CURRENCY_CODE,
    returnUrl: input.returnUrl,
    description: input.description,
    language: 'hy',
    jsonParams: JSON.stringify({ FORCE_3DS2: 'true' }),
  });
  const rawResponse = await postArcaForm('register.do', params);
  const errorCode = readString(rawResponse.errorCode);

  if (errorCode && errorCode !== '0') {
    throw new Error(readString(rawResponse.errorMessage) ?? 'Arca order registration failed.');
  }

  const orderId = readString(rawResponse.orderId);
  const formUrl = readString(rawResponse.formUrl);

  if (!orderId || !formUrl) {
    throw new Error('Arca registration response is missing payment form details.');
  }

  return { orderId, formUrl, rawResponse };
}

export async function getArcaOrderStatus(orderId: string): Promise<ArcaOrderStatusResult> {
  const config = getArcaConfig();
  const params = new URLSearchParams({
    userName: config.userName,
    password: config.password,
    orderId,
  });
  const rawResponse = await postArcaForm('getOrderStatusExtended.do', params);
  const paymentAmountInfo = toRecord(rawResponse.paymentAmountInfo ?? {});

  return {
    actionCode: readNumber(rawResponse.actionCode),
    orderStatus: readNumber(rawResponse.orderStatus),
    paymentState: readString(paymentAmountInfo.paymentState),
    rawResponse,
  };
}

export function isSuccessfulArcaPayment(status: ArcaOrderStatusResult): boolean {
  return status.paymentState === ARCA_SUCCESS_PAYMENT_STATE || status.orderStatus === ARCA_SUCCESS_ORDER_STATUS;
}
