import enPrivacyMessages from '../../../locales/en/privacy.json';
import hyPrivacyMessages from '../../../locales/hy/privacy.json';
import ruPrivacyMessages from '../../../locales/ru/privacy.json';
import { DEFAULT_HOME_LOCALE, type HomeLocale } from './home-messages';

export type PrivacyMessages = typeof enPrivacyMessages;

export const privacyMessagesByLocale: Record<HomeLocale, PrivacyMessages> = {
  en: enPrivacyMessages,
  hy: hyPrivacyMessages,
  ru: ruPrivacyMessages,
};

export const privacyMessages = privacyMessagesByLocale[DEFAULT_HOME_LOCALE];
