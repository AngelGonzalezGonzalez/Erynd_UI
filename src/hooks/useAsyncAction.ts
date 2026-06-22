import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';

type Status = 'idle' | 'pending' | 'success' | 'error';

/**
 * useAsyncAction — the single closed-loop pattern for "processing" actions that
 * have no real backend. Runs idle → pending → success|error with a brief
 * simulated latency, drives a button's `loading` state, and fires a toast so the
 * user is never left wondering whether the action took.
 *
 *   const exportPdf = useAsyncAction(() => addLedger({…}), { successToast: t('toast.exported') });
 *   <Button loading={exportPdf.loading} onClick={exportPdf.run}>Export</Button>
 */
export function useAsyncAction(
  fn: () => void | Promise<void>,
  opts: { successToast?: string; errorToast?: string; minMs?: number } = {}
) {
  const { successToast, errorToast, minMs = 850 } = opts;
  const [status, setStatus] = useState<Status>('idle');
  const pushToast = useStore((st) => st.pushToast);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    },
    []
  );

  const run = useCallback(() => {
    setStatus((cur) => {
      if (cur === 'pending') return cur;
      const settle = window.setTimeout(async () => {
        try {
          await fn();
          setStatus('success');
          if (successToast) pushToast(successToast);
        } catch {
          setStatus('error');
          if (errorToast) pushToast(errorToast);
        }
        timers.current.push(window.setTimeout(() => setStatus('idle'), 1600));
      }, minMs);
      timers.current.push(settle);
      return 'pending';
    });
  }, [fn, successToast, errorToast, minMs, pushToast]);

  return { run, status, loading: status === 'pending' };
}
