import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NeetrinoPageShell } from '@/app/_components/neetrino-page-shell';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import styles from './payment-product.module.css';

type PaymentProductRouteProps = {
  params: Promise<{ secret: string }>;
  searchParams?: Promise<{ payment?: string | string[] }>;
};

const AMD_FORMATTER = new Intl.NumberFormat('en-US');

async function getActiveProduct(secretSlug: string) {
  try {
    return await prisma.paymentProduct.findFirst({
      where: {
        secretSlug,
        status: 'ACTIVE',
      },
    });
  } catch (error) {
    logger.error('Failed to load public payment product.', { error, secretSlug });
    return null;
  }
}

export async function generateMetadata({ params }: PaymentProductRouteProps): Promise<Metadata> {
  const { secret } = await params;
  const product = await getActiveProduct(secret);

  if (!product) {
    return {
      title: 'Payment | Neetrino',
    };
  }

  return {
    title: `${product.name} | Neetrino Payment`,
    description: product.description ?? `Pay ${AMD_FORMATTER.format(product.priceAmd)} AMD to Neetrino.`,
  };
}

function readPaymentMessage(payment: string | string[] | undefined): { text: string; isSuccess: boolean } | null {
  const value = Array.isArray(payment) ? payment[0] : payment;

  if (value === 'paid') {
    return { text: 'Payment completed successfully.', isSuccess: true };
  }

  if (value === 'failed') {
    return { text: 'Payment was not completed. Please try again.', isSuccess: false };
  }

  return null;
}

export default async function PaymentProductRoute({
  params,
  searchParams,
}: PaymentProductRouteProps): Promise<React.JSX.Element> {
  const { secret } = await params;
  const resolvedSearchParams = await searchParams;
  const product = await getActiveProduct(secret);

  if (!product) {
    notFound();
  }

  const paymentMessage = readPaymentMessage(resolvedSearchParams?.payment);

  return (
    <NeetrinoPageShell mainId="payment-product" srOnlyTitle={`${product.name} payment`}>
      <section className={styles.paymentSection} aria-label="Payment product">
        <article className={styles.paymentCard}>
          <h2 className={styles.productName}>{product.name}</h2>
          {product.description ? <p className={styles.description}>{product.description}</p> : null}
          <p className={styles.price}>{AMD_FORMATTER.format(product.priceAmd)} AMD</p>
          {paymentMessage ? (
            <p className={paymentMessage.isSuccess ? styles.paymentStatusSuccess : styles.paymentStatusError}>
              {paymentMessage.text}
            </p>
          ) : null}
          <form action="/api/v1/payments/arca/init" method="post">
            <input type="hidden" name="productId" value={product.id} />
            <button className={styles.payButton} type="submit">
              Pay with card
            </button>
          </form>
          <p className={styles.paymentNote}>You will be redirected to the secure ARCA payment page.</p>
        </article>
      </section>
    </NeetrinoPageShell>
  );
}
