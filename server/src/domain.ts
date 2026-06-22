// Server-local mirror of the frontend's domain shapes (src/lib/types.ts).
// Kept in sync by hand so the API responses match the React app verbatim.

export type Locale = 'en' | 'es';
export type AutonomyLevel = 0 | 1 | 2 | 3;

export type SurfaceKind =
  | 'briefing'
  | 'analytics'
  | 'response'
  | 'kanban'
  | 'search'
  | 'crm'
  | 'publisher'
  | 'roi'
  | 'warning'
  | 'onboarding';

export interface Artifact {
  id: string;
  kind: SurfaceKind;
  title: string;
}

export interface Proposal {
  label: string;
  actionLabel: string;
  kind: SurfaceKind;
  title: string;
  outbound?: boolean;
}

/** What the chat endpoint returns — matches the frontend ChatMessage subset. */
export interface Reply {
  text?: string;
  textKey?: string;
  artifact?: Artifact;
  proposal?: Proposal;
}

export interface ChatRequest {
  text: string;
  autonomy: AutonomyLevel;
  locale: Locale;
  history?: { author: 'user' | 'assistant'; text: string }[];
}

/** i18n title keys per surface — identical to src/data/assistant.ts. */
export const SURFACE_TITLES: Record<Exclude<SurfaceKind, 'onboarding' | 'warning'>, string> = {
  briefing: 'brief.title',
  analytics: 'an.title',
  response: 'resp.title',
  kanban: 'kan.title',
  search: 'srch.title',
  crm: 'crm.title',
  publisher: 'pub.title',
  roi: 'roi.title',
};

/** Surfaces that are "outbound" — at autonomy 0 these are proposed before acting. */
export const OUTBOUND_SURFACES: ReadonlySet<SurfaceKind> = new Set(['crm', 'publisher']);

/** Surfaces offered as a proposal first at L0 (outbound-ish or creative). */
export const PROPOSABLE_SURFACES: ReadonlySet<SurfaceKind> = new Set(['response', 'crm', 'publisher']);

let n = 0;
export const artifactId = () => `a-${Date.now().toString(36)}-${n++}`;
