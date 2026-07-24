import type { Metadata } from 'next';
import { BlogPage } from '../_components/blog-page';
import { blogMessages } from '../_components/blog-messages';

export const metadata: Metadata = {
  title: blogMessages.meta.pageTitle,
  description: blogMessages.meta.description,
};

export const revalidate = 300;

export default function Blog(): React.JSX.Element {
  return <BlogPage />;
}
