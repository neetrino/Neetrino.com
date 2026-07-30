import type { Metadata } from 'next';
import { BlogPage } from '../_components/blog-page';
import { serializeBlogListItems } from '../_components/blog/blog-serialize';
import { blogMessages } from '../_components/blog-messages';
import { getPublishedBlogPostBundles } from '@/lib/public-blog-posts';

export const metadata: Metadata = {
  title: blogMessages.meta.pageTitle,
  description: blogMessages.meta.description,
};

export const revalidate = 300;

export default async function Blog(): Promise<React.JSX.Element> {
  const bundles = await getPublishedBlogPostBundles();
  const articles = serializeBlogListItems(bundles);

  return <BlogPage articles={articles} />;
}
