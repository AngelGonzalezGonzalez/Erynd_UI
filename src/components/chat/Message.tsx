import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import { Aperture, Button } from '../primitives';
import { ArtifactFrame } from './ArtifactFrame';
import { artifactForKind } from '../../data/assistant';
import type { ChatMessage } from '../../lib/types';
import c from './chat.module.css';

export function Message({ msg }: { msg: ChatMessage }) {
  const { t } = useI18n();
  const pushAssistant = useStore((s) => s.pushAssistant);
  const addLedger = useStore((s) => s.addLedger);
  const pushToast = useStore((s) => s.pushToast);

  if (msg.author === 'user') {
    return (
      <div className={`${c.msg} ${c.msgUser}`}>
        <div className={c.bubbleUser}>{msg.text}</div>
      </div>
    );
  }

  if (msg.pending) {
    return (
      <div className={`${c.msg} ${c.assistant}`}>
        <div className={c.assistantHead}>
          <Aperture size={20} spin className={c.assistantAvatar} />
          <span className={c.thinking}>{t('composer.thinking')}…</span>
        </div>
      </div>
    );
  }

  const text = msg.textKey ? t(msg.textKey) : msg.text;

  const acceptProposal = () => {
    if (!msg.proposal) return;
    const led = addLedger({
      kind: msg.proposal.outbound ? 'queued' : 'drafted',
      label: msg.proposal.actionLabel,
      detail: t(msg.proposal.title),
      outbound: msg.proposal.outbound,
      status: msg.proposal.outbound ? 'pending_approval' : 'done',
    });
    pushToast(msg.proposal.actionLabel, led);
    pushAssistant({ artifact: artifactForKind(msg.proposal.kind, msg.proposal.title) });
  };

  return (
    <div className={`${c.msg} ${c.assistant}`}>
      <div className={c.assistantHead}>
        <Aperture size={20} className={c.assistantAvatar} />
        <span className={c.time}>{msg.time}</span>
      </div>
      {text && <div className={c.assistantText}>{text}</div>}
      {msg.artifact && <ArtifactFrame artifact={msg.artifact} />}
      {msg.proposal && (
        <div className={c.proposal}>
          <span className={c.proposalText}>
            {msg.proposal.outbound ? `🔒 ${t('trust.gateNote')}` : t('trust.l1.desc')}
          </span>
          <Button variant="accent" size="sm" onClick={acceptProposal}>{msg.proposal.actionLabel}</Button>
        </div>
      )}
    </div>
  );
}
