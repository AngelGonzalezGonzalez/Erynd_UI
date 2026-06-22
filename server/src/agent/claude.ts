// The real agent — Claude Sonnet 4.6 via the official SDK.
// It reads the user's message and returns ERYND-voice copy plus which surface
// (if any) to materialize, constrained with structured outputs so the result
// maps cleanly onto the frontend's Artifact / proposal shapes.

import Anthropic from '@anthropic-ai/sdk';
import type { AgentProvider } from './provider.js';
import { MockAgent } from './mock.js';
import {
  artifactId,
  PROPOSABLE_SURFACES,
  SURFACE_TITLES,
  OUTBOUND_SURFACES,
  type ChatRequest,
  type Reply,
  type SurfaceKind,
} from '../domain.js';

const MODEL = 'claude-sonnet-4-6';

const SURFACES = [
  'briefing',
  'analytics',
  'response',
  'kanban',
  'search',
  'crm',
  'publisher',
  'roi',
  'none',
] as const;

const SYSTEM = `You are ERYND, an AI-first media-intelligence copilot. You are nameless in the UI.

VOICE: confident, precise, editorial. No emoji. Short, declarative sentences. Reply in the user's language (en or es) — it is given per turn.

THE SCENARIO you are watching: a premium-audio brand "Nuvera" whose "Aria 2" earbuds have a spiking battery-life complaint that is getting a response and recovering. Ground answers in that world.

YOUR JOB each turn: write a brief reply, then decide which ONE capability surface (if any) the user's message calls for:
- briefing  — "what's happening / today / brief"
- analytics — sentiment, why it dropped, charts, share of voice
- response  — draft a reply/statement in brand voice
- kanban    — the action board / what the team is working on
- search    — build a monitoring query / alert
- crm       — find or pitch a journalist (OUTBOUND)
- publisher — schedule or compose a social post (OUTBOUND)
- roi       — return on investment / attribution / board report
- none      — pure conversation, no surface

AUTONOMY (given per turn, 0–3): at level 0 ("Ask"), outbound or creative work (response, crm, publisher) must be offered as a proposal the user approves first — set is_proposal true and give a short proposal_action label (e.g. "Draft it", "Prepare pitch"). At levels 1–3, act directly (is_proposal false).

Always answer with the structured schema.`;

interface ModelOut {
  reply_text: string;
  surface: (typeof SURFACES)[number];
  is_proposal: boolean;
  proposal_action?: string;
}

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    reply_text: { type: 'string', description: "The assistant's reply, in the user's language." },
    surface: { type: 'string', enum: SURFACES as unknown as string[] },
    is_proposal: { type: 'boolean' },
    proposal_action: { type: 'string', description: 'Short approve-button label when is_proposal is true.' },
  },
  required: ['reply_text', 'surface', 'is_proposal'],
} as const;

export class ClaudeAgent implements AgentProvider {
  private client: Anthropic;
  private fallback = new MockAgent();

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async respond(req: ChatRequest): Promise<Reply> {
    try {
      const history = (req.history ?? []).slice(-8).map((m) => ({
        role: m.author === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.text,
      }));

      // The SDK's static types lag the current API for `thinking: adaptive`
      // and `output_config`, so build the request untyped.
      const params: Record<string, unknown> = {
        model: MODEL,
        max_tokens: 1024,
        thinking: { type: 'adaptive' },
        system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
        output_config: { format: { type: 'json_schema', schema: SCHEMA } },
        messages: [
          ...history,
          {
            role: 'user',
            content: `Autonomy: ${req.autonomy}. Locale: ${req.locale}.\n\nUser: ${req.text}`,
          },
        ],
      };
      const response = await this.client.messages.create(params as never);

      const textBlock = response.content.find((b) => b.type === 'text');
      if (!textBlock || textBlock.type !== 'text') throw new Error('no text block');
      const out = JSON.parse(textBlock.text) as ModelOut;
      return this.toReply(out, req);
    } catch (err) {
      console.warn('[agent] Claude call failed, using mock fallback:', (err as Error).message);
      return this.fallback.respond(req);
    }
  }

  private toReply(out: ModelOut, req: ChatRequest): Reply {
    if (out.surface === 'none' || !(out.surface in SURFACE_TITLES)) {
      return { text: out.reply_text };
    }
    const surface = out.surface as SurfaceKind;
    const title = SURFACE_TITLES[surface as keyof typeof SURFACE_TITLES];

    const proposeFirst =
      req.autonomy === 0 && (out.is_proposal || PROPOSABLE_SURFACES.has(surface));
    if (proposeFirst) {
      const action = out.proposal_action || (req.locale === 'es' ? 'Continuar' : 'Continue');
      return {
        text: out.reply_text,
        proposal: {
          label: action,
          actionLabel: action,
          kind: surface,
          title,
          outbound: OUTBOUND_SURFACES.has(surface),
        },
      };
    }

    return { text: out.reply_text, artifact: { id: artifactId(), kind: surface, title } };
  }
}
