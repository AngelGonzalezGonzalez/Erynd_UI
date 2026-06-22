import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import { registry } from '../artifacts/registry';
import type { LoadState } from '../../lib/types';
import s from './shell.module.css';

const states: LoadState[] = ['default', 'loading', 'empty', 'error'];

export function SurfaceOverlay() {
  const { t } = useI18n();
  const expanded = useStore((st) => st.expanded);
  const close = useStore((st) => st.closeSurface);
  const [preview, setPreview] = useState<LoadState>('default');

  return (
    <AnimatePresence onExitComplete={() => setPreview('default')}>
      {expanded && (
        <>
          <motion.div className={s.scrim} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
          <div className={s.overlay}>
            <motion.div
              className={s.overlayCard}
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              {(() => {
                const def = registry[expanded.kind];
                const Comp = def.Component;
                return (
                  <>
                    <div className={s.overlayHead}>
                      <span className={s.overlayGlyph}>{def.glyph}</span>
                      <span className={s.overlayTitle}>{expanded.title}</span>
                      <span style={{ flex: 1 }} />
                      {def.statePreview && (
                        <span className={s.statePreview} title="Preview states">
                          {states.map((st2) => (
                            <button key={st2} className={`${s.stateBtn} ${preview === st2 ? s.stateBtnOn : ''}`} onClick={() => setPreview(st2)}>
                              {st2}
                            </button>
                          ))}
                        </span>
                      )}
                      <button className={s.iconBtn} style={{ color: 'var(--text)' }} onClick={close} aria-label={t('common.close')}>✕</button>
                    </div>
                    <div className={s.overlayBody}>
                      <Comp full state={def.statePreview ? preview : 'default'} payload={expanded.payload} />
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
