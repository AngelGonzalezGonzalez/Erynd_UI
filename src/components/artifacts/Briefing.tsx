import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import { warnings, opportunities, team, getMentions } from '../../data/mockData';
import { Button, SeverityBadge, Skeleton, EmptyState, ErrorState, Avatar, fmt } from '../primitives';
import { Sparkline } from '../charts';
import { ArtifactProps, severityRank } from './shared';
import a from './artifacts.module.css';

export function Briefing({ full, state }: ArtifactProps) {
  const { t } = useI18n();
  const openSurface = useStore((s) => s.openSurface);
  const addLedger = useStore((s) => s.addLedger);
  const pushToast = useStore((s) => s.pushToast);
  const send = useStore((s) => s.send);

  if (state === 'loading') {
    return (
      <div className={a.body}>
        <Skeleton h={84} r={13} />
        <Skeleton h={20} w="55%" />
        <Skeleton h={56} r={13} />
        <Skeleton h={56} r={13} />
      </div>
    );
  }
  if (state === 'empty') {
    return <EmptyState title={t('state.emptyTitle')} body={t('brief.empty')} />;
  }
  if (state === 'error') {
    return <ErrorState title={t('state.errorTitle')} body={t('brief.error')} retryLabel={t('common.retry')} onRetry={() => {}} />;
  }

  const sorted = [...warnings].filter((w) => !w.warming).sort((x, y) => severityRank[x.severity] - severityRank[y.severity]);
  const shown = full ? sorted : sorted.slice(0, 2);

  const assign = (title: string) => {
    const id = addLedger({ kind: 'acted', label: 'Assigned with SLA', detail: title, status: 'done' });
    pushToast('Assigned · 4h SLA started', id);
  };

  return (
    <div className={a.body}>
      {/* TL;DR — the narrative spine */}
      <div className={a.tldr}>
        <div className={a.tldrRow}>
          <span className={a.tldrKey}>{t('brief.whatChanged')}</span>
          <span className={a.narr}>{t('brief.s.changed')}</span>
        </div>
        <div className={a.tldrRow}>
          <span className={a.tldrKey}>{t('brief.whyMatters')}</span>
          <span className={a.narr}>{t('brief.s.why')}</span>
        </div>
        <div className={a.tldrRow}>
          <span className={a.tldrKey}>{t('brief.whatToDo')}</span>
          <span className={a.narr}>{t('brief.s.do')}</span>
        </div>
      </div>

      {/* Warnings by severity */}
      <div>
        <div className={a.sectionLabel}>{t('brief.warnings')} · {t('brief.severityOrder')}</div>
        <div className={a.list}>
          {shown.map((w) => (
            <div className={a.itemRow} key={w.id}>
              <SeverityBadge severity={w.severity} />
              <div className={a.itemMain}>
                <div className={a.itemTitle}>{w.title}</div>
                <div className={a.itemSub}>
                  {fmt(w.reach)} {t('common.reach')} · {w.channels.join(' · ')}
                </div>
              </div>
              <Sparkline data={w.spark} color={w.sentiment === 'positive' ? 'var(--pos)' : 'var(--neg)'} w={70} h={26} />
              <div className={a.actions}>
                <Button size="sm" variant="ghost" onClick={() => openSurface('warning', w.title, { warningId: w.id })}>
                  {t('brief.investigate')}
                </Button>
                {w.severity === 'critical' && (
                  <Button size="sm" variant="accent" onClick={() => send(t('prompt.respond'))}>
                    {t('brief.respond')}
                  </Button>
                )}
                {full && w.severity !== 'low' && (
                  <Button size="sm" variant="secondary" onClick={() => assign(w.title)}>
                    {t('brief.assign')}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {full && (
        <>
          <div className={a.grid2}>
            <div>
              <div className={a.sectionLabel}>{t('brief.opportunities')}</div>
              <div className={a.list}>
                {opportunities.map((o) => (
                  <div className={a.panel} key={o.id}>
                    <div className={a.itemTitle}>{o.title}</div>
                    <div className={a.itemSub} style={{ marginBottom: 8 }}>{o.detail}</div>
                    <Button size="sm" variant="secondary" onClick={() => send(o.channel === 'Media' ? t('prompt.journalist') : t('prompt.publish'))}>
                      {o.channel}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className={a.sectionLabel}>{t('brief.team')}</div>
              <div className={a.list}>
                {team.map((m) => (
                  <div className={a.itemRow} key={m.id}>
                    <Avatar name={m.name} hue={m.hue} presence={m.presence} />
                    <div className={a.itemMain}>
                      <div className={a.itemTitle}>{m.name} · <span className={a.faint}>{t(`role.${m.role}`)}</span></div>
                      <div className={a.itemSub}>{m.activity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {!full && (
        <div className={a.faint} style={{ fontSize: 'var(--fs-xs)' }}>
          + {sorted.length - shown.length} more · {getMentions(warnings[0].mentionIds).length} {t('common.mentions')} behind the lead signal
        </div>
      )}
    </div>
  );
}
