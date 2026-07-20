'use client';

import { useEffect, useState, useTransition, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { CdnImage as Image } from '@/lib/cdn-image';
import { isRemoteImageUrl } from '@/lib/image-url';
import { updatePartnerImage, uploadPartnerImage } from '../_actions/partner-actions';
import type { AdminPartner } from './admin-partner';
import { useAdminI18n } from './admin-i18n-provider';
import { useAdminToast } from './admin-toast';

type PartnerUploadSheetProps = {
  onClose: () => void;
  partner?: AdminPartner;
};

export function PartnerUploadSheet({
  onClose,
  partner,
}: PartnerUploadSheetProps): React.JSX.Element | null {
  const router = useRouter();
  const { copy } = useAdminI18n();
  const { showSuccessToast } = useAdminToast();
  const isEditing = Boolean(partner);
  const [mounted, setMounted] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!file) {
      setPreviewUrl(null);
      setFileName('');
      return;
    }

    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setErrorMessage('');

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = isEditing
        ? await updatePartnerImage({ status: 'idle', message: '' }, formData)
        : await uploadPartnerImage({ status: 'idle', message: '' }, formData);

      if (result.status === 'error') {
        setErrorMessage(result.message);
        return;
      }

      showSuccessToast(isEditing ? copy.partners.updateSuccess : copy.partners.uploadSuccess);
      router.refresh();
      onClose();
    });
  }

  if (!mounted) {
    return null;
  }

  const title = isEditing ? copy.partners.editSheetTitle : copy.partners.uploadSheetTitle;
  const description = isEditing
    ? copy.partners.editSheetDescription
    : copy.partners.uploadSheetDescription;
  const submitLabel = isEditing ? copy.partners.editSubmit : copy.partners.uploadSubmit;
  const previewSrc = previewUrl ?? partner?.url ?? null;

  return createPortal(
    <div className="admin-drawer-layer" role="presentation">
      <button
        type="button"
        className="admin-drawer-backdrop"
        aria-label={copy.common.closePanel}
        onClick={onClose}
      />
      <section
        className="admin-drawer admin-portfolio-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-partner-upload-title"
      >
        <div className="admin-drawer-header">
          <div>
            <h2 id="admin-partner-upload-title">{title}</h2>
            <p>{description}</p>
          </div>
          <button type="button" className="admin-drawer-close" aria-label={copy.common.closePanel} onClick={onClose}>
            x
          </button>
        </div>

        <form id="admin-partner-upload-form" className="admin-form admin-portfolio-sheet-form" onSubmit={handleSubmit}>
          {partner ? <input name="partnerId" type="hidden" value={partner.id} /> : null}

          <label className="admin-field admin-portfolio-sheet-field-wide">
            <span>{copy.partners.uploadImageLabel}</span>
            <input
              name="image"
              type="file"
              accept="image/avif,image/jpeg,image/png,image/webp"
              required
              disabled={isPending}
              onChange={handleFileChange}
            />
            {fileName ? <p className="admin-portfolio-upload-filename">{fileName}</p> : null}
          </label>

          {previewSrc ? (
            <div className="admin-portfolio-sheet-preview">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- local blob preview before upload
                <img src={previewUrl} alt="" className="admin-portfolio-sheet-image" />
              ) : (
                <Image
                  src={previewSrc}
                  alt={partner?.alt ?? ''}
                  width={320}
                  height={180}
                  sizes="320px"
                  unoptimized={isRemoteImageUrl(previewSrc)}
                  className="admin-portfolio-sheet-image"
                />
              )}
            </div>
          ) : null}

          {errorMessage ? <p className="admin-card-error">{errorMessage}</p> : null}
        </form>

        <div className="admin-drawer-footer">
          <button type="button" className="admin-secondary-button" disabled={isPending} onClick={onClose}>
            {copy.common.cancel}
          </button>
          <button
            type="submit"
            form="admin-partner-upload-form"
            className="admin-primary-button"
            disabled={isPending}
          >
            {isPending ? copy.partners.uploading : submitLabel}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
