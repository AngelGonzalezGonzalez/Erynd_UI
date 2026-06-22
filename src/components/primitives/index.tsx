import React, { useState, useId } from 'react';
import type { Severity, Sentiment } from '../../lib/types';
import s from './primitives.module.css';

/* ---------------- Button ---------------- */
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger';
export function Button({
  variant = 'secondary',
  size,
  className = '',
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant;
  size?: 'sm' | 'lg';
}) {
  const sz = size === 'sm' ? s.sm : size === 'lg' ? s.lg : '';
  return (
    <button className={`${s.btn} ${s[variant]} ${sz} ${className}`} {...rest}>
      {children}
    </button>
  );
}

/* ---------------- Card ---------------- */
export function Card({
  raised,
  interactive,
  className = '',
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { raised?: boolean; interactive?: boolean }) {
  return (
    <div
      className={`${s.card} ${raised ? s.cardRaised : ''} ${interactive ? s.interactive : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ---------------- Pill ---------------- */
export function Pill({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span className={s.pill} style={style}>
      {children}
    </span>
  );
}

/* --------- Severity / Sentiment badge (color + shape + label) --------- */
const sevShape: Record<Severity, React.ReactNode> = {
  critical: (
    <svg width="11" height="11" viewBox="0 0 12 12" className={s.sevShape} aria-hidden>
      <path d="M6 1 11 11 1 11Z" fill="currentColor" />
    </svg>
  ),
  high: (
    <svg width="11" height="11" viewBox="0 0 12 12" className={s.sevShape} aria-hidden>
      <path d="M6 1 11 6 6 11 1 6Z" fill="currentColor" />
    </svg>
  ),
  medium: (
    <svg width="11" height="11" viewBox="0 0 12 12" className={s.sevShape} aria-hidden>
      <circle cx="6" cy="6" r="4.5" fill="currentColor" />
    </svg>
  ),
  low: (
    <svg width="11" height="11" viewBox="0 0 12 12" className={s.sevShape} aria-hidden>
      <rect x="1.5" y="5" width="9" height="2.4" rx="1.2" fill="currentColor" />
    </svg>
  ),
};
const sevColor: Record<Severity, [string, string]> = {
  critical: ['var(--sev-critical)', 'var(--sev-critical-bg)'],
  high: ['var(--sev-high)', 'var(--sev-high-bg)'],
  medium: ['var(--sev-medium)', 'var(--sev-medium-bg)'],
  low: ['var(--sev-low)', 'var(--sev-low-bg)'],
};
export function SeverityBadge({ severity, label }: { severity: Severity; label?: string }) {
  const [c, bg] = sevColor[severity];
  return (
    <span className={s.sev} style={{ color: c, background: bg }}>
      {sevShape[severity]}
      {label ?? severity}
    </span>
  );
}

const sentMeta: Record<Sentiment, { shape: React.ReactNode; color: string; bg: string; label: string }> = {
  positive: {
    shape: (
      <svg width="10" height="10" viewBox="0 0 12 12" className={s.sevShape} aria-hidden>
        <path d="M6 2 10 9 2 9Z" fill="currentColor" />
      </svg>
    ),
    color: 'var(--pos)',
    bg: 'var(--pos-bg)',
    label: 'Positive',
  },
  neutral: {
    shape: (
      <svg width="10" height="10" viewBox="0 0 12 12" className={s.sevShape} aria-hidden>
        <rect x="2" y="5" width="8" height="2" rx="1" fill="currentColor" />
      </svg>
    ),
    color: 'var(--neu)',
    bg: 'var(--neu-bg)',
    label: 'Neutral',
  },
  negative: {
    shape: (
      <svg width="10" height="10" viewBox="0 0 12 12" className={s.sevShape} aria-hidden>
        <path d="M6 10 2 3 10 3Z" fill="currentColor" />
      </svg>
    ),
    color: 'var(--neg)',
    bg: 'var(--neg-bg)',
    label: 'Negative',
  },
};
export function SentimentBadge({ sentiment, label }: { sentiment: Sentiment; label?: string }) {
  const m = sentMeta[sentiment];
  return (
    <span className={s.sev} style={{ color: m.color, background: m.bg }}>
      {m.shape}
      {label ?? m.label}
    </span>
  );
}

/* ---------------- Aperture mark (the ERYND logo motif) ---------------- */
export function Aperture({ size = 24, spin, className = '' }: { size?: number; spin?: boolean; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={`${s.aperture} ${spin ? s.apertureSpin : ''} ${className}`}
      aria-hidden
    >
      <g transform="rotate(28 100 100)" fill="none" stroke="currentColor" strokeWidth={13} strokeLinecap="round">
        <path d="M73.3 26.7 A78 78 0 1 1 73.3 173.3" />
        <path d="M126.7 173.3 A78 78 0 1 1 126.7 26.7" />
      </g>
      <circle cx="100" cy="100" r="45" fill="none" stroke="currentColor" strokeWidth={1} />
      <circle cx="100" cy="100" r="33" fill="none" stroke="currentColor" strokeWidth={1} />
      <circle cx="100" cy="100" r="22" fill="none" stroke="currentColor" strokeWidth={1} />
      <circle cx="100" cy="100" r="9" fill="currentColor" />
      <circle cx="100" cy="55" r="2.4" fill="currentColor" />
      <circle cx="145" cy="100" r="2.4" fill="currentColor" />
      <circle cx="100" cy="145" r="2.4" fill="currentColor" />
      <circle cx="55" cy="100" r="2.4" fill="currentColor" />
    </svg>
  );
}

/* ---------------- Skeleton ---------------- */
export function Skeleton({ w = '100%', h = 14, r, style }: { w?: number | string; h?: number | string; r?: number; style?: React.CSSProperties }) {
  return <div className={s.skeleton} style={{ width: w, height: h, borderRadius: r, ...style }} />;
}

/* ---------------- Empty / Error states ---------------- */
export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className={s.stateWrap}>
      <Aperture size={42} className={s.stateIcon} />
      <div className={s.stateTitle}>{title}</div>
      <div className={s.stateBody}>{body}</div>
      {action}
    </div>
  );
}
export function ErrorState({ title, body, onRetry, retryLabel }: { title: string; body: string; onRetry?: () => void; retryLabel?: string }) {
  return (
    <div className={s.stateWrap}>
      <svg viewBox="0 0 24 24" className={s.stateIcon} width={42} height={42} aria-hidden>
        <path d="M12 3 22 20H2L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M12 9.5V14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="12" cy="17" r="1.1" fill="currentColor" />
      </svg>
      <div className={s.stateTitle}>{title}</div>
      <div className={s.stateBody}>{body}</div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {retryLabel ?? 'Try again'}
        </Button>
      )}
    </div>
  );
}

/* ---------------- Tooltip (glossary helper) ---------------- */
export function Tooltip({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className={s.tooltip}>
      <button
        type="button"
        className={s.tooltipDot}
        aria-describedby={id}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        ?
      </button>
      {open && (
        <span role="tooltip" id={id} className={s.tooltipBubble}>
          {label}
        </span>
      )}
    </span>
  );
}

/* ---------------- Avatar ---------------- */
export function Avatar({ name, hue, size = 30, presence }: { name: string; hue: number; size?: number; presence?: 'online' | 'away' | 'offline' }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
  return (
    <span
      className={s.avatar}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: `linear-gradient(140deg, hsl(${hue} 55% 42%), hsl(${hue} 60% 30%))`,
      }}
    >
      {initials}
      {presence && <span className={`${s.presence} ${s[presence]}`} />}
    </span>
  );
}

/* ---------------- Stat ---------------- */
export function Stat({ num, label }: { num: React.ReactNode; label: string }) {
  return (
    <div>
      <div className={s.statNum}>{num}</div>
      <div className={s.statLabel}>{label}</div>
    </div>
  );
}

/* ---------------- Delta ---------------- */
export function Delta({ value, suffix = '%' }: { value: number; suffix?: string }) {
  const cls = value > 0 ? s.deltaUp : value < 0 ? s.deltaDown : s.deltaFlat;
  const sign = value > 0 ? '↑' : value < 0 ? '↓' : '→';
  return (
    <span className={`${s.delta} ${cls}`}>
      {sign} {Math.abs(value)}
      {suffix}
    </span>
  );
}

export const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `${n}`;
