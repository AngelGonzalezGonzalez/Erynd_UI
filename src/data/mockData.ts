// ERYND Intelligence — mock data.
// One coherent scenario threaded through every surface so the
// detect -> respond -> measure loop feels real. The WATCHED brand is the
// fictional premium-audio company "Nuvera" and its "Aria 2" earbuds; a
// battery-life complaint spikes, gets a response, and recovers.
// No real company appears in crisis. Mentions are a natural EN/ES mix.

import type {
  Mention,
  Warning,
  Opportunity,
  SeriesPoint,
  CompetitorShare,
  RadarAxis,
  Journalist,
  ActionCard,
  TeamMember,
} from '../lib/types';

export const BRAND = 'Nuvera';
export const PRODUCT = 'Aria 2';
export const COMPETITORS = ['Halden', 'Orbital', 'Cesta', 'Sonora'];

export const mentions: Mention[] = [
  {
    id: 'mn-1',
    author: 'Priya Raman',
    handle: '@priyareviews',
    outlet: 'X',
    channel: 'x',
    text: "Three months in and my Aria 2 battery is already down to ~4hrs. For $249 buds this is rough. Anyone else seeing this? 🧵",
    lang: 'en',
    sentiment: 'negative',
    reach: 184000,
    influence: 78,
    time: '2h',
    verified: true,
  },
  {
    id: 'mn-2',
    author: 'TechDesk',
    handle: '@thesignal',
    outlet: 'The Signal',
    channel: 'news',
    text: 'Reports of premature battery fade pile up for Nuvera’s Aria 2 — is the flagship’s headline feature its weak point?',
    lang: 'en',
    sentiment: 'negative',
    reach: 920000,
    influence: 91,
    time: '3h',
    verified: true,
  },
  {
    id: 'mn-3',
    author: 'Marco Díaz',
    handle: '@marcodiaz',
    outlet: 'X',
    channel: 'x',
    text: 'Los Aria 2 que compré en marzo ya casi no aguantan media jornada. Una pena porque el sonido es increíble.',
    lang: 'es',
    sentiment: 'negative',
    reach: 42000,
    influence: 61,
    time: '4h',
  },
  {
    id: 'mn-4',
    author: 'r/headphones',
    handle: 'u/aud-nerd',
    outlet: 'Reddit',
    channel: 'reddit',
    text: 'PSA: Nuvera support is actually replacing affected Aria 2 units no questions asked. Took 2 days. Credit where due.',
    lang: 'en',
    sentiment: 'positive',
    reach: 56000,
    influence: 44,
    time: '1h',
  },
  {
    id: 'mn-5',
    author: 'Sound & Vision',
    handle: '@soundvision',
    outlet: 'Sound & Vision',
    channel: 'news',
    text: 'Hands-on: the Aria 2 still has the best spatial audio in its class. Battery questions aside, nothing else comes close.',
    lang: 'en',
    sentiment: 'positive',
    reach: 310000,
    influence: 82,
    time: '6h',
  },
  {
    id: 'mn-6',
    author: 'Lena Hofer',
    handle: '@lenahofer',
    outlet: 'Instagram',
    channel: 'instagram',
    text: 'Honestly still love my Aria 2 — the fit is unreal for workouts. Hope they sort the battery thing though.',
    lang: 'en',
    sentiment: 'neutral',
    reach: 88000,
    influence: 57,
    time: '5h',
  },
  {
    id: 'mn-7',
    author: 'Canal Tech',
    handle: '@canaltech_es',
    outlet: 'Canal Tech',
    channel: 'news',
    text: 'Nuvera responde a las quejas de batería del Aria 2 y promete una actualización de firmware esta semana.',
    lang: 'es',
    sentiment: 'neutral',
    reach: 240000,
    influence: 74,
    time: '40m',
  },
  {
    id: 'mn-8',
    author: 'Dev Okafor',
    handle: '@devokafor',
    outlet: 'X',
    channel: 'x',
    text: 'If the firmware fix is real, Nuvera handled this faster than Halden ever did with their charging fiasco.',
    lang: 'en',
    sentiment: 'positive',
    reach: 134000,
    influence: 69,
    time: '25m',
  },
  {
    id: 'mn-9',
    author: 'AudioFile Pod',
    handle: '@audiofilepod',
    outlet: 'AudioFile (podcast)',
    channel: 'podcast',
    text: 'Episode 142: we break down the Aria 2 battery reports and what a good recall-free response looks like.',
    lang: 'en',
    sentiment: 'neutral',
    reach: 71000,
    influence: 58,
    time: '7h',
  },
  {
    id: 'mn-10',
    author: 'Gabriela Mota',
    handle: '@gabimota',
    outlet: 'TikTok',
    channel: 'tiktok',
    text: 'mi review honesta de los Aria 2 a 6 meses — el sonido sigue 10/10 pero la batería bajó bastante',
    lang: 'es',
    sentiment: 'negative',
    reach: 410000,
    influence: 80,
    time: '8h',
  },
  {
    id: 'mn-11',
    author: 'The Verge-ish',
    handle: '@gadgetwell',
    outlet: 'Gadgetwell',
    channel: 'blog',
    text: 'Nuvera’s transparency here is a case study. They named the affected batch and gave a date. Rare.',
    lang: 'en',
    sentiment: 'positive',
    reach: 198000,
    influence: 72,
    time: '15m',
  },
  {
    id: 'mn-12',
    author: 'Hiro Tanaka',
    handle: '@hiro_audio',
    outlet: 'X',
    channel: 'x',
    text: 'Comparing Aria 2 vs Orbital Pro: Nuvera wins on sound, loses on battery longevity. Fixable in software hopefully.',
    lang: 'en',
    sentiment: 'neutral',
    reach: 96000,
    influence: 63,
    time: '9h',
  },
];

