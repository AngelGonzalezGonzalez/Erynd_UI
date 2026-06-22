import { useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import { Aperture, Button } from '../primitives';
import { BRAND, COMPETITORS, PRODUCT } from '../../data/mockData';
import o from './onboarding.module.css';
import a from '../artifacts/artifacts.module.css';

export function Onboarding() {
  const { t } = useI18n();
  const complete = useStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [seeding, setSeeding] = useState(false);

  const steps = [
    {
      label: t('onb.brandLabel'),
      q: t('onb.q1'),
      field: <input className={a.field} defaultValue={`${BRAND}, ${PRODUCT}`} autoFocus />,
    },
    {
      label: t('onb.competitorsLabel'),
      q: t('onb.competitorsLabel'),
      field: (
        <div className={a.chips}>
          {COMPETITORS.map((c) => <span key={c} className={`${a.chip} ${a.chipActive}`}>{c}</span>)}
          <span className={a.chip}>+ add</span>
        </div>
      ),
    },
    {
      label: t('onb.sourcesLabel'),
      q: t('onb.sourcesLabel'),
      field: (
        <div className={a.chips}>
          {['News', 'X', 'Reddit', 'TikTok', 'Instagram', 'Podcasts'].map((c, i) => (
            <span key={c} className={`${a.chip} ${i < 4 ? a.chipActive : ''}`}>{c}</span>
          ))}
        </div>
      ),
    },
    {
      label: t('onb.alertsLabel'),
      q: t('onb.alertsLabel'),
      field: (
        <div className={o.row}>
          {['onb.alerts.critical', 'onb.alerts.daily', 'onb.alerts.realtime'].map((k, i) => (
            <span key={k} className={`${a.chip} ${i === 1 ? a.chipActive : ''}`}>{t(k)}</span>
          ))}
        </div>
      ),
    },
  ];

  const last = step === steps.length - 1;
  const seed = () => {
    setSeeding(true);
    window.setTimeout(() => complete(false), 1600);
  };

  return (
    <div className={o.wrap}>
      <motion.div className={o.inner} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <div className={o.top}>
          <Aperture size={26} />
          <span className={o.word}>ERYND</span>
        </div>

        {seeding ? (
          <div className={o.seeding}>
            <Aperture size={22} spin />
            <span>{t('onb.seeding')}</span>
          </div>
        ) : (
          <>
            <div>
              <div className={o.greet}>{t('onb.greeting').replace('.', '')} <span className="em">{t('app.tagline').toLowerCase().replace('.', '')}</span></div>
            </div>
            <div className={o.intro}>{t('onb.intro')}</div>

            <div className={o.stepDots}>
              {steps.map((_, i) => <span key={i} className={`${o.dot} ${i <= step ? o.dotOn : ''}`} />)}
            </div>

            <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <div className={a.sectionLabel}>{t('onb.step')} {step + 1} {t('onb.of')} {steps.length}</div>
              <div className={o.q}>{steps[step].q}</div>
              {steps[step].field}
            </motion.div>

            <div className={o.foot}>
              {last ? (
                <Button variant="primary" onClick={seed}>{t('onb.seed')}</Button>
              ) : (
                <Button variant="primary" onClick={() => setStep((s) => s + 1)}>{t('onb.next')}</Button>
              )}
              <button className={o.skip} onClick={() => complete(true)}>{t('onb.skip')}</button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
