import { motion, useReducedMotion } from "motion/react";
import { wedding } from "../../data/weddingData.js";
import Section from "../ui/Section.jsx";
import SectionTitle from "../ui/SectionTitle.jsx";
import SmartImage from "../ui/SmartImage.jsx";
import Petals from "../ui/Petals.jsx";

const EASE = [0.22, 0.61, 0.36, 1];

const script = {
  fontFamily: "var(--font-script)",
  fontWeight: 700,
};

export default function CoupleSection() {
  const reduce = useReducedMotion();
  const { couple } = wedding;

  const people = [
    { ...couple.one, key: "groom", from: -40 },
    { ...couple.other, key: "bride", from: 40 },
  ];

  return (
    <Section id="couple" className="relative overflow-hidden">
      {/* Behind the portraits: a heart that crosses a face reads as a smudge. */}
      <Petals shape="heart" count={16} seed={88} onlyInView />
      <div className="section-pad relative mx-auto w-full max-w-3xl sm:px-6">
        <SectionTitle id="couple-title" title="Groom & Bride" className="mb-16 sm:mb-20" />

        <div className="flex flex-col items-center gap-10">
          {people.map((person, i) => (
            <motion.div
              key={person.key}
              initial={reduce ? false : { opacity: 0, x: person.from }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.1, delay: reduce ? 0 : i * 0.12, ease: EASE }}
              className="group w-full text-center"
            >
              <div className="mx-auto mb-6 aspect-square w-[clamp(150px,46vw,230px)] overflow-hidden rounded-full border-[5px] border-[var(--color-ivory)] shadow-[0_10px_30px_-8px_rgba(58,46,36,0.4)] transition-transform duration-700 group-hover:scale-[1.04]">
                <SmartImage
                  src={person.photo.src}
                  alt={person.photo.alt}
                  width={person.photo.w}
                  height={person.photo.w}
                  seed={i + 3}
                  variant={i ? "petals" : "mandala"}
                  eager={i === 0}
                  className="h-full w-full rounded-full"
                  imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.06]"
                />
              </div>

              <h3 className="text-[clamp(2.4rem,9vw,3.4rem)] leading-[0.9] text-[var(--color-maroon)]" style={script}>
                {person.first}
              </h3>
              <p className="mt-1 text-[clamp(1.5rem,6vw,2.1rem)] leading-[0.9] text-[var(--color-gold-deep)]" style={script}>
                {person.last}
              </p>
              <p className="mx-auto mt-4 max-w-sm text-[0.98rem] text-[var(--color-brown)]">{person.family}</p>
              <p className="eyebrow mt-2 text-[clamp(0.5rem,1.6vw,0.62rem)]">{person.city}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-5" aria-hidden="true">
          <span className="h-px w-16 bg-[linear-gradient(90deg,transparent,var(--color-gold))] sm:w-24" />
          <span className="text-[clamp(3rem,12vw,4.5rem)] leading-[0.7] text-[var(--color-gold)]" style={script}>
            &amp;
          </span>
          <span className="h-px w-16 bg-[linear-gradient(90deg,var(--color-gold),transparent)] sm:w-24" />
        </div>
      </div>
    </Section>
  );
}
