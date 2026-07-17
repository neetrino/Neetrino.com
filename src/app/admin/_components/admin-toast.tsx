'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

const TOAST_AUTO_DISMISS_MS = 3600;
const TOAST_EXIT_MS = 220;
const MAX_VISIBLE_TOASTS = 3;

type AdminToastItem = {
  id: string;
  message: string;
  leaving: boolean;
};

type AdminToastContextValue = {
  showSuccessToast: (message: string) => void;
};

const AdminToastContext = createContext<AdminToastContextValue | null>(null);

function createToastId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function AdminToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: AdminToastItem[];
  onDismiss: (id: string) => void;
}): React.JSX.Element {
  return (
    <div className="admin-toast-viewport" aria-live="polite" aria-relevant="additions">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={
            toast.leaving
              ? 'admin-toast admin-toast--success admin-toast--leaving'
              : 'admin-toast admin-toast--success'
          }
          role="status"
        >
          <span className="admin-toast-icon" aria-hidden>
            <svg viewBox="0 0 20 20" fill="none">
              <path
                d="M5.5 10.5 8.5 13.5 14.5 6.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <p className="admin-toast-message">{toast.message}</p>
          <button
            type="button"
            className="admin-toast-dismiss"
            aria-label="Dismiss"
            onClick={() => onDismiss(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export function AdminToastProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [toasts, setToasts] = useState<AdminToastItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const dismissTimersRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    const timers = dismissTimersRef.current;

    return () => {
      window.clearTimeout(timer);
      timers.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timers.clear();
    };
  }, []);

  const removeToast = useCallback((id: string): void => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timeoutId = dismissTimersRef.current.get(id);

    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
      dismissTimersRef.current.delete(id);
    }
  }, []);

  const beginExit = useCallback(
    (id: string): void => {
      setToasts((current) =>
        current.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast)),
      );
      const exitTimer = window.setTimeout(() => removeToast(id), TOAST_EXIT_MS);
      dismissTimersRef.current.set(id, exitTimer);
    },
    [removeToast],
  );

  const showSuccessToast = useCallback(
    (message: string): void => {
      const id = createToastId();
      setToasts((current) => [{ id, message, leaving: false }, ...current].slice(0, MAX_VISIBLE_TOASTS));
      const dismissTimer = window.setTimeout(() => beginExit(id), TOAST_AUTO_DISMISS_MS);
      dismissTimersRef.current.set(id, dismissTimer);
    },
    [beginExit],
  );

  const value = useMemo<AdminToastContextValue>(() => ({ showSuccessToast }), [showSuccessToast]);

  return (
    <AdminToastContext.Provider value={value}>
      {children}
      {mounted ? createPortal(<AdminToastViewport toasts={toasts} onDismiss={beginExit} />, document.body) : null}
    </AdminToastContext.Provider>
  );
}

export function useAdminToast(): AdminToastContextValue {
  const context = useContext(AdminToastContext);

  if (!context) {
    throw new Error('useAdminToast must be used within AdminToastProvider.');
  }

  return context;
}
