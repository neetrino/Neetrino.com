import enTeamMessages from '../../../locales/en/team.json';
import hyTeamMessages from '../../../locales/hy/team.json';
import ruTeamMessages from '../../../locales/ru/team.json';
import { DEFAULT_HOME_LOCALE, type HomeLocale } from './home-messages';

export type TeamMessages = typeof enTeamMessages;

export const teamMessagesByLocale: Record<HomeLocale, TeamMessages> = {
  en: enTeamMessages,
  hy: hyTeamMessages,
  ru: ruTeamMessages,
};

export const teamMessages = teamMessagesByLocale[DEFAULT_HOME_LOCALE];
