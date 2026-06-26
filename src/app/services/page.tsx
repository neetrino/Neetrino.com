import type { Metadata } from 'next';
import { ServicesPage } from '../_components/services-page';
import { servicesMessages } from '../_components/services-messages';

export const metadata: Metadata = {
  title: servicesMessages.meta.pageTitle,
  description: servicesMessages.meta.description,
};

export const revalidate = 300;

export default function Services(): React.JSX.Element {
  return <ServicesPage />;
}
