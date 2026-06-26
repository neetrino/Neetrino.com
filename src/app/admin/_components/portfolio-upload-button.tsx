'use client';

import { useActionState, useEffect, useRef } from 'react';
import type { PortfolioUploadState } from '../_actions/portfolio-actions';
import { useAdminI18n } from './admin-i18n-provider';

const INITIAL_UPLOAD_STATE: PortfolioUploadState = {
  status: 'idle',
  message: '',
};

type PortfolioUploadButtonProps = {
  action: (state: PortfolioUploadState, formData: FormData) => Promise<PortfolioUploadState>;
  assetType: 'IMAGE' | 'ANIMATION_IMAGE';
  label?: string;
  labelPath?: 'portfolio.upload';
};

export function PortfolioUploadButton({
  action,
  assetType,
  label,
  labelPath,
}: PortfolioUploadButtonProps): React.JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(action, INITIAL_UPLOAD_STATE);
  const { copy } = useAdminI18n();
  const buttonLabel = label ?? (labelPath ? copy.portfolio.upload : '');

  useEffect(() => {
    if (state.status === 'success' && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="admin-direct-upload">
      <input name="assetType" type="hidden" value={assetType} />
      <input
        ref={fileInputRef}
        name="image"
        type="file"
        accept="image/avif,image/jpeg,image/png,image/webp"
        className="admin-direct-upload-input"
        disabled={isPending}
        onChange={() => formRef.current?.requestSubmit()}
      />
      <button
        type="button"
        className="admin-primary-button"
        disabled={isPending}
        onClick={() => fileInputRef.current?.click()}
      >
        {isPending ? copy.portfolio.uploading : buttonLabel}
      </button>
      {state.message ? (
        <p className={`admin-upload-message admin-upload-message--${state.status}`}>{state.message}</p>
      ) : null}
    </form>
  );
}
