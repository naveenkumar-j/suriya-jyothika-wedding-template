import { motion, useReducedMotion } from "motion/react";

export default function Section({ id, label, children, className = "", tone = "ivory" }) {
  const reduce = useReducedMotion();

  const background =
    tone === "beige" ? "bg-[var(--color-beige)]" : tone === "dark" ? "bg-[var(--color-charcoal)]" : "bg-[var(--color-ivory)]";

  return (
    <motion.section
      id={id}
      aria-labelledby={label ? `${id}-title` : undefined}
      className={`${background} ${className}`}
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: "some" }}
      transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}
