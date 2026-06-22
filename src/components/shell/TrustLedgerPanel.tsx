import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import type { AutonomyLevel } from '../../lib/types';
import s from './shell.module.css';

const levels: AutonomyLevel[] = [0, 1, 2, 3];

export function TrustLedgerPanel() {
  const { t } = useI18n();
  const autonomy = useStore((st) => st.autonomy);
  const setAutonomy = useStore((st) => st.setAutonomy);
  const ledger = useStore((st) => st.ledger);
  const undoLedger = useStore((st) => st.undoLedger);
  const approveLedger = useStore((st) => st.approveLedger);
  const pushToast = useStore((st) => st.pushToast);

  const pending = ledger.filter((e) => e.status === 'pending_approval');
  const recent = ledger.filter((e) => e.status !== 'pending_approval').slice(0, 8);

  return (
    <>
      <div className={s.railHead}>
        <span className={s.railTitle}>{t('shell.trust')}</span>
        <span className={s.railSub}>{t('shell.trustSub')}</span>
      </div>

      {/* autonomy ladder */}
      <div>
        <div className={s.railSection} style={{ marginBottom: 'var(--sp-2)' }}>{t('trust.level')}</div>
        <div className={s.ladder}>
          {levels.map((l) => (
            <button key={l} className={`${s.rung} ${autonomy === l ? s.rungActive : ''}`} onClick={() => setAutonomy(l)}>
              <span className={s.rungNum}>L{l}</span>
              <span className={s.rungLabel}>{t(`trust.l${l}`)}</span>
            </button>
          ))}
        </div>
        <div className={s.rungDesc}>{t(`trust.l${autonomy}.desc`)}</div>
        <div className={s.gateNote} style={{ marginTop: 'var(--sp-2)' }}>🔒 {t('trust.gateNote')}</div>
      </div>

      {/* pending approvals */}
      {pending.length > 0 && (
        <div>
          <div className={s.railSection} style={{ marginBottom: 'var(--sp-2)' }}>{t('trust.pending')}</div>
          {pending.map((e) => (
            <div key={e.id} className={`${s.ledgerItem} ${s.ledgerPending}`}>
              <span className={s.ledgerLabel}>{e.outbound && '🔒 '}{e.label}</span>
              <span className={s.ledgerDetail}>{e.detail}</span>
              <div className={s.ledgerRow}>
                <button className={s.undoLink} onClick={() => { approveLedger(e.id); pushToast(t('trust.approved')); }}>{t('common.approve')}</button>
                <button className={s.undoLink} style={{ color: 'var(--text-faint)' }} onClick={() => { undoLedger(e.id); pushToast(t('common.undo')); }}>{t('common.reject')}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* recent actions */}
      <div>
        <div className={s.railSection} style={{ marginBottom: 'var(--sp-2)' }}>{t('trust.recent')}</div>
        {recent.length === 0 ? (
          <div className={s.railSub} style={{ lineHeight: 1.5 }}>{t('trust.empty')}</div>
        ) : (
          recent.map((e) => (
            <div key={e.id} className={`${s.ledgerItem} ${e.status === 'approved' ? s.ledgerApproved : ''} ${e.status === 'undone' ? s.ledgerUndone : ''}`}>
              <span className={s.ledgerLabel}>
                {e.outbound && '🔒 '}{e.label}
                {e.status === 'undone' && <span className={s.ledgerTime}>· {t('trust.undone')}</span>}
              </span>
              <span className={s.ledgerDetail}>{e.detail}</span>
              <div className={s.ledgerRow}>
                <span className={s.ledgerTime}>{e.time}</span>
                {e.status !== 'undone' && (
                  <button className={s.undoLink} onClick={() => { undoLedger(e.id); pushToast(`${t('common.undo')}: ${e.label}`); }}>↺ {t('common.undo')}</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
