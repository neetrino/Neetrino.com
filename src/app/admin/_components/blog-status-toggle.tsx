'use client';

import { useTransition } from 'react';
import { toggleBlogPostStatus } from '../_actions/blog-actions';

type BlogStatusToggleProps = {
  postId: string;
  status: string;
};

function getStatusLabel(status: string): string {
  return status === 'PUBLISHED' ? 'Published' : 'Draft';
}

function getStatusClassName(status: string): string {
  return status === 'PUBLISHED' ? 'admin-status admin-status--published' : 'admin-status admin-status--draft';
}

export function BlogStatusToggle({ postId, status }: BlogStatusToggleProps): React.JSX.Element {
  const [isPending, startTransition] = useTransition();

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
      aria-label={status === 'PUBLISHED' ? 'Set post to draft' : 'Publish post'}
    >
      {getStatusLabel(status)}
    </button>
  );
}
