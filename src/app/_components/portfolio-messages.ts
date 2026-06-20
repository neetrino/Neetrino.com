import enPortfolioMessages from '../../../locales/en/portfolio.json';
import hyPortfolioMessages from '../../../locales/hy/portfolio.json';
import ruPortfolioMessages from '../../../locales/ru/portfolio.json';
import { DEFAULT_HOME_LOCALE, type HomeLocale } from './home-messages';

export type PortfolioMessages = typeof enPortfolioMessages;

export const portfolioMessagesByLocale: Record<HomeLocale, PortfolioMessages> = {
  en: enPortfolioMessages,
  hy: hyPortfolioMessages,
  ru: ruPortfolioMessages,
};

export const portfolioMessages = portfolioMessagesByLocale[DEFAULT_HOME_LOCALE];
