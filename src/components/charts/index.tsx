import type { SeriesPoint, CompetitorShare, RadarAxis } from '../../lib/types';
import c from './charts.module.css';

/* ---------------- Sparkline ---------------- */
export function Sparkline({ data, color = 'var(--accent)', w = 120, h = 30 }: { data: number[]; color?: string; w?: number; h?: number }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const span = max - min || 1;
  const step = w / (data.length - 1 || 1);
  const pts = data.map((v, i) => [i * step, h - ((v - min) / span) * h]);
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={c.spark} style={{ maxWidth: w }} aria-hidden>
      <path d={`${d} L${w} ${h} L0 ${h} Z`} fill={color} opacity={0.12} />
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={2.6} fill={color} />
    </svg>
  );
}

/* ---------------- Sentiment line (clickable) ---------------- */
export function SentimentTrend({ data, onPick }: { data: SeriesPoint[]; onPick?: (p: SeriesPoint) => void }) {
  const W = 340;
  const H = 140;
  const pad = { l: 8, r: 8, t: 14, b: 22 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const max = 100;
  const step = iw / (data.length - 1 || 1);
  const xy = data.map((p, i) => [pad.l + i * step, pad.t + ih - (p.value / max) * ih]);
  const line = xy.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={c.chart} role="img" aria-label="Sentiment over time">
      {[0, 50, 100].map((g) => {
        const y = pad.t + ih - (g / max) * ih;
        return <line key={g} x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="var(--border)" strokeWidth={1} strokeDasharray="2 3" />;
      })}
      <path d={`${line} L${xy[xy.length - 1][0]} ${pad.t + ih} L${xy[0][0]} ${pad.t + ih} Z`} fill="var(--accent)" opacity={0.1} />
      <path d={line} fill="none" stroke="var(--accent)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((p, i) => (
        <g key={p.label}>
          <title>{p.label}: {p.value} — click to read the mentions behind it</title>
          <circle className={c.point} cx={xy[i][0]} cy={xy[i][1]} r={3.6} fill="var(--accent)" stroke="var(--surface)" strokeWidth={1.5} onClick={() => onPick?.(p)} />
          <circle className={c.pointHit} cx={xy[i][0]} cy={xy[i][1]} r={14} onClick={() => onPick?.(p)} />
          <text className={c.axisLabel} x={xy[i][0]} y={H - 6} textAnchor="middle">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

/* ---------------- Bar series (clickable) ---------------- */
export function BarSeries({ data, onPick, unit = '' }: { data: SeriesPoint[]; onPick?: (p: SeriesPoint) => void; unit?: string }) {
  const W = 340;
  const H = 140;
  const pad = { l: 8, r: 8, t: 16, b: 22 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const max = Math.max(...data.map((d) => d.value), 1);
  const bw = (iw / data.length) * 0.56;
  const gap = iw / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={c.chart} role="img" aria-label="Bar series">
      {data.map((p, i) => {
        const bh = (p.value / max) * ih;
        const x = pad.l + i * gap + (gap - bw) / 2;
        const y = pad.t + ih - bh;
        return (
          <g key={p.label} onClick={() => onPick?.(p)}>
            <title>{p.label}: {p.value}{unit} — click to read the mentions behind it</title>
            <rect className={c.barTrack} x={x} y={pad.t} width={bw} height={ih} rx={4} />
            <rect className={c.bar} x={x} y={y} width={bw} height={bh} rx={4} fill="var(--accent)" />
            <text className={c.valueLabel} x={x + bw / 2} y={y - 4} textAnchor="middle">{p.value}{unit}</text>
            <text className={c.axisLabel} x={x + bw / 2} y={H - 6} textAnchor="middle">{p.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------------- Share of voice (horizontal, clickable) ---------------- */
export function ShareOfVoice({ data, onPick }: { data: CompetitorShare[]; onPick?: (d: CompetitorShare) => void }) {
  const max = Math.max(...data.map((d) => d.share), 1);
  return (
    <div>
      {data.map((d) => (
        <div className={c.sovRow} key={d.name}>
          <span className={c.sovName}>
            <span className={c.dot} style={{ background: d.isUs ? 'var(--accent)' : 'var(--neu)' }} />
            <strong style={{ fontWeight: d.isUs ? 700 : 500 }}>{d.name}</strong>
          </span>
          <span className={c.sovBarWrap} onClick={() => onPick?.(d)} role="button" tabIndex={0} title={`${d.name}: ${d.share}%${onPick ? ' — click to read the mentions behind it' : ''}`} aria-label={`${d.name}: ${d.share}%`}>
            <span
              className={c.sovBar}
              style={{ width: `${(d.share / max) * 100}%`, background: d.isUs ? 'var(--accent)' : 'var(--border-strong)' }}
            />
          </span>
          <span className={c.sovPct}>
            {d.share}% <span style={{ color: d.delta >= 0 ? 'var(--pos)' : 'var(--neg)' }}>{d.delta >= 0 ? '+' : ''}{d.delta}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Competitive radar ---------------- */
export function CompetitiveRadar({ data, usLabel = 'Us', themLabel = 'Field' }: { data: RadarAxis[]; usLabel?: string; themLabel?: string }) {
  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 34;
  const n = data.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const poly = (key: 'us' | 'them') =>
    data
      .map((d, i) => {
        const v = d[key] / 100;
        return `${(cx + Math.cos(angle(i)) * r * v).toFixed(1)},${(cy + Math.sin(angle(i)) * r * v).toFixed(1)}`;
      })
      .join(' ');
  return (
    <div>
      <svg viewBox={`0 0 ${size} ${size}`} className={c.chart} style={{ maxWidth: 280, margin: '0 auto' }} role="img" aria-label="Competitive radar">
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <polygon
            key={g}
            points={data.map((_, i) => `${(cx + Math.cos(angle(i)) * r * g).toFixed(1)},${(cy + Math.sin(angle(i)) * r * g).toFixed(1)}`).join(' ')}
            fill="none"
            stroke="var(--border)"
            strokeWidth={1}
          />
        ))}
        <polygon points={poly('them')} fill="var(--neu)" opacity={0.18} stroke="var(--neu)" strokeWidth={1.5} />
        <polygon points={poly('us')} fill="var(--accent)" opacity={0.22} stroke="var(--accent)" strokeWidth={2} />
        {data.map((d, i) => (
          <text key={d.axis} className={c.axisLabel} x={cx + Math.cos(angle(i)) * (r + 16)} y={cy + Math.sin(angle(i)) * (r + 16) + 3} textAnchor="middle">
            {d.axis}
          </text>
        ))}
      </svg>
      <div className={c.legend}>
        <span className={c.legendItem}><span className={c.dot} style={{ background: 'var(--accent)' }} /> {usLabel}</span>
        <span className={c.legendItem}><span className={c.dot} style={{ background: 'var(--neu)' }} /> {themLabel}</span>
      </div>
    </div>
  );
}

/* ---------------- Health gauge (donut) ---------------- */
export function HealthGauge({ score, delta }: { score: number; delta: number }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - score / 100);
  return (
    <div className={c.gaugeWrap}>
      <svg viewBox="0 0 90 90" width={90} height={90} aria-hidden>
        <circle cx="45" cy="45" r={r} fill="none" stroke="var(--hover)" strokeWidth={9} />
        <circle
          cx="45" cy="45" r={r} fill="none"
          stroke="var(--accent)" strokeWidth={9} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={off}
          transform="rotate(-90 45 45)"
        />
      </svg>
      <div>
        <div className={c.gaugeNum}>{score}</div>
        <div style={{ color: delta >= 0 ? 'var(--pos)' : 'var(--neg)', fontFamily: 'var(--mono)', fontSize: 'var(--fs-mono)' }}>
          {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)} pts
        </div>
      </div>
    </div>
  );
}
