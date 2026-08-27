import { useCallback, useState } from 'react';

const STORAGE_KEY = 'nayha-sidebar-collapsed';

function getInitial(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'true';
  } catch {
    return false;
  }
}

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(getInitial);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // localStorage unavailable
      }
      return next;
    });
  }, []);

  return { collapsed, toggle };
}