export const warnings: Warning[] = [
  {
    id: 'w-1',
    title: 'Aria 2 battery complaints accelerating',
    summary:
      'Negative posts about premature battery fade are up sharply, led by a verified reviewer (184k) and picked up by The Signal. Sentiment is sliding but a firmware-fix narrative is forming.',
    severity: 'critical',
    status: 'open',
    velocity: 312,
    reach: 1460000,
    sentiment: 'negative',
    channels: ['X', 'News', 'TikTok', 'Reddit'],
    spark: [4, 5, 6, 8, 14, 26, 41, 58, 72],
    drivingAccounts: [
      { name: '@priyareviews', followers: 184000, posts: 6 },
      { name: 'The Signal', followers: 920000, posts: 2 },
      { name: '@gabimota', followers: 410000, posts: 1 },
    ],
    guidance:
      'Lead with transparency: name the affected batch, confirm the firmware date, and point to the no-questions replacement already winning goodwill on Reddit. Counter the “flagship’s weak point” framing with the spatial-audio strength reviewers still praise.',
    mentionIds: ['mn-1', 'mn-2', 'mn-3', 'mn-10', 'mn-12'],
  },
  {
    id: 'w-2',
    title: 'Halden teasing a “2-day battery” rival',
    summary:
      'Competitor Halden is seeding press about an upcoming earbud with double the battery life — likely to ride your current news cycle.',
    severity: 'high',
    status: 'monitoring',
    velocity: 88,
    reach: 520000,
    sentiment: 'neutral',
    channels: ['News', 'X'],
    spark: [2, 3, 3, 5, 7, 9, 12, 14, 18],
    drivingAccounts: [{ name: 'Halden Newsroom', followers: 220000, posts: 3 }],
    guidance:
      'Don’t react publicly yet. Prepare a positioning line on sound quality + the firmware improvement so PR is ready if a journalist asks for comparison.',
    mentionIds: ['mn-12'],
  },
  {
    id: 'w-3',
    title: 'Goodwill forming around your support response',
    summary:
      'Positive posts praising the replacement program and transparency are climbing — an opportunity to amplify rather than a threat.',
    severity: 'low',
    status: 'open',
    velocity: 41,
    reach: 388000,
    sentiment: 'positive',
    channels: ['Reddit', 'X', 'Blog'],
    spark: [1, 1, 2, 3, 4, 6, 9, 13, 17],
    drivingAccounts: [{ name: '@devokafor', followers: 134000, posts: 1 }],
    guidance:
      'Amplify the strongest third-party praise (Gadgetwell, Reddit) rather than self-congratulating. Route to social as positive reinforcement.',
    mentionIds: ['mn-4', 'mn-8', 'mn-11'],
  },
  {
    id: 'w-4',
    title: 'Spike alert — warming up',
    summary: 'A new keyword rule just fired but is still gathering data.',
    severity: 'medium',
    status: 'open',
    velocity: 0,
    reach: 0,
    sentiment: 'neutral',
    channels: [],
    spark: [0, 0, 0],
    drivingAccounts: [],
    guidance: '',
    mentionIds: [],
    warming: true,
  },
];

export const opportunities: Opportunity[] = [
  {
    id: 'op-1',
    title: 'Amplify the “rare transparency” praise',
    detail: 'Gadgetwell called your response “a case study.” A quote-share could turn a defensive moment into earned trust.',
    channel: 'Social',
  },
  {
    id: 'op-2',
    title: 'Pitch Sound & Vision a spatial-audio deep dive',
    detail: 'They just reaffirmed you have the best spatial audio in class. Good moment for an exclusive.',
    channel: 'Media',
  },
];

