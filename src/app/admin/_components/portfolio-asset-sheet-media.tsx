'use client';

import { CdnImage as Image } from '@/lib/cdn-image';
import { isRemoteImageUrl } from '@/lib/image-url';
import { useAdminI18n } from './admin-i18n-provider';

type PortfolioAssetSheetMediaProps = {
  currentImageUrl: string;
  previewUrl: string | null;
  alt: string;
  selectedFileName: string;
  isPending: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSelection: () => void;
  deleteControl?: React.ReactNode;
};

export function PortfolioAssetSheetMedia({
  currentImageUrl,
  previewUrl,
  alt,
  selectedFileName,
  isPending,
  fileInputRef,
  onFileChange,
  onClearSelection,
  deleteControl,
}: PortfolioAssetSheetMediaProps): React.JSX.Element {
  const { copy } = useAdminI18n();

  return (
    <>
      <div className="admin-portfolio-sheet-preview">
        {previewUrl ? (
          // Local blob preview before save
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="" className="admin-portfolio-sheet-image" />
        ) : (
          <Image
            src={currentImageUrl}
            alt={alt}
            width={1200}
            height={800}
            sizes="(max-width: 760px) 100vw, 640px"
            unoptimized={isRemoteImageUrl(currentImageUrl)}
            className="admin-portfolio-sheet-image"
          />
        )}
        {deleteControl}
      </div>

      <div className="admin-portfolio-sheet-image-actions">
        <input
          ref={fileInputRef}
          name="image"
          type="file"
          accept="image/avif,image/jpeg,image/png,image/webp"
          className="admin-portfolio-sheet-file-input"
          disabled={isPending}
          onChange={onFileChange}
        />
        <button
          type="button"
          className="admin-secondary-button"
          disabled={isPending}
          onClick={() => fileInputRef.current?.click()}
        >
          {copy.portfolio.changeImage}
        </button>
        {selectedFileName ? (
          <>
            <p className="admin-portfolio-upload-filename">{selectedFileName}</p>
            <button
              type="button"
              className="admin-portfolio-sheet-clear-image"
              disabled={isPending}
              onClick={onClearSelection}
            >
              {copy.portfolio.clearImageSelection}
            </button>
          </>
        ) : null}
      </div>
    </>
  );
}
