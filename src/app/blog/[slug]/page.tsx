import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogArticlePage } from '../../_components/blog-article-page';
import { pickRelatedArticles } from '../../_components/blog/blog-resolve';
import { serializeBlogArticleItem, serializeBlogListItems } from '../../_components/blog/blog-serialize';
import { blogMessages } from '../../_components/blog-messages';
import {
  getPublishedBlogPostBundleBySlug,
  getPublishedBlogPostBundles,
} from '@/lib/public-blog-posts';

type BlogPostRouteProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export async function generateMetadata({ params }: BlogPostRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getPublishedBlogPostBundleBySlug(slug);

  if (!bundle) {
    return {
      title: blogMessages.meta.pageTitle,
      description: blogMessages.meta.description,
    };
  }

  const translation =
    bundle.translations.en ?? Object.values(bundle.translations)[0] ?? null;

  return {
    title: translation?.seoTitle || translation?.title || blogMessages.meta.pageTitle,
    description: translation?.seoDescription || translation?.excerpt || blogMessages.meta.description,
  };
}

export default async function BlogPostRoute({
  params,
}: BlogPostRouteProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const [bundle, bundles] = await Promise.all([
    getPublishedBlogPostBundleBySlug(slug),
    getPublishedBlogPostBundles(),
  ]);

  if (!bundle) {
    notFound();
  }

  const article = serializeBlogArticleItem(bundle);

  return (
    <BlogArticlePage
      article={article}
      relatedArticles={pickRelatedArticles(
        serializeBlogListItems(bundles),
        article.id,
        article.categoryId,
      )}
    />
  );
}
