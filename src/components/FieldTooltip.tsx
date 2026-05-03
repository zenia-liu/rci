import { createPortal } from 'react-dom';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

type Props = {
  text: string;
};

const CLOSE_MS = 280;
const MARGIN = 8;
const GAP = 6;

function preliminaryPos(btn: HTMLElement) {
  const rect = btn.getBoundingClientRect();
  const vw = window.innerWidth;
  const maxW = Math.min(280, vw - MARGIN * 2);
  let left = rect.left + rect.width / 2 - maxW / 2;
  left = Math.max(MARGIN, Math.min(left, vw - maxW - MARGIN));
  return { left, top: rect.bottom + GAP };
}

export function FieldTooltip({ text }: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0 });

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_MS);
  }, [cancelClose]);

  const updatePosition = useCallback(() => {
    const btn = btnRef.current;
    const tip = tipRef.current;
    if (!btn || !tip) return;

    const rect = btn.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const maxW = Math.min(280, vw - MARGIN * 2);
    tip.style.maxWidth = `${maxW}px`;

    const w = tip.offsetWidth || maxW;
    const h = tip.offsetHeight || 72;

    let left = rect.left + rect.width / 2 - w / 2;
    left = Math.max(MARGIN, Math.min(left, vw - w - MARGIN));

    let top = rect.bottom + GAP;
    if (top + h > vh - MARGIN) {
      top = rect.top - h - GAP;
    }
    top = Math.max(MARGIN, Math.min(top, vh - h - MARGIN));

    setPos({ left, top });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    const id = requestAnimationFrame(() => updatePosition());

    const onReposition = () => updatePosition();
    window.addEventListener('resize', onReposition);
    window.addEventListener('scroll', onReposition, true);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', onReposition);
      window.removeEventListener('scroll', onReposition, true);
    };
  }, [open, text, updatePosition]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
    };
  }, []);

  const portal =
    open &&
    createPortal(
      <div
        ref={tipRef}
        role="tooltip"
        className="pointer-events-auto fixed z-[10000] box-border max-w-[min(280px,calc(100vw-16px))] border border-terminal-border bg-[#0a0a0a] p-2 text-[10px] leading-snug text-terminal-text shadow-none"
        style={{ left: pos.left, top: pos.top }}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        {text}
      </div>,
      document.body,
    );

  return (
    <>
      <span className="relative inline-flex align-middle">
        <button
          ref={btnRef}
          type="button"
          className="ml-0.5 inline-flex h-4 w-4 items-center justify-center border border-terminal-border bg-black font-mono-data text-[9px] text-terminal-amber hover:bg-[rgba(255,140,0,0.1)]"
          aria-label="指标说明"
          onMouseEnter={() => {
            cancelClose();
            const btn = btnRef.current;
            if (btn) setPos(preliminaryPos(btn));
            setOpen(true);
          }}
          onMouseLeave={scheduleClose}
        >
          ?
        </button>
      </span>
      {portal}
    </>
  );
}
