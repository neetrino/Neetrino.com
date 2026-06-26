import { AdminDrawer } from '../_components/admin-drawer';
import { AdminPageHeader } from '../_components/admin-page-header';
import { AdminSubmitButton } from '../_components/admin-submit-button';
import { createBlogPost } from '../_actions/blog-actions';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

const BLOG_DATE_FORMATTER = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
const TRANSLATION_TABS = ['English', 'Русский', 'Հայերեն'] as const;

async function getBlogPosts() {
  try {
    return await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    logger.error('Failed to load admin blog posts.', { error });
    return [];
  }
}

type BlogPostItem = Awaited<ReturnType<typeof getBlogPosts>>[number];

function BlogPostCard({ post }: { post: BlogPostItem }): React.JSX.Element {
  return (
    <article className="admin-card">
      <span className="admin-card-icon" aria-hidden>
        B
      </span>
      <div>
        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>
        <p>{BLOG_DATE_FORMATTER.format(post.createdAt)}</p>
      </div>
      <div className="admin-card-meta">
        <span className="admin-status">{post.status}</span>
        <span aria-hidden>&gt;</span>
      </div>
    </article>
  );
}

function BlogCommonFields(): React.JSX.Element {
  return (
    <section className="admin-form-section">
      <h3 className="admin-form-section-title">Common fields</h3>
      <div className="admin-form-grid admin-form-grid--two">
        <label className="admin-field">
          <span>Status</span>
          <select name="status" defaultValue="DRAFT">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </label>
        <label className="admin-field">
          <span>Published date</span>
          <input name="publishedAt" type="date" />
        </label>
      </div>
      <label className="admin-field">
        <span>Cover image URL</span>
        <input name="coverImageUrl" placeholder="https://cdn.neetrino.com/figma-assets/example.webp" />
      </label>
    </section>
  );
}

function BlogTranslationFields(): React.JSX.Element {
  return (
    <section className="admin-form-section">
      <h3 className="admin-form-section-title">Translations</h3>
      <div className="admin-tabs" aria-label="Translation language tabs">
        {TRANSLATION_TABS.map((tab, index) => (
          <span key={tab} className={index === 0 ? 'admin-tab is-active' : 'admin-tab'}>
            {tab}
          </span>
        ))}
      </div>
      <label className="admin-field">
        <span>Slug</span>
        <input name="slug" placeholder="online-booking-systems-in-2026" />
      </label>
      <label className="admin-field">
        <span>Title</span>
        <input name="title" placeholder="Online Booking Systems in 2026" required />
      </label>
      <label className="admin-field">
        <span>Excerpt / short description</span>
        <textarea name="excerpt" placeholder="Short summary for the admin list." required />
      </label>
      <label className="admin-field">
        <span>Content / full text</span>
        <textarea name="content" placeholder="Write the first draft here." required />
      </label>
      <label className="admin-field">
        <span>Image alt</span>
        <input name="imageAlt" placeholder="Descriptive alt text for the cover image" />
      </label>
      <label className="admin-field">
        <span>SEO title</span>
        <input name="seoTitle" placeholder="SEO title for search results" />
      </label>
      <label className="admin-field">
        <span>SEO description</span>
        <textarea name="seoDescription" placeholder="Short SEO description for search engines." />
      </label>
    </section>
  );
}

function BlogPostForm(): React.JSX.Element {
  return (
    <form action={createBlogPost} className="admin-form admin-form--wide">
      <BlogCommonFields />
      <BlogTranslationFields />
      <div className="admin-form-actions">
        <AdminSubmitButton>Save post</AdminSubmitButton>
      </div>
    </form>
  );
}

export default async function AdminBlogPage(): Promise<React.JSX.Element> {
  const posts = await getBlogPosts();

  return (
    <>
      <AdminPageHeader title="Blog posts" description="Manage published and draft blog content.">
        <AdminDrawer
          buttonLabel="Create new post"
          title="Create new post"
          description="Create the post content and publishing fields."
          initialScrollPosition="bottom"
        >
          <BlogPostForm />
        </AdminDrawer>
      </AdminPageHeader>
      <section className="admin-list" aria-label="Blog post list">
        {posts.length > 0 ? (
          posts.map((post) => <BlogPostCard key={post.id} post={post} />)
        ) : (
          <div className="admin-empty">No blog posts yet. Create the first draft from the left panel.</div>
        )}
      </section>
    </>
  );
}
