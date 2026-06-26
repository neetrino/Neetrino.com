'use client';

import { useAdminI18n } from './admin-i18n-provider';
import type { AdminMessages } from './admin-messages';

type AdminTextProps = {
  path: string;
};

function readPath(source: AdminMessages, path: string): string {
  let current: unknown = source;

  for (const segment of path.split('.')) {
    if (typeof current !== 'object' || current === null || Array.isArray(current)) {
      return path;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return typeof current === 'string' ? current : path;
}

export function AdminText({ path }: AdminTextProps): React.JSX.Element {
  const { copy } = useAdminI18n();

  return <>{readPath(copy, path)}</>;
}
