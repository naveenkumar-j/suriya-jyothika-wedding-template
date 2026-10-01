import { useMemo, useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";

const HEART_PATH =
  "M12 20.8C9.6 18.6 3.2 13.8 3.2 9.2 3.2 6.2 5.5 4.2 8 4.2c1.9 0 3.3 1.1 4 2.4.7-1.3 2.1-2.4 4-2.4 2.5 0 4.8 2 4.8 5 0 4.6-6.4 9.4-8.8 11.6Z";
const HEART_COLORS = ["var(--color-maroon)", "#c9707c", "var(--color-gold)", "var(--color-maroon-deep)"];

function seeded(count, seed, shape) {
  let state = seed;
  const next = () => {
    // Deterministic so a re-render never reshuffles the drift.
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
  return Array.from({ length: count }, (_, i) => {
    const size = 6 + next() * 9;
    return {
      id: i,
      left: next() * 100,
      size: shape === "heart" ? size * 2 : size,
      duration: (shape === "heart" ? 13 : 10) + next() * 8,
      // A scroll-triggered layer has to be mid-flight the moment it appears, so
      // hearts start partway through their fall instead of queueing above it.
      delay: shape === "heart" ? -next() * 12 : next() * 9,
      drift: next() * (shape === "heart" ? 14 : 12) - (shape === "heart" ? 5 : 0),
      opacity: (shape === "heart" ? 0.5 : 0.35) + next() * 0.4,
    };
  });
}

export default function Petals({ count = 18, seed = 7, shape = "petal", onlyInView = false, className = "" }) {
  const reduce = useReducedMotion();
  const layer = useRef(null);
  const inView = useInView(layer, { amount: 0.2 });
  const drifters = useMemo(() => seeded(count, seed, shape), [count, seed, shape]);

  if (reduce) return null;
  // Off-screen drifters are pure waste, so a section layer stays empty until it
  // is actually being looked at.
  if (onlyInView && !inView) return <div ref={layer} className={`petal-layer ${className}`} aria-hidden="true" />;

  return (
    <div ref={layer} className={`petal-layer ${className}`} aria-hidden="true">
      {drifters.map((p) => {
        const style = {
          left: `${p.left}%`,
          width: `${p.size}px`,
          height: `${p.size}px`,
          opacity: p.opacity,
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
          "--petal-drift": `${p.drift}vw`,
        };

        return shape === "heart" ? (
          <svg key={p.id} className="heart" viewBox="0 0 24 24" style={style}>
            <path d={HEART_PATH} fill={HEART_COLORS[p.id % HEART_COLORS.length]} />
          </svg>
        ) : (
          <span key={p.id} className="petal" style={style} />
        );
      })}
    </div>
  );
}
