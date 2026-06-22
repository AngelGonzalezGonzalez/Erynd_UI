import { useState } from 'react';
import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import { watching } from '../../data/mockData';
import { Aperture, Tip } from '../primitives';
import type { Role } from '../../lib/types';
import s from './shell.module.css';

const roleCycle: Role[] = ['analyst', 'pr', 'manager'];

export function TopBar() {
  const { t } = useI18n();
  const theme = useStore((st) => st.theme);
  const toggleTheme = useStore((st) => st.toggleTheme);
  const locale = useStore((st) => st.locale);
  const toggleLocale = useStore((st) => st.toggleLocale);
  const role = useStore((st) => st.role);
  const setRole = useStore((st) => st.setRole);
  const setCommand = useStore((st) => st.setCommand);
  const setSettings = useStore((st) => st.setSettings);
  const leftOpen = useStore((st) => st.leftOpen);
  const rightOpen = useStore((st) => st.rightOpen);
  const setLeft = useStore((st) => st.setLeft);
  const setRight = useStore((st) => st.setRight);
  const ledger = useStore((st) => st.ledger);
  const pushToast = useStore((st) => st.pushToast);
  const [notifOpen, setNotifOpen] = useState(false);

  const nextRole = () => {
    const next = roleCycle[(roleCycle.indexOf(role) + 1) % 3];
    setRole(next);
    pushToast(`${t('toast.role')} ${t(`role.${next}`)}`);
  };
  const onTheme = () => {
    pushToast(t(theme === 'dark' ? 'toast.themeLight' : 'toast.themeDark'));
    toggleTheme();
  };
  const onLang = () => {
    const next = locale === 'en' ? 'es' : 'en';
    toggleLocale();
    pushToast(`${t('shell.language')}: ${t(`lang.${next}`)}`);
  };

  // Notifications = what just moved (signal) + recent assistant activity.
  const signal = watching.filter((w) => w.changed);
  const activity = ledger.slice(0, 5);
  const hasNotif = signal.length + activity.length > 0;

  return (
    <header className={s.topbar}>
      <Tip text={t('tip.menuLeft')} side="bottom">
        <button className={`${s.iconBtn} ${s.menuToggle}`} onClick={() => setLeft(!leftOpen)} aria-label={t('shell.watching')}>☰</button>
      </Tip>
      <div className={s.brand}>
        <Aperture size={24} />
        <span className={s.wordmark}>ERYND</span>
        <span className={s.brandTag}>INTELLIGENCE</span>
      </div>

      <Tip text={t('tip.search')} side="bottom">
        <button className={s.searchBtn} onClick={() => setCommand(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m21 21-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          {t('shell.search')}
          <span className={s.searchKbd}>⌘K</span>
        </button>
      </Tip>

      <div className={s.topActions}>
        <Tip text={t('tip.role')} side="bottom">
          <button className={s.roleChip} onClick={nextRole}>{t(`role.${role}`)}</button>
        </Tip>
        <Tip text={t('tip.lang')} side="bottom">
          <button className={`${s.iconBtn} ${s.langBtn}`} onClick={onLang}>{locale.toUpperCase()}</button>
        </Tip>
        <Tip text={t(theme === 'dark' ? 'tip.themeToLight' : 'tip.themeToDark')} side="bottom">
          <button className={s.iconBtn} onClick={onTheme}>{theme === 'dark' ? '☾' : '☀'}</button>
        </Tip>

        <span className={s.notifWrap}>
          <Tip text={t('tip.notifications')} side="bottom">
            <button className={s.iconBtn} onClick={() => setNotifOpen((o) => !o)} aria-label={t('shell.notifications')} aria-expanded={notifOpen}>
              {hasNotif && <span className={s.badge} />}◔
            </button>
          </Tip>
          {notifOpen && (
            <>
              <div className={s.popScrim} onClick={() => setNotifOpen(false)} />
              <div className={s.notifPop} role="dialog" aria-label={t('notif.title')}>
                <div className={s.notifHead}>{t('notif.title')}</div>
                {!hasNotif ? (
                  <div className={s.notifEmpty}>{t('notif.empty')}</div>
                ) : (
                  <>
                    {signal.map((w) => (
                      <div key={w.id} className={s.notifItem}>
                        <span className={s.notifLabel}><span className={s.notifDot} /> {w.label}</span>
                        <span className={s.notifTime}>{t('shell.newChange')}</span>
                      </div>
                    ))}
                    {activity.map((e) => (
                      <div key={e.id} className={s.notifItem}>
                        <span className={s.notifLabel}>{e.label}</span>
                        <span className={s.notifTime}>{e.time}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </>
          )}
        </span>

        <Tip text={t('tip.settings')} side="bottom">
          <button className={s.iconBtn} onClick={() => setSettings(true)} aria-label={t('shell.profile')}>⚙</button>
        </Tip>
        <Tip text={t('tip.menuRight')} side="bottom">
          <button className={`${s.iconBtn} ${s.menuToggle}`} onClick={() => setRight(!rightOpen)} aria-label={t('shell.trust')}>◫</button>
        </Tip>
      </div>
    </header>
  );
}
