'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import type { AdminProduct } from '../_actions/product-actions';
import { useAdminI18n } from './admin-i18n-provider';
import {
  ProductFormFields,
  ProductUrlBox,
  type ProductFormValues,
} from './product-form-fields';

const AMD_FORMATTER = new Intl.NumberFormat('en-US');

type ProductSheetProps = {
  product: AdminProduct;
  productUrl: string;
  values: ProductFormValues;
  showCreatedUrl: boolean;
  errorMessage: string;
  isSubmitting: boolean;
  onValuesChange: (values: ProductFormValues) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDeactivate: () => void;
};

export function ProductSheet({
  product,
  productUrl,
  values,
  showCreatedUrl,
  errorMessage,
  isSubmitting,
  onValuesChange,
  onClose,
  onSubmit,
  onDeactivate,
}: ProductSheetProps): React.JSX.Element | null {
  const { copy } = useAdminI18n();
  const [mounted, setMounted] = useState(false);

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
        className="admin-drawer admin-product-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-product-sheet-title"
      >
        <div className="admin-drawer-header">
          <div>
            <h2 id="admin-product-sheet-title">{values.name || product.name}</h2>
            <p>{copy.products.sheetDescription}</p>
          </div>
          <button type="button" className="admin-drawer-close" aria-label={copy.common.closePanel} onClick={onClose}>
            x
          </button>
        </div>

        <div className="admin-product-sheet-summary">
          <span className="admin-card-icon" aria-hidden>
            P
          </span>
          <div>
            <p className="admin-product-sheet-price">{AMD_FORMATTER.format(product.priceAmd)} AMD</p>
            <span className={product.status === 'ACTIVE' ? 'admin-status admin-status--published' : 'admin-status'}>
              {product.status}
            </span>
          </div>
        </div>

        {showCreatedUrl ? <ProductUrlBox label={copy.products.createdUrlLabel} url={productUrl} /> : null}

        <form id="admin-product-sheet-form" onSubmit={onSubmit} className="admin-form admin-product-edit-form">
          <input type="hidden" name="productId" value={product.id} />
          <ProductFormFields values={values} isEditing isSubmitting={isSubmitting} onChange={onValuesChange} />
          <ProductUrlBox label={copy.products.publicUrlLabel} url={productUrl} />
          {errorMessage ? <p className="admin-card-error">{errorMessage}</p> : null}
        </form>

        <div className="admin-product-sheet-actions">
          {product.status === 'ACTIVE' ? (
            <button
              type="button"
              className="admin-product-deactivate"
              disabled={isSubmitting}
              onClick={onDeactivate}
            >
              {copy.products.deactivate}
            </button>
          ) : (
            <span />
          )}
          <button
            type="submit"
            form="admin-product-sheet-form"
            className="admin-primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? copy.common.saving : copy.common.save}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
