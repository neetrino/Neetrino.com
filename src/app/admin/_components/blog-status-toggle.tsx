'use client';

import { useTransition } from 'react';
import { toggleBlogPostStatus } from '../_actions/blog-actions';
import { useAdminI18n } from './admin-i18n-provider';

type BlogStatusToggleProps = {
  postId: string;
  status: string;
};

function getStatusClassName(status: string): string {
  return status === 'PUBLISHED' ? 'admin-status admin-status--published' : 'admin-status admin-status--draft';
}

export function BlogStatusToggle({ postId, status }: BlogStatusToggleProps): React.JSX.Element {
  const [isPending, startTransition] = useTransition();
  const { copy } = useAdminI18n();
  const isPublished = status === 'PUBLISHED';

  function handleToggle(): void {
    const formData = new FormData();
    formData.set('postId', postId);

    startTransition(async () => {
      await toggleBlogPostStatus(formData);
    });
  }

  return (
    <button
      type="button"
      className={getStatusClassName(status)}
      onClick={handleToggle}
      disabled={isPending}
      aria-label={isPublished ? copy.blog.setDraftAria : copy.blog.publishAria}
    >
      {isPublished ? copy.common.published : copy.common.draft}
    </button>
  );
}
