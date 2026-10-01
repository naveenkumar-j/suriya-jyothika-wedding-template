import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Mail, MailOpen } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { wedding } from "../../data/weddingData.js";
import { resolveFrames } from "../../assets/intro/manifest.js";
import { useFramePreload } from "../../hooks/useFramePreload.js";
import Poster from "../ui/Poster.jsx";
import Petals from "../ui/Petals.jsx";
import IntroFlipbook from "./IntroFlipbook.jsx";

const EASE = [0.22, 0.61, 0.36, 1];

export default function OpeningScreen() {
  const { begin, finishIntro } = useApp();
  const reduce = useReducedMotion();
  const { meta, couple, intro, decor } = wedding;

  const frames = useMemo(() => resolveFrames(intro), [intro]);
  const { failed } = useFramePreload(frames);
  const [opening, setOpening] = useState(false);
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  const openGate = () => {
    // Audio has to be unlocked here, in the click, not when the film ends.
    begin();
    if (failed) {
      finishIntro();
      return;
    }
    setOpening(true);
  };

  // The film ends on the very frame InvitationCard is already holding underneath,
  // so finishing is only a fade — the copy carries on from the same pixel.
  const handleDone = useCallback(() => finishIntro(), [finishIntro]);

  const rise = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay: reduce ? 0 : delay, ease: EASE },
  });

  const scriptName = {
    fontFamily: "var(--font-script)",
    fontWeight: 700,
    backgroundImage: "linear-gradient(135deg,var(--color-gold) 0%,var(--color-gold-deep) 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    filter: "drop-shadow(0 3px 14px rgba(20,18,16,0.55))",
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-[linear-gradient(170deg,var(--color-ivory)_0%,var(--color-beige)_58%,var(--color-champagne)_100%)]"
      exit={{ opacity: 0, transition: { duration: reduce ? 0.3 : 0.8, ease: EASE } }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="film-stage">
          {failed ? (
            <Poster
              seed={11}
              variant="border"
              width={576}
              height={1024}
              alt={intro.alt}
              className="absolute inset-0 h-full w-full"
            />
          ) : opening ? (
            <IntroFlipbook
              frames={frames}
              fps={intro.fps}
              alt={intro.alt}
              onDone={handleDone}
            />
          ) : (
            <img
              src={frames[0]}
              alt={intro.alt}
              width={576}
              height={1024}
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          <AnimatePresence>
            {!opening && (
              <motion.div
                key="gate"
                className="absolute inset-0"
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.55, ease: EASE }}
              >
                <div
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(42,27,27,0.8)_0%,rgba(42,27,27,0.4)_34%,rgba(42,27,27,0.56)_66%,rgba(42,27,27,0.86)_100%)]"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(88%_54%_at_50%_44%,rgba(42,27,27,0.72)_0%,rgba(42,27,27,0.32)_56%,rgba(42,27,27,0)_80%)]"
                  aria-hidden="true"
                />
                <Petals count={16} seed={23} />

                <div className="relative flex h-full flex-col items-center justify-center overflow-y-auto px-5 py-6 text-center">
                  <motion.img
                    src={decor.ganesha}
                    alt=""
                    width={512}
                    height={512}
                    {...rise(0.1)}
                    className="h-auto w-[clamp(2.6rem,12cqw,4rem)] shrink-0 object-contain"
                    style={{ filter: "brightness(1.35) saturate(0.8) sepia(0.25) drop-shadow(0 2px 10px rgba(244,228,184,0.35))" }}
                  />

                  <motion.p
                    className="mt-5 text-[clamp(0.62rem,2.9cqw,0.86rem)] italic text-[var(--color-ivory)]"
                    style={{
                      fontFamily: "var(--font-heading)",
                      letterSpacing: "0.12em",
                      textShadow: "0 1px 10px rgba(20,18,16,0.85)",
                    }}
                    {...rise(0.2)}
                  >
                    {meta.welcomeLine}
                  </motion.p>

                  <motion.h1
                    ref={headingRef}
                    tabIndex={-1}
                    className="mt-1 flex flex-col items-center leading-[0.9] outline-none"
                    {...rise(0.3)}
                  >
                    <span
                      className="text-[clamp(2.6rem,17cqw,4.6rem)] text-[var(--color-gold)]"
                      style={scriptName}
                    >
                      {couple.one.first}
                    </span>
                    <span
                      className="-mt-3 text-[clamp(2rem,13cqw,3.4rem)] text-[var(--color-champagne)]"
                      style={{
                        ...scriptName,
                        backgroundImage:
                          "linear-gradient(135deg,var(--color-champagne) 0%,var(--color-gold) 100%)",
                      }}
                    >
                      &amp;
                    </span>
                    <span
                      className="-mt-3 text-[clamp(2.6rem,17cqw,4.6rem)]"
                      style={scriptName}
                    >
                      {couple.other.first}
                    </span>
                  </motion.h1>

                  <motion.button
                    type="button"
                    onClick={openGate}
                    className="group pill-gold relative mt-8 mb-1 w-[min(70cqw,260px)] shrink-0 overflow-hidden"
                    {...rise(0.46)}
                  >
                    <span
                      className="pointer-events-none absolute inset-y-0 -left-full w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] transition-[left] duration-700 group-hover:left-full"
                      aria-hidden="true"
                    />
                    <Mail size={17} className="relative shrink-0 group-hover:hidden" aria-hidden="true" />
                    <MailOpen size={17} className="relative hidden shrink-0 group-hover:block" aria-hidden="true" />
                    <span className="relative">{meta.cta}</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
