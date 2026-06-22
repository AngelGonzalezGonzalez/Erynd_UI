import { useState } from 'react';
import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import { journalists } from '../../data/mockData';
import { Button, Avatar, Pill, EmptyState, Tip } from '../primitives';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { ArtifactProps } from './shared';
import a from './artifacts.module.css';
import type { Journalist } from '../../lib/types';

const pipe = ['queued', 'sent', 'opened', 'replied'] as const;
const pitchBody = (j: Journalist) =>
  `Hi ${j.name.split(' ')[0]}, you flagged the Aria 2 battery reports — here are the specifics ahead of anyone else: affected batch named, firmware 1.4.2 Thursday, no-questions replacements live today. Happy to put our audio lead on the record. — Mara, ERYND`;

export function MediaCRM({ full, state }: ArtifactProps) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<Journalist | null>(full ? journalists[0] : null);
  const [composing, setComposing] = useState(false);
  const [sent, setSent] = useState(false);
  const [subject, setSubject] = useState('Aria 2 battery fix — the specifics, with a date');
  const [body, setBody] = useState(full ? pitchBody(journalists[0]) : '');
  const addLedger = useStore((s) => s.addLedger);

  const sendPitch = useAsyncAction(
    () => { setSent(true); addLedger({ kind: 'queued', label: 'Pitch queued for approval', detail: `${selected?.name} · ${selected?.outlet}`, outbound: true, status: 'pending_approval' }); },
    { successToast: t('toast.pitchQueued'), minMs: 800 }
  );

  if (state === 'empty') return <EmptyState title={t('state.emptyTitle')} body={t('crm.empty')} action={<Button size="sm" variant="secondary">{t('crm.import')}</Button>} />;

  const list = full ? journalists : journalists.slice(0, 3);
  const startPitch = (j: Journalist) => { setComposing(true); setBody(pitchBody(j)); };

  return (
    <div className={a.body}>
      {!composing && (
        <>
          <div className={a.itemSub}>{t('crm.find')} · <span style={{ color: 'var(--accent)' }}>◎ {t('crm.match')}</span> {t('common.now')}</div>
          <div className={a.list}>
            {list.map((j) => (
              <div className={a.journalistCard} key={j.id} title={t('tip.journalist')} onClick={() => setSelected(j)}>
                <Avatar name={j.name} hue={j.avatarHue} size={40} />
                <div className={a.itemMain}>
                  <div className={a.itemTitle}>{j.name} <span className={a.matchScore}>· {j.matchScore}% {t('crm.match')}</span></div>
                  <div className={a.itemSub}>{j.outlet} · {j.location}</div>
                  <div className={a.chips} style={{ marginTop: 6 }}>
                    {j.beats.slice(0, full ? 3 : 2).map((b) => <span key={b} className={a.chip}>{b}</span>)}
                    {j.status === 'optedout' && <Pill style={{ color: 'var(--neg)' }}>opted out</Pill>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selected && !composing && (
        <div className={a.panel}>
          <div className={a.head} style={{ marginBottom: 'var(--sp-2)' }}>
            <Avatar name={selected.name} hue={selected.avatarHue} size={34} />
            <div className={a.title} style={{ fontSize: 'var(--fs-h3)' }}>{selected.name}</div>
            <span className={a.headSpacer} />
            <Pill>{selected.outlet}</Pill>
          </div>
          <div className={a.sectionLabel}>◎ {t('crm.insight')}</div>
          <div className={a.narr} style={{ fontSize: 'var(--fs-sm)' }}>{selected.aiInsight}</div>
          {full && (
            <>
              <div className={a.sectionLabel} style={{ marginTop: 'var(--sp-3)' }}>{t('crm.recent')}</div>
              {selected.recentArticles.map((r) => (
                <div className={a.kv} key={r.title}><span style={{ maxWidth: '75%' }}>{r.title}</span><span className={a.faint}>{r.date}</span></div>
              ))}
              {selected.lastInteraction && <div className={a.kv}><span className={a.muted}>{t('crm.history')}</span><span className={a.faint}>{selected.lastInteraction}</span></div>}
            </>
          )}
          <div className={a.actions} style={{ marginTop: 'var(--sp-3)' }}>
            <Tip text={selected.status === 'optedout' ? `${selected.name.split(' ')[0]} ${t('crm.optedOut')}` : t('tip.pitchStart')} side="top">
              <Button variant="accent" size="sm" disabled={selected.status === 'optedout'} onClick={() => startPitch(selected)}>{t('crm.pitch')}</Button>
            </Tip>
            {selected.status === 'optedout' && <span className={a.faint} style={{ fontSize: 'var(--fs-xs)', alignSelf: 'center' }}>{selected.name.split(' ')[0]} {t('crm.optedOut')}</span>}
          </div>
        </div>
      )}

      {composing && selected && (
        <div className={a.panel}>
          <div className={a.head} style={{ marginBottom: 'var(--sp-2)' }}>
            <div className={a.title} style={{ fontSize: 'var(--fs-h3)' }}>{t('crm.pitch')} → {selected.name}</div>
          </div>
          <label className={a.label}>{t('crm.subject')}</label>
          <input className={a.field} aria-label={t('crm.subject')} value={subject} onChange={(e) => setSubject(e.target.value)} />
          <label className={a.label} style={{ marginTop: 'var(--sp-3)' }}>{t('crm.body')}</label>
          <textarea className={`${a.field} ${a.textarea}`} aria-label={t('crm.body')} value={body} onChange={(e) => setBody(e.target.value)} />
          <div className={a.itemSub}>{t('crm.bodyHint')}</div>
          <div style={{ marginTop: 'var(--sp-2)' }}><Pill>◎ {t('crm.attach')}: Aria-2-firmware.pdf</Pill></div>

          <div className={a.gate} style={{ marginTop: 'var(--sp-3)' }}>
            <span className={a.gateIcon}>🔒</span><span>{t('crm.gate')}</span>
          </div>

          {sent ? (
            <div style={{ marginTop: 'var(--sp-3)' }}>
              <div className={a.pipeline}>
                {pipe.map((p, i) => (
                  <span key={p} className={`${a.pipeStep} ${i === 0 ? a.pipeActive : ''}`}>{t(`crm.${p}`)}</span>
                ))}
              </div>
              <div className={a.success} style={{ marginTop: 'var(--sp-2)' }}>✓ {t('crm.queued')} → {selected.name}</div>
            </div>
          ) : (
            <div className={a.actions} style={{ marginTop: 'var(--sp-3)' }}>
              <Tip text={t('tip.pitchSend')} side="top">
                <Button variant="primary" size="sm" loading={sendPitch.loading} onClick={sendPitch.run}>{t('common.approve')} & {t('common.send')}</Button>
              </Tip>
              <Tip text={t('tip.pitchCancel')} side="top">
                <Button variant="ghost" size="sm" onClick={() => setComposing(false)}>{t('common.cancel')}</Button>
              </Tip>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
