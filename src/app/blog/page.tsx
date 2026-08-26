import type { Metadata } from 'next';
import { BlogPage } from '../_components/blog-page';
import { serializeBlogListItems } from '../_components/blog/blog-serialize';
import { BLOG_PAGE_SIZE, type BlogArticleListItem } from '../_components/blog/blog-types';
import { blogMessages } from '../_components/blog-messages';
import { getPublishedBlogPostPage } from '@/lib/public-blog-posts';

export const metadata: Metadata = {
  title: blogMessages.meta.pageTitle,
  description: blogMessages.meta.description,
};

export const revalidate = 300;

export default async function Blog(): Promise<React.JSX.Element> {
  let articles: BlogArticleListItem[] = [];
  let total = 0;

  try {
    const page = await getPublishedBlogPostPage(0, BLOG_PAGE_SIZE);
    articles = serializeBlogListItems(page.items);
    total = page.total;
  } catch {
    articles = [];
    total = 0;
  }

  return <BlogPage articles={articles} total={total} />;
}
