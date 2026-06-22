import { useEffect } from 'react';
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
  const leftOpen = useStore((st) => st.leftOpen);
  const rightOpen = useStore((st) => st.rightOpen);
  const setLeft = useStore((st) => st.setLeft);
  const setRight = useStore((st) => st.setRight);
  const setCommand = useStore((st) => st.setCommand);
  const commandOpen = useStore((st) => st.commandOpen);
  const closeSurface = useStore((st) => st.closeSurface);
  const closeEvidence = useStore((st) => st.closeEvidence);

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
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [commandOpen, setCommand, closeSurface, closeEvidence]);

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

        {/* desktop collapse / reopen handles */}
        {!leftOpen && (
          <button className={`${s.collapseBtn} ${s.collapseLeft}`} onClick={() => setLeft(true)} aria-label="Open watching rail">›</button>
        )}
        {leftOpen && (
          <button className={`${s.collapseBtn} ${s.collapseLeft}`} style={{ left: 'var(--lw)' }} onClick={() => setLeft(false)} aria-label="Collapse">‹</button>
        )}
        {!rightOpen && (
          <button className={`${s.collapseBtn} ${s.collapseRight}`} onClick={() => setRight(true)} aria-label="Open trust ledger">‹</button>
        )}
        {rightOpen && (
          <button className={`${s.collapseBtn} ${s.collapseRight}`} style={{ right: 'var(--rw)' }} onClick={() => setRight(false)} aria-label="Collapse">›</button>
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
