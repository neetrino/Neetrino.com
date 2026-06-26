'use client';

import { useState, type FormEvent } from 'react';
import { BLOG_LOCALES, BLOG_LOCALE_LABELS, type BlogLocale } from '@/lib/blog-locales';
import { createBlogPost, updateBlogPost } from '../_actions/blog-actions';
import type { AdminBlogPost } from './admin-blog-post';
import { formatAdminMessage, useAdminI18n } from './admin-i18n-provider';
import type { AdminMessages } from './admin-messages';

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
  copy,
}: {
  locale: BlogLocale;
  fields: LocaleFields;
  onFieldChange: (field: keyof LocaleFields, value: string) => void;
  copy: AdminMessages;
}): React.JSX.Element {
  const label = BLOG_LOCALE_LABELS[locale];
  const isEnglish = locale === 'en';
  const formCopy = copy.blog.form;

  return (
    <div
      className="admin-translation-panel"
      role="tabpanel"
      aria-label={formatAdminMessage(formCopy.translationPanelAria, { label })}
    >
      <label className="admin-field">
        <span>{formCopy.slug}</span>
        <input
          value={fields.slug}
          placeholder={isEnglish ? formCopy.slugPlaceholder : formatAdminMessage(formCopy.localizedSlugPlaceholder, { locale })}
          onChange={(event) => onFieldChange('slug', event.target.value)}
        />
      </label>
      <label className="admin-field">
        <span>{formCopy.title}</span>
        <input
          value={fields.title}
          placeholder={isEnglish ? formCopy.titlePlaceholder : formatAdminMessage(formCopy.localizedTitlePlaceholder, { label })}
          onChange={(event) => onFieldChange('title', event.target.value)}
        />
      </label>
      <label className="admin-field">
        <span>{formCopy.excerpt}</span>
        <textarea
          value={fields.excerpt}
          placeholder={isEnglish ? formCopy.excerptPlaceholder : formatAdminMessage(formCopy.localizedExcerptPlaceholder, { label })}
          onChange={(event) => onFieldChange('excerpt', event.target.value)}
        />
      </label>
      <label className="admin-field">
        <span>{formCopy.content}</span>
        <textarea
          value={fields.content}
          placeholder={isEnglish ? formCopy.contentPlaceholder : formatAdminMessage(formCopy.localizedContentPlaceholder, { label })}
          onChange={(event) => onFieldChange('content', event.target.value)}
        />
      </label>
      <label className="admin-field">
        <span>{formCopy.imageAlt}</span>
        <input
          value={fields.imageAlt}
          placeholder={formCopy.imageAltPlaceholder}
          onChange={(event) => onFieldChange('imageAlt', event.target.value)}
        />
      </label>
      <label className="admin-field">
        <span>{formCopy.seoTitle}</span>
        <input
          value={fields.seoTitle}
          placeholder={formCopy.seoTitlePlaceholder}
          onChange={(event) => onFieldChange('seoTitle', event.target.value)}
        />
      </label>
      <label className="admin-field">
        <span>{formCopy.seoDescription}</span>
        <textarea
          value={fields.seoDescription}
          placeholder={formCopy.seoDescriptionPlaceholder}
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
  const { copy } = useAdminI18n();
  const formCopy = copy.blog.form;

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
        <h3 className="admin-form-section-title">{formCopy.commonFields}</h3>
        <div className="admin-form-grid admin-form-grid--two">
          <label className="admin-field">
            <span>{copy.common.status}</span>
            <select name="status" defaultValue={post?.status ?? 'DRAFT'} disabled={isSubmitting}>
              <option value="DRAFT">{copy.common.draft}</option>
              <option value="PUBLISHED">{copy.common.published}</option>
            </select>
          </label>
          <label className="admin-field">
            <span>{formCopy.publishedDate}</span>
            <input
              name="publishedAt"
              type="date"
              defaultValue={post?.publishedAt ?? ''}
              disabled={isSubmitting}
            />
          </label>
        </div>
        <label className="admin-field admin-file-field">
          <span>{isEditing ? formCopy.replaceCover : formCopy.coverImage}</span>
          {post?.coverImageUrl ? <p className="admin-cover-note">{formCopy.coverSaved}</p> : null}
          <input
            name="coverImage"
            type="file"
            accept="image/avif,image/jpeg,image/png,image/webp"
            disabled={isSubmitting}
          />
        </label>
      </section>

      <section className="admin-form-section">
        <h3 className="admin-form-section-title">{formCopy.translations}</h3>
        <div className="admin-tabs" role="tablist" aria-label={formCopy.translationTabsAria}>
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
            copy={copy}
          />
        </div>
      </section>

      <div className="admin-form-actions">
        <button
          type="submit"
          className="admin-primary-button admin-primary-button--full"
          disabled={isSubmitting}
        >
          {isSubmitting ? copy.common.saving : isEditing ? formCopy.updatePost : formCopy.savePost}
        </button>
      </div>
    </form>
  );
}
