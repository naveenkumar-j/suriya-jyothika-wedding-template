import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { wedding } from "../../data/weddingData.js";
import Section from "../ui/Section.jsx";
import SectionTitle from "../ui/SectionTitle.jsx";
import SmartImage from "../ui/SmartImage.jsx";
import Lightbox from "./Lightbox.jsx";

const EASE = [0.22, 0.61, 0.36, 1];
const VARIANTS = ["petals", "lamps", "arch", "mandala", "trellis", "diya"];
// One portrait frame for every slide so the strip never changes height mid-swipe.
const FRAME = { w: 3, h: 4 };

export default function Gallery() {
  const reduce = useReducedMotion();
  const [pos, setPos] = useState(1);
  const [animate, setAnimate] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);
  const triggerRef = useRef(null);
  const touchStart = useRef(null);
  const { gallery } = wedding;
  const n = gallery.length;
  const posRef = useRef(pos);
  posRef.current = pos;

  // The strip carries a clone of the last slide in front and the first slide at
  // the back, so stepping past either end keeps travelling in the same direction
  // instead of sweeping the whole track backwards. `pos` lives in strip space:
  // 0 … n+1, with the real slides at 1 … n.
  const strip = [gallery[n - 1], ...gallery, gallery[0]];
  const index = (pos - 1 + n) % n;

  const step = useCallback(
    (delta) => {
      if (posRef.current === 0 || posRef.current === n + 1) return;
      setPos((current) => current + delta);
    },
    [n]
  );

  const snapBack = useCallback(() => {
    const at = posRef.current;
    if (at !== 0 && at !== n + 1) return;
    setAnimate(false);
    setPos(at === 0 ? n : 1);
  }, [n]);

  const onTransitionEnd = (event) => {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
    snapBack();
  };

  // transitionend can be swallowed (an interrupted swipe, a hidden tab), and a
  // slide parked on a clone has no working controls, so land it by hand too.
  useEffect(() => {
    if (pos !== 0 && pos !== n + 1) return undefined;
    const id = setTimeout(snapBack, 700);
    return () => clearTimeout(id);
  }, [pos, n, snapBack]);

  // Re-arm the transition one paint after the silent jump back onto a real slide.
  useEffect(() => {
    if (animate) return;
    let inner;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setAnimate(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [animate]);

  const moveTo = useCallback((next) => {
    setPos(next + 1);
  }, []);

  const snapTo = useCallback((next) => {
    setAnimate(false);
    setPos(next + 1);
  }, []);

  const onPointerDown = (event) => {
    touchStart.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event) => {
    if (!touchStart.current) return;
    const dx = event.clientX - touchStart.current.x;
    const dy = event.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > 48 && Math.abs(dy) < 40) step(dx < 0 ? 1 : -1);
  };

  return (
    <Section id="gallery" tone="beige">
      <div className="section-pad mx-auto w-full max-w-[620px] sm:px-6">
        <SectionTitle
          id="gallery-title"
          title="Happy Moments"
          subtitle="Little memories and the journey that led us to say yes to forever."
          className="mb-12 sm:mb-16"
        />

        <div
          className="relative overflow-hidden border border-[var(--color-gold)]/45 bg-[#fbf8f1] p-3 shadow-[0_16px_36px_-20px_rgba(80,55,30,0.5)]"
          role="group"
          aria-roledescription="carousel"
          aria-label="Photographs"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <div className="pointer-events-none absolute inset-5 border border-[rgba(255,255,255,0.65)]" aria-hidden="true" />

          <div
            className={`flex ${
              animate
                ? "transition-transform duration-[0.55s] ease-[cubic-bezier(0.4,0,0.2,1)]"
                : "transition-none"
            }`}
            style={{ transform: `translateX(-${pos * 100}%)` }}
            onTransitionEnd={onTransitionEnd}
          >
            {strip.map((item, i) => {
              const slide = (i - 1 + n) % n;
              return (
              <div key={`${i}-${item.src}`} className="w-full flex-shrink-0" inert={i !== pos}>
                <motion.button
                  type="button"
                  onClick={(event) => {
                    triggerRef.current = event.currentTarget;
                    setOpenIndex(index);
                  }}
                  className="block w-full text-left"
                  aria-label={`Open photo: ${item.alt}`}
                  initial={reduce ? false : { opacity: 0, scale: 1.03 }}
                  animate={i === pos ? { opacity: 1, scale: 1 } : { opacity: 0.55, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <SmartImage
                    src={item.src}
                    alt={item.alt}
                    width={FRAME.w}
                    height={FRAME.h}
                    seed={slide + 9}
                    variant={VARIANTS[slide % VARIANTS.length]}
                    eager={i === 1}
                    className="w-full"
                  />
                </motion.button>
              </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous photo"
            className="absolute left-4 top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-gold)]/50 bg-[var(--color-ivory)]/85 text-[var(--color-maroon)] backdrop-blur-[2px] transition-colors duration-500 hover:bg-[var(--color-gold)] hover:text-[var(--color-ivory)]"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next photo"
            className="absolute right-4 top-1/2 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-gold)]/50 bg-[var(--color-ivory)]/85 text-[var(--color-maroon)] backdrop-blur-[2px] transition-colors duration-500 hover:bg-[var(--color-gold)] hover:text-[var(--color-ivory)]"
          >
            <ChevronRight size={18} />
          </button>

          <div className="flex items-center justify-center gap-2 pb-1 pt-4">
            {gallery.map((item, i) => (
              <button
                key={item.src}
                type="button"
                onClick={() => moveTo(i)}
                aria-label={`Show photo ${i + 1} of ${n}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i === index
                    ? "w-6 bg-[var(--color-gold)]"
                    : "w-2 bg-[var(--color-gold)]/35 hover:bg-[var(--color-gold)]/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <Lightbox
        items={gallery}
        index={openIndex}
        onClose={() => {
          if (openIndex !== null) snapTo(openIndex);
          setOpenIndex(null);
        }}
        onStep={setOpenIndex}
        triggerRef={triggerRef}
      />
    </Section>
  );
}