// ---- Analytics series ----
export const sentimentSeries: SeriesPoint[] = [
  { label: 'Mon', value: 71, mentionIds: ['mn-5'] },
  { label: 'Tue', value: 68, mentionIds: ['mn-6'] },
  { label: 'Wed', value: 64, mentionIds: ['mn-12'] },
  { label: 'Thu', value: 52, mentionIds: ['mn-1', 'mn-2'] },
  { label: 'Fri', value: 41, mentionIds: ['mn-1', 'mn-3', 'mn-10'] },
  { label: 'Sat', value: 49, mentionIds: ['mn-7', 'mn-4'] },
  { label: 'Sun', value: 63, mentionIds: ['mn-8', 'mn-11'] },
];

export const shareOfVoice: CompetitorShare[] = [
  { name: BRAND, share: 38, delta: 6, isUs: true },
  { name: 'Halden', share: 27, delta: 3 },
  { name: 'Orbital', share: 19, delta: -2 },
  { name: 'Cesta', share: 9, delta: -1 },
  { name: 'Sonora', share: 7, delta: -1 },
];

export const aveSeries: SeriesPoint[] = [
  { label: 'Wk 1', value: 184 },
  { label: 'Wk 2', value: 210 },
  { label: 'Wk 3', value: 168 },
  { label: 'Wk 4', value: 296, mentionIds: ['mn-2', 'mn-5', 'mn-11'] },
];

export const radar: RadarAxis[] = [
  { axis: 'Sound', us: 92, them: 74 },
  { axis: 'Battery', us: 48, them: 81 },
  { axis: 'Design', us: 88, them: 70 },
  { axis: 'Value', us: 66, them: 72 },
  { axis: 'Support', us: 84, them: 58 },
  { axis: 'Buzz', us: 79, them: 64 },
];

export const brandHealth = {
  score: 72,
  delta: -8,
  drivers: [
    { label: 'Spatial audio acclaim', value: 18, positive: true },
    { label: 'Support response praise', value: 11, positive: true },
    { label: 'Battery complaints', value: -27, positive: false },
    { label: 'Competitor framing', value: -10, positive: false },
  ],
};

// ---- Journalists ----
export const journalists: Journalist[] = [
  {
    id: 'j-1',
    name: 'Amara Bexcco',
    outlet: 'The Signal',
    beats: ['Consumer tech', 'Audio', 'Product reviews'],
    location: 'London, UK',
    matchScore: 96,
    email: 'amara.b@thesignal.example',
    recentArticles: [
      { title: 'Premature battery fade reports pile up for the Aria 2', date: '3h ago' },
      { title: 'The earbud arms race is now about longevity', date: '5d ago' },
    ],
    aiInsight:
      'Wrote the piece driving today’s spike. Values transparency and named-batch specifics; has historically updated stories when given concrete fix timelines.',
    lastInteraction: 'Briefed on the Aria 2 launch, Mar 2026',
    avatarHue: 348,
  },
  {
    id: 'j-2',
    name: 'Theo Marchetti',
    outlet: 'Sound & Vision',
    beats: ['Audio engineering', 'Spatial audio'],
    location: 'New York, US',
    matchScore: 91,
    email: 't.marchetti@soundvision.example',
    recentArticles: [{ title: 'Hands-on: still the best spatial audio in its class', date: '6h ago' }],
    aiInsight:
      'Already positive on your core strength. Ideal for a constructive spatial-audio exclusive that reframes the narrative around what you do best.',
    lastInteraction: 'Sent Aria 2 review unit, Feb 2026',
    avatarHue: 188,
  },
  {
    id: 'j-3',
    name: 'Sofía Ramírez',
    outlet: 'Canal Tech',
    beats: ['Tecnología de consumo', 'Lanzamientos'],
    location: 'Ciudad de México, MX',
    matchScore: 88,
    email: 'sofia.r@canaltech.example',
    recentArticles: [{ title: 'Nuvera promete actualización de firmware para el Aria 2', date: '40m ago' }],
    aiInsight:
      'Cubre el mercado hispanohablante donde el sentimiento cayó más. Responde bien a datos concretos y fechas de corrección.',
    lastInteraction: undefined,
    avatarHue: 28,
  },
  {
    id: 'j-4',
    name: 'Jonas Pratt',
    outlet: 'Gadgetwell',
    beats: ['Gadgets', 'Brand strategy'],
    location: 'Berlin, DE',
    matchScore: 84,
    email: 'jonas@gadgetwell.example',
    recentArticles: [{ title: 'Nuvera’s transparency is a case study', date: '15m ago' }],
    aiInsight: 'Already framing your response positively. A short on-record quote could extend a favorable story.',
    avatarHue: 268,
  },
  {
    id: 'j-5',
    name: 'Wren Doyle',
    outlet: 'AudioFile',
    beats: ['Podcast', 'Industry analysis'],
    location: 'Austin, US',
    matchScore: 79,
    email: 'wren@audiofile.example',
    recentArticles: [{ title: 'Ep.142 — Anatomy of a recall-free response', date: '7h ago' }],
    aiInsight: 'Podcast reach skews to enthusiasts. Good for a longer-form founder conversation, not a quick reactive quote.',
    status: 'optedout',
    avatarHue: 152,
  },
];

