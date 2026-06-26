'use client';

import { useActionState, useEffect, useRef } from 'react';
import type { PortfolioUploadState } from '../_actions/portfolio-actions';

const INITIAL_UPLOAD_STATE: PortfolioUploadState = {
  status: 'idle',
  message: '',
};

type PortfolioUploadButtonProps = {
  action: (state: PortfolioUploadState, formData: FormData) => Promise<PortfolioUploadState>;
  assetType: 'IMAGE' | 'ANIMATION_IMAGE';
  label: string;
};

export function PortfolioUploadButton({
  action,
  assetType,
  label,
}: PortfolioUploadButtonProps): React.JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(action, INITIAL_UPLOAD_STATE);

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
        {isPending ? 'Uploading...' : label}
      </button>
      {state.message ? (
        <p className={`admin-upload-message admin-upload-message--${state.status}`}>{state.message}</p>
      ) : null}
    </form>
  );
}
