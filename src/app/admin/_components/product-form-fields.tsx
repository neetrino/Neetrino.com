'use client';

import { useState } from 'react';
import type { AdminProduct, ProductStatus, ProductType } from '../_actions/product-actions';
import { useAdminI18n } from './admin-i18n-provider';

export type ProductFormValues = {
  name: string;
  priceAmd: string;
  description: string;
  type: ProductType;
  status: ProductStatus;
};

export const EMPTY_PRODUCT_FORM: ProductFormValues = {
  name: '',
  priceAmd: '',
  description: '',
  type: 'ONE_TIME',
  status: 'ACTIVE',
};

export function createProductFormValues(product?: AdminProduct): ProductFormValues {
  if (!product) {
    return EMPTY_PRODUCT_FORM;
  }

  return {
    name: product.name,
    priceAmd: String(product.priceAmd),
    description: product.description,
    type: product.type,
    status: product.status,
  };
}

export function getProductUrl(appUrl: string, product: AdminProduct): string {
  return `${appUrl.replace(/\/$/, '')}/p/${product.secretSlug}`;
}

export function ProductUrlBox({ label, url }: { label: string; url: string }): React.JSX.Element {
  const { copy } = useAdminI18n();
  const [isCopied, setIsCopied] = useState(false);

  async function handleCopy(): Promise<void> {
    await navigator.clipboard.writeText(url);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 1600);
  }

  return (
    <div className="admin-product-url-box">
      <strong>{label}</strong>
      <code>{url}</code>
      <button type="button" className="admin-secondary-button" onClick={handleCopy}>
        {isCopied ? copy.products.copied : copy.products.copyUrl}
      </button>
    </div>
  );
}

export function ProductFormFields({
  values,
  isEditing,
  isSubmitting,
  onChange,
}: {
  values: ProductFormValues;
  isEditing: boolean;
  isSubmitting: boolean;
  onChange: (values: ProductFormValues) => void;
}): React.JSX.Element {
  const { copy } = useAdminI18n();
  const productTypeLabels: Record<ProductType, string> = {
    ONE_TIME: copy.products.form.oneTime,
    PERMANENT: copy.products.form.permanent,
  };
  const productStatusLabels: Record<ProductStatus, string> = {
    ACTIVE: copy.products.form.active,
    INACTIVE: copy.products.form.inactive,
  };

  return (
    <>
      <label className="admin-field">
        <span>{copy.products.form.name}</span>
        <input
          name="name"
          value={values.name}
          disabled={isSubmitting}
          onChange={(event) => onChange({ ...values, name: event.target.value })}
        />
      </label>
      <label className="admin-field">
        <span>{copy.products.form.price}</span>
        <input
          name="priceAmd"
          inputMode="numeric"
          value={values.priceAmd}
          disabled={isSubmitting}
          onChange={(event) => onChange({ ...values, priceAmd: event.target.value })}
        />
      </label>
      <label className="admin-field">
        <span>{copy.products.form.description}</span>
        <textarea
          name="description"
          value={values.description}
          disabled={isSubmitting}
          onChange={(event) => onChange({ ...values, description: event.target.value })}
        />
      </label>
      <label className="admin-field">
        <span>{copy.products.form.type}</span>
        <select
          name="type"
          value={values.type}
          disabled={isSubmitting}
          onChange={(event) => onChange({ ...values, type: event.target.value as ProductType })}
        >
          {Object.entries(productTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      {isEditing ? (
        <label className="admin-field">
          <span>{copy.products.form.status}</span>
          <select
            name="status"
            value={values.status}
            disabled={isSubmitting}
            onChange={(event) => onChange({ ...values, status: event.target.value as ProductStatus })}
          >
            {Object.entries(productStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </>
  );
}
