// Reconstruct frontend-shaped objects from Prisma rows (JSON-string columns →
// real arrays/objects). Output matches src/lib/types.ts exactly.

const j = <T>(s: string | null | undefined, fallback: T): T => {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
};

export function mention(m: any) {
  return {
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
    verified: m.verified || undefined,
  };
}

export function warning(w: any) {
  return {
    id: w.id,
    title: w.title,
    summary: w.summary,
    severity: w.severity,
    status: w.status,
    velocity: w.velocity,
    reach: w.reach,
    sentiment: w.sentiment,
    channels: j<string[]>(w.channels, []),
    spark: j<number[]>(w.spark, []),
    drivingAccounts: j<any[]>(w.drivingAccounts, []),
    guidance: w.guidance,
    mentionIds: j<string[]>(w.mentionIds, []),
    owner: w.owner ?? undefined,
    sla: w.sla ?? undefined,
    isNoise: w.isNoise || undefined,
    warming: w.warming || undefined,
  };
}

export function opportunity(o: any) {
  return { id: o.id, title: o.title, detail: o.detail, channel: o.channel };
}

export function journalist(j2: any) {
  return {
    id: j2.id,
    name: j2.name,
    outlet: j2.outlet,
    beats: j<string[]>(j2.beats, []),
    location: j2.location,
    matchScore: j2.matchScore,
    email: j2.email,
    recentArticles: j<any[]>(j2.recentArticles, []),
    aiInsight: j2.aiInsight,
    lastInteraction: j2.lastInteraction ?? undefined,
    status: j2.status ?? undefined,
    avatarHue: j2.avatarHue,
  };
}

export function action(a: any) {
  return {
    id: a.id,
    title: a.title,
    stage: a.stage,
    owner: a.owner,
    due: a.due,
    linkedWarningId: a.linkedWarningId ?? undefined,
    comments: a.comments,
    fromAI: a.fromAI || undefined,
    whatWeDid: a.whatWeDid ?? undefined,
    whatChanged: a.whatChanged ?? undefined,
    learnings: a.learnings ?? undefined,
    roi: a.roi ?? undefined,
    blocked: a.blocked || undefined,
  };
}

export function team(t: any) {
  return { id: t.id, name: t.name, role: t.role, presence: t.presence, activity: t.activity, hue: t.hue };
}

export function seriesPoint(s: any) {
  return { label: s.label, value: s.value, mentionIds: j<string[]>(s.mentionIds, []) };
}

export function ledger(l: any) {
  return {
    id: l.id,
    kind: l.kind,
    label: l.label,
    detail: l.detail,
    time: new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    outbound: l.outbound || undefined,
    status: l.status,
    undone: l.status === 'undone' || undefined,
  };
}

export function savedSearch(s: any) {
  return { id: s.id, name: s.name, query: s.query, alert: s.alert };
}
