import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, Download, RefreshCw, Search, Trash2 } from "lucide-react";
import { wedding } from "../data/weddingData.js";
import { clearReplies, isRemote, loadReplies } from "../lib/rsvpStore.js";
import OrnamentDivider from "../components/ui/OrnamentDivider.jsx";

const DAY = 86_400_000;
const EASE = [0.22, 0.61, 0.36, 1];

const CAPTION =
  "text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-gold-deep)]";

const OUTLINE =
  "inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--color-gold)]/55 px-5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-deep)] transition-colors hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 disabled:cursor-not-allowed disabled:opacity-40";

const PANEL =
  "rounded-[24px] border border-[var(--color-gold)]/30 bg-[var(--color-ivory)] px-5 py-7 shadow-[0_24px_54px_-34px_rgba(58,46,36,0.6)] sm:px-7";

function stamp(iso) {
  const at = new Date(iso);
  return {
    date: at.toLocaleDateString(undefined, { day: "numeric", month: "short" }),
    time: at.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
  };
}

function rise(delay, reduce) {
  return {
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0 : 0.7, delay: reduce ? 0 : delay, ease: EASE },
  };
}

function Panel({ title, note, children, ...reveal }) {
  return (
    <motion.section {...reveal} className={`${PANEL} flex flex-col`}>
      <h2 className={`text-center ${CAPTION}`} style={{ fontFamily: "var(--font-heading)" }}>
        {title}
      </h2>
      {note && <p className="mt-2 text-center text-[0.78rem] italic text-[var(--color-brown)]">{note}</p>}
      <div className="mt-6 flex flex-1 flex-col justify-center">{children}</div>
    </motion.section>
  );
}

function Tile({ value, label, hint }) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex aspect-square w-full items-center justify-center rounded-xl border border-[var(--color-gold)]/30 bg-[var(--color-ivory)] shadow-[0_18px_34px_-24px_rgba(58,46,36,0.55)]">
        <span
          className="text-[clamp(1.4rem,4.6vw,2.6rem)] leading-none text-[var(--color-gold)]"
          style={{ fontFamily: "var(--font-heading)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}
        >
          {value}
        </span>
      </span>
      <span
        className="mt-3 text-center text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-brown)] sm:text-[0.66rem]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {label}
      </span>
      {hint && (
        <span className="mt-1 text-center text-[0.7rem] italic text-[var(--color-brown)]/80">{hint}</span>
      )}
    </div>
  );
}

