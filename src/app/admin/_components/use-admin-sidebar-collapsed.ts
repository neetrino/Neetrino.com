'use client';

import { useEffect, useRef, useState } from 'react';

const ADMIN_SIDEBAR_COLLAPSED_KEY = 'neetrino.admin.sidebarCollapsed';

export function useAdminSidebarCollapsed(): {
  isCollapsed: boolean;
  toggleSidebar: () => void;
} {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const hasRestoredCollapseRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      hasRestoredCollapseRef.current = true;
      setIsCollapsed(window.localStorage.getItem(ADMIN_SIDEBAR_COLLAPSED_KEY) === '1');
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!hasRestoredCollapseRef.current) {
      return;
    }

    window.localStorage.setItem(ADMIN_SIDEBAR_COLLAPSED_KEY, isCollapsed ? '1' : '0');
  }, [isCollapsed]);

  function toggleSidebar(): void {
    setIsCollapsed((current) => !current);
  }

  return { isCollapsed, toggleSidebar };
}
