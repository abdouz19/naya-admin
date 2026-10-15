import { useEffect, useState } from 'react';
import { getSupportStats, SUPPORT_STATS_EVENT } from '@/services/support.service';
import type { SupportStats } from '@/types/support';

const POLL_INTERVAL_MS = 60_000;

/**
 * Number of support requests waiting for the team, for the sidebar badge.
 * Polls every minute and also picks up stats broadcast by the Support page.
 * Errors (offline, expired session) simply hide the badge.
 */
export function useSupportWaitingCount(token: string | null, enabled: boolean): number {
  const [waiting, setWaiting] = useState(0);

  useEffect(() => {
    if (!enabled || !token) return;

    const onStats = (event: Event) => {
      const stats = (event as CustomEvent<SupportStats>).detail;
      if (stats && typeof stats.waiting === 'number') setWaiting(stats.waiting);
    };
    window.addEventListener(SUPPORT_STATS_EVENT, onStats);

    const poll = () => {
      getSupportStats(token).catch(() => setWaiting(0));
    };
    poll();
    const interval = window.setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      window.removeEventListener(SUPPORT_STATS_EVENT, onStats);
      window.clearInterval(interval);
    };
  }, [token, enabled]);

  return enabled && token ? waiting : 0;
}
