import type { Metadata } from 'next';
import { PrivacyPage } from '../_components/privacy-page';
import { privacyMessages } from '../_components/privacy-messages';

export const metadata: Metadata = {
  title: privacyMessages.meta.pageTitle,
  description: privacyMessages.meta.description,
};

export default function PrivacyPolicyRoute(): React.JSX.Element {
  return <PrivacyPage />;
}
