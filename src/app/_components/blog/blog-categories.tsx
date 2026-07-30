'use client';

import { useHomeI18n } from '../home-i18n-provider';
import { BLOG_CATEGORY_IDS, type BlogCategoryId } from './blog-types';

type BlogCategoriesProps = {
  activeId: BlogCategoryId;
  onChange: (id: BlogCategoryId) => void;
};

export function BlogCategories({ activeId, onChange }: BlogCategoriesProps): React.JSX.Element {
  const { blogCopy } = useHomeI18n();

  return (
    <nav className="blog-categories" aria-label={blogCopy.toolbar.categoryLabel}>
      <ul className="blog-categories-list">
        {BLOG_CATEGORY_IDS.map((id) => {
          const isActive = id === activeId;
          return (
            <li key={id}>
              <button
                type="button"
                className={isActive ? 'blog-category-chip is-active' : 'blog-category-chip'}
                aria-pressed={isActive}
                onClick={() => onChange(id)}
              >
                {blogCopy.categories[id]}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
