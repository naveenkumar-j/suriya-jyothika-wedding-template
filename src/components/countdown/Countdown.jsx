import { useCountdown } from "../../hooks/useCountdown.js";
import { wedding } from "../../data/weddingData.js";
import Section from "../ui/Section.jsx";
import OrnamentDivider from "../ui/OrnamentDivider.jsx";

const UNITS = [
  { key: "days", label: "Days", min: 1 },
  { key: "hours", label: "Hours", min: 2 },
  { key: "minutes", label: "Minutes", min: 2 },
  { key: "seconds", label: "Seconds", min: 2 },
];

export default function Countdown() {
  const time = useCountdown(wedding.meta.dateISO);

  return (
    <Section id="countdown" tone="beige">
      <div className="section-pad flex flex-col items-center text-center">
        <h2
          id="countdown-title"
          className="section-title text-[clamp(1.4rem,4.6vw,2.2rem)]"
        >
          {time.arrived ? "Today is the day" : "We are getting married"}
        </h2>

        <p className="mt-4 text-[clamp(0.95rem,2.4vw,1.15rem)] font-medium text-[var(--color-gold-deep)]" style={{ fontFamily: "var(--font-display)" }}>
          {wedding.meta.dateLabel}, {wedding.meta.yearLabel}
        </p>

        <p className="sr-only" aria-live="polite">
          {time.arrived
            ? "The wedding day has arrived."
            : `${time.days} days, ${time.hours} hours, ${time.minutes} minutes and ${time.seconds} seconds until the ceremony.`}
        </p>

        <ul className="mt-12 grid w-full max-w-2xl list-none grid-cols-4 gap-2.5 p-0 sm:mt-16 sm:gap-5">
          {UNITS.map((unit) => (
            <li key={unit.key} className="flex min-w-0 flex-col items-center">
              <span
                data-unit={unit.key}
                aria-hidden="true"
                className="flex aspect-square w-full items-center justify-center rounded-xl border border-[var(--color-gold)]/30 bg-[var(--color-ivory)] shadow-[0_18px_34px_-24px_rgba(58,46,36,0.55)]"
              >
                <span
                  className="text-[clamp(1.35rem,6.6vw,3.25rem)] leading-none text-[var(--color-gold)]"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 500,
                    fontVariantNumeric: "lining-nums tabular-nums",
                  }}
                >
                  {String(time[unit.key]).padStart(unit.min, "0")}
                </span>
              </span>
              <span className="mt-3.5 text-[clamp(0.42rem,1.9vw,0.85rem)] uppercase tracking-[0.1em] text-[var(--color-brown)] sm:tracking-[0.14em]" style={{ fontFamily: "var(--font-heading)" }}>
                {unit.label}
              </span>
            </li>
          ))}
        </ul>

        <OrnamentDivider className="mt-14" />
      </div>
    </Section>
  );
}
