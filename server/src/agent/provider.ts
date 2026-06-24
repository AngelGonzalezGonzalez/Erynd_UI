import type { ChatRequest, Reply } from '../domain.js';

/**
 * The swap seam. Today: a Claude Sonnet 4.6 provider with a rules fallback.
 * Tomorrow: an Apify-backed provider can implement the same interface and be
 * dropped in without touching the routes or the frontend.
 */
export interface AgentProvider {
  respond(req: ChatRequest): Promise<Reply>;
}
