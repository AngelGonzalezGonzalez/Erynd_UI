import { useState } from 'react';
import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import { mentions } from '../../data/mockData';
import { Button, Pill, SentimentBadge, Tip } from '../primitives';
import { useAsyncAction } from '../../hooks/useAsyncAction';
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
  const [name, setName] = useState('Aria 2 · battery');
  const [alertOn, setAlertOn] = useState(true);
  const [saved, setSaved] = useState(false);
  const addLedger = useStore((s) => s.addLedger);

  // AI draft + save — brief processing, then a confirming toast.
  const draftQuery = useAsyncAction(
    () => { setQuery('"Aria 2" AND ("battery life" OR "dies fast" OR "no aguanta") NOT charger'); setMode('advanced'); },
    { successToast: t('toast.queryDrafted'), minMs: 800 }
  );
  const saveSearch = useAsyncAction(
    () => { setSaved(true); addLedger({ kind: 'acted', label: 'Saved search + alert', detail: `${name} — ${alertOn ? 'alert on spike' : 'no alert'}`, status: 'done' }); },
    { successToast: t('srch.saved'), minMs: 700 }
  );

  if (state === 'empty') return <div className={a.body}><div className={a.itemSub}>{t('srch.zero')}</div></div>;

  const invalid = query.includes('((') ; // demo: unbalanced parens
  const broad = query.trim().length > 0 && query.split(/\s+/).length <= 2;
  const results = mentions.filter((m) => /aria|battery/i.test(m.text)).slice(0, full ? 6 : 3);

  const toggle = (o: string) => setActive((s) => (s.includes(o) ? s.filter((x) => x !== o) : [...s, o]));

  return (
    <div className={a.body}>
      <div className={a.segmented}>
        {(['ai', 'simple', 'advanced'] as Mode[]).map((m) => (
          <Tip key={m} text={t('tip.mode')} side="bottom">
            <button className={`${a.segBtn} ${mode === m ? a.segActive : ''}`} aria-pressed={mode === m} onClick={() => setMode(m)}>
              {m === 'ai' ? t('srch.ai') : m === 'simple' ? t('srch.simple') : t('srch.advanced')}
            </button>
          </Tip>
        ))}
      </div>

      {mode === 'ai' && (
        <div>
          <label className={a.label}>{t('srch.ai')}</label>
          <input className={a.field} placeholder={t('srch.aiPlaceholder')} aria-label={t('srch.ai')} value={nl} onChange={(e) => setNl(e.target.value)} />
          <div style={{ marginTop: 'var(--sp-2)' }}>
            <Tip text={t('tip.aiDraft')} side="top">
              <Button variant="accent" size="sm" loading={draftQuery.loading} onClick={draftQuery.run}>◎ {t('srch.aiDraft')}</Button>
            </Tip>
          </div>
        </div>
      )}

      {(mode === 'advanced' || mode === 'simple') && (
        <div>
          <label className={a.label}>{mode === 'advanced' ? t('srch.advanced') : t('srch.simple')}</label>
          <input className={a.field} value={query} onChange={(e) => setQuery(e.target.value)} title={t('tip.queryEdit')} aria-label={mode === 'advanced' ? t('srch.advanced') : t('srch.simple')} style={{ fontFamily: mode === 'advanced' ? 'var(--mono)' : undefined, fontSize: mode === 'advanced' ? 'var(--fs-sm)' : undefined }} />
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
                  <Tip key={o} text={t('tip.filter')} side="top">
                    <button className={`${a.chip} ${active.includes(o) ? a.chipActive : ''}`} aria-pressed={active.includes(o)} onClick={() => toggle(o)}>{o}</button>
                  </Tip>
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
            <input className={a.field} placeholder={t('srch.saveName')} aria-label={t('srch.saveName')} value={name} onChange={(e) => setName(e.target.value)} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--fs-sm)' }}>
              <input type="checkbox" checked={alertOn} onChange={(e) => setAlertOn(e.target.checked)} /> {t('srch.saveAlert')}
            </label>
          </div>
          <div className={a.actions} style={{ marginTop: 'var(--sp-3)' }}>
            <Tip text={invalid ? t('tip.saveInvalid') : t('tip.saveSearch')} side="top">
              <Button variant="primary" size="sm" loading={saveSearch.loading} onClick={saveSearch.run} disabled={invalid}>{t('common.save')}</Button>
            </Tip>
          </div>
        </div>
      )}
    </div>
  );
}
