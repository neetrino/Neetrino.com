import type { Metadata } from 'next';
import { ContactPage } from '../_components/contact-page';

export const metadata: Metadata = {
  title: 'Contact us',
  description:
    'Contact Neetrino by email or phone, visit the Yerevan office, or send a project inquiry.',
};

export default function Contact(): React.JSX.Element {
  return <ContactPage />;
}
