'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ADMIN_LANGUAGE_OPTIONS,
  adminMessagesByLocale,
  DEFAULT_ADMIN_LOCALE,
  type AdminLanguageOption,
  type AdminLocale,
  type AdminMessages,
} from './admin-messages';

type AdminI18nContextValue = {
  copy: AdminMessages;
  languageOptions: readonly AdminLanguageOption[];
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
};

const ADMIN_LOCALE_STORAGE_KEY = 'neetrino.admin.locale';
const AdminI18nContext = createContext<AdminI18nContextValue | null>(null);

function isAdminLocale(value: string | null): value is AdminLocale {
  return value === 'en' || value === 'hy' || value === 'ru';
}

export function formatAdminMessage(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce((message, [key, value]) => message.replaceAll(`{${key}}`, value), template);
}

export function AdminI18nProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [locale, setLocaleState] = useState<AdminLocale>(DEFAULT_ADMIN_LOCALE);
  const hasRestoredLocaleRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const storedLocale = window.localStorage.getItem(ADMIN_LOCALE_STORAGE_KEY);
      hasRestoredLocaleRef.current = true;

      if (isAdminLocale(storedLocale)) {
        setLocaleState(storedLocale);
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!hasRestoredLocaleRef.current) {
      return;
    }

    window.localStorage.setItem(ADMIN_LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  const value = useMemo<AdminI18nContextValue>(
    () => ({
      copy: adminMessagesByLocale[locale],
      languageOptions: ADMIN_LANGUAGE_OPTIONS,
      locale,
      setLocale: setLocaleState,
    }),
    [locale],
  );

  return <AdminI18nContext.Provider value={value}>{children}</AdminI18nContext.Provider>;
}

export function useAdminI18n(): AdminI18nContextValue {
  const context = useContext(AdminI18nContext);

  if (!context) {
    throw new Error('useAdminI18n must be used within AdminI18nProvider.');
  }

  return context;
}
