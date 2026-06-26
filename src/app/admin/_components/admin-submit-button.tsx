'use client';

import { useFormStatus } from 'react-dom';
import { useAdminI18n } from './admin-i18n-provider';

export function AdminSubmitButton({ children }: { children: string }): React.JSX.Element {
  const { pending } = useFormStatus();
  const { copy } = useAdminI18n();

  return (
    <button type="submit" className="admin-primary-button admin-primary-button--full" disabled={pending}>
      {pending ? copy.common.saving : children}
    </button>
  );
}
