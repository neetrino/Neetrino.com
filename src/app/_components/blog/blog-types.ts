export const BLOG_CATEGORY_IDS = [
  'all',
  'insights',
  'product',
  'engineering',
  'design',
  'company',
] as const;

export type BlogCategoryId = (typeof BLOG_CATEGORY_IDS)[number];

export const BLOG_CONTENT_TYPE_IDS = ['all', 'article', 'guide', 'news'] as const;

export type BlogContentTypeId = (typeof BLOG_CONTENT_TYPE_IDS)[number];

export const BLOG_SORT_IDS = ['newest', 'oldest', 'title'] as const;

export type BlogSortId = (typeof BLOG_SORT_IDS)[number];

/** Taxonomy ids stored on list items (excludes the "all" filter sentinel). */
export type BlogArticleCategoryId = Exclude<BlogCategoryId, 'all'>;
export type BlogArticleContentTypeId = Exclude<BlogContentTypeId, 'all'>;

export type BlogArticleTranslation = {
  title: string;
  slug: string;
  excerpt: string;
  imageAlt: string | null;
  content?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type BlogArticleListItem = {
  id: string;
  coverImageUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  categoryId: BlogArticleCategoryId;
  contentTypeId: BlogArticleContentTypeId;
  translations: Partial<Record<string, BlogArticleTranslation>>;
};

export const BLOG_PAGE_SIZE = 6;

export const DEFAULT_BLOG_CATEGORY: BlogArticleCategoryId = 'insights';
export const DEFAULT_BLOG_CONTENT_TYPE: BlogArticleContentTypeId = 'article';
