import enTermsMessages from '../../../locales/en/terms.json';
import hyTermsMessages from '../../../locales/hy/terms.json';
import ruTermsMessages from '../../../locales/ru/terms.json';
import { DEFAULT_HOME_LOCALE, type HomeLocale } from './home-messages';

export type TermsMessages = typeof enTermsMessages;

export const termsMessagesByLocale: Record<HomeLocale, TermsMessages> = {
  en: enTermsMessages,
  hy: hyTermsMessages,
  ru: ruTermsMessages,
};

export const termsMessages = termsMessagesByLocale[DEFAULT_HOME_LOCALE];
