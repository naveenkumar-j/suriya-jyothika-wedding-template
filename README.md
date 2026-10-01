# Suriya weds Jyothika — Digital Wedding Invitation

A cinematic, single-page wedding invitation built with React, Vite, Tailwind CSS v4 and Framer Motion (`motion`).

The layout, palette and decorative artwork follow **your own `surendar wedding / floral-right` template**
(`ganesha.png`, the floral corners, the vector ornaments were copied into `public/images/`), rebuilt here in
React with this invitation's own copy and data. Nothing is taken from a third-party invitation site.

## Commands

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs dist/
npm run preview    # serve the production build on :4173
```

## Making it your own

Almost everything worth changing lives in **`src/data/weddingData.js`** — names, dates, the countdown target, events, venue, map link, gallery list, music tracks and RSVP copy. You should not need to touch the components.

| What | Where |
| --- | --- |
| Couple names, family lines | `wedding.couple` |
| Wedding date driving the countdown | `wedding.meta.dateISO` (keep the `+05:30`-style offset) |
| Event schedule | `wedding.events[]` — `image` is the photograph on the card, `art` the drawn plate used if it is missing (`mandala`, `arch`, `trellis`, `lamps`, …) |
| Venue, address, Google Maps link | `wedding.venue` |
| Gallery photographs and alt text | `wedding.gallery[]` |
| Background music files and volume | `wedding.audio` |
| Where RSVP replies are stored | `wedding.rsvp.endpoint` — empty keeps them in this browser, a Google Apps Script URL writes to a Sheet |
| Gate (door-opening) speed and trimming | `wedding.intro` |
| Colours, fonts, type scales | `src/styles/tokens.css` |

Four faces carry the design, all self-hosted from `@fontsource`: `--font-heading` (Cinzel) for the
uppercase section titles and the countdown numerals, `--font-script` (Tangerine) for the couple's names
and the event names, `--font-display` (Cormorant Garamond) for body copy, and `--font-ui` (Inter) for
the small tracked labels. `--color-gold` / `--color-gold-deep` and `--color-maroon` /
`--color-maroon-deep` are the temple-gold and kumkum pair from the template; `--color-ivory`,
`--color-beige` and `--color-champagne` are the cream grounds they sit on.

### The gate and the main page

The opening is a two-phase overlay that hands over to a permanent first screen. All copy is written
directly on the artwork — no panels, no boxes:

1. **Landing** — the closed golden doors carry the Ganesha mark, a welcome line, the couple's names in
   Tangerine and a gold **Open Invitation** pill. Gold petals drift down the frame. Nothing animates
   until a guest clicks, and scrolling stays locked.
2. **Gate** — the click plays the doors swinging open as a short flipbook: still frames sequenced in the
   browser, not a `<video>` element.

The overlay then only fades: `src/components/sections/InvitationCard.jsx` is the first section of the
document and is already holding the film's last frame underneath it, so the hand-off is pixel for
pixel. The full invitation fades in on top, in this order: the Ganesha mark, an invitation line, the
couple's names in Tangerine joined by a gold ampersand, a gold hairline, the **Marriage** time and
date taken from `events`, the venue name with its address, then **Scroll Down**. Floral corner PNGs
sit over the top edge of the frame.

That card is the main page and it stays: it is `position: sticky` at a full viewport height, so
every later section slides over it as you scroll down, and it is waiting there again when you scroll
back up. It is never unmounted.

There is deliberately no navigation bar: the card is the summary screen, and the invitation below it
is read by scrolling — Groom & Bride, the countdown, The Celebrations, Happy Moments, the couple's
note, RSVP, then the footer. A thin gold-to-maroon progress rule tracks that scroll along the top
edge.

The doors are dark and the reveal is a sunlit valley, so the two screens use opposite scrims: ivory
text on a dark wash over the closed doors, charcoal and gold on a light wash over the open frame.

The first frame doubles as the landing backdrop and the last as the card's, so both hand-offs from
still to motion are invisible. The frames live in `src/assets/intro/frames/` (40 × 576×1024 WebP,
~2.7 MB) and are picked up by `import.meta.glob` in `src/assets/intro/manifest.js`. Tune playback
entirely from data:

| Field | Effect |
| --- | --- |
| `fps` | playback speed — 12 is the flipbook sweet spot, 18+ reads as video |
| `stride` | use every Nth frame; set `2` to halve memory on low-end phones |
| `keep` | explicit array of frame indices, for hand-picked timing |

Because the gate is click-driven, no browser autoplay policy is involved, and the background
drone is unlocked inside the same gesture. If the frames ever fail to load, the click enters the
invitation directly.

To rebuild the set from a different clip, keep the source out of `public/` (so Vite never copies
it into `dist/`) and re-run the extraction:

```bash
mkdir -p media-src && mv "your clip.mp4" media-src/source.mp4
ffmpeg -ss 1 -to 9.8 -i media-src/source.mp4 \
  -vf "fps=4.5,scale=576:1024:flags=lanczos" \
  -c:v libwebp -quality 58 src/assets/intro/frames/f-%03d.webp
