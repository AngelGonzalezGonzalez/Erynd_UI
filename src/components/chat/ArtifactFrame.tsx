import { motion } from 'framer-motion';
import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import { Card, Tip } from '../primitives';
import { registry } from '../artifacts/registry';
import { useMountLoad } from '../artifacts/shared';
import type { Artifact } from '../../lib/types';
import c from './chat.module.css';

export function ArtifactFrame({ artifact }: { artifact: Artifact }) {
  const { t } = useI18n();
  const openSurface = useStore((s) => s.openSurface);
  const def = registry[artifact.kind];
  const Comp = def.Component;
  // brief, natural loading on mount — no spinner on the user's own data
  const state = useMountLoad(artifact.state);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className={c.frame}>
        <div className={c.frameHead}>
          <span className={c.frameGlyph}>{def.glyph}</span>
          <span className={c.frameTitle}>{t(artifact.title || def.titleKey)}</span>
          <span className={c.frameSpacer} />
          <Tip text={t('tip.expand')} side="left">
            <button className={c.expandBtn} onClick={() => openSurface(artifact.kind, t(artifact.title || def.titleKey), artifact.payload)}>
              ⤢ {t('common.expand')}
            </button>
          </Tip>
        </div>
        <div className={c.frameBody}>
          <Comp full={false} state={state} payload={artifact.payload} />
        </div>
      </Card>
    </motion.div>
  );
}
