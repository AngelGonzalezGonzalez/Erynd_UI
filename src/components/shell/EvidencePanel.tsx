import { AnimatePresence, motion } from 'framer-motion';
import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import { getMentions } from '../../data/mockData';
import { Pill, SentimentBadge, Tip, fmt } from '../primitives';
import { channelLabel } from '../artifacts/shared';
import s from './shell.module.css';
import a from '../artifacts/artifacts.module.css';

export function EvidencePanel() {
  const { t } = useI18n();
  const evidence = useStore((st) => st.evidence);
  const close = useStore((st) => st.closeEvidence);
  const mentions = evidence ? getMentions(evidence.mentionIds) : [];

  return (
    <AnimatePresence>
      {evidence && (
        <>
          <motion.div className={s.scrim} style={{ zIndex: 109 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
          <motion.aside
            className={s.evidence}
            role="dialog"
            aria-modal="true"
            aria-label={evidence.title}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={s.evidenceHead}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div>
                  <div className={a.title} style={{ fontSize: 'var(--fs-h3)' }}>{evidence.title}</div>
                  <div className={a.itemSub}>{evidence.subtitle} · {mentions.length} {t('common.mentions')}</div>
                </div>
                <span style={{ flex: 1 }} />
                <Tip text={t('tip.close')} side="left">
                  <button className={s.iconBtn} style={{ color: 'var(--text)' }} onClick={close} aria-label={t('common.close')}>✕</button>
                </Tip>
              </div>
            </div>
            <div className={s.evidenceBody}>
              {mentions.map((m) => (
                <div className={a.mention} key={m.id}>
                  <div className={a.mentionHead}>
                    <span className={a.mentionAuthor}>{m.author}</span>
                    <span className={a.faint}>{m.handle}</span>
                    <Pill>{m.outlet}</Pill>
                    <span style={{ flex: 1 }} />
                    <SentimentBadge sentiment={m.sentiment} />
                  </div>
                  <div className={a.mentionText}>{m.text}</div>
                  <div className={a.mentionMeta}>
                    <span>{channelLabel[m.channel]}</span>
                    <span>{fmt(m.reach)} {t('common.reach')}</span>
                    <span>infl {m.influence}</span>
                    <span>{m.time}</span>
                    {m.lang === 'es' && <span>ES</span>}
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
