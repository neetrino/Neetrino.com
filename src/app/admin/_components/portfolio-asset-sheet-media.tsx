'use client';

import { CdnImage as Image } from '@/lib/cdn-image';
import { isRemoteImageUrl } from '@/lib/image-url';
import { PORTFOLIO_MEDIA_ACCEPT, resolvePortfolioMediaKind } from '@/lib/portfolio-media';
import { useAdminI18n } from './admin-i18n-provider';
import { shouldAutoSelectAnimationType } from './portfolio-upload-validation';

export { PORTFOLIO_MEDIA_ACCEPT };

type AdminPortfolioMediaPreviewProps = {
  src: string;
  alt: string;
  contentType?: string;
  className?: string;
};

export function AdminPortfolioMediaPreview({
  src,
  alt,
  contentType,
  className = 'admin-portfolio-sheet-image',
}: AdminPortfolioMediaPreviewProps): React.JSX.Element {
  const kind = resolvePortfolioMediaKind(contentType);

  if (kind === 'video') {
    return (
      <video
        src={src}
        className={className}
        aria-label={alt}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
    );
  }

  if (src.startsWith('blob:')) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- local blob preview before upload
      <img src={src} alt="" className={className} />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={800}
      sizes="(max-width: 760px) 100vw, 640px"
      unoptimized={isRemoteImageUrl(src)}
      className={className}
    />
  );
}

type PortfolioAssetSheetMediaProps = {
  currentMediaUrl: string;
  currentContentType: string;
  previewUrl: string | null;
  previewContentType: string | null;
  alt: string;
  selectedFileName: string;
  isPending: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSelection: () => void;
  deleteControl?: React.ReactNode;
};

export function PortfolioAssetSheetMedia({
  currentMediaUrl,
  currentContentType,
  previewUrl,
  previewContentType,
  alt,
  selectedFileName,
  isPending,
  fileInputRef,
  onFileChange,
  onClearSelection,
  deleteControl,
}: PortfolioAssetSheetMediaProps): React.JSX.Element {
  const { copy } = useAdminI18n();
  const previewSrc = previewUrl ?? currentMediaUrl;
  const previewType = previewUrl ? previewContentType ?? undefined : currentContentType;

  return (
    <>
      <div className="admin-portfolio-sheet-preview">
        <AdminPortfolioMediaPreview
          src={previewSrc}
          alt={alt}
          contentType={previewType}
        />
        {deleteControl}
      </div>

      <div className="admin-portfolio-sheet-image-actions">
        <input
          ref={fileInputRef}
          name="image"
          type="file"
          accept={PORTFOLIO_MEDIA_ACCEPT}
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
          {copy.portfolio.changeMedia}
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
              {copy.portfolio.clearMediaSelection}
            </button>
          </>
        ) : null}
      </div>
    </>
  );
}

type AdminPortfolioThumbProps = {
  src: string;
  alt: string;
  contentType: string;
};

export function AdminPortfolioThumb({
  src,
  alt,
  contentType,
}: AdminPortfolioThumbProps): React.JSX.Element {
  const kind = resolvePortfolioMediaKind(contentType);

  if (kind === 'video') {
    return (
      <video
        src={src}
        className="admin-portfolio-thumb"
        aria-label={alt}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={72}
      height={72}
      sizes="72px"
      unoptimized={isRemoteImageUrl(src)}
      className="admin-portfolio-thumb"
    />
  );
}

export function isPreviewVideoFile(file: File): boolean {
  return shouldAutoSelectAnimationType(file);
}