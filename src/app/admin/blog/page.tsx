import { AdminDrawer } from '../_components/admin-drawer';
import { AdminPageHeader } from '../_components/admin-page-header';
import { AdminSection } from '../_components/admin-section';
import { serializeAdminBlogPost } from '../_components/admin-blog-post';
import { AdminText } from '../_components/admin-text';
import { BlogDeleteButton } from '../_components/blog-delete-button';
import { BlogEditDrawer } from '../_components/blog-edit-drawer';
import { BlogPostForm } from '../_components/blog-post-form';
import { BlogStatusToggle } from '../_components/blog-status-toggle';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

const BLOG_DATE_FORMATTER = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

async function getBlogPosts() {
  try {
    return await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        translations: {
          orderBy: { locale: 'asc' },
        },
      },
    });
  } catch (error) {
    logger.error('Failed to load admin blog posts.', { error });
    return [];
  }
}

type BlogPostItem = Awaited<ReturnType<typeof getBlogPosts>>[number];

function getEnglishTranslation(post: BlogPostItem) {
  return post.translations.find((translation) => translation.locale === 'en') ?? post.translations[0];
}

function BlogPostCard({ post }: { post: BlogPostItem }): React.JSX.Element {
  const englishTranslation = getEnglishTranslation(post);
  const localeCount = post.translations.length;
  const postTitle = englishTranslation?.title ?? '';
  const adminPost = serializeAdminBlogPost(post);

  return (
    <article className="admin-card">
      <span className="admin-card-icon" aria-hidden>
        B
      </span>
      <div>
        <h2>{postTitle || <AdminText path="blog.untitled" />}</h2>
        <p>{englishTranslation?.excerpt ?? <AdminText path="blog.noExcerpt" />}</p>
        <p>
          {BLOG_DATE_FORMATTER.format(post.createdAt)} · {localeCount}{' '}
          <AdminText path={localeCount === 1 ? 'blog.languageSingular' : 'blog.languagePlural'} />
        </p>
      </div>
      <div className="admin-card-meta">
        <BlogStatusToggle postId={post.id} status={post.status} />
        <div className="admin-card-actions">
          <BlogEditDrawer post={adminPost} postTitle={postTitle} />
          <BlogDeleteButton postId={post.id} postTitle={postTitle} />
        </div>
      </div>
    </article>
  );
}

export default async function AdminBlogPage(): Promise<React.JSX.Element> {
  const posts = await getBlogPosts();

  return (
    <>
      <AdminPageHeader sectionKey="blog">
        <AdminDrawer
          buttonLabelPath="blog.createButton"
          titlePath="blog.createTitle"
          descriptionPath="blog.createDescription"
          initialScrollPosition="bottom"
        >
          <BlogPostForm />
        </AdminDrawer>
      </AdminPageHeader>
      <AdminSection className="admin-list" ariaLabelPath="blog.listAria">
        {posts.length > 0 ? (
          posts.map((post) => <BlogPostCard key={post.id} post={post} />)
        ) : (
          <div className="admin-empty">
            <AdminText path="blog.empty" />
          </div>
        )}
      </AdminSection>
    </>
  );
}