// ---- Kanban actions ----
export const actions: ActionCard[] = [
  {
    id: 'ac-1',
    title: 'Publish Aria 2 firmware-fix statement',
    stage: 'proposed',
    owner: 'Mara V.',
    due: 'Today',
    linkedWarningId: 'w-1',
    comments: 3,
    fromAI: true,
  },
  {
    id: 'ac-2',
    title: 'Pitch Sound & Vision spatial-audio exclusive',
    stage: 'proposed',
    owner: 'Mara V.',
    due: 'Wed',
    linkedWarningId: 'w-1',
    comments: 1,
  },
  {
    id: 'ac-3',
    title: 'Brief support on replacement messaging',
    stage: 'in_progress',
    owner: 'Diego R.',
    due: 'Today',
    linkedWarningId: 'w-1',
    comments: 5,
  },
  {
    id: 'ac-4',
    title: 'Prepare Halden comparison holding line',
    stage: 'in_progress',
    owner: 'Mara V.',
    due: 'Thu',
    linkedWarningId: 'w-2',
    comments: 2,
    blocked: true,
  },
  {
    id: 'ac-5',
    title: 'Coordinate firmware release notes with eng',
    stage: 'shipped',
    owner: 'Diego R.',
    due: 'Yesterday',
    comments: 4,
    whatWeDid: 'Aligned PR statement with engineering’s 1.4.2 release notes and a named affected batch (Q1 cells).',
    whatChanged: 'Removed ambiguity that was fueling speculation; gave journalists a concrete date to anchor to.',
    learnings: 'Naming the batch early cut “is my unit affected?” replies by ~60%.',
  },
  {
    id: 'ac-6',
    title: 'Reddit AMA-style support thread',
    stage: 'measured',
    owner: 'Diego R.',
    due: 'Last week',
    comments: 8,
    whatWeDid: 'Ran a transparent support thread offering no-questions replacements.',
    whatChanged: 'Flipped the top community thread from critical to supportive.',
    learnings: 'Community goodwill outperformed any paid response.',
    roi: '+11 pts sentiment in r/headphones · est. $42k earned AVE',
  },
  {
    id: 'ac-7',
    title: 'Amplify “best spatial audio” reviews',
    stage: 'measured',
    owner: 'Mara V.',
    due: 'Last week',
    comments: 2,
    whatWeDid: 'Quote-shared Sound & Vision’s hands-on across owned channels.',
    whatChanged: 'Re-centered the conversation on product strength during the dip.',
    learnings: 'Strength-led messaging during a crisis steadies sentiment faster than defense.',
    roi: '+6% share of voice · 2.1M reach',
  },
];

// ---- Team ----
export const team: TeamMember[] = [
  { id: 't-1', name: 'Mara V.', role: 'pr', presence: 'online', activity: 'Drafting the firmware statement', hue: 348 },
  { id: 't-2', name: 'Diego R.', role: 'analyst', presence: 'online', activity: 'Triaging the battery spike', hue: 188 },
  { id: 't-3', name: 'Iris K.', role: 'manager', presence: 'away', activity: 'Reviewing ROI for board prep', hue: 268 },
  { id: 't-4', name: 'Sam O.', role: 'analyst', presence: 'offline', activity: 'Last active 3h ago', hue: 28 },
];

// ---- Watching rail (saved searches + what just moved) ----
export const watching = [
  { id: 'wch-1', label: 'Aria 2 · battery', count: 412, delta: 312, severity: 'critical' as const, changed: true },
  { id: 'wch-2', label: 'Nuvera · brand', count: 1840, delta: 24, severity: 'medium' as const, changed: true },
  { id: 'wch-3', label: 'Halden · competitor', count: 296, delta: 88, severity: 'high' as const, changed: true },
  { id: 'wch-4', label: 'Spatial audio · category', count: 530, delta: -4, severity: 'low' as const, changed: false },
  { id: 'wch-5', label: 'Founder mentions', count: 38, delta: 0, severity: 'low' as const, changed: false },
];

export const usage = {
  queries: { used: 1840, limit: 2500 },
  seats: { used: 6, limit: 8 },
  mentions: { used: 218000, limit: 250000 },
};

export const getMentions = (ids: string[]) => mentions.filter((m) => ids.includes(m.id));
