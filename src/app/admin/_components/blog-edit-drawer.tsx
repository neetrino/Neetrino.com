'use client';

import { AdminDrawer } from './admin-drawer';
import { formatAdminMessage, useAdminI18n } from './admin-i18n-provider';
import type { AdminBlogPost } from './admin-blog-post';
import { BlogPostForm } from './blog-post-form';

type BlogEditDrawerProps = {
  post: AdminBlogPost;
  postTitle: string;
};

export function BlogEditDrawer({ post, postTitle }: BlogEditDrawerProps): React.JSX.Element {
  const { copy } = useAdminI18n();

  return (
    <AdminDrawer
      buttonLabel={copy.blog.editButton}
      title={copy.blog.editTitle}
      description={formatAdminMessage(copy.blog.editDescription, { title: postTitle })}
      renderTrigger={({ open }) => (
        <button
          type="button"
          className="admin-icon-button"
          aria-label={formatAdminMessage(copy.blog.editAria, { title: postTitle })}
          onClick={open}
        >
          <span className="admin-icon admin-icon--edit" aria-hidden />
        </button>
      )}
    >
      <BlogPostForm post={post} />
    </AdminDrawer>
  );
}
