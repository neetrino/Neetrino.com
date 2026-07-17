'use client';

import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAdminI18n } from './admin-i18n-provider';

type AdminConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** When set, Delete stays disabled until the user types this exact value. */
  confirmText?: string;
  confirmInputLabel?: string;
  confirmInputPlaceholder?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function AdminConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel,
  confirmText,
  confirmInputLabel,
  confirmInputPlaceholder,
  isConfirming = false,
  onConfirm,
  onCancel,
}: AdminConfirmDialogProps): React.JSX.Element {
  const { copy } = useAdminI18n();
  const inputId = useId();
  const [typedValue, setTypedValue] = useState('');
  const requiresTypedConfirm = Boolean(confirmText);
  const isConfirmEnabled =
    !isConfirming && (!requiresTypedConfirm || typedValue.trim() === confirmText?.trim());

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape' && !isConfirming) {
        onCancel();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isConfirming, onCancel]);

  return createPortal(
    <div className="admin-confirm-layer" role="presentation">
      <button
        type="button"
        className="admin-confirm-backdrop"
        aria-label={copy.common.closePanel}
        disabled={isConfirming}
        onClick={onCancel}
      />
      <section
        className="admin-confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        aria-describedby="admin-confirm-description"
      >
        <div className="admin-confirm-icon" aria-hidden>
          !
        </div>
        <div className="admin-confirm-copy">
          <h2 id="admin-confirm-title">{title}</h2>
          <p id="admin-confirm-description">{description}</p>
        </div>
        {requiresTypedConfirm ? (
          <label className="admin-field admin-confirm-field" htmlFor={inputId}>
            <span>{confirmInputLabel}</span>
            <input
              id={inputId}
              type="text"
              autoComplete="off"
              autoFocus
              spellCheck={false}
              placeholder={confirmInputPlaceholder ?? confirmText}
              value={typedValue}
              disabled={isConfirming}
              onChange={(event) => setTypedValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && isConfirmEnabled) {
                  event.preventDefault();
                  onConfirm();
                }
              }}
            />
          </label>
        ) : null}
        <div className="admin-confirm-actions">
          <button type="button" className="admin-secondary-button" disabled={isConfirming} onClick={onCancel}>
            {cancelLabel ?? copy.common.cancel}
          </button>
          <button
            type="button"
            className="admin-danger-button"
            disabled={!isConfirmEnabled}
            onClick={onConfirm}
          >
            {isConfirming ? copy.common.deleting : (confirmLabel ?? copy.common.delete)}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
