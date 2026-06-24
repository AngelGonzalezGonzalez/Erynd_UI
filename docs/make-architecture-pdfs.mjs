import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;

/* ---------- shared professional styling ---------- */
const C = {
  ink: '#16202c', muted: '#5b6b7a', line: '#d4dbe2', wire: '#94a3b8',
  zone: '#f6f8fa', zoneline: '#cdd6df', bg: '#ffffff',
  client: '#2563eb', app: '#0f766e', data: '#15803d', ext: '#7c3aed', warn: '#b45309',
};
const W = 1123, H = 794;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function node({ x, y, w = 196, h = 92, kind = 'app', role = '', title = '', desc = '', host = '', hostC = '#334155' }) {
  const color = C[kind] ?? C.app;
  const lines = wrap(desc, 30);
  const descSvg = lines
    .map((l, i) => `<text x="${x + 14}" y="${y + 60 + i * 14}" font-size="11" fill="${C.muted}">${esc(l)}</text>`)
    .join('');
  let hostTag = '';
  if (host) {
    const tw = host.length * 5.7 + 18;
    hostTag = `<rect x="${x + w - 12 - tw}" y="${y + 13}" width="${tw}" height="17" rx="8.5" fill="${hostC}1f" stroke="${hostC}" stroke-opacity=".45"/>
      <text x="${x + w - 12 - tw / 2}" y="${y + 25}" font-size="9.5" fill="${hostC}" font-weight="700" text-anchor="middle">${esc(host)}</text>`;
  }
  return `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="11" fill="#fff" stroke="${C.line}" stroke-width="1.5"/>
    <rect x="${x}" y="${y}" width="${w}" height="5" rx="2.5" fill="${color}"/>
    <text x="${x + 14}" y="${y + 25}" font-size="10" letter-spacing=".6" fill="${C.muted}" font-weight="600">${esc(role.toUpperCase())}</text>
    <text x="${x + 14}" y="${y + 44}" font-size="14.5" fill="${C.ink}" font-weight="700">${esc(title)}</text>
    ${descSvg}${hostTag}
  </g>`;
}

function zone({ x, y, w, h, label, dashed = false, right = false, bottom = false }) {
  const lx = right ? x + w - 16 : x + 16;
  const anc = right ? 'end' : 'start';
  const ly = bottom ? y + h - 14 : y + 22;
  return `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${C.zone}" stroke="${C.zoneline}" stroke-width="1.5" ${dashed ? 'stroke-dasharray="7 5"' : ''}/>
    <text x="${lx}" y="${ly}" text-anchor="${anc}" font-size="11.5" letter-spacing=".5" fill="${C.muted}" font-weight="700">${esc(label.toUpperCase())}</text>
  </g>`;
}

