'use client';

import { useEffect, useRef, useState, useTransition, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { getPortfolioSlotId } from '@/lib/portfolio-slots';
import { updatePortfolioAsset, type PortfolioDeleteState } from '../_actions/portfolio-actions';
import {
  serializeAdminPortfolioAsset,
  type AdminPortfolioAsset,
} from './admin-portfolio-asset';
import { formatAdminMessage, useAdminI18n } from './admin-i18n-provider';
import {
  createPortfolioSheetFormValues,
  formatPortfolioCreatedAt,
  formatPortfolioFileSize,
  type PortfolioSheetFormValues,
} from './portfolio-asset-sheet-form';
import { PortfolioAssetSheetMedia } from './portfolio-asset-sheet-media';
import { PortfolioDeleteButton } from './portfolio-delete-button';
import { PortfolioDeleteIconButton } from './portfolio-delete-icon-button';
import { useAdminToast } from './admin-toast';

type PortfolioAssetSheetProps = {
  asset: AdminPortfolioAsset;
  index: number;
  deleteAction: (state: PortfolioDeleteState, formData: FormData) => Promise<PortfolioDeleteState>;
  onClose: () => void;
  onUpdated: (asset: AdminPortfolioAsset) => void;
};

export function PortfolioAssetSheet({
  asset,
  index,
  deleteAction,
  onClose,
  onUpdated,
}: PortfolioAssetSheetProps): React.JSX.Element | null {
  const { copy, locale } = useAdminI18n();
  const { showSuccessToast } = useAdminToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [formAssetId, setFormAssetId] = useState(asset.id);
  const [values, setValues] = useState<PortfolioSheetFormValues>(() => createPortfolioSheetFormValues(asset));
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const formatLabel = asset.contentType.split('/').pop()?.toUpperCase() ?? asset.contentType;

  if (asset.id !== formAssetId) {
    setFormAssetId(asset.id);
    setValues(createPortfolioSheetFormValues(asset));
    setPreviewUrl(null);
    setSelectedFileName('');
    setErrorMessage('');
  }

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

  function clearImageSelection(): void {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setSelectedFileName('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!file) {
      setPreviewUrl(null);
      setSelectedFileName('');
      return;
    }

    setSelectedFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setErrorMessage('');

    const formData = new FormData(event.currentTarget);
    formData.set('assetId', asset.id);

    startTransition(async () => {
      try {
        const updated = await updatePortfolioAsset(formData);
        const nextAsset = serializeAdminPortfolioAsset(updated);
        onUpdated(nextAsset);
        setValues(createPortfolioSheetFormValues(nextAsset));
        clearImageSelection();
        showSuccessToast(copy.portfolio.updateSuccess);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : copy.portfolio.updateError);
      }
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
        aria-labelledby="admin-portfolio-sheet-title"
      >
        <div className="admin-drawer-header">
          <div>
            <h2 id="admin-portfolio-sheet-title">{values.title || asset.title}</h2>
            <p>{copy.portfolio.sheetDescription}</p>
          </div>
          <button type="button" className="admin-drawer-close" aria-label={copy.common.closePanel} onClick={onClose}>
            x
          </button>
        </div>

        <form
          id="admin-portfolio-sheet-form"
          className="admin-form admin-portfolio-sheet-form"
          onSubmit={handleSubmit}
        >
          <PortfolioAssetSheetMedia
            currentImageUrl={asset.url}
            previewUrl={previewUrl}
            alt={values.alt || asset.alt}
            selectedFileName={selectedFileName}
            isPending={isPending}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
            onClearSelection={clearImageSelection}
            deleteControl={
              previewUrl ? (
                <button
                  type="button"
                  className="admin-portfolio-sheet-delete-x"
                  aria-label={copy.portfolio.clearImageSelection}
                  disabled={isPending}
                  onClick={clearImageSelection}
                >
                  <span aria-hidden>×</span>
                </button>
              ) : (
                <PortfolioDeleteIconButton
                  action={deleteAction}
                  assetId={asset.id}
                  assetTitle={values.title || asset.title}
                  confirmMessage={formatAdminMessage(copy.portfolio.deleteImageConfirm, {
                    title: values.title || asset.title,
                  })}
                  disabled={isPending}
                  onDeleted={onClose}
                />
              )
            }
          />

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
                onChange={(event) => setValues((current) => ({ ...current, assetType: event.target.value }))}
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
                onChange={(event) => setValues((current) => ({ ...current, status: event.target.value }))}
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
                required
                rows={3}
                value={values.alt}
                onChange={(event) => setValues((current) => ({ ...current, alt: event.target.value }))}
                disabled={isPending}
              />
            </label>
          </div>

          <dl className="admin-portfolio-sheet-meta admin-portfolio-sheet-meta--readonly">
            <div>
              <dt>{copy.portfolio.metaSlot}</dt>
              <dd>{getPortfolioSlotId(index)}</dd>
            </div>
            <div>
              <dt>{copy.portfolio.metaSize}</dt>
              <dd>{formatPortfolioFileSize(asset.sizeBytes)}</dd>
            </div>
            <div>
              <dt>{copy.portfolio.metaFormat}</dt>
              <dd>{formatLabel}</dd>
            </div>
            <div>
              <dt>{copy.portfolio.metaCreated}</dt>
              <dd>{formatPortfolioCreatedAt(asset.createdAt, locale)}</dd>
            </div>
          </dl>

          {errorMessage ? <p className="admin-card-error">{errorMessage}</p> : null}
        </form>

        <div className="admin-portfolio-sheet-actions">
          <PortfolioDeleteButton
            action={deleteAction}
            assetId={asset.id}
            assetTitle={values.title || asset.title}
            confirmMessage={formatAdminMessage(copy.portfolio.deleteImageConfirm, {
              title: values.title || asset.title,
            })}
            onDeleted={onClose}
          />
          <button
            type="submit"
            form="admin-portfolio-sheet-form"
            className="admin-primary-button"
            disabled={isPending}
          >
            {isPending ? copy.common.saving : copy.common.save}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
