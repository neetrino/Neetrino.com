import type { Metadata } from 'next';
import { ServicesPage } from '../_components/services-page';
import { servicesMessages } from '../_components/services-messages';

export const metadata: Metadata = {
  title: servicesMessages.meta.pageTitle,
  description: servicesMessages.meta.description,
};

export default function Services() {
  return <ServicesPage />;
}
