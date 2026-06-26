'use client';

import { AdminDrawer } from './admin-drawer';
import type { AdminBlogPost } from './admin-blog-post';
import { BlogPostForm } from './blog-post-form';

type BlogEditDrawerProps = {
  post: AdminBlogPost;
  postTitle: string;
};

export function BlogEditDrawer({ post, postTitle }: BlogEditDrawerProps): React.JSX.Element {
  return (
    <AdminDrawer
      buttonLabel="Edit post"
      title="Edit post"
      description={`Update content and publishing fields for "${postTitle}".`}
      renderTrigger={({ open }) => (
        <button type="button" className="admin-icon-button" aria-label={`Edit ${postTitle}`} onClick={open}>
          <span className="admin-icon admin-icon--edit" aria-hidden />
        </button>
      )}
    >
      <BlogPostForm post={post} />
    </AdminDrawer>
  );
}
