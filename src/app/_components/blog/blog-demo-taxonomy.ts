/**
 * Demo taxonomy for seeded blog posts (DB has no category/contentType columns yet).
 * Keys are English slugs from scripts/seed-blog-posts.mjs.
 */
import type { BlogArticleCategoryId, BlogArticleContentTypeId } from './blog-types';

export type BlogDemoTaxonomy = {
  categoryId: BlogArticleCategoryId;
  contentTypeId: BlogArticleContentTypeId;
};

export const BLOG_DEMO_TAXONOMY: Record<string, BlogDemoTaxonomy> = {
  'demo-shipping-smaller-releases': { categoryId: 'product', contentTypeId: 'article' },
  'demo-design-systems-that-scale': { categoryId: 'design', contentTypeId: 'guide' },
  'demo-api-error-contracts': { categoryId: 'engineering', contentTypeId: 'article' },
  'demo-discovery-before-build': { categoryId: 'insights', contentTypeId: 'guide' },
  'demo-neetrino-studio-notes': { categoryId: 'company', contentTypeId: 'news' },
  'demo-mobile-perf-checklist': { categoryId: 'engineering', contentTypeId: 'guide' },
  'demo-onboarding-that-converts': { categoryId: 'product', contentTypeId: 'article' },
  'demo-accessible-forms': { categoryId: 'design', contentTypeId: 'article' },
  'demo-postgres-indexing-basics': { categoryId: 'engineering', contentTypeId: 'guide' },
  'demo-roadmap-rituals': { categoryId: 'product', contentTypeId: 'article' },
  'demo-brand-motion-principles': { categoryId: 'design', contentTypeId: 'news' },
  'demo-secure-session-cookies': { categoryId: 'engineering', contentTypeId: 'article' },
  'demo-hiring-builders': { categoryId: 'company', contentTypeId: 'news' },
  'demo-content-ops-for-saas': { categoryId: 'insights', contentTypeId: 'guide' },
  'demo-launch-week-playbook': { categoryId: 'insights', contentTypeId: 'article' },
};

export function resolveBlogDemoTaxonomy(englishSlug: string | undefined): BlogDemoTaxonomy | null {
  if (!englishSlug) {
    return null;
  }

  return BLOG_DEMO_TAXONOMY[englishSlug] ?? null;
}
