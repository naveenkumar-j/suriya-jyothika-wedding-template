import { motion, useReducedMotion } from "motion/react";
import { Heart } from "lucide-react";
import { wedding } from "../../data/weddingData.js";

export default function Footer() {
  const reduce = useReducedMotion();
  const { couple, footer, meta } = wedding;

  return (
    <footer className="relative z-[1] border-t border-[var(--color-gold)]/25 bg-[linear-gradient(to_bottom,var(--color-beige),#f4eee6)]">
      <div className="section-pad flex flex-col items-center text-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0 : 1.1, ease: [0.22, 0.61, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <h2
            id="footer-title"
            className="section-title text-[clamp(1.15rem,3.2vw,1.75rem)] leading-[1.4]"
          >
            {footer.title}
          </h2>

          <p className="mt-4 text-[1.05rem] text-[var(--color-brown)]">{footer.subtitle}</p>

          <p className="mt-8 flex flex-wrap items-baseline justify-center gap-x-5 text-[clamp(2.4rem,9vw,3.4rem)] leading-[1] text-[var(--color-gold)]" style={{ fontFamily: "var(--font-script)", fontWeight: 700 }}>
            {couple.one.first}
            <span className="text-[0.42em] tracking-[0.02em] text-[var(--color-maroon)]">and</span>
            {couple.other.first}
          </p>

          <p className="mt-8 text-[var(--color-brown)]">{footer.closing}</p>
          <p className="eyebrow mt-4">{meta.hashtag}</p>

          <p className="mt-8 flex items-center gap-2 text-[0.8rem] text-[var(--color-brown)]/75">
            {meta.yearLabel}
            <Heart size={12} className="text-[var(--color-maroon)]" aria-hidden="true" />
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
