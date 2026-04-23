'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLenis } from 'lenis/react';

export function RouterPreventScrollRestoration() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lenis = useLenis();

  // Disable native scroll restoration to avoid jank on route changes
  useEffect(() => {
    if (typeof window === 'undefined' || !('scrollRestoration' in window.history)) {
      return;
    }

    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (lenis) {
      // Single Lenis call; no extra raf/timeouts
      lenis.scrollTo(0, {
        immediate: true,
      });
    } else {
      // Fallback to native scroll
      window.scrollTo(0, 0);
    }
  }, [pathname, searchParams, lenis]);

  return null;
}

export default RouterPreventScrollRestoration;