import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogPostPage } from '../../_components/blog-post-page';
import { blogMessages } from '../../_components/blog-messages';
import { resolveBlogTranslation } from '@/lib/blog-translation';
import { getPublishedBlogPostBundleBySlug } from '@/lib/public-blog-posts';

type BlogPostRouteProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export async function generateMetadata({ params }: BlogPostRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBundleBySlug(slug);

  if (!post) {
    return {
      title: blogMessages.meta.pageTitle,
    };
  }

  const translation = resolveBlogTranslation(post.translations, 'en');

  if (!translation) {
    return {
      title: blogMessages.meta.pageTitle,
    };
  }

  return {
    title: translation.seoTitle ?? translation.title,
    description: translation.seoDescription ?? translation.excerpt,
  };
}

export default async function BlogPostRoute({ params }: BlogPostRouteProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBundleBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostPage post={post} />;
}
