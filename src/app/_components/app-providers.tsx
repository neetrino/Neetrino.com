'use client';

import type { ReactNode } from 'react';
import { HomeI18nProvider } from './home-i18n-provider';

/** Root client providers that must persist across route changes. */
export function AppProviders({ children }: { children: ReactNode }): React.JSX.Element {
  return <HomeI18nProvider>{children}</HomeI18nProvider>;
}
