'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

type AdminDrawerProps = {
  buttonLabel: string;
  title: string;
  description: string;
  initialScrollPosition?: 'top' | 'bottom';
  renderTrigger?: (props: { open: () => void }) => ReactNode;
  children: ReactNode;
};

export function AdminDrawer({
  buttonLabel,
  title,
  description,
  initialScrollPosition = 'top',
  renderTrigger,
  children,
}: AdminDrawerProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const openDrawer = (): void => setIsOpen(true);

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
          {buttonLabel}
        </button>
      )}
      {isOpen ? (
        <div className="admin-drawer-layer" role="presentation">
          <button
            type="button"
            className="admin-drawer-backdrop"
            aria-label="Close panel"
            onClick={() => setIsOpen(false)}
          />
          <section ref={drawerRef} className="admin-drawer" aria-labelledby="admin-drawer-title">
            <div className="admin-drawer-header">
              <div>
                <h2 id="admin-drawer-title">{title}</h2>
                <p>{description}</p>
              </div>
              <button
                type="button"
                className="admin-drawer-close"
                aria-label="Close panel"
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
