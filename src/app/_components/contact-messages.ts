import enContactMessages from '../../../locales/en/contact.json';
import hyContactMessages from '../../../locales/hy/contact.json';
import ruContactMessages from '../../../locales/ru/contact.json';
import { DEFAULT_HOME_LOCALE, type HomeLocale } from './home-messages';

export type ContactMessages = typeof enContactMessages;

export const contactMessagesByLocale: Record<HomeLocale, ContactMessages> = {
  en: enContactMessages,
  hy: hyContactMessages,
  ru: ruContactMessages,
};

export const contactMessages = contactMessagesByLocale[DEFAULT_HOME_LOCALE];
