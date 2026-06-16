import type { Metadata } from 'next';
import { ServicesPage } from '../_components/services-page';

export const metadata: Metadata = {
  title: 'Services | Neetrino',
  description:
    'Neetrino services — SaaS, CRM, websites, mobile apps, AI products and ERP systems built end to end.',
};

export default function Services() {
  return <ServicesPage />;
}
