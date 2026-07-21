import type { Metadata } from 'next';
import { TermsPage } from '../_components/terms-page';
import { termsMessages } from '../_components/terms-messages';

export const metadata: Metadata = {
  title: termsMessages.meta.pageTitle,
  description: termsMessages.meta.description,
};

export default function TermsAndConditionsRoute(): React.JSX.Element {
  return <TermsPage />;
}
