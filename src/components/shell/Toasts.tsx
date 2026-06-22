import { AnimatePresence, motion } from 'framer-motion';
import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import s from './shell.module.css';

export function Toasts() {
  const { t } = useI18n();
  const toasts = useStore((st) => st.toasts);
  const dismiss = useStore((st) => st.dismissToast);
  const undoLedger = useStore((st) => st.undoLedger);

  return (
    <div className={s.toasts}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={s.toast}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.24 }}
          >
            <span>{toast.text}</span>
            {toast.undoId && (
              <button
                className={s.undoLink}
                onClick={() => { undoLedger(toast.undoId!); dismiss(toast.id); }}
              >
                ↺ {t('common.undo')}
              </button>
            )}
            <button className={s.undoLink} style={{ color: 'var(--text-faint)' }} onClick={() => dismiss(toast.id)}>✕</button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
