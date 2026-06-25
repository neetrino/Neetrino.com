import type { Metadata } from 'next';
import { ContactPage } from '../_components/contact-page';
import { contactMessages } from '../_components/contact-messages';

export const metadata: Metadata = {
  title: contactMessages.meta.pageTitle,
  description: contactMessages.meta.description,
};

export const revalidate = 300;

export default function Contact(): React.JSX.Element {
  return <ContactPage />;
}
