import enServicesMessages from '../../../locales/en/services.json';
import hyServicesMessages from '../../../locales/hy/services.json';
import ruServicesMessages from '../../../locales/ru/services.json';
import { DEFAULT_HOME_LOCALE, type HomeLocale } from './home-messages';

export type ServicesMessages = typeof enServicesMessages;

export const servicesMessagesByLocale: Record<HomeLocale, ServicesMessages> = {
  en: enServicesMessages,
  hy: hyServicesMessages,
  ru: ruServicesMessages,
};

export const servicesMessages = servicesMessagesByLocale[DEFAULT_HOME_LOCALE];
