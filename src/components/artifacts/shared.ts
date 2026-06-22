import { useEffect, useState } from 'react';
import type { LoadState, Severity } from '../../lib/types';

export interface ArtifactProps {
  full?: boolean;
  state?: LoadState;
  payload?: Record<string, unknown>;
}

export const severityRank: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };

/** Briefly show a loading state on mount, then settle — makes the UI feel alive
 *  without spinners on the user's own data. Respects an explicit forced state. */
export function useMountLoad(forced?: LoadState, ms = 650): LoadState {
  const [loading, setLoading] = useState(forced ? forced === 'loading' : true);
  useEffect(() => {
    if (forced) {
      setLoading(forced === 'loading');
      return;
    }
    const id = window.setTimeout(() => setLoading(false), ms);
    return () => window.clearTimeout(id);
  }, [forced, ms]);
  if (forced) return forced;
  return loading ? 'loading' : 'default';
}

export const channelLabel: Record<string, string> = {
  x: 'X',
  news: 'News',
  reddit: 'Reddit',
  instagram: 'IG',
  tiktok: 'TikTok',
  broadcast: 'TV',
  blog: 'Blog',
  podcast: 'Pod',
};
