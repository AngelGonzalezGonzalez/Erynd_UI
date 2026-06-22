import { useState } from 'react';
import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import { Button } from '../primitives';
import { ArtifactProps } from './shared';
import a from './artifacts.module.css';

const platforms = [
  { id: 'x', label: 'X', limit: 280 },
  { id: 'in', label: 'IN', limit: 3000 },
  { id: 'ig', label: 'IG', limit: 2200 },
  { id: 'th', label: 'TH', limit: 500 },
];

export function SocialPublisher({ full, state }: ArtifactProps) {
  const { t } = useI18n();
  const [on, setOn] = useState<string[]>(['x', 'in']);
  const [text, setText] = useState('Battery longevity matters — so we’re fixing it in days, not seasons. Aria 2 firmware 1.4.2 ships Thursday; affected units get a no-questions replacement starting today. Details ↓');
  const [status, setStatus] = useState<'idle' | 'queued' | 'publishing' | 'published'>('idle');
  const addLedger = useStore((s) => s.addLedger);
  const pushToast = useStore((s) => s.pushToast);

  if (state === 'empty') return <div className={a.body}><div className={a.itemSub}>{t('pub.empty')}</div></div>;

  const toggle = (id: string) => setOn((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const overLimit = platforms.filter((p) => on.includes(p.id) && text.length > p.limit);

  const schedule = () => {
    setStatus('queued');
    const id = addLedger({ kind: 'queued', label: 'Post queued for approval', detail: `${on.join(', ').toUpperCase()} · best time 6:10pm`, outbound: true, status: 'pending_approval' });
    pushToast(`${t('pub.queue')}: ${t('pub.bestTime')} 6:10pm`, id);
    window.setTimeout(() => setStatus('publishing'), 1400);
    window.setTimeout(() => setStatus('published'), 2800);
  };

  return (
    <div className={a.body}>
      <div>
        <div className={a.sectionLabel}>{t('pub.platforms')}</div>
        <div className={a.platformToggle}>
          {platforms.map((p) => (
            <button key={p.id} className={`${a.platBtn} ${on.includes(p.id) ? a.platOn : ''}`} onClick={() => toggle(p.id)}>{p.label}</button>
          ))}
        </div>
      </div>

      <div>
        <label className={a.label}>{t('pub.compose')}</label>
        <textarea className={`${a.field} ${a.textarea}`} value={text} onChange={(e) => setText(e.target.value)} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 'var(--fs-xs)' }}>
          <span className={a.faint}>{text.length} chars</span>
          {overLimit.length > 0 && <span style={{ color: 'var(--neg)' }}>{text.length - Math.min(...overLimit.map((p) => p.limit))} {t('pub.limit')} {overLimit.map((p) => p.label).join(', ')}</span>}
        </div>
        <div className={a.actions} style={{ marginTop: 'var(--sp-2)' }}>
          <Button variant="ghost" size="sm" onClick={() => pushToast('Copy tightened by the assistant')}>◎ {t('pub.aiAssist')}</Button>
          <Button variant="ghost" size="sm" onClick={() => setText((x) => x + ' #Aria2 #NuveraSound')}>◎ {t('pub.hashtags')}</Button>
        </div>
      </div>

      <div className={a.panel}>
        <div className={a.kv}><span className={a.muted}>◎ {t('pub.bestTime')}</span><span style={{ color: 'var(--accent)' }}>Today 6:10pm · +18% est. reach</span></div>
        {full && <div className={a.kv}><span className={a.muted}>{t('pub.performance')} (last post)</span><span>2.1M {t('common.reach')} · 4.8% eng.</span></div>}
      </div>

      <div className={a.gate}><span className={a.gateIcon}>🔒</span><span>{t('pub.gate')}</span></div>

      {status === 'idle' ? (
        <div className={a.actions}>
          <Button variant="primary" size="sm" onClick={schedule} disabled={overLimit.length > 0 || on.length === 0}>{t('common.approve')} · {t('pub.schedule')}</Button>
          <Button variant="secondary" size="sm" onClick={schedule} disabled={overLimit.length > 0 || on.length === 0}>{t('pub.publishNow')}</Button>
        </div>
      ) : (
        <div>
          <div className={a.pipeline}>
            <span className={`${a.pipeStep} ${status === 'queued' ? a.pipeActive : ''}`}>{t('pub.queue')}</span>
            <span className={a.pipeArrow}>→</span>
            <span className={`${a.pipeStep} ${status === 'publishing' ? a.pipeActive : ''}`}>{t('pub.publishing')}</span>
            <span className={a.pipeArrow}>→</span>
            <span className={`${a.pipeStep} ${status === 'published' ? a.pipeActive : ''}`}>{t('pub.published')}</span>
          </div>
          {status === 'published' && <div className={a.success} style={{ marginTop: 'var(--sp-2)' }}>✓ {t('pub.published')} · {on.length} {t('pub.platforms').toLowerCase()}</div>}
        </div>
      )}
    </div>
  );
}
