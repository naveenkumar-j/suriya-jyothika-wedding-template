import { wedding } from "../../data/weddingData.js";
import Section from "../ui/Section.jsx";

export default function CoupleMessage() {
  const { message } = wedding;

  return (
    <Section id="message" tone="beige">
      <div className="section-pad mx-auto w-full max-w-3xl sm:px-6">
        <div className="rounded-[20px] border-l-4 border-[var(--color-gold)] bg-[var(--color-ivory)] px-6 py-10 text-center shadow-[0_16px_40px_-24px_rgba(58,46,36,0.55)] sm:px-12">
          <h2
            id="message-title"
            className="text-[clamp(1.3rem,3.6vw,2rem)] tracking-[0.04em] text-[var(--color-maroon)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {message.heading}
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-[clamp(1rem,2.2vw,1.15rem)] leading-[1.85] text-[var(--color-brown)]">
            {message.body}
          </p>

          <p className="mt-7 text-[clamp(1.9rem,7vw,2.6rem)] leading-[0.9] text-[var(--color-gold)]" style={{ fontFamily: "var(--font-script)", fontWeight: 700 }}>
            {message.from}
          </p>
        </div>
      </div>
    </Section>
  );
}
