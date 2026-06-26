'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createHomeData } from './home-data';
import {
  DEFAULT_HOME_LOCALE,
  HOME_LANGUAGE_OPTIONS,
  homeMessagesByLocale,
  type HomeLanguageOption,
  type HomeLocale,
} from './home-messages';
import { createAboutPageData, type AboutPageData } from './about-data';
import { aboutMessagesByLocale, type AboutMessages } from './about-messages';
import { contactMessagesByLocale, type ContactMessages } from './contact-messages';
import { createPortfolioProjects, type PortfolioProject } from './portfolio-data';
import { portfolioMessagesByLocale, type PortfolioMessages } from './portfolio-messages';
import { createServiceDetailCards, type ServiceDetailCard } from './services-data';
import { blogMessagesByLocale, type BlogMessages } from './blog-messages';
import { servicesMessagesByLocale, type ServicesMessages } from './services-messages';

type HomeI18nContextValue = ReturnType<typeof createHomeData> & {
  activeLanguage: HomeLanguageOption;
  aboutCopy: AboutMessages;
  aboutData: AboutPageData;
  blogCopy: BlogMessages;
  contactCopy: ContactMessages;
  languageOptions: readonly HomeLanguageOption[];
  locale: HomeLocale;
  portfolioCopy: PortfolioMessages;
  portfolioProjects: PortfolioProject[];
  servicesCopy: ServicesMessages;
  serviceDetailCards: readonly ServiceDetailCard[];
  setLocale: (locale: HomeLocale) => void;
};

const HOME_LOCALE_STORAGE_KEY = 'neetrino.home.locale';

const HomeI18nContext = createContext<HomeI18nContextValue | null>(null);

function isHomeLocale(value: string | null): value is HomeLocale {
  return value === 'en' || value === 'hy' || value === 'ru';
}

export function HomeI18nProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [locale, setLocaleState] = useState<HomeLocale>(DEFAULT_HOME_LOCALE);
  const isRestoringLocaleRef = useRef(true);

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(HOME_LOCALE_STORAGE_KEY);

    if (isHomeLocale(storedLocale)) {
      setLocaleState(storedLocale);
    } else {
      isRestoringLocaleRef.current = false;
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;

    if (isRestoringLocaleRef.current) {
      isRestoringLocaleRef.current = false;
      return;
    }

    window.localStorage.setItem(HOME_LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  const value = useMemo<HomeI18nContextValue>(() => {
    const activeLanguage =
      HOME_LANGUAGE_OPTIONS.find((language) => language.locale === locale) ?? HOME_LANGUAGE_OPTIONS[0];
    const servicesCopy = servicesMessagesByLocale[locale];
    const portfolioCopy = portfolioMessagesByLocale[locale];
    const contactCopy = contactMessagesByLocale[locale];
    const aboutCopy = aboutMessagesByLocale[locale];
    const blogCopy = blogMessagesByLocale[locale];

    return {
      ...createHomeData(homeMessagesByLocale[locale]),
      activeLanguage,
      aboutCopy,
      aboutData: createAboutPageData(aboutCopy),
      blogCopy,
      contactCopy,
      languageOptions: HOME_LANGUAGE_OPTIONS,
      locale,
      portfolioCopy,
      portfolioProjects: createPortfolioProjects(portfolioCopy),
      servicesCopy,
      serviceDetailCards: createServiceDetailCards(servicesCopy),
      setLocale: setLocaleState,
    };
  }, [locale]);

  return <HomeI18nContext.Provider value={value}>{children}</HomeI18nContext.Provider>;
}

export function useHomeI18n(): HomeI18nContextValue {
  const context = useContext(HomeI18nContext);

  if (!context) {
    throw new Error('useHomeI18n must be used within HomeI18nProvider.');
  }

  return context;
}