```

`media-src/` is gitignored. Zero-padded `%03d` filenames matter — the manifest sorts them
lexicographically.

### Dropping in real photographs

Put files in `public/images/` using the names already referenced in `weddingData.js`:

```
public/images/ganesha.png      ← mark on the gate and the card
public/images/floral-left.png  ← top corners of the card
public/images/floral-right.png
public/images/vector-1.png     ← corner ornaments (unused so far)
public/images/vector-2.png
public/images/groom.jpg        ← Groom & Bride portrait
public/images/bride.jpeg
public/images/marriage.jpg / reception.jpg  ← event photographs
public/images/gallery-1.jpg … gallery-5.jpg             ← Happy Moments carousel
public/images/hero-poster.jpg  ← opening poster artwork (not present; art plate renders instead)
```

Keep each entry's `w`/`h` values close to the real pixel dimensions — they reserve the aspect ratio before the file loads, which is what prevents layout shift. The carousel is the exception: `Gallery.jsx` crops every slide into one shared 3:4 portrait frame (`FRAME`), so the strip never changes height mid-swipe, and the entries in `wedding.gallery` only need `src` and `alt`.

Until a file exists, every image slot renders a hand-drawn gold-on-ivory SVG art plate (`src/components/ui/Poster.jsx`), so the site never shows a broken image. The plate used per tile is chosen by the `variant` field in `Gallery.jsx`.

### Music

The background music is the set of wedding recordings from the template, kept in `public/audio/`
and listed in `wedding.audio.tracks`. `src/lib/audio.js` picks one of them at random per visit,
loops it and plays it through a single `<audio>` element at `wedding.audio.volume`. It only ever
starts from the "Open Invitation" click, so no autoplay policy is violated, and the on/off choice is
remembered for the session.

The round sound toggle in the bottom-right appears as soon as the guest clicks **Open Invitation** — it rises in during the gate animation, so the music can be muted without waiting for the film to finish. Because it is fixed to the viewport it stays put through every scroll.

To change the playlist, drop or remove files in `public/audio/` and edit `wedding.audio.tracks`; the
files are `.mp4` (AAC in an MP4 container), which every current browser decodes in an audio element.

### RSVP replies and `/analytics`

Every reply goes through the three exports of `src/lib/rsvpStore.js` — `submitReply`, `loadReplies`,
`clearReplies` — so no component touches storage directly. The store has two modes, decided by one
value:

**Local (the default, no setup).** With `wedding.rsvp.endpoint` left empty, replies are written to
this browser's `localStorage` under `tn-rsvp-replies`. `/analytics` reads the same list. Because
there is no backend, **the numbers are per device**: a guest's reply lands on the guest's phone, not
on the host's laptop. This mode is great for building and testing, and useless for a real wedding.
The first passcode you type at the gate becomes this browser's host key, and every later visit has
to match it.

**Google Sheets (recommended for the live site).** Replies are appended to a tab of a spreadsheet you
own, so every guest writes to one shared list.

1. Make a Google Sheet, then **Extensions → Apps Script**, and paste `tools/google-sheets/Code.gs`.
2. `HOST_KEY` already holds the host passcode. It is the only thing standing between a stranger and
   your guest list, so treat it like a password — it lives in the script, never in the site's
   JavaScript, and it must be changed here if this file is ever shared.
3. **Deploy → New deployment → Web app**, with *Execute as: Me* and *Who has access: Anyone*. Copy the
   `/exec` URL it gives you.
4. Paste that URL into `wedding.rsvp.endpoint` in `src/data/weddingData.js` (or set it as
   `VITE_RSVP_ENDPOINT` in a `.env` file, which wins and keeps the URL out of the content file), then
   rebuild.

A `rsvps` tab with the headers `name, contact, attendance, guests, message, at` is created on the
first reply. Posting the same contact again updates that guest's row instead of counting them twice,
and **Clear all** deletes the rows but keeps the header.

The form sends its body as `text/plain` on purpose: Apps Script answers cross-origin `fetch` without a
preflight only when the request is a simple one, so a JSON content type would break the submit.

`/analytics` (`src/pages/AnalyticsPage.jsx`) always opens behind the passcode — the script checks it
server-side when a Sheet is wired up (it is kept in `sessionStorage`, so you type it once per browser
tab). **Clear all** asks for it a second time in a confirmation dialog, and a wrong one deletes
nothing. Either way the page shows the headcount tiles, attendance split, replies per day, party
sizes and the full guest list, with search, filter and CSV export.

`/analytics` is served by the same SPA: `App.jsx` matches the pathname and renders the dashboard
instead of the invitation. Any host must therefore fall back to `index.html` for unknown paths
(Vite's dev server and `vite preview` already do; static hosts usually call this an SPA rewrite or
"404 to index" rule). Nothing links to it from the invitation — the address is the first half of the
protection, so type `/analytics` yourself rather than leaving a trail for guests.

### Reading the raw sheet

The dashboard is a convenience; the spreadsheet is the real record. Any of these work:

- **Just open the sheet** — `File → Download → Comma separated values (.csv)` for a backup, or filter
  and pivot it there.
- **A CSV or TSV dump over plain HTTP**, no Google credentials needed, as long as the sheet's own
  sharing lets the reader in:
  ```
  https://docs.google.com/spreadsheets/d/<SHEET_ID>/gviz/tq?tqx=out:csv&sheet=rsvps
  https://docs.google.com/spreadsheets/d/<SHEET_ID>/gviz/tq?tqx=out:json&sheet=rsvps
  ```
  `<SHEET_ID>` is the long string in the sheet's own URL. These are handy in `curl`, a spreadsheet
  `IMPORTDATA()`, or a notification script.
- **The official Sheets API**, if you want structured reads with a key or OAuth:
  ```
  https://sheets.googleapis.com/v4/spreadsheets/<SHEET_ID>/values/rsvps?key=<API_KEY>
  ```
- **The bridge's own `doGet`** — `GET <web-app-url>?key=<HOST_KEY>` returns the same rows as JSON,
  which is what `/analytics` uses.

Whichever you pick, keep the sharing tight. *Anyone with the link → Viewer* on the spreadsheet, or a
`gviz` URL pasted into a group chat, exposes every guest name and phone number. The Apps Script route
is the safest of the four: the sheet stays private, and only the passcode holder can read it.

## Structure

```
src/
  main.jsx                 entry; self-hosted fonts + global CSS
  App.jsx                  opening overlay ⇄ main experience transition, /analytics route
  context/AppContext.jsx   `entered`, audio lifecycle
  data/weddingData.js      all content
  hooks/                   useCountdown, useLockScroll, useFrameSequence, useFramePreload
  lib/                     audio.js (music playlist), rsvpStore.js (reply persistence)
  assets/intro/            opening film frames + manifest
  components/
    layout/                OpeningScreen, IntroFlipbook, Footer
    sections/              InvitationCard (pinned main page), Couple, Events, Message, RSVP
    countdown/             Countdown
    gallery/               Gallery, Lightbox
    audio/                 MusicControl
    ui/                    Section, Poster, OrnamentDivider, SmartImage
  pages/                   AnalyticsPage (RSVP dashboard at /analytics)
  styles/                  tokens.css (@theme), globals.css
```

## Accessibility notes

- Every section is a landmark with an `aria-labelledby` title; the countdown also exposes a `sr-only` live summary.
- The lightbox traps `Tab`, closes on `Escape`, steps with arrow keys, and returns focus to the tile that opened it.
- Scroll and parallax animations are disabled under `prefers-reduced-motion: reduce`.
- Controls keep 44px minimum touch targets, and the unopened invitation is `inert` so keyboard users never land behind the overlay.
