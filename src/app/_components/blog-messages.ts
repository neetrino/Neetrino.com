import enBlogMessages from '../../../locales/en/blog.json';
import hyBlogMessages from '../../../locales/hy/blog.json';
import ruBlogMessages from '../../../locales/ru/blog.json';
import { DEFAULT_HOME_LOCALE, type HomeLocale } from './home-messages';

export type BlogMessages = typeof enBlogMessages;

export const blogMessagesByLocale: Record<HomeLocale, BlogMessages> = {
  en: enBlogMessages,
  hy: hyBlogMessages,
  ru: ruBlogMessages,
};

export const blogMessages = blogMessagesByLocale[DEFAULT_HOME_LOCALE];
