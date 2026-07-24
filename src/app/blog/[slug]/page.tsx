import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { blogMessages } from '../../_components/blog-messages';

export const metadata: Metadata = {
  title: blogMessages.meta.pageTitle,
  description: blogMessages.meta.description,
};

/** Public blog posts are paused while the listing shows Under construction. */
export default function BlogPostRoute(): never {
  redirect('/blog');
}
