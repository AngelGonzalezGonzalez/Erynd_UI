import type { SurfaceKind } from '../../lib/types';
import { ArtifactProps } from './shared';
import { Briefing } from './Briefing';
import { Analytics } from './Analytics';
import { ResponseDraft } from './ResponseDraft';
import { Kanban } from './Kanban';
import { SearchBuilder } from './SearchBuilder';
import { MediaCRM } from './MediaCRM';
import { SocialPublisher } from './SocialPublisher';
import { ROI } from './ROI';
import { WarningDetail } from './WarningDetail';

interface SurfaceDef {
  Component: (p: ArtifactProps) => JSX.Element;
  titleKey: string;
  /** glyph for the artifact header + command menu */
  glyph: string;
  /** hero surfaces expose a state preview in the overlay */
  statePreview?: boolean;
}

export const registry: Record<SurfaceKind, SurfaceDef> = {
  briefing: { Component: Briefing, titleKey: 'brief.title', glyph: '◴', statePreview: true },
  analytics: { Component: Analytics, titleKey: 'an.title', glyph: '◫', statePreview: true },
  response: { Component: ResponseDraft, titleKey: 'resp.title', glyph: '✎', statePreview: true },
  kanban: { Component: Kanban, titleKey: 'kan.title', glyph: '▦', statePreview: true },
  search: { Component: SearchBuilder, titleKey: 'srch.title', glyph: '⌕' },
  crm: { Component: MediaCRM, titleKey: 'crm.title', glyph: '✦' },
  publisher: { Component: SocialPublisher, titleKey: 'pub.title', glyph: '➤' },
  roi: { Component: ROI, titleKey: 'roi.title', glyph: '∿' },
  warning: { Component: WarningDetail, titleKey: 'warn.queue', glyph: '⚠' },
  onboarding: { Component: Briefing, titleKey: 'brief.title', glyph: '◴' },
};

/** Surfaces a power user can open directly from the command menu. */
export const directSurfaces: SurfaceKind[] = ['briefing', 'analytics', 'search', 'crm', 'publisher', 'kanban', 'roi'];
