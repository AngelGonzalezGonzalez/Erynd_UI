import { AnimatePresence, motion } from 'framer-motion';
import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import { usage, team } from '../../data/mockData';
import { Button, Avatar, Pill, Tip, fmt } from '../primitives';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import s from './shell.module.css';
import a from '../artifacts/artifacts.module.css';

function Usage({ label, used, limit }: { label: string; used: number; limit: number }) {
  const pct = (used / limit) * 100;
  return (
    <div>
      <div className={a.kv} style={{ borderBottom: 'none', paddingBottom: 2 }}>
        <span className={a.muted}>{label}</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 'var(--fs-sm)' }}>{fmt(used)} / {fmt(limit)}</span>
      </div>
      <div className={s.usageBar}><span className={`${s.usageFill} ${pct > 85 ? s.usageWarn : ''}`} style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

export function Settings() {
  const { t } = useI18n();
  const open = useStore((st) => st.settingsOpen);
  const setSettings = useStore((st) => st.setSettings);
  const theme = useStore((st) => st.theme);
  const toggleTheme = useStore((st) => st.toggleTheme);
  const locale = useStore((st) => st.locale);
  const setLocale = useStore((st) => st.setLocale);
  const upgrade = useAsyncAction(() => {}, { successToast: t('toast.upgrade'), minMs: 700 });

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className={s.scrim} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSettings(false)} />
          <div className={s.overlay}>
            <motion.div
              className={s.overlayCard}
              style={{ width: 'min(680px, 100%)' }}
              role="dialog"
              aria-modal="true"
              aria-label={t('set.title')}
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={s.overlayHead}>
                <span className={s.overlayGlyph}>⚙</span>
                <span className={s.overlayTitle}>{t('set.title')}</span>
                <span style={{ flex: 1 }} />
                <Tip text={t('tip.close')} side="bottom">
                  <button className={s.iconBtn} style={{ color: 'var(--text)' }} onClick={() => setSettings(false)} aria-label={t('common.close')}>✕</button>
                </Tip>
              </div>
              <div className={s.overlayBody}>
                <div className={s.settingsGrid}>
                  <div className={a.panel}>
                    <div className={a.sectionLabel}>{t('set.usage')} · <Pill>{t('set.plan')}: Studio</Pill></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                      <Usage label={t('set.queries')} used={usage.queries.used} limit={usage.queries.limit} />
                      <Usage label={t('set.quota')} used={usage.mentions.used} limit={usage.mentions.limit} />
                      <Usage label={t('set.seats')} used={usage.seats.used} limit={usage.seats.limit} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginTop: 'var(--sp-3)' }}>
                      <span style={{ color: 'var(--sev-high)', fontSize: 'var(--fs-xs)' }}>⚠ {t('set.near')}</span>
                      <Tip text={t('tip.upgrade')} side="top">
                        <Button size="sm" variant="primary" loading={upgrade.loading} onClick={upgrade.run}>{t('set.upgrade')}</Button>
                      </Tip>
                    </div>
                  </div>

                  <div className={a.grid2}>
                    <div className={a.panel}>
                      <div className={a.sectionLabel}>{t('set.appearance')}</div>
                      <div className={a.label}>{t('shell.theme')}</div>
                      <div className={s.themeRow}>
                        <Tip text={t('tip.themeToDark')} side="top" style={{ flex: 1 }}>
                          <button className={`${s.themeOpt} ${theme === 'dark' ? s.themeOptOn : ''}`} style={{ width: '100%' }} aria-pressed={theme === 'dark'} onClick={() => theme !== 'dark' && toggleTheme()}>☾ Dark</button>
                        </Tip>
                        <Tip text={t('tip.themeToLight')} side="top" style={{ flex: 1 }}>
                          <button className={`${s.themeOpt} ${theme === 'light' ? s.themeOptOn : ''}`} style={{ width: '100%' }} aria-pressed={theme === 'light'} onClick={() => theme !== 'light' && toggleTheme()}>☀ Light</button>
                        </Tip>
                      </div>
                      <div className={a.label} style={{ marginTop: 'var(--sp-3)' }}>{t('shell.language')}</div>
                      <div className={s.themeRow}>
                        <Tip text={t('tip.lang')} side="top" style={{ flex: 1 }}>
                          <button className={`${s.themeOpt} ${locale === 'en' ? s.themeOptOn : ''}`} style={{ width: '100%' }} aria-pressed={locale === 'en'} onClick={() => setLocale('en')}>English</button>
                        </Tip>
                        <Tip text={t('tip.lang')} side="top" style={{ flex: 1 }}>
                          <button className={`${s.themeOpt} ${locale === 'es' ? s.themeOptOn : ''}`} style={{ width: '100%' }} aria-pressed={locale === 'es'} onClick={() => setLocale('es')}>Español</button>
                        </Tip>
                      </div>
                    </div>

                    <div className={a.panel}>
                      <div className={a.sectionLabel}>{t('set.team')}</div>
                      <div className={a.list}>
                        {team.map((m) => (
                          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                            <Avatar name={m.name} hue={m.hue} size={26} presence={m.presence} />
                            <span style={{ fontSize: 'var(--fs-sm)' }}>{m.name}</span>
                            <span style={{ flex: 1 }} />
                            <Pill>{t(`role.${m.role}`)}</Pill>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
