// Seeds the single ERYND workspace from the frontend's mock data, so the API
// serves the exact scenario the static demo shows. Run via `npm run seed`
// (tsx) — never compiled by `tsc build`.

import { PrismaClient } from '@prisma/client';
import {
  mentions,
  warnings,
  opportunities,
  journalists,
  actions,
  team,
  sentimentSeries,
  aveSeries,
  shareOfVoice,
  radar,
  brandHealth,
} from '../../src/data/mockData';

const prisma = new PrismaClient();
const WORKSPACE_ID = process.env.WORKSPACE_ID ?? 'ws-erynd';

async function main() {
  // Reset this workspace (cascade clears children) then recreate.
  await prisma.workspace.deleteMany({ where: { id: WORKSPACE_ID } });

  await prisma.workspace.create({
    data: {
      id: WORKSPACE_ID,
      name: 'Nuvera',
      analytics: JSON.stringify({ shareOfVoice, radar, brandHealth, aveSeries }),
    },
  });

  const ws = { workspaceId: WORKSPACE_ID };

  await prisma.mention.createMany({
    data: mentions.map((m) => ({
      ...ws,
      id: m.id,
      author: m.author,
      handle: m.handle,
      outlet: m.outlet,
      channel: m.channel,
      text: m.text,
      lang: m.lang,
      sentiment: m.sentiment,
      reach: m.reach,
      influence: m.influence,
      time: m.time,
      verified: m.verified ?? false,
    })),
  });

  await prisma.warning.createMany({
    data: warnings.map((w) => ({
      ...ws,
      id: w.id,
      title: w.title,
      summary: w.summary,
      severity: w.severity,
      status: w.status,
      velocity: w.velocity,
      reach: w.reach,
      sentiment: w.sentiment,
      channels: JSON.stringify(w.channels),
      spark: JSON.stringify(w.spark),
      drivingAccounts: JSON.stringify(w.drivingAccounts),
      guidance: w.guidance,
      mentionIds: JSON.stringify(w.mentionIds),
      owner: w.owner ?? null,
      sla: w.sla ?? null,
      isNoise: w.isNoise ?? false,
      warming: w.warming ?? false,
    })),
  });

  await prisma.opportunity.createMany({
    data: opportunities.map((o) => ({ ...ws, id: o.id, title: o.title, detail: o.detail, channel: o.channel })),
  });

  await prisma.journalist.createMany({
    data: journalists.map((jr) => ({
      ...ws,
      id: jr.id,
      name: jr.name,
      outlet: jr.outlet,
      beats: JSON.stringify(jr.beats),
      location: jr.location,
      matchScore: jr.matchScore,
      email: jr.email,
      recentArticles: JSON.stringify(jr.recentArticles),
      aiInsight: jr.aiInsight,
      lastInteraction: jr.lastInteraction ?? null,
      status: jr.status ?? null,
      avatarHue: jr.avatarHue,
    })),
  });

  await prisma.actionCard.createMany({
    data: actions.map((a) => ({
      ...ws,
      id: a.id,
      title: a.title,
      stage: a.stage,
      owner: a.owner,
      due: a.due,
      linkedWarningId: a.linkedWarningId ?? null,
      comments: a.comments,
      fromAI: a.fromAI ?? false,
      whatWeDid: a.whatWeDid ?? null,
      whatChanged: a.whatChanged ?? null,
      learnings: a.learnings ?? null,
      roi: a.roi ?? null,
      blocked: a.blocked ?? false,
    })),
  });

  await prisma.teamMember.createMany({
    data: team.map((t) => ({ ...ws, id: t.id, name: t.name, role: t.role, presence: t.presence, activity: t.activity, hue: t.hue })),
  });

  await prisma.seriesPoint.createMany({
    data: sentimentSeries.map((p, idx) => ({
      ...ws,
      series: 'sentiment',
      idx,
      label: p.label,
      value: p.value,
      mentionIds: JSON.stringify(p.mentionIds ?? []),
    })),
  });

  const counts = {
    mentions: mentions.length,
    warnings: warnings.length,
    journalists: journalists.length,
    actions: actions.length,
    team: team.length,
  };
  console.log('[seed] done', counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
