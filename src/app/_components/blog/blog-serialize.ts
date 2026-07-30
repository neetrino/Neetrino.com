import type { PublicBlogPostBundle } from '@/lib/public-blog-posts';
import { resolveBlogDemoTaxonomy } from './blog-demo-taxonomy';
import {
  DEFAULT_BLOG_CATEGORY,
  DEFAULT_BLOG_CONTENT_TYPE,
  type BlogArticleListItem,
  type BlogArticleTranslation,
} from './blog-types';

function mapTranslations(
  translations: PublicBlogPostBundle['translations'],
  includeContent: boolean,
): BlogArticleListItem['translations'] {
  return Object.fromEntries(
    Object.entries(translations).map(([locale, fields]) => {
      const translation: BlogArticleTranslation = {
        title: fields.title,
        slug: fields.slug,
        excerpt: fields.excerpt,
        imageAlt: fields.imageAlt,
      };

      if (includeContent) {
        translation.content = fields.content;
        translation.seoTitle = fields.seoTitle;
        translation.seoDescription = fields.seoDescription;
      }

      return [locale, translation];
    }),
  );
}

function resolveTaxonomy(bundle: PublicBlogPostBundle): Pick<
  BlogArticleListItem,
  'categoryId' | 'contentTypeId'
> {
  const englishSlug = bundle.translations.en?.slug;
  const demo = resolveBlogDemoTaxonomy(englishSlug);

  return {
    categoryId: demo?.categoryId ?? DEFAULT_BLOG_CATEGORY,
    contentTypeId: demo?.contentTypeId ?? DEFAULT_BLOG_CONTENT_TYPE,
  };
}

function serializeBundle(
  bundle: PublicBlogPostBundle,
  includeContent: boolean,
): BlogArticleListItem {
  const taxonomy = resolveTaxonomy(bundle);

  return {
    id: bundle.id,
    coverImageUrl: bundle.coverImageUrl,
    publishedAt: bundle.publishedAt?.toISOString() ?? null,
    createdAt: bundle.createdAt.toISOString(),
    categoryId: taxonomy.categoryId,
    contentTypeId: taxonomy.contentTypeId,
    translations: mapTranslations(bundle.translations, includeContent),
  };
}

/** Serializes published blog bundles for the public listing client. */
export function serializeBlogListItems(bundles: PublicBlogPostBundle[]): BlogArticleListItem[] {
  return bundles.map((bundle) => serializeBundle(bundle, false));
}

/** Serializes a single published blog bundle for the article page client. */
export function serializeBlogArticleItem(bundle: PublicBlogPostBundle): BlogArticleListItem {
  return serializeBundle(bundle, true);
}
