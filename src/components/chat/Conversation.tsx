import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../i18n/useI18n';
import { useStore } from '../../store/useStore';
import { Message } from './Message';
import c from './chat.module.css';

const promptKeys = ['prompt.briefing', 'prompt.sentiment', 'prompt.respond', 'prompt.journalist', 'prompt.actions', 'prompt.roi'];

export function Conversation() {
  const { t } = useI18n();
  const messages = useStore((s) => s.messages);
  const busy = useStore((s) => s.busy);
  const send = useStore((s) => s.send);
  const [draft, setDraft] = useState('');
  const threadRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const submit = () => {
    const text = draft.trim();
    if (!text || busy) return;
    send(text);
    setDraft('');
    if (taRef.current) taRef.current.style.height = 'auto';
  };

  return (
    <div className={c.conversation}>
      <div className={c.thread} ref={threadRef}>
        <div className={c.threadInner}>
          {messages.map((m) => (
            <Message key={m.id} msg={m} />
          ))}
        </div>
      </div>

      <div className={c.composerWrap}>
        <div className={c.composerInner}>
          <div className={c.prompts}>
            {promptKeys.map((p) => (
              <button key={p} className={c.promptChip} onClick={() => send(t(p))} disabled={busy}>
                {t(p)}
              </button>
            ))}
          </div>
          <div className={c.composer}>
            <textarea
              ref={taRef}
              className={c.composerInput}
              placeholder={t('composer.placeholder')}
              rows={1}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
            />
            <button className={c.sendBtn} onClick={submit} disabled={!draft.trim() || busy} aria-label={t('composer.send')}>
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                <path d="M4 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className={c.slashHint}>{t('shell.commandHint')} · ⌘K</div>
        </div>
      </div>
    </div>
  );
}
