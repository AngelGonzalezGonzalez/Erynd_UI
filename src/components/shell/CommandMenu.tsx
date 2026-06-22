import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import { directSurfaces, registry } from '../artifacts/registry';
import s from './shell.module.css';

export function CommandMenu() {
  const { t } = useI18n();
  const open = useStore((st) => st.commandOpen);
  const setCommand = useStore((st) => st.setCommand);
  const openSurface = useStore((st) => st.openSurface);
  const send = useStore((st) => st.send);
  const [q, setQ] = useState('');

  const close = () => { setCommand(false); setQ(''); };
  const surfaces = directSurfaces.filter((k) => t(registry[k].titleKey).toLowerCase().includes(q.toLowerCase()));

  const ask = () => { if (q.trim()) { send(q.trim()); close(); } };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className={s.cmdScrim} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
          <motion.div
            className={s.cmd}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              className={s.cmdInput}
              placeholder={t('shell.commandHint')}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') ask(); if (e.key === 'Escape') close(); }}
            />
            <div className={s.cmdList}>
              {q.trim() && (
                <>
                  <div className={s.cmdSection}>Ask the assistant</div>
                  <div className={`${s.cmdItem} ${s.cmdItemActive}`} onClick={ask}>
                    <span className={s.cmdGlyph}>◎</span>
                    <span className={s.cmdLabel}>“{q}”</span>
                    <span className={s.cmdHint}>↵</span>
                  </div>
                </>
              )}
              <div className={s.cmdSection}>{t('shell.openSurface')}</div>
              {surfaces.map((k) => (
                <div key={k} className={s.cmdItem} onClick={() => { openSurface(k, t(registry[k].titleKey)); close(); }}>
                  <span className={s.cmdGlyph}>{registry[k].glyph}</span>
                  <span className={s.cmdLabel}>{t(registry[k].titleKey)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
