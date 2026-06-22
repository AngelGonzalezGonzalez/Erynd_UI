import { useState } from 'react';
import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import { Button, Skeleton, EmptyState, ErrorState, Pill, Tip } from '../primitives';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { ArtifactProps } from './shared';
import a from './artifacts.module.css';

type Angle = 'direct' | 'counter' | 'amplify';

const drafts: Record<Angle, { en: string; es: string; clarity: number; tone: number; predicted: number }> = {
  direct: {
    en: "On the Aria 2 battery reports: a small batch of early units is fading faster than it should. We've found the cause, and firmware 1.4.2 ships Thursday to correct it. Affected units are eligible for a no-questions replacement, starting today. We'd rather tell you exactly what's happening than say less.",
    es: 'Sobre los reportes de batería del Aria 2: un lote pequeño de unidades iniciales se agota más rápido de lo debido. Encontramos la causa y el firmware 1.4.2 llega el jueves para corregirlo. Las unidades afectadas pueden reemplazarse sin preguntas, desde hoy. Preferimos decir exactamente qué pasa antes que decir menos.',
    clarity: 92,
    tone: 88,
    predicted: 74,
  },
  counter: {
    en: 'Battery longevity matters — which is why we’re fixing it in days, not seasons. The Aria 2 still delivers the best spatial audio in its class, and now it’ll hold its charge to match. Coverage, not promises.',
    es: 'La duración de la batería importa — por eso lo corregimos en días, no en temporadas. El Aria 2 sigue ofreciendo el mejor audio espacial de su categoría, y ahora mantendrá la carga a la altura. Cobertura, no promesas.',
    clarity: 84,
    tone: 79,
    predicted: 68,
  },
  amplify: {
    en: '“Nuvera named the affected batch and gave a date. Rare.” — Gadgetwell. Transparency is a choice. Thank you to everyone holding us to it.',
    es: '“Nuvera nombró el lote afectado y dio una fecha. Algo raro.” — Gadgetwell. La transparencia es una decisión. Gracias a quienes nos exigen estar a la altura.',
    clarity: 90,
    tone: 94,
    predicted: 81,
  },
};

function Meter({ label, value, tip }: { label: string; value: number; tip: string }) {
  return (
    <div className={a.coachRow}>
      <Tip text={tip} side="right">
        <span style={{ width: 110, fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', cursor: 'help' }}>{label}</span>
      </Tip>
      <span className={a.meter}><span className={a.meterFill} style={{ width: `${value}%` }} /></span>
      <span style={{ width: 36, textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 'var(--fs-mono)' }}>{value}</span>
    </div>
  );
}

export function ResponseDraft({ full, state }: ArtifactProps) {
  const { t, locale } = useI18n();
  const [angle, setAngle] = useState<Angle>('direct');
  const [approved, setApproved] = useState(false);
  const [text, setText] = useState<string>(drafts.direct[locale]);
  const [touched, setTouched] = useState(false);
  const addLedger = useStore((s) => s.addLedger);
  const openSurface = useStore((s) => s.openSurface);

  const doApprove = (route: 'publish' | 'pitch') => {
    addLedger({
      kind: 'queued',
      label: route === 'publish' ? 'Approved response → Publisher' : 'Approved response → Pitch',
      detail: `${t(`resp.angle.${angle}`)} · AI-assisted draft, human-approved`,
      outbound: true,
      status: 'approved',
    });
    setApproved(true);
    openSurface(route === 'publish' ? 'publisher' : 'crm', route === 'publish' ? t('pub.title') : t('crm.title'));
  };
  const approvePublish = useAsyncAction(() => doApprove('publish'), { successToast: t('resp.logged') });
  const approvePitch = useAsyncAction(() => doApprove('pitch'), { successToast: t('resp.logged') });
  const regen = useAsyncAction(
    () => { setText(drafts[angle][locale]); setTouched(false); },
    { successToast: t('toast.regen'), minMs: 600 }
  );

  if (state === 'loading') return <div className={a.body}><Skeleton h={20} w="50%" /><Skeleton h={120} r={13} /><Skeleton h={70} r={13} /></div>;
  if (state === 'empty') return <EmptyState title={t('state.emptyTitle')} body="No warning selected to respond to yet." />;
  if (state === 'error') return <ErrorState title={t('state.errorTitle')} body={t('state.errorBody')} retryLabel={t('common.retry')} onRetry={() => {}} />;

  const d = drafts[angle];
  const switchAngle = (g: Angle) => {
    setAngle(g);
    setText(drafts[g][locale]);
    setTouched(false);
    setApproved(false);
  };

  return (
    <div className={a.body}>
      <div className={a.itemSub}>
        {t('resp.context')}: <strong style={{ color: 'var(--text)' }}>Aria 2 battery complaints</strong> · <Pill>{t('resp.brandVoice')}</Pill>
      </div>

      <div>
        <div className={a.sectionLabel}>{t('resp.angles')}</div>
        <div className={a.chips}>
          {(['direct', 'counter', 'amplify'] as Angle[]).map((g) => (
            <Tip key={g} text={t('tip.angle')} side="top">
              <button className={`${a.chip} ${angle === g ? a.chipActive : ''}`} aria-pressed={angle === g} onClick={() => switchAngle(g)}>
                {t(`resp.angle.${g}`)}
              </button>
            </Tip>
          ))}
        </div>
      </div>

      <textarea
        className={`${a.field} ${a.textarea}`}
        value={text}
        aria-label={t('resp.title')}
        onChange={(e) => { setText(e.target.value); setTouched(true); }}
      />
      <div className={a.itemSub} style={{ marginTop: -4 }}>{t('resp.editHint')}</div>

      <div className={a.panel}>
        <div className={a.sectionLabel}>◎ {t('resp.coach')}</div>
        <Meter label={t('resp.clarity')} value={d.clarity} tip={t('tip.clarity')} />
        <Meter label={t('resp.tone')} value={d.tone} tip={t('tip.tone')} />
        <Meter label={t('resp.predicted')} value={touched ? Math.min(99, d.predicted + 4) : d.predicted} tip={t('tip.predicted')} />
      </div>

      <div className={a.gate}>
        <svg className={a.gateIcon} width="16" height="16" viewBox="0 0 24 24" aria-hidden>
          <path d="M5 11V8a7 7 0 0 1 14 0v3" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <rect x="4" y="11" width="16" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        <span>{t('resp.gate')}</span>
      </div>

      {approved ? (
        <div className={a.success}>✓ {t('resp.logged')}</div>
      ) : (
        <div className={a.actions}>
          <Tip text={t('tip.publish')} side="top">
            <Button variant="primary" size={full ? undefined : 'sm'} loading={approvePublish.loading} onClick={approvePublish.run}>{t('resp.routePublish')}</Button>
          </Tip>
          <Tip text={t('tip.pitch')} side="top">
            <Button variant="accent" size={full ? undefined : 'sm'} loading={approvePitch.loading} onClick={approvePitch.run}>{t('resp.routePitch')}</Button>
          </Tip>
          <Tip text={t('tip.regen')} side="top">
            <Button variant="ghost" size={full ? undefined : 'sm'} loading={regen.loading} onClick={regen.run}>{t('common.regenerate')}</Button>
          </Tip>
        </div>
      )}
    </div>
  );
}
