import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { wedding } from "../../data/weddingData.js";
import { submitReply } from "../../lib/rsvpStore.js";
import Section from "../ui/Section.jsx";
import SectionTitle from "../ui/SectionTitle.jsx";
import OrnamentDivider from "../ui/OrnamentDivider.jsx";

const LABEL =
  "block pb-2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-gold-deep)]";

const FIELD =
  "w-full min-h-[44px] rounded-none border-0 border-b border-[var(--color-gold)]/40 bg-transparent px-0 py-2.5 text-[1.05rem] text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-brown)]/55 focus:border-[var(--color-gold-deep)]";

const CARD =
  "rounded-[24px] border border-[var(--color-gold)]/35 bg-[#fffdf8] px-5 py-9 shadow-[0_26px_56px_-34px_rgba(58,46,36,0.65)] sm:px-10 sm:py-11";

export default function RSVP() {
  const reduce = useReducedMotion();
  const { rsvp, couple } = wedding;
  const [values, setValues] = useState({
    name: "",
    contact: "",
    guests: "1",
    attendance: "accept",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(null);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");

  const set = (key) => (event) => {
    setValues((v) => ({ ...v, [key]: event.target.value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const next = {};
    if (!values.name.trim()) next.name = "Please tell us your name.";
    if (!values.contact.trim()) next.contact = "An email or phone number helps us reach you.";
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(Object.keys(next)[0])?.focus();
      return;
    }
    setBusy(true);
    setFailure("");
    try {
      await submitReply(values);
      setSent(values.attendance);
    } catch (error) {
      setFailure(error.message);
    } finally {
      setBusy(false);
    }
  };

  const firstName = values.name.trim().split(" ")[0];

  if (sent) {
    return (
      <Section id="rsvp">
        <div className="section-pad mx-auto w-full max-w-xl">
          <motion.div
            className={`${CARD} text-center`}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <OrnamentDivider />
            <p className={`${LABEL} mt-8`} style={{ fontFamily: "var(--font-heading)" }}>
              {sent === "accept" ? "Joyfully accepted" : "Regretfully noted"}
            </p>
            <h2
              id="rsvp-title"
              className="mt-3 text-[clamp(1.6rem,5.5vw,2.3rem)] leading-[1.25] text-[var(--color-maroon)]"
              style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.05em" }}
            >
              {sent === "accept"
                ? "We can't wait to see you"
                : "Thank you for letting us know"}
            </h2>
            <p className="mt-6 text-[var(--color-charcoal)]">
              {sent === "accept"
                ? `Your reply is saved, ${firstName}. ${couple.one.first} and ${couple.other.first} will be in touch closer to the day with directions and timings.`
                : `Thank you, ${firstName}. You will be missed, and we will raise a glass in your honour.`}
            </p>
            <button
              type="button"
              onClick={() => setSent(null)}
              className="link-quiet mx-auto mt-10"
            >
              Edit my reply
            </button>
          </motion.div>
        </div>
      </Section>
    );
  }

  return (
    <Section id="rsvp">
      <div className="section-pad mx-auto w-full max-w-xl">
        <SectionTitle
          id="rsvp-title"
          title={rsvp.headline}
          subtitle={rsvp.subline}
          className="mb-12"
        />

        <motion.form
          noValidate
          onSubmit={submit}
          className={`${CARD} flex flex-col gap-8`}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: reduce ? 0 : 0.9, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div>
            <label htmlFor="name" className={LABEL} style={{ fontFamily: "var(--font-heading)" }}>
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={set("name")}
              className={FIELD}
              placeholder="Your full name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-2 text-[0.8rem] text-[var(--color-maroon)]">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contact" className={LABEL} style={{ fontFamily: "var(--font-heading)" }}>
              Email or phone
            </label>
            <input
              id="contact"
              name="contact"
              type="text"
              autoComplete="tel"
              value={values.contact}
              onChange={set("contact")}
              className={FIELD}
              placeholder="How we may reach you"
              aria-invalid={Boolean(errors.contact)}
              aria-describedby={errors.contact ? "contact-error" : undefined}
            />
            {errors.contact && (
              <p id="contact-error" className="mt-2 text-[0.8rem] text-[var(--color-maroon)]">
                {errors.contact}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="guests" className={LABEL} style={{ fontFamily: "var(--font-heading)" }}>
              Number of guests
            </label>
            <select
              id="guests"
              name="guests"
              value={values.guests}
              onChange={set("guests")}
              className={FIELD}
            >
              {Array.from({ length: rsvp.maxGuests }, (_, i) => String(i + 1)).map((n) => (
                <option key={n} value={n}>
                  {n} {n === "1" ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </div>

          <fieldset className="border-0 p-0">
            <legend className={LABEL} style={{ fontFamily: "var(--font-heading)" }}>
              Will you be there?
            </legend>
            <div className="flex flex-col gap-3 sm:flex-row">
              {rsvp.attendanceOptions.map((option) => {
                const selected = values.attendance === option.value;
                return (
                  <label
                    key={option.value}
                    className={`flex min-h-[48px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border px-5 py-3 transition-colors ${
                      selected
                        ? "border-[var(--color-gold)] bg-[linear-gradient(135deg,var(--color-gold)_0%,var(--color-gold-deep)_100%)] text-[var(--color-ivory)] shadow-[0_12px_26px_-16px_rgba(212,175,55,0.9)]"
                        : "border-[var(--color-gold)]/45 bg-[var(--color-beige)]/60 text-[var(--color-maroon)] hover:border-[var(--color-gold)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="attendance"
                      value={option.value}
                      checked={selected}
                      onChange={set("attendance")}
                      className="sr-only"
                    />
                    {selected && <Check size={15} aria-hidden="true" />}
                    <span
                      className="text-[0.68rem] font-semibold uppercase tracking-[0.16em]"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div>
            <label htmlFor="rsvp-message" className={LABEL} style={{ fontFamily: "var(--font-heading)" }}>
              A message for the couple
            </label>
            <textarea
              id="rsvp-message"
              name="message"
              rows={3}
              value={values.message}
              onChange={set("message")}
              className={`${FIELD} resize-none`}
              placeholder="Blessings, song requests, anything at all"
            />
          </div>

          {failure && (
            <p role="alert" className="text-center text-[0.85rem] text-[var(--color-maroon)]">
              {failure}
            </p>
          )}

          <button type="submit" disabled={busy} className="pill-gold mx-auto px-12 py-4 disabled:opacity-60">
            {busy ? "Sending…" : "Send Reply"}
          </button>
        </motion.form>
      </div>
    </Section>
  );
}
