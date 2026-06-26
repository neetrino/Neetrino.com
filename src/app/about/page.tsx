import type { Metadata } from 'next';
import { AboutPage } from '../_components/about-page';
import { aboutMessages } from '../_components/about-messages';

export const metadata: Metadata = {
  title: aboutMessages.meta.pageTitle,
  description: aboutMessages.meta.description,
};

export const revalidate = 300;

export default function About(): React.JSX.Element {
  return <AboutPage />;
}
