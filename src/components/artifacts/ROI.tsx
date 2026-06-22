import { useState } from 'react';
import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import { actions, shareOfVoice, BRAND } from '../../data/mockData';
import { Button, Stat, Pill, EmptyState } from '../primitives';
import { ShareOfVoice } from '../charts';
import { ArtifactProps } from './shared';
import a from './artifacts.module.css';

const attribution = [
  { label: 'Earned / response work', value: 62, color: 'var(--accent)' },
  { label: 'Owned / social', value: 24, color: 'var(--pos)' },
  { label: 'Media relations', value: 14, color: 'var(--sev-medium)' },
];

export function ROI({ full, state }: ArtifactProps) {
  const { t } = useI18n();
  const [drilled, setDrilled] = useState(false);
  const addLedger = useStore((s) => s.addLedger);
  const pushToast = useStore((s) => s.pushToast);

  if (state === 'empty') return <EmptyState title={t('state.emptyTitle')} body={t('roi.empty')} />;

  const measured = actions.filter((c) => c.roi);

  const build = () => {
    const id = addLedger({ kind: 'acted', label: 'Built board report', detail: 'ROI & attribution · PPT (branded) · scheduled monthly', status: 'done' });
    pushToast('Board report built · scheduled', id);
  };

  return (
    <div className={a.body}>
      <div className={a.grid3}>
        <Stat num="3.4×" label={t('roi.outcome')} />
        <Stat num="$312k" label="earned AVE" />
        <Stat num="+6%" label={t('an.sov')} />
      </div>

      <div className={a.panel}>
        <div className={a.sectionLabel}>{t('roi.attribution')} <Pill>{t('roi.model')}: time-decay</Pill></div>
        <div style={{ display: 'flex', height: 14, borderRadius: 100, overflow: 'hidden', marginBottom: 10 }}>
          {attribution.map((s) => <span key={s.label} style={{ width: `${s.value}%`, background: s.color }} />)}
        </div>
        {attribution.map((s) => (
          <div className={a.kv} key={s.label}>
            <span className={a.muted}><span className="dot" style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 2, background: s.color, marginRight: 8 }} />{s.label}</span>
            <span>{s.value}%</span>
          </div>
        ))}
        <Button variant="ghost" size="sm" style={{ marginTop: 8 }} onClick={() => setDrilled((d) => !d)}>
          {drilled ? t('common.collapse') : `${t('roi.linked')} →`}
        </Button>
        {drilled && (
          <div className={a.list} style={{ marginTop: 8 }}>
            {measured.map((c) => (
              <div className={a.itemRow} key={c.id}>
                <div className={a.itemMain}>
                  <div className={a.itemTitle}>{c.title}</div>
                  <div className={a.itemSub} style={{ color: 'var(--pos)' }}>{c.roi}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {full && (
        <div>
          <div className={a.sectionLabel}>{t('roi.competitive')}</div>
          <ShareOfVoice data={shareOfVoice} />
          <div className={a.itemSub} style={{ marginTop: 6 }}>{BRAND} leads the set and is the only brand gaining share through the cycle.</div>
        </div>
      )}

      <div className={a.panel}>
        <div className={a.itemTitle}>{t('roi.board')}</div>
        <div className={a.itemSub} style={{ marginBottom: 10 }}>{t('roi.boardSub')}</div>
        <Button variant="primary" size="sm" onClick={build}>{t('roi.board')}</Button>
      </div>
    </div>
  );
}
