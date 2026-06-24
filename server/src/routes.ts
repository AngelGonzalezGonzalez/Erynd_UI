import { Router } from 'express';
import { prisma, WORKSPACE_ID } from './db.js';
import { makeAgent } from './agent/index.js';
import * as s from './serialize.js';
import type { ChatRequest } from './domain.js';

const agent = makeAgent();
export const router = Router();

const ws = { workspaceId: WORKSPACE_ID };

router.get('/health', (_req, res) => res.json({ ok: true }));

// ---- Chat: replaces routeIntent ----
router.post('/chat', async (req, res) => {
  const body = req.body as ChatRequest;
  if (!body?.text?.trim()) return res.status(400).json({ error: 'text required' });

  const reply = await agent.respond({
    text: body.text,
    autonomy: (body.autonomy ?? 0) as ChatRequest['autonomy'],
    locale: body.locale === 'es' ? 'es' : 'en',
    history: body.history,
  });

  // Persist the exchange (best-effort; never block the response on it).
  try {
    await prisma.chatMessage.create({ data: { ...ws, author: 'user', text: body.text } });
    await prisma.chatMessage.create({
      data: {
        ...ws,
        author: 'assistant',
        text: reply.text ?? null,
        artifact: reply.artifact ? JSON.stringify(reply.artifact) : null,
        proposal: reply.proposal ? JSON.stringify(reply.proposal) : null,
      },
    });
  } catch (e) {
    console.warn('[chat] persist failed:', (e as Error).message);
  }

  res.json({ reply });
});

// ---- Briefing ----
router.get('/briefing', async (_req, res) => {
  const [warnings, opportunities, team] = await Promise.all([
    prisma.warning.findMany({ where: ws }),
    prisma.opportunity.findMany({ where: ws }),
    prisma.teamMember.findMany({ where: ws }),
  ]);
  res.json({
    warnings: warnings.map(s.warning),
    opportunities: opportunities.map(s.opportunity),
    team: team.map(s.team),
  });
});

// ---- Analytics ----
router.get('/analytics', async (_req, res) => {
  const [points, workspace] = await Promise.all([
    prisma.seriesPoint.findMany({ where: { ...ws, series: 'sentiment' }, orderBy: { idx: 'asc' } }),
    prisma.workspace.findUnique({ where: { id: WORKSPACE_ID } }),
  ]);
  const extras = workspace?.analytics ? JSON.parse(workspace.analytics) : {};
  res.json({ series: points.map(s.seriesPoint), ...extras });
});

// ---- Mentions (evidence drill-down) ----
router.get('/mentions', async (req, res) => {
  const idsParam = String(req.query.ids ?? '').trim();
  const where = idsParam
    ? { ...ws, id: { in: idsParam.split(',').filter(Boolean) } }
    : ws;
  const mentions = await prisma.mention.findMany({ where });
  res.json({ mentions: mentions.map(s.mention) });
});

router.get('/journalists', async (_req, res) => {
  const rows = await prisma.journalist.findMany({ where: ws });
  res.json({ journalists: rows.map(s.journalist) });
});

router.get('/actions', async (_req, res) => {
  const rows = await prisma.actionCard.findMany({ where: ws });
  res.json({ actions: rows.map(s.action) });
});

router.get('/warnings', async (_req, res) => {
  const rows = await prisma.warning.findMany({ where: ws });
  res.json({ warnings: rows.map(s.warning) });
});

// ---- Trust ledger ----
router.get('/ledger', async (_req, res) => {
  const rows = await prisma.ledgerEntry.findMany({ where: ws, orderBy: { createdAt: 'desc' } });
  res.json({ ledger: rows.map(s.ledger) });
});

router.post('/ledger', async (req, res) => {
  const { kind, label, detail, outbound, status } = req.body ?? {};
  const row = await prisma.ledgerEntry.create({
    data: { ...ws, kind: kind ?? 'acted', label: label ?? '', detail: detail ?? '', outbound: !!outbound, status: status ?? 'done' },
  });
  res.json({ entry: s.ledger(row) });
});

router.post('/ledger/:id/:op', async (req, res) => {
  const op = req.params.op;
  const status = op === 'approve' ? 'approved' : op === 'undo' ? 'undone' : null;
  if (!status) return res.status(400).json({ error: 'op must be approve|undo' });
  const row = await prisma.ledgerEntry.update({ where: { id: req.params.id }, data: { status } });
  res.json({ entry: s.ledger(row) });
});

// ---- Saved searches ----
router.get('/searches', async (_req, res) => {
  const rows = await prisma.savedSearch.findMany({ where: ws, orderBy: { createdAt: 'desc' } });
  res.json({ searches: rows.map(s.savedSearch) });
});

router.post('/searches', async (req, res) => {
  const { name, query, alert } = req.body ?? {};
  const row = await prisma.savedSearch.create({
    data: { ...ws, name: name ?? 'Untitled', query: query ?? '', alert: !!alert },
  });
  res.json({ search: s.savedSearch(row) });
});
