import type { Metadata } from 'next';
import { AboutPage } from '../_components/about-page';

export const metadata: Metadata = {
  title: 'About | Neetrino',
  description:
    'About Neetrino — a digital product company building websites, mobile apps, CRM systems, SaaS platforms, and AI integrations.',
};

export default function About() {
  return <AboutPage />;
}
