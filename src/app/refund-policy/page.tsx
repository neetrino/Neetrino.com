import type { Metadata } from 'next';
import { RefundPage } from '../_components/refund-page';
import { refundMessages } from '../_components/refund-messages';

export const metadata: Metadata = {
  title: refundMessages.meta.pageTitle,
  description: refundMessages.meta.description,
};

export default function RefundPolicyRoute(): React.JSX.Element {
  return <RefundPage />;
}
