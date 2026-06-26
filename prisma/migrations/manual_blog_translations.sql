-- Migrate legacy blog_posts columns into blog_post_translations before schema push.

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS cover_image_key TEXT;

CREATE TABLE IF NOT EXISTS blog_post_translations (
  id TEXT NOT NULL,
  blog_post_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_alt TEXT,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL,
  CONSTRAINT blog_post_translations_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX IF NOT EXISTS blog_post_translations_blog_post_id_locale_key
  ON blog_post_translations (blog_post_id, locale);

CREATE UNIQUE INDEX IF NOT EXISTS blog_post_translations_locale_slug_key
  ON blog_post_translations (locale, slug);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'title'
  ) THEN
    INSERT INTO blog_post_translations (
      id,
      blog_post_id,
      locale,
      title,
      slug,
      excerpt,
      content,
      image_alt,
      seo_title,
      seo_description,
      created_at,
      updated_at
    )
    SELECT
      'mig_' || id,
      id,
      'en',
      title,
      slug,
      excerpt,
      content,
      image_alt,
      seo_title,
      seo_description,
      created_at,
      updated_at
    FROM blog_posts
  WHERE title IS NOT NULL
    AND NOT EXISTS (
      SELECT 1
      FROM blog_post_translations
      WHERE blog_post_translations.blog_post_id = blog_posts.id
        AND blog_post_translations.locale = 'en'
    );

    ALTER TABLE blog_posts DROP COLUMN IF EXISTS title;
    ALTER TABLE blog_posts DROP COLUMN IF EXISTS slug;
    ALTER TABLE blog_posts DROP COLUMN IF EXISTS excerpt;
    ALTER TABLE blog_posts DROP COLUMN IF EXISTS content;
    ALTER TABLE blog_posts DROP COLUMN IF EXISTS image_alt;
    ALTER TABLE blog_posts DROP COLUMN IF EXISTS seo_title;
    ALTER TABLE blog_posts DROP COLUMN IF EXISTS seo_description;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'blog_post_translations_blog_post_id_fkey'
  ) THEN
    ALTER TABLE blog_post_translations
      ADD CONSTRAINT blog_post_translations_blog_post_id_fkey
      FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
