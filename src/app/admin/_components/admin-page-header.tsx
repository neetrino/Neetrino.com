import type { ReactNode } from 'react';

type AdminPageHeaderProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function AdminPageHeader({
  title,
  description,
  children,
}: AdminPageHeaderProps): React.JSX.Element {
  return (
    <header className="admin-page-header">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </header>
  );
}
