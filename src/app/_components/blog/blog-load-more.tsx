'use client';

import { useHomeI18n } from '../home-i18n-provider';

type BlogLoadMoreProps = {
  visible: number;
  total: number;
  hasMore: boolean;
  onLoadMore: () => void;
};

export function BlogLoadMore({
  visible,
  total,
  hasMore,
  onLoadMore,
}: BlogLoadMoreProps): React.JSX.Element | null {
  const { blogCopy } = useHomeI18n();

  if (total === 0) {
    return null;
  }

  const showing = blogCopy.pagination.showing
    .replace('{visible}', String(Math.min(visible, total)))
    .replace('{total}', String(total));

  return (
    <div className="blog-load-more">
      <p className="blog-load-more-count">{showing}</p>
      {hasMore ? (
        <button type="button" className="blog-load-more-button" onClick={onLoadMore}>
          {blogCopy.pagination.loadMore}
        </button>
      ) : null}
    </div>
  );
}
