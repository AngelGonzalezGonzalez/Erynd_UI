import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import { warnings } from '../../data/mockData';
import { Button, SeverityBadge, SentimentBadge, Pill, EmptyState, Tip, fmt } from '../primitives';
import { Sparkline } from '../charts';
import { ArtifactProps } from './shared';
import a from './artifacts.module.css';

export function WarningDetail({ full, state, payload }: ArtifactProps) {
  const { t } = useI18n();
  const openEvidence = useStore((s) => s.openEvidence);
  const send = useStore((s) => s.send);
  const addLedger = useStore((s) => s.addLedger);
  const pushToast = useStore((s) => s.pushToast);

  const id = (payload?.warningId as string) ?? warnings[0].id;
  const w = warnings.find((x) => x.id === id) ?? warnings[0];

  if (state === 'empty' || w.warming) {
    return <EmptyState title="Still warming up" body={t('warn.warming')} />;
  }

  const route = (label: string, kind: 'acted') => {
    const lid = addLedger({ kind, label, detail: w.title, status: 'done' });
    pushToast(label, lid);
  };

  return (
    <div className={a.body}>
      <div className={a.head} style={{ marginBottom: 0 }}>
        <SeverityBadge severity={w.severity} />
        <SentimentBadge sentiment={w.sentiment} />
        <span className={a.headSpacer} />
        {w.severity !== 'low' && <Pill style={{ color: 'var(--pos)' }}>✓ {t('warn.followup')}</Pill>}
      </div>
      <div className={a.narr}>{w.summary}</div>

      <div className={a.grid2}>
        <div className={a.panel}>
          <div className={a.sectionLabel}>{t('warn.velocity')}</div>
          <Sparkline data={w.spark} color="var(--neg)" w={220} h={50} />
          <div style={{ marginTop: 8, fontFamily: 'var(--mono)', fontSize: 'var(--fs-sm)', color: 'var(--neg)' }}>↑ {w.velocity}% vs baseline</div>
        </div>
        <div className={a.panel}>
          <div className={a.sectionLabel}>{t('warn.spread')}</div>
          <div className={a.chips}>{w.channels.map((c) => <span key={c} className={a.chip}>{c}</span>)}</div>
          <div className={a.kv} style={{ marginTop: 8 }}><span className={a.muted}>{t('common.reach')}</span><span>{fmt(w.reach)}</span></div>
        </div>
      </div>

      {full && w.drivingAccounts.length > 0 && (
        <div>
          <div className={a.sectionLabel}>{t('warn.accounts')}</div>
          <div className={a.list}>
            {w.drivingAccounts.map((d) => (
              <div className={a.itemRow} key={d.name}>
                <div className={a.itemMain}>
                  <div className={a.itemTitle}>{d.name}</div>
                  <div className={a.itemSub}>{fmt(d.followers)} followers · {d.posts} posts</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={a.panel}>
        <div className={a.sectionLabel}>◎ {t('warn.guidance')}</div>
        <div className={a.narr} style={{ fontSize: 'var(--fs-sm)' }}>{w.guidance}</div>
      </div>

      <div className={a.actions}>
        <Tip text={t('tip.warnEscalate')} side="top">
          <Button variant="accent" size="sm" onClick={() => send(t('prompt.respond'))}>{t('warn.escalate')}</Button>
        </Tip>
        <Tip text={t('tip.viewEvidence')} side="top">
          <Button variant="secondary" size="sm" onClick={() => openEvidence({ title: t('an.evidence'), subtitle: t('an.evidenceSub'), mentionIds: w.mentionIds })}>{t('common.viewEvidence')} ({w.mentionIds.length})</Button>
        </Tip>
        <Tip text={t('tip.warnMonitor')} side="top">
          <Button variant="ghost" size="sm" onClick={() => route(t('warn.monitor'), 'acted')}>{t('warn.monitor')}</Button>
        </Tip>
        <Tip text={t('tip.warnNoise')} side="top">
          <Button variant="ghost" size="sm" onClick={() => route(t('warn.noise'), 'acted')}>{t('warn.noise')}</Button>
        </Tip>
      </div>
    </div>
  );
}
