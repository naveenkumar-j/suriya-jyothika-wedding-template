import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown, MapPin } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { wedding } from "../../data/weddingData.js";
import { resolveFrames } from "../../assets/intro/manifest.js";
import Poster from "../ui/Poster.jsx";
import Petals from "../ui/Petals.jsx";

const EASE = [0.22, 0.61, 0.36, 1];

const eyebrow = {
  fontFamily: "var(--font-heading)",
  letterSpacing: "0.14em",
};

const names = {
  fontFamily: "var(--font-script)",
  fontWeight: 700,
  backgroundImage: "linear-gradient(135deg,var(--color-gold-deep) 0%,var(--color-maroon) 100%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
};

export default function InvitationCard() {
  const { introDone } = useApp();
  const reduce = useReducedMotion();
  const { meta, couple, intro, venue, decor } = wedding;
  // The first event is the ceremony the card advertises; keying off the list
  // position means renaming or reordering the ids can never blank out the card.
  const ceremony = wedding.events[0];

  const frames = useMemo(() => resolveFrames(intro), [intro]);
  const [frameFailed, setFrameFailed] = useState(false);

  // The overlay hands this frame over pixel for pixel, so the copy must wait
  // for `introDone` rather than animate behind it.
  const rise = (delay) => ({
    initial: { opacity: 0, y: 14 },
    animate: introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    transition: { duration: reduce ? 0 : 0.9, delay: reduce ? 0 : delay, ease: EASE },
  });

  const toCouple = () => {
    const el = document.getElementById("couple");
    if (!el) return;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <section
      id="home"
      aria-label="Wedding invitation"
      className="svh sticky top-0 z-0 flex items-center justify-center bg-[linear-gradient(135deg,var(--color-ivory)_0%,var(--color-champagne)_50%,var(--color-ivory)_100%)]"
    >
      <div className="film-stage">
        {frameFailed ? (
          <Poster
            seed={11}
            variant="border"
            width={576}
            height={1024}
            alt={intro.alt}
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <img
            src={frames[frames.length - 1]}
            alt={intro.alt}
            width={576}
            height={1024}
            fetchPriority="high"
            decoding="async"
            onError={() => setFrameFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(250,248,245,0.62)_0%,rgba(250,248,245,0.9)_18%,rgba(250,248,245,0.95)_44%,rgba(250,248,245,0.94)_70%,rgba(250,248,245,0.82)_100%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(88%_52%_at_50%_48%,rgba(250,248,245,0.95)_0%,rgba(250,248,245,0.6)_62%,rgba(250,248,245,0)_86%)]"
          aria-hidden="true"
        />

        <motion.img
          src={decor.floralLeft}
          alt=""
          initial={reduce ? false : { opacity: 0, x: -30 }}
          animate={introDone ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.2, ease: EASE }}
          className="pointer-events-none absolute left-0 top-0 z-[2] w-[clamp(64px,26cqw,150px)] shrink-0"
        />
        <motion.img
          src={decor.floralRight}
          alt=""
          initial={reduce ? false : { opacity: 0, x: 30 }}
          animate={introDone ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.2, ease: EASE }}
          className="pointer-events-none absolute right-0 top-0 z-[2] w-[clamp(64px,26cqw,150px)] shrink-0"
        />
        <Petals count={12} seed={41} />

        <div className="relative flex h-full flex-col items-center justify-center overflow-y-auto px-6 py-8 text-center">
          <motion.img
            src={decor.ganesha}
            alt=""
            width={512}
            height={512}
            {...rise(0.06)}
            className="h-auto w-[clamp(2.1rem,9.5cqw,3.2rem)] shrink-0 object-contain drop-shadow-[0_3px_8px_rgba(139,47,57,0.25)]"
          />

          <motion.p
            className="veil-text mt-3 text-[clamp(0.56rem,2.5cqw,0.78rem)] text-[var(--color-maroon)]"
            style={eyebrow}
            {...rise(0.14)}
          >
            {meta.inviteLine}
          </motion.p>

          <h1 className="mt-1 flex flex-col items-center leading-[0.92] drop-shadow-[0_2px_10px_rgba(250,248,245,0.95)]">
            <motion.span
              className="text-[clamp(2.6rem,17cqw,4.6rem)]"
              style={names}
              {...rise(0.2)}
            >
              {couple.one.first}
            </motion.span>

            <motion.span
              className="-mt-3 text-[clamp(2rem,13cqw,3.4rem)] text-[var(--color-gold)]"
              style={{ fontFamily: "var(--font-script)", fontWeight: 700 }}
              {...rise(0.26)}
            >
              &amp;
            </motion.span>

            <motion.span
              className="-mt-3 text-[clamp(2.6rem,17cqw,4.6rem)]"
              style={names}
              {...rise(0.32)}
            >
              {couple.other.first}
            </motion.span>
          </h1>

          <motion.span
            className="mt-6 block h-px w-[30cqw] max-w-28 bg-[linear-gradient(90deg,transparent,var(--color-gold),transparent)]"
            {...rise(0.4)}
          />

          <motion.p
            className="veil-text mt-6 text-[clamp(0.52rem,2.3cqw,0.72rem)] text-[var(--color-gold-deep)]"
            style={eyebrow}
            {...rise(0.46)}
          >
            {ceremony.name}:
          </motion.p>
          <motion.p
            className="veil-text mt-1.5 text-[clamp(1.1rem,5cqw,1.75rem)] font-semibold leading-[1.3] text-[var(--color-maroon)]"
            style={{ fontFamily: "var(--font-ui)" }}
            {...rise(0.52)}
          >
            {ceremony.time}
          </motion.p>
          <motion.p
            className="veil-text mt-1.5 text-[clamp(0.8rem,3.5cqw,1.15rem)] font-semibold tracking-[0.06em] text-[var(--color-maroon)]"
            style={{ fontFamily: "var(--font-heading)" }}
            {...rise(0.58)}
          >
            {ceremony.date}
          </motion.p>

          <motion.div
            className="veil-text mt-5 flex flex-col items-center"
            {...rise(0.64)}
          >
            <p
              className="flex items-center gap-2 text-[clamp(0.85rem,3.6cqw,1.1rem)] leading-[1.4] font-semibold text-[var(--color-ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <MapPin size={16} className="shrink-0 text-[var(--color-gold-deep)]" aria-hidden="true" />
              {venue.name}
            </p>
            <p className="mt-1 text-[clamp(0.6rem,2.6cqw,0.82rem)] leading-[1.5] font-medium text-[var(--color-charcoal)]">
              {venue.line1}
              <br />
              <span className="font-semibold text-[var(--color-maroon)]">{venue.city}</span>
            </p>
          </motion.div>

          <motion.button
            type="button"
            onClick={toCouple}
            className="group mb-1 mt-7 flex min-h-[44px] shrink-0 flex-col items-center gap-2.5 text-[var(--color-maroon)]"
            {...rise(0.72)}
          >
            <span className="veil-text text-[clamp(0.5rem,2.1cqw,0.65rem)] font-medium uppercase tracking-[0.28em]">
              Scroll Down
            </span>
            {/* A gold drop walks the hairline ring and fades into the ripple,
                the cue the template's own scroll marker uses. */}
            <span className="relative flex h-11 w-11 items-center justify-center">
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-[var(--color-gold)]/55"
                animate={reduce ? {} : { scale: [1, 1.35], opacity: [0.6, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
              />
              <span
                className="absolute inset-[3px] rounded-full border border-[var(--color-gold-deep)]/70 bg-[var(--color-ivory)]/70"
                aria-hidden="true"
              />
              <motion.span
                aria-hidden="true"
                animate={reduce ? {} : { y: [-5, 6, -5], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="relative text-[var(--color-gold-deep)] transition-transform duration-500 group-hover:scale-125"
              >
                <ChevronDown size={19} />
              </motion.span>
            </span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