// straight or elbow arrow; pts = [[x,y],...]; n = optional step number badge at midpoint
function arrow(pts, { label = '', n = null, dashed = false, color = C.wire, back = false } = {}) {
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
  const mid = pts[Math.floor((pts.length - 1) / 2)];
  const end = pts[pts.length - 1];
  const a = pts[pts.length - 2];
  // midpoint between last two for label position
  const lx = (a[0] + end[0]) / 2, ly = (a[1] + end[1]) / 2;
  const marker = back ? 'url(#arrB)' : 'url(#arr)';
  let badge = '';
  if (n != null) {
    badge = `<circle cx="${mid[0]}" cy="${mid[1]}" r="11" fill="${color}"/>
      <text x="${mid[0]}" y="${mid[1] + 4}" font-size="12" fill="#fff" font-weight="700" text-anchor="middle">${n}</text>`;
  }
  let lab = '';
  if (label) {
    const wpx = label.length * 6.2 + 14;
    lab = `<g>
      <rect x="${lx - wpx / 2}" y="${ly - 11}" width="${wpx}" height="20" rx="6" fill="#fff" stroke="${C.line}"/>
      <text x="${lx}" y="${ly + 3}" font-size="11" fill="${C.muted}" text-anchor="middle">${esc(label)}</text></g>`;
  }
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="2" ${dashed ? 'stroke-dasharray="6 5"' : ''} marker-end="${marker}"/>${lab}${badge}`;
}

function wrap(s, n) {
  if (!s) return [];
  const words = s.split(' ');
  const out = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > n) { out.push(line.trim()); line = w; }
    else line += ' ' + w;
  }
  if (line.trim()) out.push(line.trim());
  return out.slice(0, 3);
}

const defs = `<defs>
  <marker id="arr" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="userSpaceOnUse">
    <path d="M0,0 L8,3 L0,6 Z" fill="${C.wire}"/></marker>
  <marker id="arrB" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="userSpaceOnUse">
    <path d="M0,0 L8,3 L0,6 Z" fill="${C.wire}"/></marker>
</defs>`;

function frame(titleNo, title, subtitle, inner, legendItems) {
  const legend = legendItems
    .map((l, i) => `<g transform="translate(${760 + (i % 1) * 0},${72 + i * 20})">
      <rect x="0" y="-10" width="13" height="13" rx="3" fill="#fff" stroke="${l.c}" stroke-width="2"/>
      <text x="20" y="1" font-size="11.5" fill="${C.muted}">${esc(l.t)}</text></g>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" font-family="Segoe UI, Helvetica, Arial, sans-serif">
    <rect width="${W}" height="${H}" fill="${C.bg}"/>
    ${defs}
    <text x="40" y="50" font-size="13" fill="${C.app}" font-weight="700" letter-spacing="1">ERYND · SYSTEM ARCHITECTURE</text>
    <text x="40" y="80" font-size="24" fill="${C.ink}" font-weight="700">${esc(titleNo)} &nbsp;${esc(title)}</text>
    <text x="40" y="104" font-size="13" fill="${C.muted}">${esc(subtitle)}</text>
    ${legend}
    ${inner}
    <line x1="40" y1="754" x2="${W - 40}" y2="754" stroke="${C.line}"/>
    <text x="40" y="774" font-size="10.5" fill="${C.muted}">ERYND — internal architecture documentation · confidential</text>
    <text x="${W - 40}" y="774" font-size="10.5" fill="${C.muted}" text-anchor="end">Figure ${titleNo.replace('.', '')}</text>
  </svg>`;
}

/* ===================== DIAGRAM 1 — TODAY ===================== */
const d1 = (() => {
  const LOCAL = '#334155', CLOUD = C.ext;
  const Y = 250; // node row
  const browser = { x: 60, y: Y, kind: 'client', role: 'User', title: 'Web browser', desc: 'Opens localhost:5173, chats, reads answers.' };
  const fe = { x: 300, y: Y, kind: 'app', role: 'Frontend · React/Vite', title: 'Interface', desc: 'Draws every screen & chart. Holds no secrets.' };
  const be = { x: 555, y: Y, kind: 'app', role: 'Backend · Express', title: 'API / brain', desc: 'Orchestrates. Holds the secret AI key.' };
  const claude = { x: 880, y: Y, w: 200, kind: 'ext', role: 'Anthropic cloud', title: 'Claude Sonnet 4.6', desc: 'Writes the reply & picks the panel.' };
  const db = { x: 555, y: 470, kind: 'data', role: 'Storage · SQLite', title: 'Database', desc: 'One file: mentions, alerts, history.' };

  const inner = `
    ${zone({ x: 36, y: 175, w: 800, h: 410, label: 'Your computer (local machine)' })}
    ${zone({ x: 858, y: 215, w: 245, h: 165, label: 'Anthropic cloud · internet', dashed: true })}
    ${node(browser)}${node(fe)}${node(be)}${node(claude)}${node(db)}
    ${arrow([[256, 282], [300, 282]], { n: 1, color: C.client })}
    ${arrow([[496, 282], [555, 282]], { n: 2, color: C.app })}
    ${arrow([[751, 282], [880, 282]], { n: 3, color: C.app })}
    ${arrow([[880, 314], [751, 314]], { n: 4, color: C.ext, back: true })}
    ${arrow([[555, 314], [496, 314]], { n: 5, color: C.app, back: true })}
    ${arrow([[300, 314], [256, 314]], { n: 6, color: C.client, back: true })}
    ${arrow([[645, 342], [645, 470]], { label: 'read / write', color: C.data })}
    ${arrow([[665, 470], [665, 342]], { color: C.data, back: true })}
    <!-- where each component lives -->
    <g transform="translate(40,612)">
      <text x="0" y="0" font-size="12.5" font-weight="700" fill="${C.ink}">Where each component lives</text>
      <g transform="translate(0,18)">
        <rect x="0" y="0" width="13" height="13" rx="3" fill="${LOCAL}1f" stroke="${LOCAL}"/>
        <text x="20" y="11" font-size="11.5" fill="${C.muted}"><tspan font-weight="700" fill="${C.ink}">Your computer</tspan> — Browser, Frontend, Backend &amp; Database all run locally (npm run dev).</text>
      </g>
      <g transform="translate(0,38)">
        <rect x="0" y="0" width="13" height="13" rx="3" fill="${CLOUD}1f" stroke="${CLOUD}"/>
        <text x="20" y="11" font-size="11.5" fill="${C.muted}"><tspan font-weight="700" fill="${C.ink}">Anthropic cloud</tspan> — Claude Sonnet 4.6, reached over the internet with your API key.</text>
      </g>
      <g transform="translate(0,58)">
        <rect x="0" y="0" width="13" height="13" rx="3" fill="#11182710" stroke="#111827"/>
        <text x="20" y="11" font-size="11.5" fill="${C.muted}"><tspan font-weight="700" fill="${C.ink}">GitHub</tspan> — stores the source code, and serves the public <tspan font-style="italic">frontend-only</tspan> demo (GitHub Pages).</text>
      </g>
      <g transform="translate(0,78)">
        <rect x="0" y="0" width="13" height="13" rx="3" fill="#0f766e1f" stroke="#0f766e"/>
        <text x="20" y="11" font-size="11.5" fill="${C.muted}"><tspan font-weight="700" fill="${C.ink}">Claude Code cloud environment</tspan> — where this was built &amp; tested. Temporary; not where you run it.</text>
      </g>
    </g>
    <g transform="translate(720,612)">
      <rect x="0" y="0" width="363" height="110" rx="9" fill="#fff7ed" stroke="#f0d3a8"/>
      <text x="16" y="22" font-size="11.5" font-weight="700" fill="${C.warn}">Built-in safety net</text>
      <text x="16" y="42" font-size="11" fill="#7c5418">If the AI key is missing or the internet drops,</text>
      <text x="16" y="58" font-size="11" fill="#7c5418">the backend answers with canned responses —</text>
      <text x="16" y="74" font-size="11" fill="#7c5418">the app never just fails. This is also what the</text>
      <text x="16" y="90" font-size="11" fill="#7c5418">GitHub Pages demo uses (no backend, no key).</text>
    </g>`;

  return frame('1.', 'Today — local development', 'How a single message travels through the app, and where each part is hosted.', inner, [
    { c: C.client, t: 'User / browser' }, { c: C.app, t: 'Frontend / backend' },
    { c: C.data, t: 'Database' }, { c: C.ext, t: 'External AI' },
  ]);
})();

/* ===================== DIAGRAM 2 — PRODUCTION (layered top-down) ===================== */
const d2 = (() => {
  const customers = { x: 300, y: 124, w: 180, kind: 'client', role: 'Customers', title: 'Many browsers', desc: 'Visit app.yourcompany.com' };
  const proxy = { x: 255, y: 245, w: 470, kind: 'app', role: 'Edge · NEW', title: 'Reverse proxy + HTTPS', desc: 'Encryption, routing, abuse control.' };
  const fe = { x: 255, y: 370, w: 180, kind: 'app', role: 'Frontend', title: 'Interface (served)', desc: 'Pre-built React, delivered fast.' };
  const be = { x: 455, y: 370, w: 200, kind: 'app', role: 'Backend cluster · NEW', title: 'API · ×N copies', desc: 'Scale + uptime; login & billing.' };
  const workers = { x: 685, y: 370, w: 180, kind: 'app', role: 'Watch jobs · NEW', title: 'Background workers', desc: 'Scheduled mention pulls + alerts.' };
  const pg = { x: 455, y: 515, w: 200, kind: 'data', role: 'Data tier · UPGRADED', title: 'PostgreSQL', desc: 'Per-customer data, isolated.' };
  const backups = { x: 685, y: 515, w: 180, kind: 'data', role: 'NEW', title: 'Backups + monitoring', desc: 'Restore points, alerts, dashboards.' };
  const claude = { x: 925, y: 388, w: 165, kind: 'ext', role: 'External', title: 'Claude / Apify agent', desc: 'Intelligence (swappable).' };
  const apify = { x: 925, y: 515, w: 165, kind: 'ext', role: 'External · NEW', title: 'Apify data feeds', desc: 'Live social & news mentions.' };

  const inner = `
    ${zone({ x: 285, y: 109, w: 210, h: 118, label: 'Client' })}
    ${zone({ x: 235, y: 235, w: 650, h: 398, label: 'Infrastructure you own', dashed: true, bottom: true })}
    ${zone({ x: 905, y: 352, w: 195, h: 273, label: 'External services', right: true, bottom: true })}
    ${node(customers)}${node(proxy)}${node(fe)}${node(be)}${node(workers)}${node(pg)}${node(backups)}${node(claude)}${node(apify)}
    ${arrow([[390, 216], [390, 245]], { n: 1, label: 'HTTPS', color: C.client })}
    ${arrow([[345, 337], [345, 370]], { label: 'serve UI', color: C.app })}
    ${arrow([[555, 337], [555, 370]], { label: 'API', color: C.app })}
    ${arrow([[555, 462], [555, 515]], { label: 'read / write', color: C.data })}
    ${arrow([[555, 370], [555, 345], [1007, 345], [1007, 388]], { n: 2, label: 'generate', color: C.ext })}
    ${arrow([[735, 462], [735, 492], [635, 492], [635, 515]], { label: 'store', color: C.data })}
    ${arrow([[655, 561], [685, 561]], { label: 'back up', color: C.data })}
    ${arrow([[925, 561], [895, 561], [895, 416], [865, 416]], { n: 3, label: 'pull mentions', color: C.ext })}
    <g transform="translate(40,675)">
      <text x="0" y="0" font-size="12.5" font-weight="700" fill="${C.ink}">What changes from local → production</text>
      <text x="0" y="22" font-size="11.5" fill="${C.muted}">Adds: front door (HTTPS) · backend as several copies · SQLite → PostgreSQL · accounts &amp; billing · always-on watch workers · live data feeds · backups &amp; monitoring.</text>
      <text x="0" y="42" font-size="11.5" fill="${C.muted}">The core path — <tspan font-weight="700" fill="${C.ink}">Frontend → Backend → Database + AI</tspan> — is unchanged; production wraps a support cast around it, on infrastructure you own.</text>
    </g>`;

  return frame('2.', 'Production — SaaS on your own server', 'The same core, hardened to serve many paying customers reliably and 24/7.', inner, [
    { c: C.client, t: 'Customers' }, { c: C.app, t: 'App server' },
    { c: C.data, t: 'Data tier' }, { c: C.ext, t: 'External services' },
  ]);
})();

/* ---------- render ---------- */
const html = (svg) => `<!doctype html><html><head><meta charset="utf-8"><style>
  @page{size:A4 landscape;margin:0}
  html,body{margin:0;padding:0}
  svg{display:block;width:297mm;height:210mm}
</style></head><body>${svg}</body></html>`;

const targets = [
  { file: 'ERYND-architecture-1-today.pdf', svg: d1 },
  { file: 'ERYND-architecture-2-production.pdf', svg: d2 },
];

// Combined interactive HTML (both diagrams), matching the PDFs.
import { writeFileSync } from 'node:fs';
writeFileSync('/home/user/Erynd_UI/docs/architecture.html', `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>ERYND — Architecture</title>
<style>body{margin:0;background:#eef1f4;font-family:Segoe UI,Helvetica,Arial,sans-serif}
.page{max-width:1123px;margin:24px auto;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,.08);border-radius:8px;overflow:hidden}
svg{display:block;width:100%;height:auto}</style></head>
<body><div class="page">${d1}</div><div class="page">${d2}</div></body></html>`);

const browser = await chromium.launch();
const ctx = await browser.newContext();
for (const t of targets) {
  const p = await ctx.newPage();
  await p.setContent(html(t.svg), { waitUntil: 'networkidle' });
  await p.pdf({ path: `/home/user/Erynd_UI/docs/${t.file}`, landscape: true, printBackground: true, format: 'A4', margin: { top: '0', bottom: '0', left: '0', right: '0' } });
  await p.setViewportSize({ width: 1123, height: 794 });
  await p.screenshot({ path: `/tmp/claude-0/-home-user-Erynd-UI/1d2911a3-59be-55d8-9a6a-71acc4f1586c/scratchpad/${t.file}.png` });
  console.log('wrote', t.file);
  await p.close();
}
await browser.close();
