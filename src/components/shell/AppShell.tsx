import { useEffect, useRef } from 'react';
import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import { Conversation } from '../chat/Conversation';
import { TopBar } from './TopBar';
import { WatchingRail } from './WatchingRail';
import { TrustLedgerPanel } from './TrustLedgerPanel';
import { SurfaceOverlay } from './SurfaceOverlay';
import { EvidencePanel } from './EvidencePanel';
import { CommandMenu } from './CommandMenu';
import { Toasts } from './Toasts';
import { Settings } from './Settings';
import s from './shell.module.css';

export function AppShell() {
  const { t } = useI18n();
  const leftOpen = useStore((st) => st.leftOpen);
  const rightOpen = useStore((st) => st.rightOpen);
  const setLeft = useStore((st) => st.setLeft);
  const setRight = useStore((st) => st.setRight);
  const setCommand = useStore((st) => st.setCommand);
  const commandOpen = useStore((st) => st.commandOpen);
  const closeSurface = useStore((st) => st.closeSurface);
  const closeEvidence = useStore((st) => st.closeEvidence);
  const setSettings = useStore((st) => st.setSettings);
  const expanded = useStore((st) => st.expanded);
  const evidence = useStore((st) => st.evidence);
  const settingsOpen = useStore((st) => st.settingsOpen);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommand(!commandOpen);
      }
      if (e.key === 'Escape') {
        setCommand(false);
        closeSurface();
        closeEvidence();
        setSettings(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [commandOpen, setCommand, closeSurface, closeEvidence, setSettings]);

  // A11y: when an overlay closes, return focus to the control that opened it.
  const anyOverlay = !!expanded || !!evidence || commandOpen || settingsOpen;
  const anyOverlayRef = useRef(anyOverlay);
  const lastFocus = useRef<HTMLElement | null>(null);
  useEffect(() => { anyOverlayRef.current = anyOverlay; }, [anyOverlay]);
  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => { if (!anyOverlayRef.current) lastFocus.current = e.target as HTMLElement; };
    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, []);
  useEffect(() => {
    if (!anyOverlay && lastFocus.current && document.contains(lastFocus.current)) {
      lastFocus.current.focus({ preventScroll: true });
    }
  }, [anyOverlay]);

  return (
    <div className={s.shell}>
      <TopBar />
      <div
        className={s.main}
        style={{
          ['--lw' as string]: leftOpen ? '286px' : '0px',
          ['--rw' as string]: rightOpen ? '300px' : '0px',
        }}
      >
        {leftOpen && (
          <aside className={`${s.rail} ${s.railLeft} ${s.railOpen}`}>
            <WatchingRail />
          </aside>
        )}

        <main className={s.center}>
          <Conversation />
        </main>

        {rightOpen && (
          <aside className={`${s.rail} ${s.railRight} ${s.railOpen}`}>
            <TrustLedgerPanel />
          </aside>
        )}

        {/* desktop collapse / reopen handles (absolutely positioned — native title) */}
        {!leftOpen && (
          <button className={`${s.collapseBtn} ${s.collapseLeft}`} onClick={() => setLeft(true)} aria-label={t('shell.watching')} title={t('tip.menuLeft')}>›</button>
        )}
        {leftOpen && (
          <button className={`${s.collapseBtn} ${s.collapseLeft}`} style={{ left: 'var(--lw)' }} onClick={() => setLeft(false)} aria-label={t('common.collapse')} title={t('common.collapse')}>‹</button>
        )}
        {!rightOpen && (
          <button className={`${s.collapseBtn} ${s.collapseRight}`} onClick={() => setRight(true)} aria-label={t('shell.trust')} title={t('tip.menuRight')}>‹</button>
        )}
        {rightOpen && (
          <button className={`${s.collapseBtn} ${s.collapseRight}`} style={{ right: 'var(--rw)' }} onClick={() => setRight(false)} aria-label={t('common.collapse')} title={t('common.collapse')}>›</button>
        )}

        {/* mobile sheet scrim */}
        {(leftOpen || rightOpen) && (
          <div className={s.sheetScrim} onClick={() => { setLeft(false); setRight(false); }} />
        )}
      </div>

      <SurfaceOverlay />
      <EvidencePanel />
      <CommandMenu />
      <Settings />
      <Toasts />
    </div>
  );
}
