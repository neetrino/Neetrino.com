'use client';

import { useState, type FormEvent } from 'react';
import { BLOG_LOCALES, BLOG_LOCALE_LABELS, type BlogLocale } from '@/lib/blog-locales';
import { createBlogPost, updateBlogPost } from '../_actions/blog-actions';
import type { AdminBlogPost } from './admin-blog-post';
import { AdminSubmitButton } from './admin-submit-button';

type LocaleFields = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  imageAlt: string;
  seoTitle: string;
  seoDescription: string;
};

const EMPTY_LOCALE_FIELDS: LocaleFields = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  imageAlt: '',
  seoTitle: '',
  seoDescription: '',
};

function createEmptyLocaleState(): Record<BlogLocale, LocaleFields> {
  return {
    en: { ...EMPTY_LOCALE_FIELDS },
    hy: { ...EMPTY_LOCALE_FIELDS },
    ru: { ...EMPTY_LOCALE_FIELDS },
  };
}

function BlogTranslationPanel({
  locale,
  fields,
  onFieldChange,
}: {
  locale: BlogLocale;
  fields: LocaleFields;
  onFieldChange: (field: keyof LocaleFields, value: string) => void;
}): React.JSX.Element {
  const label = BLOG_LOCALE_LABELS[locale];
  const isEnglish = locale === 'en';

  return (
    <div className="admin-translation-panel" role="tabpanel" aria-label={`${label} translation`}>
      <label className="admin-field">
        <span>Slug</span>
        <input
          value={fields.slug}
          placeholder={isEnglish ? 'online-booking-systems-in-2026' : `${locale}-slug`}
          onChange={(event) => onFieldChange('slug', event.target.value)}
        />
      </label>
      <label className="admin-field">
        <span>Title</span>
        <input
          value={fields.title}
          placeholder={isEnglish ? 'Online Booking Systems in 2026' : `${label} title`}
          onChange={(event) => onFieldChange('title', event.target.value)}
        />
      </label>
      <label className="admin-field">
        <span>Excerpt / short description</span>
        <textarea
          value={fields.excerpt}
          placeholder={isEnglish ? 'Short summary for the admin list.' : `${label} excerpt`}
          onChange={(event) => onFieldChange('excerpt', event.target.value)}
        />
      </label>
      <label className="admin-field">
        <span>Content / full text</span>
        <textarea
          value={fields.content}
          placeholder={isEnglish ? 'Write the first draft here.' : `${label} content`}
          onChange={(event) => onFieldChange('content', event.target.value)}
        />
      </label>
      <label className="admin-field">
        <span>Image alt</span>
        <input
          value={fields.imageAlt}
          placeholder="Descriptive alt text for the cover image"
          onChange={(event) => onFieldChange('imageAlt', event.target.value)}
        />
      </label>
      <label className="admin-field">
        <span>SEO title</span>
        <input
          value={fields.seoTitle}
          placeholder="SEO title for search results"
          onChange={(event) => onFieldChange('seoTitle', event.target.value)}
        />
      </label>
      <label className="admin-field">
        <span>SEO description</span>
        <textarea
          value={fields.seoDescription}
          placeholder="Short SEO description for search engines."
          onChange={(event) => onFieldChange('seoDescription', event.target.value)}
        />
      </label>
    </div>
  );
}

function createLocaleStateFromPost(post?: AdminBlogPost): Record<BlogLocale, LocaleFields> {
  const nextState = createEmptyLocaleState();

  if (!post) {
    return nextState;
  }

  for (const translation of post.translations) {
    nextState[translation.locale] = {
      slug: translation.slug,
      title: translation.title,
      excerpt: translation.excerpt,
      content: translation.content,
      imageAlt: translation.imageAlt,
      seoTitle: translation.seoTitle,
      seoDescription: translation.seoDescription,
    };
  }

  return nextState;
}

/** Admin drawer form for creating or editing multilingual blog posts with cover upload. */
export function BlogPostForm({ post }: { post?: AdminBlogPost }): React.JSX.Element {
  const isEditing = Boolean(post);
  const [activeLocale, setActiveLocale] = useState<BlogLocale>('en');
  const [localeFields, setLocaleFields] = useState(() => createLocaleStateFromPost(post));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateLocaleField = (field: keyof LocaleFields, value: string): void => {
    setLocaleFields((current) => ({
      ...current,
      [activeLocale]: {
        ...current[activeLocale],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);

      for (const locale of BLOG_LOCALES) {
        const fields = localeFields[locale];

        formData.set(`${locale}_slug`, fields.slug);
        formData.set(`${locale}_title`, fields.title);
        formData.set(`${locale}_excerpt`, fields.excerpt);
        formData.set(`${locale}_content`, fields.content);
        formData.set(`${locale}_imageAlt`, fields.imageAlt);
        formData.set(`${locale}_seoTitle`, fields.seoTitle);
        formData.set(`${locale}_seoDescription`, fields.seoDescription);
      }

      if (isEditing && post) {
        formData.set('postId', post.id);
        await updateBlogPost(formData);
      } else {
        await createBlogPost(formData);
        setLocaleFields(createEmptyLocaleState());
        setActiveLocale('en');
        event.currentTarget.reset();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="admin-form admin-form--wide">
      {isEditing && post ? <input name="postId" type="hidden" value={post.id} /> : null}
      <section className="admin-form-section">
        <h3 className="admin-form-section-title">Common fields</h3>
        <div className="admin-form-grid admin-form-grid--two">
          <label className="admin-field">
            <span>Status</span>
            <select name="status" defaultValue={post?.status ?? 'DRAFT'} disabled={isSubmitting}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </label>
          <label className="admin-field">
            <span>Published date</span>
            <input
              name="publishedAt"
              type="date"
              defaultValue={post?.publishedAt ?? ''}
              disabled={isSubmitting}
            />
          </label>
        </div>
        <label className="admin-field admin-file-field">
          <span>{isEditing ? 'Replace cover image' : 'Cover image'}</span>
          {post?.coverImageUrl ? <p className="admin-cover-note">Current cover image is saved.</p> : null}
          <input
            name="coverImage"
            type="file"
            accept="image/avif,image/jpeg,image/png,image/webp"
            disabled={isSubmitting}
          />
        </label>
      </section>

      <section className="admin-form-section">
        <h3 className="admin-form-section-title">Translations</h3>
        <div className="admin-tabs" role="tablist" aria-label="Translation language tabs">
          {BLOG_LOCALES.map((locale) => {
            const isActive = locale === activeLocale;

            return (
              <button
                key={locale}
                type="button"
                role="tab"
                id={`blog-translation-tab-${locale}`}
                className={isActive ? 'admin-tab admin-tab-button is-active' : 'admin-tab admin-tab-button'}
                aria-selected={isActive}
                aria-controls="blog-translation-panel"
                disabled={isSubmitting}
                onClick={() => setActiveLocale(locale)}
              >
                {BLOG_LOCALE_LABELS[locale]}
              </button>
            );
          })}
        </div>

        <div id="blog-translation-panel">
          <BlogTranslationPanel
            key={activeLocale}
            locale={activeLocale}
            fields={localeFields[activeLocale]}
            onFieldChange={updateLocaleField}
          />
        </div>
      </section>

      <div className="admin-form-actions">
        <button
          type="submit"
          className="admin-primary-button admin-primary-button--full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update post' : 'Save post'}
        </button>
      </div>
    </form>
  );
}
