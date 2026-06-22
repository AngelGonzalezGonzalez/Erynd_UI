import { useState } from 'react';
import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import { actions as seed } from '../../data/mockData';
import { Button, Skeleton, EmptyState, ErrorState, Pill, SeverityBadge } from '../primitives';
import { ArtifactProps } from './shared';
import a from './artifacts.module.css';
import type { ActionCard, ActionStage } from '../../lib/types';

const stages: ActionStage[] = ['proposed', 'in_progress', 'shipped', 'measured'];

export function Kanban({ full, state }: ArtifactProps) {
  const { t } = useI18n();
  const [cards, setCards] = useState<ActionCard[]>(seed);
  const [dragId, setDragId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(full ? seed.find((c) => c.stage === 'measured')?.id ?? null : null);
  const pushToast = useStore((s) => s.pushToast);
  const addLedger = useStore((s) => s.addLedger);

  if (state === 'loading') return <div className={a.body}><Skeleton h={20} w="30%" /><Skeleton h={160} r={13} /></div>;
  if (state === 'empty') return <EmptyState title={t('state.emptyTitle')} body={t('kan.empty')} />;
  if (state === 'error') return <ErrorState title={t('state.errorTitle')} body={t('state.errorBody')} retryLabel={t('common.retry')} onRetry={() => {}} />;

  const move = (id: string, stage: ActionStage) => {
    setCards((cs) => cs.map((c) => (c.id === id ? { ...c, stage } : c)));
    const card = cards.find((c) => c.id === id);
    if (card && card.stage !== stage) {
      pushToast(`“${card.title}” → ${t(`kan.${stage}`)}`);
      if (card.fromAI) addLedger({ kind: 'acted', label: 'Advanced AI-proposed action', detail: `${card.title} → ${t(`kan.${stage}`)}`, status: 'done' });
    }
  };

  const shownStages = full ? stages : stages;
  const open = cards.find((c) => c.id === openId);

  return (
    <div className={a.body}>
      <div className={a.kanban} style={!full ? { gridTemplateColumns: 'repeat(4, minmax(130px,1fr))' } : undefined}>
        {shownStages.map((stage) => {
          const col = cards.filter((c) => c.stage === stage);
          return (
            <div
              key={stage}
              className={a.kanCol}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dragId && move(dragId, stage)}
            >
              <div className={a.kanColHead}>
                <span>{t(`kan.${stage}`)}</span>
                <span className={a.kanCount}>{col.length}</span>
              </div>
              {col.map((c) => (
                <div
                  key={c.id}
                  className={`${a.kanCard} ${dragId === c.id ? a.kanDragging : ''}`}
                  draggable
                  onDragStart={() => setDragId(c.id)}
                  onDragEnd={() => setDragId(null)}
                  onClick={() => setOpenId(openId === c.id ? null : c.id)}
                >
                  <div className={a.kanTitle}>{c.title}</div>
                  <div className={a.kanMeta}>
                    <span>{c.owner}</span>·<span>{c.due}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {c.fromAI && <Pill style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}>◎ AI</Pill>}
                    {c.blocked && <SeverityBadge severity="high" label={t('kan.blocked')} />}
                    {c.roi && <Pill style={{ color: 'var(--pos)' }}>ROI</Pill>}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {open && (
        <div className={a.panel}>
          <div className={a.head} style={{ marginBottom: 'var(--sp-3)' }}>
            <div className={a.title} style={{ fontSize: 'var(--fs-h3)' }}>{open.title}</div>
            <span className={a.headSpacer} />
            <Button size="sm" variant="ghost" onClick={() => setOpenId(null)}>{t('common.close')}</Button>
          </div>
          <div className={a.kv}><span className={a.muted}>{t('kan.owner')}</span><span>{open.owner}</span></div>
          <div className={a.kv}><span className={a.muted}>{t('kan.due')}</span><span>{open.due}</span></div>
          {open.fromAI && <div className={a.kv}><span className={a.muted}>{t('kan.fromAI')}</span><span>◎</span></div>}
          {open.whatWeDid && <div className={a.kv}><span className={a.muted}>{t('kan.whatWeDid')}</span><span style={{ maxWidth: '60%', textAlign: 'right' }}>{open.whatWeDid}</span></div>}
          {open.whatChanged && <div className={a.kv}><span className={a.muted}>{t('kan.whatChanged')}</span><span style={{ maxWidth: '60%', textAlign: 'right' }}>{open.whatChanged}</span></div>}
          {open.learnings && <div className={a.kv}><span className={a.muted}>{t('kan.learnings')}</span><span style={{ maxWidth: '60%', textAlign: 'right' }}>{open.learnings}</span></div>}
          {open.roi && <div className={a.kv}><span className={a.muted}>{t('kan.roi')}</span><span style={{ color: 'var(--pos)', maxWidth: '60%', textAlign: 'right' }}>{open.roi}</span></div>}

          {open.stage !== 'measured' && (
            <div className={a.actions} style={{ marginTop: 'var(--sp-3)' }}>
              <span className={a.muted} style={{ fontSize: 'var(--fs-xs)', alignSelf: 'center' }}>{t('kan.move')}:</span>
              {stages.filter((s) => s !== open.stage).map((s) => (
                <Button key={s} size="sm" variant="secondary" onClick={() => move(open.id, s)}>{t(`kan.${s}`)}</Button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
