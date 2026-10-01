import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Poster from "../ui/Poster.jsx";

const FOCUSABLE = "button, [href]";

export default function Lightbox({ items, index, onClose, onStep, triggerRef }) {
  const open = index !== null;
  const dialogRef = useRef(null);
  const restoreRef = useRef(null);
  const [broken, setBroken] = useState(false);
  const touchStart = useRef(null);
  const indexRef = useRef(index);
  indexRef.current = index;

  // Reads the index through a ref so `step` stays stable and the open-effect
  // does not re-run (and steal focus) on every arrow key press.
  const step = useCallback(
    (delta) => {
      const current = indexRef.current;
      if (current === null) return;
      setBroken(false);
      onStep((current + delta + items.length) % items.length);
    },
    [items.length, onStep]
  );

  useEffect(() => {
    if (!open) {
      const trigger = triggerRef?.current ?? restoreRef.current;
      if (trigger?.isConnected) trigger.focus();
      return;
    }
    setBroken(false);

    const dialog = dialogRef.current;
    restoreRef.current = document.activeElement;
    dialog?.querySelector(FOCUSABLE)?.focus();

    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      } else if (event.key === "Tab") {
        const nodes = [...dialog.querySelectorAll(FOCUSABLE)];
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, step]);

  useEffect(() => {
    if (!open) return;
    [-1, 1].forEach((delta) => {
      const neighbor = items[(index + delta + items.length) % items.length];
      if (neighbor) {
        const img = new Image();
        img.src = neighbor.src;
      }
    });
  }, [open, index, items]);

  if (!open) return null;

  const item = items[index];

  const onPointerDown = (event) => {
    touchStart.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event) => {
    if (!touchStart.current) return;
    const dx = event.clientX - touchStart.current.x;
    const dy = event.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > 48 && Math.abs(dy) < 32) step(dx < 0 ? 1 : -1);
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Photo ${index + 1} of ${items.length}: ${item.alt}`}
        className="fixed inset-0 z-[70] flex flex-col bg-[rgba(20,18,16,0.94)] px-4 py-5 sm:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        onClick={onClose}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div className="flex items-center justify-between text-[var(--color-ivory)]">
          <span className="eyebrow text-[var(--color-champagne)]">
            {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="flex h-11 w-11 items-center justify-center border border-[var(--color-champagne)]/40 transition-colors hover:border-[var(--color-gold)]"
            aria-label="Close photo viewer"
          >
            <X size={20} />
          </button>
        </div>

        <div
          className="relative flex flex-1 items-center justify-center overflow-hidden py-6"
          onClick={(e) => e.stopPropagation()}
        >
          {broken ? (
            <Poster
              seed={index + 1}
              width={1200}
              height={1500}
              alt={item.alt}
              className="max-h-full w-auto max-w-full"
            />
          ) : (
            <motion.img
              key={item.src}
              src={item.src}
              alt={item.alt}
              onError={() => setBroken(true)}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
              className="max-h-full max-w-full object-contain"
            />
          )}
        </div>

        <div className="flex items-center justify-between gap-4 pb-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => step(-1)}
            className="flex h-11 w-11 items-center justify-center border border-[var(--color-champagne)]/40 text-[var(--color-ivory)] transition-colors hover:border-[var(--color-gold)]"
            aria-label="Previous photo"
          >
            <ChevronLeft size={20} />
          </button>
          <p className="flex-1 text-center text-[0.85rem] text-[var(--color-champagne)]">{item.alt}</p>
          <button
            type="button"
            onClick={() => step(1)}
            className="flex h-11 w-11 items-center justify-center border border-[var(--color-champagne)]/40 text-[var(--color-ivory)] transition-colors hover:border-[var(--color-gold)]"
            aria-label="Next photo"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
