import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import { watching } from '../../data/mockData';
import { SeverityBadge, Delta } from '../primitives';
import { directSurfaces, registry } from '../artifacts/registry';
import s from './shell.module.css';

export function WatchingRail() {
  const { t } = useI18n();
  const openSurface = useStore((st) => st.openSurface);
  const send = useStore((st) => st.send);

  return (
    <>
      <div className={s.railHead}>
        <span className={s.railTitle}>{t('shell.watching')}</span>
        <span className={s.railSub}>{t('shell.watchingSub')}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
        {watching.map((w) => (
          <button key={w.id} className={s.watchItem} onClick={() => openSurface('search', t('srch.title'))}>
            {w.changed && <span className={s.changedDot} />}
            <span className={s.watchMain}>
              <span className={s.watchLabel}>{w.label}</span>
            </span>
            {w.delta !== 0 && <Delta value={w.delta} />}
            <SeverityBadge severity={w.severity} label="" />
          </button>
        ))}
      </div>

      <div>
        <div className={s.railSection} style={{ marginBottom: 'var(--sp-2)' }}>{t('shell.openSurface')}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {directSurfaces.map((k) => (
            <button
              key={k}
              className={s.watchItem}
              style={{ flex: '0 0 auto', padding: '0.4em 0.7em' }}
              onClick={() => openSurface(k, t(registry[k].titleKey))}
              title={t(registry[k].titleKey)}
            >
              <span style={{ color: 'var(--accent)' }}>{registry[k].glyph}</span>
              <span className={s.watchLabel} style={{ fontSize: 'var(--fs-xs)' }}>{t(registry[k].titleKey)}</span>
            </button>
          ))}
        </div>
      </div>

      <button className={s.watchItem} onClick={() => send(t('prompt.search'))} style={{ justifyContent: 'center', color: 'var(--text-muted)' }}>
        + {t('srch.title')}
      </button>
    </>
  );
}
