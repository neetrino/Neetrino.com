'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, type FormEvent } from 'react';
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
  ProductUrlBox,
  type ProductFormValues,
} from './product-form-fields';
import { formatAdminMessage, useAdminI18n } from './admin-i18n-provider';

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

  async function handleCreate(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const product = await createPaymentProduct(new FormData(event.currentTarget));
      setProducts((current) => [product, ...current]);
      setCreateValues(EMPTY_PRODUCT_FORM);
      setIsCreateOpen(false);
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
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : copy.products.deactivateError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-products">
      <div className="admin-products-toolbar">
        <button type="button" className="admin-primary-button" onClick={() => setIsCreateOpen(true)}>
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
            <article key={product.id} className="admin-card admin-product-card">
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
                <button
                  type="button"
                  className="admin-icon-button"
                  aria-label={formatAdminMessage(copy.products.editAria, { name: product.name })}
                  onClick={() => openEdit(product)}
                >
                  <span className="admin-icon admin-icon--edit" aria-hidden />
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="admin-empty">{copy.products.empty}</div>
        )}
      </section>
      {selectedProduct ? (
        <div className="admin-drawer-layer" role="presentation">
          <button type="button" className="admin-drawer-backdrop" onClick={() => setSelectedProduct(null)} />
          <section className="admin-drawer admin-product-drawer" aria-label={`Edit ${selectedProduct.name}`}>
            <div className="admin-product-detail-header">
              <span className="admin-card-icon" aria-hidden>
                P
              </span>
              <div>
                <h2>{selectedProduct.name}</h2>
                <p>{AMD_FORMATTER.format(selectedProduct.priceAmd)} AMD</p>
              </div>
              <span className="admin-status admin-status--published">{selectedProduct.status}</span>
              <button type="button" className="admin-drawer-close" onClick={() => setSelectedProduct(null)}>
                x
              </button>
            </div>
            {createdProductId === selectedProduct.id ? (
              <ProductUrlBox label={copy.products.createdUrlLabel} url={selectedProductUrl} />
            ) : null}
            <form onSubmit={handleUpdate} className="admin-form admin-product-edit-form">
              <input type="hidden" name="productId" value={selectedProduct.id} />
              <ProductFormFields values={editValues} isEditing isSubmitting={isSubmitting} onChange={setEditValues} />
              <ProductUrlBox label={copy.products.publicUrlLabel} url={selectedProductUrl} />
              {errorMessage ? <p className="admin-card-error">{errorMessage}</p> : null}
              <div className="admin-form-actions">
                <button type="submit" className="admin-primary-button" disabled={isSubmitting}>
                  {copy.common.save}
                </button>
              </div>
            </form>
            {selectedProduct.status === 'ACTIVE' ? (
              <button type="button" className="admin-product-deactivate" disabled={isSubmitting} onClick={handleDeactivate}>
                {copy.products.deactivate}
              </button>
            ) : null}
          </section>
        </div>
      ) : null}
    </div>
  );
}
