import { useState } from 'react';
import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import { mentions } from '../../data/mockData';
import { Button, Pill, SentimentBadge } from '../primitives';
import { ArtifactProps } from './shared';
import a from './artifacts.module.css';

type Mode = 'ai' | 'simple' | 'advanced';

const filterGroups: { key: string; opts: string[] }[] = [
  { key: 'srch.filter.emotion', opts: ['Anger', 'Joy', 'Concern'] },
  { key: 'srch.filter.influence', opts: ['Tier 1', 'Tier 2', 'Long tail'] },
  { key: 'srch.filter.source', opts: ['News', 'Social', 'Forums', 'Podcasts'] },
  { key: 'srch.filter.content', opts: ['Text', 'Video', 'Image'] },
  { key: 'srch.filter.geo', opts: ['US', 'EU', 'LATAM'] },
];

export function SearchBuilder({ full, state }: ArtifactProps) {
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>('ai');
  const [nl, setNl] = useState('');
  const [query, setQuery] = useState('"Aria 2" AND (battery OR "battery life") NOT charger');
  const [active, setActive] = useState<string[]>(['Tier 1', 'Social']);
  const [saved, setSaved] = useState(false);
  const addLedger = useStore((s) => s.addLedger);
  const pushToast = useStore((s) => s.pushToast);

  if (state === 'empty') return <div className={a.body}><div className={a.itemSub}>{t('srch.zero')}</div></div>;

  const invalid = query.includes('((') ; // demo: unbalanced parens
  const broad = query.trim().length > 0 && query.split(/\s+/).length <= 2;
  const results = mentions.filter((m) => /aria|battery/i.test(m.text)).slice(0, full ? 6 : 3);

  const draftFromNL = () => {
    setQuery('"Aria 2" AND ("battery life" OR "dies fast" OR "no aguanta") NOT charger');
    setMode('advanced');
    pushToast('Drafted a query from your description');
  };
  const toggle = (o: string) => setActive((s) => (s.includes(o) ? s.filter((x) => x !== o) : [...s, o]));
  const save = () => {
    setSaved(true);
    const id = addLedger({ kind: 'acted', label: 'Saved search + alert', detail: 'Aria 2 · battery — alert on spike', status: 'done' });
    pushToast(t('srch.saved'), id);
  };

  return (
    <div className={a.body}>
      <div className={a.segmented}>
        {(['ai', 'simple', 'advanced'] as Mode[]).map((m) => (
          <button key={m} className={`${a.segBtn} ${mode === m ? a.segActive : ''}`} onClick={() => setMode(m)}>
            {m === 'ai' ? t('srch.ai') : m === 'simple' ? t('srch.simple') : t('srch.advanced')}
          </button>
        ))}
      </div>

      {mode === 'ai' && (
        <div>
          <label className={a.label}>{t('srch.ai')}</label>
          <input className={a.field} placeholder={t('srch.aiPlaceholder')} value={nl} onChange={(e) => setNl(e.target.value)} />
          <div style={{ marginTop: 'var(--sp-2)' }}>
            <Button variant="accent" size="sm" onClick={draftFromNL}>◎ {t('srch.aiDraft')}</Button>
          </div>
        </div>
      )}

      {(mode === 'advanced' || mode === 'simple') && (
        <div>
          <label className={a.label}>{mode === 'advanced' ? t('srch.advanced') : t('srch.simple')}</label>
          <input className={a.field} value={query} onChange={(e) => setQuery(e.target.value)} style={{ fontFamily: mode === 'advanced' ? 'var(--mono)' : undefined, fontSize: mode === 'advanced' ? 'var(--fs-sm)' : undefined }} />
          <div style={{ marginTop: 'var(--sp-2)', fontSize: 'var(--fs-xs)' }}>
            {invalid ? (
              <span style={{ color: 'var(--neg)' }}>✕ {t('srch.invalid')}</span>
            ) : broad ? (
              <span style={{ color: 'var(--sev-medium)' }}>⚠ {t('srch.broad')}</span>
            ) : (
              <span style={{ color: 'var(--pos)' }}>✓ {t('srch.valid')} · {t('srch.preview')} ~412 {t('srch.perDay')}</span>
            )}
          </div>
        </div>
      )}

      {full && (
        <div>
          <div className={a.sectionLabel}>{t('srch.filters')}</div>
          {filterGroups.map((g) => (
            <div key={g.key} style={{ marginBottom: 'var(--sp-2)' }}>
              <div className={a.label}>{t(g.key)}</div>
              <div className={a.chips}>
                {g.opts.map((o) => (
                  <button key={o} className={`${a.chip} ${active.includes(o) ? a.chipActive : ''}`} onClick={() => toggle(o)}>{o}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <div className={a.sectionLabel}>{t('srch.results')} · {results.length}</div>
        <div className={a.list}>
          {results.map((m) => (
            <div className={a.mention} key={m.id}>
              <div className={a.mentionHead}>
                <span className={a.mentionAuthor}>{m.author}</span>
                <Pill>{m.outlet}</Pill>
                <SentimentBadge sentiment={m.sentiment} />
              </div>
              <div className={a.mentionText}>{m.text}</div>
            </div>
          ))}
        </div>
      </div>

      {saved ? (
        <div className={a.success}>✓ {t('srch.saved')}</div>
      ) : (
        <div>
          <div className={a.grid2}>
            <input className={a.field} placeholder={t('srch.saveName')} defaultValue="Aria 2 · battery" />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--fs-sm)' }}>
              <input type="checkbox" defaultChecked /> {t('srch.saveAlert')}
            </label>
          </div>
          <div className={a.actions} style={{ marginTop: 'var(--sp-3)' }}>
            <Button variant="primary" size="sm" onClick={save} disabled={invalid}>{t('common.save')}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
