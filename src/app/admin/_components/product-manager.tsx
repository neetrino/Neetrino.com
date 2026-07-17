'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, type FormEvent, type KeyboardEvent } from 'react';
import {
  createPaymentProduct,
  deactivatePaymentProduct,
  updatePaymentProduct,
  type AdminProduct,
} from '../_actions/product-actions';
import {
  createProductFormValues,
  EMPTY_PRODUCT_FORM,
  getProductUrl,
  ProductFormFields,
  type ProductFormValues,
} from './product-form-fields';
import { formatAdminMessage, useAdminI18n } from './admin-i18n-provider';
import { useAdminToast } from './admin-toast';
import { ProductSheet } from './product-sheet';

const AMD_FORMATTER = new Intl.NumberFormat('en-US');

export function ProductManager({
  appUrl,
  initialProducts,
}: {
  appUrl: string;
  initialProducts: AdminProduct[];
}): React.JSX.Element {
  const router = useRouter();
  const { copy } = useAdminI18n();
  const { showSuccessToast } = useAdminToast();
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [createValues, setCreateValues] = useState<ProductFormValues>(EMPTY_PRODUCT_FORM);
  const [editValues, setEditValues] = useState<ProductFormValues>(EMPTY_PRODUCT_FORM);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedProductUrl = useMemo(() => {
    return selectedProduct ? getProductUrl(appUrl, selectedProduct) : '';
  }, [appUrl, selectedProduct]);

  function openEdit(product: AdminProduct, wasCreated = false): void {
    setSelectedProduct(product);
    setEditValues(createProductFormValues(product));
    setCreatedProductId(wasCreated ? product.id : null);
    setErrorMessage('');
  }

  function closeEdit(): void {
    setSelectedProduct(null);
    setCreatedProductId(null);
    setErrorMessage('');
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const product = await createPaymentProduct(new FormData(event.currentTarget));
      setProducts((current) => [product, ...current]);
      setCreateValues(EMPTY_PRODUCT_FORM);
      setIsCreateOpen(false);
      showSuccessToast(copy.products.createSuccess);
      openEdit(product, true);
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : copy.products.createError);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!selectedProduct) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const formData = new FormData(event.currentTarget);
      formData.set('productId', selectedProduct.id);
      const product = await updatePaymentProduct(formData);
      setProducts((current) => current.map((item) => (item.id === product.id ? product : item)));
      openEdit(product);
      showSuccessToast(copy.products.updateSuccess);
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : copy.products.updateError);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeactivate(): Promise<void> {
    if (!selectedProduct) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.set('productId', selectedProduct.id);
      const product = await deactivatePaymentProduct(formData);
      setProducts((current) => current.map((item) => (item.id === product.id ? product : item)));
      openEdit(product);
      showSuccessToast(copy.products.deactivateSuccess);
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : copy.products.deactivateError);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCardKeyDown(product: AdminProduct, event: KeyboardEvent<HTMLElement>): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openEdit(product);
    }
  }

  return (
    <div className="admin-products">
      <div className="admin-products-toolbar">
        <button
          type="button"
          className="admin-primary-button"
          onClick={() => {
            setErrorMessage('');
            setIsCreateOpen(true);
          }}
        >
          {copy.products.newProduct}
        </button>
      </div>
      {isCreateOpen ? (
        <div className="admin-product-modal-layer" role="presentation">
          <button type="button" className="admin-product-modal-backdrop" onClick={() => setIsCreateOpen(false)} />
          <section className="admin-product-modal" aria-label={copy.products.newProduct}>
            <div className="admin-product-modal-header">
              <div>
                <h2>{copy.products.newProduct}</h2>
                <p>{copy.products.newProductDescription}</p>
              </div>
              <button type="button" className="admin-drawer-close" onClick={() => setIsCreateOpen(false)}>
                x
              </button>
            </div>
            <form onSubmit={handleCreate} className="admin-form">
              <ProductFormFields
                values={createValues}
                isEditing={false}
                isSubmitting={isSubmitting}
                onChange={setCreateValues}
              />
              {errorMessage ? <p className="admin-card-error">{errorMessage}</p> : null}
              <div className="admin-product-modal-actions">
                <button type="submit" className="admin-primary-button" disabled={isSubmitting}>
                  {copy.common.save}
                </button>
                <button type="button" className="admin-secondary-button" onClick={() => setIsCreateOpen(false)}>
                  {copy.common.cancel}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
      <section className="admin-list" aria-label={copy.products.listAria}>
        {products.length > 0 ? (
          products.map((product) => (
            <article
              key={product.id}
              className="admin-card admin-product-card"
              role="button"
              tabIndex={0}
              aria-label={formatAdminMessage(copy.products.openAria, { name: product.name })}
              onClick={() => openEdit(product)}
              onKeyDown={(event) => handleCardKeyDown(product, event)}
            >
              <span className="admin-card-icon" aria-hidden>
                P
              </span>
              <div>
                <h2>{product.name}</h2>
                <p>{AMD_FORMATTER.format(product.priceAmd)} AMD</p>
                <p>{product.description || copy.products.noDescription}</p>
              </div>
              <div className="admin-card-meta">
                <span className={product.status === 'ACTIVE' ? 'admin-status admin-status--published' : 'admin-status'}>
                  {product.status}
                </span>
                <span className="admin-icon-button" aria-hidden>
                  <span className="admin-icon admin-icon--edit" />
                </span>
              </div>
            </article>
          ))
        ) : (
          <div className="admin-empty">{copy.products.empty}</div>
        )}
      </section>
      {selectedProduct ? (
        <ProductSheet
          product={selectedProduct}
          productUrl={selectedProductUrl}
          values={editValues}
          showCreatedUrl={createdProductId === selectedProduct.id}
          errorMessage={errorMessage}
          isSubmitting={isSubmitting}
          onValuesChange={setEditValues}
          onClose={closeEdit}
          onSubmit={handleUpdate}
          onDeactivate={handleDeactivate}
        />
      ) : null}
    </div>
  );
}
