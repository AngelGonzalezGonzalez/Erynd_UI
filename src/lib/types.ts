// ERYND Intelligence — domain types.

export type Theme = 'dark' | 'light';
export type Locale = 'en' | 'es';
export type Role = 'analyst' | 'pr' | 'manager';

/** Progressive-delegation ladder (the trust spine). */
export type AutonomyLevel = 0 | 1 | 2 | 3;
// 0 Ask · 1 Draft for me · 2 Draft & queue for approval · 3 Act within bounds

export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type Sentiment = 'positive' | 'neutral' | 'negative';
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

export type LoadState = 'default' | 'loading' | 'empty' | 'error';

/** A mention is the atomic unit of evidence — every number drills down to these. */
export interface Mention {
  id: string;
  author: string;
  handle: string;
  outlet: string;
  channel: 'x' | 'news' | 'reddit' | 'instagram' | 'tiktok' | 'broadcast' | 'blog' | 'podcast';
  text: string;
  lang: Locale;
  sentiment: Sentiment;
  reach: number;
  influence: number; // 0-100 influence tier score
  time: string;
  verified?: boolean;
}

export interface Warning {
  id: string;
  title: string;
  summary: string;
  severity: Severity;
  status: 'open' | 'assigned' | 'monitoring' | 'resolved';
  velocity: number; // % change vs baseline
  reach: number;
  sentiment: Sentiment;
  channels: string[];
  spark: number[]; // velocity sparkline
  drivingAccounts: { name: string; followers: number; posts: number }[];
  guidance: string;
  mentionIds: string[];
  owner?: string;
  sla?: string;
  isNoise?: boolean;
  warming?: boolean; // alert fired but no data yet (edge case)
}

export interface Opportunity {
  id: string;
  title: string;
  detail: string;
  channel: string;
}

export interface SeriesPoint {
  label: string;
  value: number;
  mentionIds?: string[]; // drill-to-evidence
}

export interface CompetitorShare {
  name: string;
  share: number; // % share of voice
  delta: number; // change
  isUs?: boolean;
}

export interface RadarAxis {
  axis: string;
  us: number;
  them: number;
}

export interface Journalist {
  id: string;
  name: string;
  outlet: string;
  beats: string[];
  location: string;
  matchScore: number;
  email: string;
  recentArticles: { title: string; date: string }[];
  aiInsight: string;
  lastInteraction?: string;
  status?: 'queued' | 'sent' | 'opened' | 'replied' | 'bounced' | 'optedout';
  avatarHue: number;
}

export type ActionStage = 'proposed' | 'in_progress' | 'shipped' | 'measured';

export interface ActionCard {
  id: string;
  title: string;
  stage: ActionStage;
  owner: string;
  due: string;
  linkedWarningId?: string;
  comments: number;
  fromAI?: boolean;
  whatWeDid?: string;
  whatChanged?: string;
  learnings?: string;
  roi?: string;
  blocked?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: Role;
  presence: 'online' | 'away' | 'offline';
  activity: string;
  hue: number;
}

/** Trust-ledger entry — every assistant action, reversible. */
export interface LedgerEntry {
  id: string;
  kind: 'drafted' | 'queued' | 'acted' | 'filtered' | 'navigated';
  label: string;
  detail: string;
  time: string;
  undone?: boolean;
  outbound?: boolean;
  status: 'done' | 'pending_approval' | 'approved' | 'undone';
}

/** A chat artifact: the inline rendering of a capability. */
export interface Artifact {
  id: string;
  kind: SurfaceKind;
  title: string;
  state?: LoadState;
  payload?: Record<string, unknown>;
}

export interface ChatMessage {
  id: string;
  author: 'user' | 'assistant';
  text?: string;
  // i18n key fallback: when text is a key the renderer resolves it
  textKey?: string;
  artifact?: Artifact;
  proposal?: {
    label: string;
    actionLabel: string;
    kind: SurfaceKind;
    title: string;
    outbound?: boolean;
  };
  time: string;
  pending?: boolean; // assistant is "thinking"
}

export interface SuggestedPrompt {
  id: string;
  labelKey: string;
  kind: SurfaceKind | 'text';
}
