import React, { useId, useRef, useState } from 'react';
import s from './primitives.module.css';

type Side = 'top' | 'bottom' | 'left' | 'right';

/**
 * Tip — wraps any single interactive child and shows an instructional bubble on
 * hover AND keyboard focus. Reuses the brand tooltip styling. The label is never
 * the sole carrier of meaning (icons/labels stay), so it's purely additive.
 *
 *   <Tip text="Switch to light"><button>…</button></Tip>
 */
export function Tip({
  text,
  side = 'top',
  delay = 350,
  style,
  children,
}: {
  text: string;
  side?: Side;
  delay?: number;
  style?: React.CSSProperties;
  children: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const timer = useRef<number | undefined>(undefined);

  if (!text) return children;

  const show = (instant?: boolean) => {
    window.clearTimeout(timer.current);
    if (instant) setOpen(true);
    else timer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };

  return (
    <span
      className={s.tipWrap}
      style={style}
      onMouseEnter={() => show()}
      onMouseLeave={hide}
      onFocusCapture={() => show(true)}
      onBlurCapture={hide}
    >
      {React.cloneElement(children as React.ReactElement<{ 'aria-describedby'?: string }>, {
        'aria-describedby': open ? id : undefined,
      })}
      {open && (
        <span role="tooltip" id={id} className={`${s.tipBubble} ${s[`tip_${side}`]}`}>
          {text}
        </span>
      )}
    </span>
  );
}
