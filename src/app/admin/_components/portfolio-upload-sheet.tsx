'use client';

import { useEffect, useState, useTransition, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { uploadPortfolioImage } from '../_actions/portfolio-actions';
import { useAdminI18n } from './admin-i18n-provider';
import { useAdminToast } from './admin-toast';

type PortfolioUploadSheetProps = {
  onClose: () => void;
};

type UploadFormValues = {
  title: string;
  alt: string;
  assetType: 'IMAGE' | 'ANIMATION_IMAGE';
  status: 'ACTIVE' | 'DRAFT';
  projectUrl: string;
};

const EMPTY_UPLOAD_VALUES: UploadFormValues = {
  title: '',
  alt: '',
  assetType: 'IMAGE',
  status: 'ACTIVE',
  projectUrl: '',
};

export function PortfolioUploadSheet({ onClose }: PortfolioUploadSheetProps): React.JSX.Element | null {
  const router = useRouter();
  const { copy } = useAdminI18n();
  const { showSuccessToast } = useAdminToast();
  const [mounted, setMounted] = useState(false);
  const [values, setValues] = useState<UploadFormValues>(EMPTY_UPLOAD_VALUES);
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

    if (!values.title.trim()) {
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
      setValues((current) => ({
        ...current,
        title: nameWithoutExtension
          .split(/[-_\s]+/)
          .filter(Boolean)
          .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
          .join(' '),
      }));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setErrorMessage('');

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await uploadPortfolioImage({ status: 'idle', message: '' }, formData);

      if (result.status === 'error') {
        setErrorMessage(result.message);
        return;
      }

      showSuccessToast(copy.portfolio.uploadSuccess);
      router.refresh();
      onClose();
    });
  }

  if (!mounted) {
    return null;
  }

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
        aria-labelledby="admin-portfolio-upload-title"
      >
        <div className="admin-drawer-header">
          <div>
            <h2 id="admin-portfolio-upload-title">{copy.portfolio.uploadSheetTitle}</h2>
            <p>{copy.portfolio.uploadSheetDescription}</p>
          </div>
          <button type="button" className="admin-drawer-close" aria-label={copy.common.closePanel} onClick={onClose}>
            x
          </button>
        </div>

        <form id="admin-portfolio-upload-form" className="admin-form admin-portfolio-sheet-form" onSubmit={handleSubmit}>
          <label className="admin-field admin-portfolio-sheet-field-wide">
            <span>{copy.portfolio.uploadImageLabel}</span>
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

          {previewUrl ? (
            <div className="admin-portfolio-sheet-preview">
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview before upload */}
              <img src={previewUrl} alt="" className="admin-portfolio-sheet-image" />
            </div>
          ) : null}

          <div className="admin-form-grid admin-form-grid--two">
            <label className="admin-field">
              <span>{copy.portfolio.metaTitle}</span>
              <input
                name="title"
                type="text"
                required
                value={values.title}
                onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
                disabled={isPending}
              />
            </label>
            <label className="admin-field">
              <span>{copy.portfolio.metaType}</span>
              <select
                name="assetType"
                value={values.assetType}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    assetType: event.target.value as UploadFormValues['assetType'],
                  }))
                }
                disabled={isPending}
              >
                <option value="IMAGE">{copy.portfolio.typeImage}</option>
                <option value="ANIMATION_IMAGE">{copy.portfolio.typeAnimation}</option>
              </select>
            </label>
            <label className="admin-field">
              <span>{copy.portfolio.metaStatus}</span>
              <select
                name="status"
                value={values.status}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    status: event.target.value as UploadFormValues['status'],
                  }))
                }
                disabled={isPending}
              >
                <option value="ACTIVE">{copy.portfolio.statusActive}</option>
                <option value="DRAFT">{copy.portfolio.statusDraft}</option>
              </select>
            </label>
            <label className="admin-field">
              <span>{copy.portfolio.metaProjectUrl}</span>
              <input
                name="projectUrl"
                type="url"
                inputMode="url"
                placeholder={copy.portfolio.metaProjectUrlPlaceholder}
                value={values.projectUrl}
                onChange={(event) => setValues((current) => ({ ...current, projectUrl: event.target.value }))}
                disabled={isPending}
              />
            </label>
            <label className="admin-field admin-portfolio-sheet-field-wide">
              <span>{copy.portfolio.metaAlt}</span>
              <textarea
                name="alt"
                rows={3}
                value={values.alt}
                placeholder={copy.portfolio.uploadAltPlaceholder}
                onChange={(event) => setValues((current) => ({ ...current, alt: event.target.value }))}
                disabled={isPending}
              />
            </label>
          </div>

          {errorMessage ? <p className="admin-card-error">{errorMessage}</p> : null}
        </form>

        <div className="admin-portfolio-sheet-actions">
          <button type="button" className="admin-secondary-button" disabled={isPending} onClick={onClose}>
            {copy.common.cancel}
          </button>
          <button
            type="submit"
            form="admin-portfolio-upload-form"
            className="admin-primary-button"
            disabled={isPending}
          >
            {isPending ? copy.portfolio.uploading : copy.portfolio.uploadSubmit}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
