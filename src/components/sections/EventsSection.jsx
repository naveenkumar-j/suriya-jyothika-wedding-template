import { motion, useReducedMotion } from "motion/react";
import { MapPin } from "lucide-react";
import { wedding } from "../../data/weddingData.js";
import Section from "../ui/Section.jsx";
import SectionTitle from "../ui/SectionTitle.jsx";
import SmartImage from "../ui/SmartImage.jsx";

const EASE = [0.22, 0.61, 0.36, 1];

export default function EventsSection() {
  const reduce = useReducedMotion();
  const { events, venue } = wedding;

  return (
    <Section id="events" tone="beige">
      <div className="section-pad mx-auto w-full max-w-5xl sm:px-6">
        <SectionTitle
          id="events-title"
          title="The Celebrations"
          subtitle="Two settings of the same day — the vows in the morning, the welcome afterwards."
          className="mb-14 sm:mb-20"
        />

        <ol className="grid list-none gap-12 p-0 md:grid-cols-2 md:gap-16">
          {events.map((event, i) => (
            <motion.li
              key={event.id}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : (i % 2) * 0.12, ease: EASE }}
              className="flex flex-col items-center rounded-[24px] border border-[var(--color-gold)]/30 bg-[var(--color-ivory)] px-5 py-8 text-center shadow-[0_24px_54px_-34px_rgba(58,46,36,0.6)] sm:px-8"
            >
              <h3
                className="text-[clamp(2.4rem,10vw,3.25rem)] leading-[0.95] text-[var(--color-gold)]"
                style={{ fontFamily: "var(--font-script)", fontWeight: 700 }}
              >
                {event.name}
              </h3>

              <p className="mt-4 text-[clamp(0.56rem,1.9vw,0.78rem)] uppercase tracking-[0.22em] text-[var(--color-charcoal)]/80" style={{ fontFamily: "var(--font-heading)" }}>
                {event.date}
              </p>
              <p className="mt-2 text-[clamp(0.52rem,1.7vw,0.72rem)] uppercase tracking-[0.2em] text-[var(--color-gold-deep)]" style={{ fontFamily: "var(--font-ui)" }}>
                {event.day} · {event.time}
              </p>

              <SmartImage
                src={event.image?.src}
                alt={event.image?.alt ?? `${event.name} celebration artwork`}
                width={1000}
                height={1250}
                seed={i + 5}
                variant={event.art}
                className="mt-6 aspect-[4/5] w-full rounded-2xl border border-[var(--color-gold)]/25"
                imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:scale-[1.04]"
              />

              <p className="mt-7 text-[clamp(0.48rem,1.5vw,0.62rem)] uppercase tracking-[0.26em] text-[var(--color-brown)]" style={{ fontFamily: "var(--font-ui)" }}>
                Venue
              </p>
              <p className="mt-3 text-[clamp(0.95rem,3.4vw,1.4rem)] uppercase tracking-[0.1em] text-[var(--color-gold)]" style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
                {event.venue}
              </p>
              <p className="mt-3 text-[clamp(0.62rem,1.9vw,0.85rem)] uppercase tracking-[0.12em] text-[var(--color-charcoal)]/70" style={{ fontFamily: "var(--font-heading)" }}>
                {venue.line1}
              </p>
              <p className="mt-2 text-[clamp(0.7rem,2.1vw,0.95rem)] uppercase tracking-[0.08em] text-[var(--color-maroon)]" style={{ fontFamily: "var(--font-heading)" }}>
                {venue.city}
              </p>

              <p className="mt-5 max-w-sm text-[0.95rem] italic leading-[1.7] text-[var(--color-brown)]">
                {event.text}
              </p>

              <p className="mt-3 text-[clamp(0.46rem,1.4vw,0.58rem)] uppercase tracking-[0.2em] text-[var(--color-gold-deep)]/85" style={{ fontFamily: "var(--font-ui)" }}>
                Attire · {event.dress}
              </p>

              <a
                href={venue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-[var(--color-gold)]/55 px-7 py-2.5 text-[clamp(0.46rem,1.4vw,0.58rem)] uppercase tracking-[0.2em] text-[var(--color-gold-deep)] transition-colors duration-500 hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                <MapPin size={13} aria-hidden="true" />
                View on Maps
              </a>
            </motion.li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
