import enRefundMessages from '../../../locales/en/refund.json';
import hyRefundMessages from '../../../locales/hy/refund.json';
import ruRefundMessages from '../../../locales/ru/refund.json';
import { DEFAULT_HOME_LOCALE, type HomeLocale } from './home-messages';

export type RefundMessages = typeof enRefundMessages;

export const refundMessagesByLocale: Record<HomeLocale, RefundMessages> = {
  en: enRefundMessages,
  hy: hyRefundMessages,
  ru: ruRefundMessages,
};

export const refundMessages = refundMessagesByLocale[DEFAULT_HOME_LOCALE];
