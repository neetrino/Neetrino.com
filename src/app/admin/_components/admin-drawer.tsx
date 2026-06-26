'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useAdminI18n } from './admin-i18n-provider';
import type { AdminMessages } from './admin-messages';

type AdminDrawerProps = {
  buttonLabel?: string;
  buttonLabelPath?: string;
  title?: string;
  titlePath?: string;
  description?: string;
  descriptionPath?: string;
  initialScrollPosition?: 'top' | 'bottom';
  renderTrigger?: (props: { open: () => void }) => ReactNode;
  children: ReactNode;
};

function readPath(source: AdminMessages, path?: string): string | undefined {
  if (!path) {
    return undefined;
  }

  let current: unknown = source;

  for (const segment of path.split('.')) {
    if (typeof current !== 'object' || current === null || Array.isArray(current)) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return typeof current === 'string' ? current : undefined;
}

export function AdminDrawer({
  buttonLabel,
  buttonLabelPath,
  title,
  titlePath,
  description,
  descriptionPath,
  initialScrollPosition = 'top',
  renderTrigger,
  children,
}: AdminDrawerProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const openDrawer = (): void => setIsOpen(true);
  const { copy } = useAdminI18n();
  const resolvedButtonLabel = buttonLabel ?? readPath(copy, buttonLabelPath) ?? '';
  const resolvedTitle = title ?? readPath(copy, titlePath) ?? '';
  const resolvedDescription = description ?? readPath(copy, descriptionPath) ?? '';

  useEffect(() => {
    if (!isOpen || initialScrollPosition !== 'bottom') {
      return;
    }

    const scrollToBottom = () => {
      const drawer = drawerRef.current;

      if (drawer) {
        drawer.scrollTo({ top: drawer.scrollHeight, behavior: 'instant' });
      }
    };
    const firstFrame = requestAnimationFrame(() => {
      requestAnimationFrame(scrollToBottom);
    });
    const fallbackTimeout = window.setTimeout(scrollToBottom, 120);

    return () => {
      cancelAnimationFrame(firstFrame);
      window.clearTimeout(fallbackTimeout);
    };
  }, [initialScrollPosition, isOpen]);

  return (
    <>
      {renderTrigger ? (
        renderTrigger({ open: openDrawer })
      ) : (
        <button type="button" className="admin-primary-button" onClick={openDrawer}>
          {resolvedButtonLabel}
        </button>
      )}
      {isOpen ? (
        <div className="admin-drawer-layer" role="presentation">
          <button
            type="button"
            className="admin-drawer-backdrop"
            aria-label={copy.common.closePanel}
            onClick={() => setIsOpen(false)}
          />
          <section ref={drawerRef} className="admin-drawer" aria-labelledby="admin-drawer-title">
            <div className="admin-drawer-header">
              <div>
                <h2 id="admin-drawer-title">{resolvedTitle}</h2>
                <p>{resolvedDescription}</p>
              </div>
              <button
                type="button"
                className="admin-drawer-close"
                aria-label={copy.common.closePanel}
                onClick={() => setIsOpen(false)}
              >
                x
              </button>
            </div>
            {children}
          </section>
        </div>
      ) : null}
    </>
  );
}
