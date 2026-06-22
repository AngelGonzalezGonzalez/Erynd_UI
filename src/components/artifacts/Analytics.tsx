import { useState } from 'react';
import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import { sentimentSeries, shareOfVoice, aveSeries, radar, brandHealth, getMentions, BRAND } from '../../data/mockData';
import { Button, Skeleton, EmptyState, ErrorState, Tooltip } from '../primitives';
import { SentimentTrend, BarSeries, ShareOfVoice, CompetitiveRadar, HealthGauge } from '../charts';
import { ArtifactProps } from './shared';
import a from './artifacts.module.css';
import type { SeriesPoint } from '../../lib/types';

type Lens = 'sentiment' | 'sov' | 'ave' | 'radar' | 'health';

const glossary: Record<Lens, string> = {
  sentiment: 'A weighted net of positive vs negative mentions, 0–100. Click a day to read the mentions driving it.',
  sov: 'Share of voice: your mentions as a percent of the tracked competitor set over the period.',
  ave: 'Advertising Value Equivalency: an estimate of what comparable paid coverage would have cost. Needs a reach figure to compute.',
  radar: 'A side-by-side of your scores vs the competitor-set average across six dimensions.',
  health: 'A composite brand-health index blending sentiment, reach, and acclaim — with the biggest movers called out.',
};

export function Analytics({ full, state }: ArtifactProps) {
  const { t } = useI18n();
  const [lens, setLens] = useState<Lens>('sentiment');
  const openEvidence = useStore((s) => s.openEvidence);
  const addLedger = useStore((s) => s.addLedger);
  const pushToast = useStore((s) => s.pushToast);

  if (state === 'loading') {
    return (
      <div className={a.body}>
        <Skeleton h={20} w="40%" />
        <Skeleton h={150} r={13} />
        <Skeleton h={40} />
      </div>
    );
  }
  if (state === 'empty') return <EmptyState title={t('state.emptyTitle')} body={t('an.empty')} />;
  if (state === 'error') return <ErrorState title={t('state.errorTitle')} body={t('state.errorBody')} retryLabel={t('common.retry')} onRetry={() => {}} />;

  const drill = (label: string, ids?: string[]) => {
    if (!ids || ids.length === 0) return;
    openEvidence({ title: `${t('an.evidence')} · ${label}`, subtitle: t('an.evidenceSub'), mentionIds: ids });
  };

  const exportReport = () => {
    const id = addLedger({ kind: 'acted', label: 'Exported analytics', detail: `${lens} · PDF (branded)`, status: 'done' });
    pushToast('Report exported · PDF', id);
  };

  const lenses: { id: Lens; label: string }[] = [
    { id: 'sentiment', label: t('an.sentiment') },
    { id: 'sov', label: t('an.sov') },
    { id: 'ave', label: t('an.ave') },
    { id: 'radar', label: t('an.radar') },
    { id: 'health', label: t('an.health') },
  ];
  const shownLenses = full ? lenses : lenses.slice(0, 3);

  return (
    <div className={a.body}>
      <div className={a.chips}>
        {shownLenses.map((l) => (
          <button key={l.id} className={`${a.chip} ${lens === l.id ? a.chipActive : ''}`} onClick={() => setLens(l.id)}>
            {l.label}
          </button>
        ))}
      </div>

      <div className={a.panel}>
        <div className={a.sectionLabel}>
          {lenses.find((l) => l.id === lens)?.label}
          <Tooltip label={glossary[lens]} />
          <span className={a.headSpacer} />
          <span className={a.faint} style={{ fontSize: 'var(--fs-mono)', fontFamily: 'var(--mono)' }}>{t('an.compare')}</span>
        </div>

        {lens === 'sentiment' && <SentimentTrend data={sentimentSeries} onPick={(p: SeriesPoint) => drill(p.label, p.mentionIds)} />}
        {lens === 'sov' && <ShareOfVoice data={shareOfVoice} onPick={(d) => drill(d.name, d.isUs ? sentimentSeries.flatMap((s) => s.mentionIds ?? []) : [])} />}
        {lens === 'ave' && (
          <>
            <BarSeries data={aveSeries} unit="k" onPick={(p) => drill(p.label, p.mentionIds)} />
            <div className={a.itemSub} style={{ marginTop: 8 }}>⚠ {t('an.aveNote')}</div>
          </>
        )}
        {lens === 'radar' && <CompetitiveRadar data={radar} usLabel={BRAND} themLabel="Field avg" />}
        {lens === 'health' && (
          <div>
            <HealthGauge score={brandHealth.score} delta={brandHealth.delta} />
            <div style={{ marginTop: 'var(--sp-4)' }}>
              {brandHealth.drivers.map((d) => (
                <div className={a.barRow} key={d.label}>
                  <span className={a.barName}>{d.label}</span>
                  <span className={a.driverBar}>
                    <span
                      className={a.driverFill}
                      style={{ width: `${Math.min(100, Math.abs(d.value) * 3)}%`, background: d.positive ? 'var(--pos)' : 'var(--neg)' }}
                    />
                  </span>
                  <span style={{ width: 42, textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 'var(--fs-mono)', color: d.positive ? 'var(--pos)' : 'var(--neg)' }}>
                    {d.value > 0 ? '+' : ''}{d.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={a.itemSub} style={{ marginTop: 'var(--sp-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: 'var(--accent)' }}>◎</span> {t('an.drillHint')}
        </div>
      </div>

      {full && (
        <div className={a.actions}>
          <Button variant="primary" size="sm" onClick={exportReport}>{t('common.export')} · PDF</Button>
          <Button variant="secondary" size="sm" onClick={exportReport}>CSV</Button>
          <Button variant="ghost" size="sm" onClick={() => drill(t('an.sentiment'), sentimentSeries[4].mentionIds)}>{t('common.viewEvidence')}</Button>
        </div>
      )}
      {!full && (
        <div className={a.faint} style={{ fontSize: 'var(--fs-xs)' }}>
          {getMentions(sentimentSeries[4].mentionIds ?? []).length} {t('common.mentions')} behind Friday’s low — {t('common.expand').toLowerCase()} to drill
        </div>
      )}
    </div>
  );
}
