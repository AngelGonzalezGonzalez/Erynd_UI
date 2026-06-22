import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import { Aperture } from '../primitives';
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

  const nextRole = () => setRole(roleCycle[(roleCycle.indexOf(role) + 1) % 3]);

  return (
    <header className={s.topbar}>
      <button className={`${s.iconBtn} ${s.menuToggle}`} onClick={() => setLeft(!leftOpen)} aria-label={t('shell.watching')}>☰</button>
      <div className={s.brand}>
        <Aperture size={24} />
        <span className={s.wordmark}>ERYND</span>
        <span className={s.brandTag}>INTELLIGENCE</span>
      </div>

      <button className={s.searchBtn} onClick={() => setCommand(true)}>
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m21 21-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        {t('shell.search')}
        <span className={s.searchKbd}>⌘K</span>
      </button>

      <div className={s.topActions}>
        <button className={s.roleChip} onClick={nextRole} title={t('shell.role')}>{t(`role.${role}`)}</button>
        <button className={`${s.iconBtn} ${s.langBtn}`} onClick={toggleLocale} title={t('shell.language')}>{locale.toUpperCase()}</button>
        <button className={s.iconBtn} onClick={toggleTheme} title={t('shell.theme')}>{theme === 'dark' ? '☾' : '☀'}</button>
        <button className={s.iconBtn} title={t('shell.notifications')}><span className={s.badge} />◔</button>
        <button className={s.iconBtn} onClick={() => setSettings(true)} title={t('shell.profile')}>⚙</button>
        <button className={`${s.iconBtn} ${s.menuToggle}`} onClick={() => setRight(!rightOpen)} aria-label={t('shell.trust')}>◫</button>
      </div>
    </header>
  );
}
