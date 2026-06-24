// Thin client for the ERYND backend. Every call is best-effort: when
// VITE_API_URL is unset (e.g. the static GitHub Pages build) or the request
// fails, callers fall back to local mock data so the app always works.

import type {
  AutonomyLevel,
  ChatMessage,
  Locale,
  Mention,
} from './types';

const BASE = import.meta.env.VITE_API_URL as string | undefined;
const TOKEN = import.meta.env.VITE_WORKSPACE_TOKEN as string | undefined;

export const apiEnabled = !!BASE;

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  if (!BASE) throw new Error('api-disabled');
  const res = await fetch(`${BASE}/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`api ${res.status}`);
  return (await res.json()) as T;
}

export type ChatReply = Pick<ChatMessage, 'text' | 'textKey' | 'artifact' | 'proposal'>;

export const api = {
  chat: (text: string, autonomy: AutonomyLevel, locale: Locale) =>
    req<{ reply: ChatReply }>('/chat', {
      method: 'POST',
      body: JSON.stringify({ text, autonomy, locale }),
    }).then((r) => r.reply),

  briefing: () => req<{ warnings: unknown[]; opportunities: unknown[]; team: unknown[] }>('/briefing'),
  analytics: () => req<Record<string, unknown>>('/analytics'),
  mentions: (ids: string[]) =>
    req<{ mentions: Mention[] }>(`/mentions?ids=${encodeURIComponent(ids.join(','))}`).then((r) => r.mentions),
  journalists: () => req<{ journalists: unknown[] }>('/journalists').then((r) => r.journalists),
  actions: () => req<{ actions: unknown[] }>('/actions').then((r) => r.actions),
  warnings: () => req<{ warnings: unknown[] }>('/warnings').then((r) => r.warnings),
};
