'use client';

import { useFormStatus } from 'react-dom';

export function AdminSubmitButton({ children }: { children: string }): React.JSX.Element {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="admin-primary-button admin-primary-button--full" disabled={pending}>
      {pending ? 'Saving...' : children}
    </button>
  );
}
