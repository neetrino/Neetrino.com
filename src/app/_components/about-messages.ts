import enAboutMessages from '../../../locales/en/about.json';
import hyAboutMessages from '../../../locales/hy/about.json';
import ruAboutMessages from '../../../locales/ru/about.json';
import { DEFAULT_HOME_LOCALE, type HomeLocale } from './home-messages';

export type AboutMessages = typeof enAboutMessages;

export const aboutMessagesByLocale: Record<HomeLocale, AboutMessages> = {
  en: enAboutMessages,
  hy: hyAboutMessages,
  ru: ruAboutMessages,
};

export const aboutMessages = aboutMessagesByLocale[DEFAULT_HOME_LOCALE];
