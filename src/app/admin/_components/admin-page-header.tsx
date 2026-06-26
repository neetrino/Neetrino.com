'use client';

import type { ReactNode } from 'react';
import { useAdminI18n } from './admin-i18n-provider';
import type { AdminMessages } from './admin-messages';

type AdminSectionKey = Exclude<keyof AdminMessages, 'shell' | 'common'>;

type AdminPageHeaderProps = {
  title?: string;
  description?: string;
  sectionKey?: AdminSectionKey;
  children?: ReactNode;
};

export function AdminPageHeader({
  title,
  description,
  sectionKey,
  children,
}: AdminPageHeaderProps): React.JSX.Element {
  const { copy } = useAdminI18n();
  const sectionCopy = sectionKey ? copy[sectionKey] : null;
  const resolvedTitle = title ?? sectionCopy?.title ?? '';
  const resolvedDescription = description ?? sectionCopy?.description ?? '';

  return (
    <header className="admin-page-header">
      <div>
        <h1>{resolvedTitle}</h1>
        <p>{resolvedDescription}</p>
      </div>
      {children}
    </header>
  );
}