function Badge({ accepted }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] ${
        accepted
          ? "border-[var(--color-gold)]/60 bg-[var(--color-gold)]/12 text-[var(--color-gold-deep)]"
          : "border-[var(--color-maroon)]/35 bg-[var(--color-maroon)]/8 text-[var(--color-maroon)]"
      }`}
      style={{ fontFamily: "var(--font-heading)" }}
    >
      {accepted ? "Accepting" : "Declining"}
    </span>
  );
}

const PASSCODE_KEY = "tn-rsvp-passcode";

function PasscodeGate({ onUnlock, remote }) {
  const [value, setValue] = useState("");
  return (
    <div className="flex min-h-svh items-center justify-center bg-[linear-gradient(135deg,var(--color-ivory)_0%,var(--color-champagne)_55%,var(--color-ivory)_100%)] px-4 py-12">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (value.trim()) onUnlock(value.trim());
        }}
        className="w-full max-w-sm rounded-[24px] border border-[var(--color-gold)]/35 bg-[#fffdf8] px-6 py-9 text-center shadow-[0_26px_56px_-34px_rgba(58,46,36,0.65)]"
      >
        <OrnamentDivider />
        <p className={`${CAPTION} mt-7`} style={{ fontFamily: "var(--font-heading)" }}>
          Host access
        </p>
        <h1 className="section-title mt-2 text-[clamp(1.4rem,5vw,1.9rem)]">Guest list</h1>
        <p className="mt-4 text-[0.92rem] text-[var(--color-brown)]">
          {remote
            ? "Enter the passcode from the Google Apps Script deployment."
            : "Set a passcode for this browser — replies are only stored here, so it is checked against itself from now on."}
        </p>
        <label htmlFor="passcode" className="sr-only">
          Passcode
        </label>
        <input
          id="passcode"
          type="password"
          autoComplete="off"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="mt-6 w-full min-h-[44px] border-0 border-b border-[var(--color-gold)]/40 bg-transparent py-2.5 text-center text-[1.05rem] tracking-[0.2em] text-[var(--color-ink)] outline-none focus:border-[var(--color-gold-deep)]"
        />
        <button type="submit" disabled={!value.trim()} className="pill-gold mt-8 w-full justify-center">
          Open
        </button>
        <a href="." className={`${OUTLINE} mt-5 w-full justify-center`}>
          <ArrowLeft size={14} aria-hidden="true" />
          Back to invitation
        </a>
      </form>
    </div>
  );
}

function ClearDialog({ onConfirm, onCancel }) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");

  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setFailure("");
    try {
      await onConfirm(value.trim());
    } catch (error) {
      setFailure(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[rgba(42,27,27,0.58)] px-4 py-10 backdrop-blur-[2px]"
      role="presentation"
      onClick={onCancel}
    >
      <form
        onSubmit={submit}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="clear-title"
        className="w-full max-w-sm rounded-[24px] border border-[var(--color-gold)]/35 bg-[#fffdf8] px-6 py-9 text-center shadow-[0_26px_56px_-30px_rgba(20,12,10,0.8)]"
      >
        <OrnamentDivider />
        <p className={`${CAPTION} mt-7`} style={{ fontFamily: "var(--font-heading)" }}>
          Danger zone
        </p>
        <h2
          id="clear-title"
          className="section-title mt-2 text-[clamp(1.3rem,5vw,1.8rem)]"
        >
          Clear every reply?
        </h2>
        <p className="mt-4 text-[0.92rem] text-[var(--color-brown)]">
          This deletes the whole guest list and cannot be undone. Re-enter the host passcode to
          confirm.
        </p>
        <label htmlFor="clear-passcode" className="sr-only">
          Host passcode
        </label>
        <input
          id="clear-passcode"
          type="password"
          autoComplete="off"
          autoFocus
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="mt-6 w-full min-h-[44px] border-0 border-b border-[var(--color-gold)]/40 bg-transparent py-2.5 text-center text-[1.05rem] tracking-[0.2em] text-[var(--color-ink)] outline-none focus:border-[var(--color-gold-deep)]"
        />
        {failure && (
          <p role="alert" className="mt-4 text-[0.85rem] text-[var(--color-maroon)]">
            {failure}
          </p>
        )}
        <button type="submit" disabled={busy || !value.trim()} className="pill-gold mt-8 w-full justify-center">
          {busy ? "Clearing…" : "Clear everything"}
        </button>
        <button type="button" onClick={onCancel} className={`${OUTLINE} mt-4 w-full justify-center`}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default function AnalyticsPage() {
  const reduce = useReducedMotion();
  const { couple, decor, meta, rsvp } = wedding;
  const [passcode, setPasscode] = useState(() => sessionStorage.getItem(PASSCODE_KEY) ?? "");
  const [replies, setReplies] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");
  const [armed, setArmed] = useState(false);

  // The guest list is private either way, so the page always opens behind the
  // passcode — a Sheet deployment checks it server-side, a local store against
  // the key this browser claimed first.
  const locked = !passcode;

  const load = useCallback(async (code) => {
    setStatus("loading");
    setError("");
    try {
      setReplies(await loadReplies(code));
      setStatus("ready");
    } catch (failure) {
      setReplies([]);
      setError(failure.message);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (locked) return;
    load(passcode);
  }, [locked, load, passcode]);

  // In local mode another tab's reply fires `storage` here.
  useEffect(() => {
    if (isRemote) return undefined;
    const onStorage = () => load(passcode);
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [load, passcode]);

  const unlock = (code) => {
    sessionStorage.setItem(PASSCODE_KEY, code);
    setPasscode(code);
  };

  const stats = useMemo(() => {
    const accepting = replies.filter((r) => r.attendance === "accept");
    return {
      total: replies.length,
      accepting: accepting.length,
      declining: replies.length - accepting.length,
      headcount: accepting.reduce((sum, r) => sum + (Number(r.guests) || 1), 0),
      rate: replies.length ? Math.round((accepting.length / replies.length) * 100) : 0,
    };
  }, [replies]);

  const trend = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => {
      const start = today.getTime() - (6 - i) * DAY;
      const sameDay = replies.filter((r) => {
        const at = Date.parse(r.at);
        return at >= start && at < start + DAY;
      });
      return {
        start,
        count: sameDay.length,
        accepting: sameDay.filter((r) => r.attendance === "accept").length,
        label: new Date(start).toLocaleDateString(undefined, { weekday: "short" }).slice(0, 3),
        day: new Date(start).getDate(),
      };
    });
  }, [replies]);

  const sizes = useMemo(
    () =>
      Array.from({ length: rsvp.maxGuests }, (_, i) => ({
        guests: i + 1,
        count: replies.filter(
          (r) => r.attendance === "accept" && (Number(r.guests) || 1) === i + 1
        ).length,
      })),
    [replies, rsvp.maxGuests]
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return replies
      .filter((r) => filter === "all" || r.attendance === filter)
      .filter(
        (r) => !needle || `${r.name} ${r.contact} ${r.message}`.toLowerCase().includes(needle)
      )
      .sort((a, b) =>
        sort === "name"
          ? a.name.localeCompare(b.name)
          : sort === "guests"
            ? (Number(b.guests) || 1) - (Number(a.guests) || 1)
            : Date.parse(b.at) - Date.parse(a.at)
      );
  }, [replies, filter, query, sort]);

  const exportCsv = () => {
    const quote = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const rows = [
      ["Name", "Contact", "Reply", "Guests", "Message", "Received"],
      ...replies.map((r) => [r.name, r.contact, r.attendance, r.guests, r.message, r.at]),
    ];
    const url = URL.createObjectURL(
      new Blob([rows.map((row) => row.map(quote).join(",")).join("\r\n")], {
        type: "text/csv;charset=utf-8",
      })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "rsvp-replies.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const wipe = async (code) => {
    await clearReplies(code);
    setArmed(false);
    await load(passcode);
  };

  if (locked) return <PasscodeGate onUnlock={unlock} remote={isRemote} />;

  const peak = Math.max(1, ...trend.map((d) => d.count));
  const sizePeak = Math.max(1, ...sizes.map((s) => s.count));
  const share = stats.total ? (stats.accepting / stats.total) * 100 : 0;

  return (
    <div className="min-h-svh bg-[linear-gradient(135deg,var(--color-ivory)_0%,var(--color-champagne)_55%,var(--color-ivory)_100%)]">
      <header className="relative overflow-hidden border-b border-[var(--color-gold)]/25 bg-[linear-gradient(to_bottom,var(--color-ivory),var(--color-beige))]">
        <img
          src={decor.floralLeft}
          alt=""
          className="pointer-events-none absolute -left-6 -top-8 w-[clamp(70px,15vw,150px)]"
        />
        <img
          src={decor.floralRight}
          alt=""
          className="pointer-events-none absolute -right-6 -top-8 w-[clamp(70px,15vw,150px)]"
        />
        <div className="section-pad relative mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <img src={decor.ganesha} alt="" className="w-[clamp(2rem,6vw,2.8rem)] object-contain" />
          <p className={`${CAPTION} mt-5`} style={{ fontFamily: "var(--font-heading)" }}>
            {couple.one.first} &amp; {couple.other.first} · {meta.yearLabel}
          </p>
          <h1 className="section-title mt-3 text-[clamp(1.7rem,5.5vw,2.6rem)]">RSVP Analytics</h1>
          <p className="mt-4 max-w-xl text-[0.98rem] italic text-[var(--color-brown)]">
            Every reply the invitation has collected, with headcount and dates for the catering
            sheet.
          </p>
          <OrnamentDivider className="mt-7" />

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href="." className={OUTLINE}>
              <ArrowLeft size={14} aria-hidden="true" />
              Back to invitation
            </a>
            <button type="button" onClick={() => load(passcode)} className={OUTLINE}>
              <RefreshCw size={14} aria-hidden="true" />
              Refresh
            </button>
            <button type="button" onClick={exportCsv} disabled={!stats.total} className="pill-gold">
              <Download size={15} aria-hidden="true" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => setArmed(true)}
              disabled={!stats.total}
              className={OUTLINE}
            >
              <Trash2 size={14} aria-hidden="true" />
              Clear all
            </button>
          </div>

          <p className="mt-5 text-[0.78rem] italic text-[var(--color-brown)]" role="status">
            {status === "loading"
              ? "Fetching replies…"
              : isRemote
                ? "Live from the Google Sheet"
                : "Saved in this browser — connect a Google Sheet in wedding.rsvp.endpoint to collect every guest's reply."}
          </p>
          {status === "error" && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-[var(--color-maroon)]/35 bg-[var(--color-maroon)]/8 px-5 py-4">
              <p className="text-[0.9rem] text-[var(--color-maroon)]">{error}</p>
              <button
                type="button"
                onClick={() => {
                  sessionStorage.removeItem(PASSCODE_KEY);
                  setPasscode("");
                }}
                className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-maroon)] underline underline-offset-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Change passcode
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12 sm:px-6 sm:py-16">
        <motion.ul {...rise(0.05, reduce)} className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
          <li>
            <Tile value={stats.total} label="Replies" hint={`${visible.length} shown`} />
          </li>
          <li>
            <Tile value={stats.accepting} label="Accepting" />
          </li>
          <li>
            <Tile value={stats.headcount} label="Guests" hint="Total headcount" />
          </li>
          <li>
            <Tile value={stats.declining} label="Declining" />
          </li>
          <li>
            <Tile value={`${stats.rate}%`} label="Accept rate" hint="Of replies received" />
          </li>
        </motion.ul>

        <div className="grid gap-6 md:grid-cols-2">
          <Panel title="Attendance split" note="Share of guests who joyfully accepted." {...rise(0.12, reduce)}>
            {stats.total ? (
              <div className="flex flex-wrap items-center justify-center gap-7">
                <div
                  className="relative flex size-[132px] shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(var(--color-gold) 0% ${share}%, var(--color-maroon) ${share}% 100%)`,
                  }}
                  role="img"
                  aria-label={`${stats.accepting} accepting, ${stats.declining} declining`}
                >
                  <span className="flex size-[96px] flex-col items-center justify-center rounded-full bg-[var(--color-ivory)]">
                    <span
                      className="text-[1.45rem] leading-none text-[var(--color-gold-deep)]"
                      style={{ fontFamily: "var(--font-heading)", fontWeight: 500 }}
                    >
                      {Math.round(share)}%
                    </span>
                    <span className="mt-1 text-[0.55rem] uppercase tracking-[0.18em] text-[var(--color-brown)]">
                      Yes
                    </span>
                  </span>
                </div>
                <ul className="list-none space-y-3 p-0 text-left">
                  {[
                    { color: "var(--color-gold)", label: "Accepting", value: stats.accepting },
                    { color: "var(--color-maroon)", label: "Declining", value: stats.declining },
                  ].map((row) => (
                    <li key={row.label} className="flex items-center gap-3">
                      <span
                        className="size-3 shrink-0 rounded-full"
                        style={{ background: row.color }}
                        aria-hidden="true"
                      />
                      <span
                        className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-brown)]"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {row.label}
                      </span>
                      <span className="text-[1.05rem] font-semibold text-[var(--color-ink)]">
                        {row.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-center text-[0.95rem] italic text-[var(--color-brown)]">
                No replies yet.
              </p>
            )}
          </Panel>

          <Panel title="Replies this week" note="One bar per day, newest on the right." {...rise(0.18, reduce)}>
            <ul className="flex items-end justify-between gap-2">
              {trend.map((day) => (
                <li key={day.start} className="flex w-full flex-col items-center gap-2">
                  <span className="text-[0.72rem] font-semibold text-[var(--color-gold-deep)]">
                    {day.count || ""}
                  </span>
                  <span
                    className="w-full max-w-[26px] rounded-t-md bg-[linear-gradient(to_top,var(--color-gold-deep),var(--color-gold))]"
                    style={{ height: `${Math.max(4, (day.count / peak) * 96)}px` }}
                    aria-hidden="true"
                  />
                  <span className="text-[0.6rem] uppercase tracking-[0.12em] text-[var(--color-brown)]">
                    {day.label}
                  </span>
                  <span className="-mt-1 text-[0.62rem] text-[var(--color-brown)]/70">{day.day}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel
          title="Party size"
          note="How many seats each accepting reply asked for."
          {...rise(0.24, reduce)}
        >
          <ul className="mx-auto flex w-full max-w-2xl flex-col gap-3">
            {sizes.map((row) => (
              <li key={row.guests} className="flex items-center gap-3">
                <span className="w-20 shrink-0 whitespace-nowrap text-right text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-brown)]" style={{ fontFamily: "var(--font-heading)" }}>
                  {row.guests} {row.guests === 1 ? "guest" : "guests"}
                </span>
                <span className="h-3 flex-1 overflow-hidden rounded-full bg-[var(--color-beige)]">
                  <span
                    className="block h-full rounded-full bg-[linear-gradient(90deg,var(--color-gold),var(--color-gold-deep))]"
                    style={{ width: `${(row.count / sizePeak) * 100}%` }}
                  />
                </span>
                <span className="w-8 shrink-0 text-[0.9rem] font-semibold text-[var(--color-ink)]">
                  {row.count}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Guest replies" note={`${visible.length} of ${stats.total} shown`} {...rise(0.3, reduce)}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", label: "All" },
                  { value: "accept", label: "Accepting" },
                  { value: "decline", label: "Declining" },
                ].map((chip) => {
                  const on = filter === chip.value;
                  return (
                    <button
                      key={chip.value}
                      type="button"
                      onClick={() => setFilter(chip.value)}
                      className={`min-h-[38px] rounded-full border px-4 text-[0.64rem] font-semibold uppercase tracking-[0.14em] transition-colors ${
                        on
                          ? "border-[var(--color-gold)] bg-[var(--color-gold)]/15 text-[var(--color-gold-deep)]"
                          : "border-[var(--color-gold)]/35 text-[var(--color-brown)] hover:border-[var(--color-gold)]"
                      }`}
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-1 items-center gap-2 sm:max-w-xs">
                <label htmlFor="q" className="sr-only">
                  Search replies
                </label>
                <div className="relative flex-1">
                  <Search
                    size={15}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[var(--color-gold-deep)]"
                  />
                  <input
                    id="q"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search name or message"
                    className="w-full min-h-[44px] border-0 border-b border-[var(--color-gold)]/40 bg-transparent py-2 pl-6 pr-2 text-[0.95rem] text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-brown)]/55 focus:border-[var(--color-gold-deep)]"
                  />
                </div>
                <label className="sr-only" htmlFor="sort">
                  Sort replies
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="min-h-[44px] border-0 border-b border-[var(--color-gold)]/40 bg-transparent py-2 text-[0.85rem] text-[var(--color-charcoal)] outline-none focus:border-[var(--color-gold-deep)]"
                >
                  <option value="recent">Newest</option>
                  <option value="name">Name</option>
                  <option value="guests">Guests</option>
                </select>
              </div>
            </div>

            {visible.length ? (
              <>
                <ul className="list-none space-y-4 p-0 md:hidden">
                  {visible.map((row) => {
                    const { date, time } = stamp(row.at);
                    return (
                      <li
                        key={row.id}
                        className="rounded-2xl border border-[var(--color-gold)]/25 bg-[var(--color-beige)]/50 px-4 py-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="min-w-0">
                            <span className="block break-words text-[1rem] font-semibold text-[var(--color-ink)]">
                              {row.name}
                            </span>
                            <span className="block break-words text-[0.8rem] text-[var(--color-brown)]">
                              {row.contact}
                            </span>
                          </span>
                          <Badge accepted={row.attendance === "accept"} />
                        </div>
                        <p className="mt-3 text-[0.9rem] italic leading-[1.55] text-[var(--color-charcoal)]">
                          {row.message || "No message"}
                        </p>
                        <p
                          className="mt-3 flex items-center justify-between text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-brown)]"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          <span>
                            {Number(row.guests) || 1} {(Number(row.guests) || 1) === 1 ? "guest" : "guests"}
                          </span>
                          <span>
                            {date} · {time}
                          </span>
                        </p>
                      </li>
                    );
                  })}
                </ul>

                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[var(--color-gold)]/35">
                        {["Guest", "Reply", "Guests", "Message", "Received"].map((head) => (
                          <th
                            key={head}
                            scope="col"
                            className="py-3 pr-4 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-deep)]"
                            style={{ fontFamily: "var(--font-heading)" }}
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((row) => {
                        const { date, time } = stamp(row.at);
                        return (
                          <tr key={row.id} className="border-b border-[var(--color-gold)]/15 align-top">
                            <th scope="row" className="py-4 pr-4 font-normal">
                              <span className="block text-[1rem] font-semibold text-[var(--color-ink)]">
                                {row.name}
                              </span>
                              <span className="block text-[0.8rem] text-[var(--color-brown)]">
                                {row.contact}
                              </span>
                            </th>
                            <td className="py-4 pr-4">
                              <Badge accepted={row.attendance === "accept"} />
                            </td>
                            <td className="py-4 pr-4 text-[1rem] font-semibold text-[var(--color-charcoal)]">
                              {Number(row.guests) || 1}
                            </td>
                            <td className="max-w-[280px] py-4 pr-4 text-[0.9rem] italic leading-[1.55] text-[var(--color-charcoal)]">
                              {row.message || "—"}
                            </td>
                            <td className="py-4 text-[0.82rem] whitespace-nowrap text-[var(--color-brown)]">
                              {date}
                              <span className="block text-[0.72rem] text-[var(--color-brown)]/75">
                                {time}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-10 text-center">
                <OrnamentDivider />
                <p className="mt-6 text-[1.5rem] leading-none text-[var(--color-gold)]" style={{ fontFamily: "var(--font-script)", fontWeight: 700 }}>
                  No replies yet
                </p>
                <p className="mt-4 max-w-sm text-[0.92rem] text-[var(--color-brown)]">
                  {isRemote
                    ? "The sheet has no rows yet. Every reply a guest sends from the invitation adds one."
                    : "Ask guests to send their reply from the invitation, then return here. Replies are stored in this browser only — open the page on the same device that collected them."}
                </p>
              </div>
            )}
          </div>
        </Panel>
      </main>

      <footer className="border-t border-[var(--color-gold)]/25 bg-[linear-gradient(to_bottom,var(--color-beige),#f4eee6)]">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-3 px-4 py-10 text-center">
          <p
            className="text-[clamp(1.8rem,6vw,2.6rem)] leading-none text-[var(--color-gold)]"
            style={{ fontFamily: "var(--font-script)", fontWeight: 700 }}
          >
            {couple.one.first} &amp; {couple.other.first}
          </p>
          <p className="eyebrow">{meta.hashtag}</p>
          <p className="text-[0.78rem] text-[var(--color-brown)]/80">
            Replies close {new Date(rsvp.deadlineISO).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })} · {meta.yearLabel}
          </p>
        </div>
      </footer>

      {armed && <ClearDialog onConfirm={wipe} onCancel={() => setArmed(false)} />}
    </div>
  );
}
