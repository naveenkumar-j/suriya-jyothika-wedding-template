// Decorative art plates rendered as SVG so every image slot reads as finished
// artwork before the couple's own photographs are dropped into /public/images.
// Everything is drawn in a 100x100 space with `slice`, so motifs stay circular
// and centred no matter what aspect ratio the tile is.

const STROKE = 0.4;

function Flower({ x, y, r = 3.2, petals = 6, rotate = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      {Array.from({ length: petals }, (_, i) => (
        <ellipse
          key={i}
          cx={0}
          cy={-r}
          rx={r * 0.34}
          ry={r * 0.72}
          transform={`rotate(${(i / petals) * 360})`}
          fill="var(--color-champagne)"
          fillOpacity="0.55"
          stroke="var(--color-gold)"
          strokeWidth={STROKE * 0.7}
        />
      ))}
      <circle cx={0} cy={0} r={r * 0.3} fill="var(--color-gold-deep)" fillOpacity="0.7" />
    </g>
  );
}

function Leaf({ x, y, len = 7, rotate = 0 }) {
  return (
    <path
      d={`M${x} ${y} Q ${x + len * 0.5} ${y - len * 0.42} ${x + len} ${y} Q ${x + len * 0.5} ${y + len * 0.42} ${x} ${y} Z`}
      transform={`rotate(${rotate} ${x} ${y})`}
      fill="var(--color-gold)"
      fillOpacity="0.18"
      stroke="var(--color-gold-deep)"
      strokeWidth={STROKE * 0.8}
    />
  );
}

function Mandala() {
  const rings = [
    { r: 12, count: 8, size: 5 },
    { r: 22, count: 16, size: 4.4 },
    { r: 32, count: 24, size: 3.8 },
    { r: 41, count: 32, size: 3 },
  ];
  return (
    <g>
      {rings.map((ring, ri) => (
        <g key={ri}>
          <circle cx={50} cy={50} r={ring.r} fill="none" stroke="var(--color-gold)" strokeOpacity="0.28" strokeWidth={STROKE} />
          {Array.from({ length: ring.count }, (_, i) => {
            const a = (i / ring.count) * 360 + ri * 6;
            return (
              <ellipse
                key={i}
                cx={50}
                cy={50 - ring.r}
                rx={ring.size * 0.3}
                ry={ring.size * 0.85}
                transform={`rotate(${a} 50 50)`}
                fill="var(--color-champagne)"
                fillOpacity={0.4 - ri * 0.07}
                stroke="var(--color-gold)"
                strokeOpacity="0.7"
                strokeWidth={STROKE * 0.7}
              />
            );
          })}
        </g>
      ))}
      <Flower x={50} y={50} r={7} petals={8} />
    </g>
  );
}

function Wreath() {
  const points = Array.from({ length: 20 }, (_, i) => {
    const a = (i / 20) * Math.PI * 2;
    return { x: 50 + Math.cos(a) * 30, y: 50 + Math.sin(a) * 30, a };
  });
  return (
    <g>
      <circle cx={50} cy={50} r={30} fill="none" stroke="var(--color-gold)" strokeOpacity="0.35" strokeWidth={STROKE} />
      <circle cx={50} cy={50} r={24} fill="none" stroke="var(--color-gold-deep)" strokeOpacity="0.22" strokeWidth={STROKE} />
      {points.map((p, i) => (
        <Leaf key={`l${i}`} x={p.x} y={p.y} len={8} rotate={(p.a * 180) / Math.PI + 90} />
      ))}
      {points
        .filter((_, i) => i % 4 === 0)
        .map((p, i) => (
          <Flower key={`f${i}`} x={p.x} y={p.y} r={2.6} petals={6} />
        ))}
    </g>
  );
}

function Arch() {
  const scallops = Array.from({ length: 11 }, (_, i) => {
    const t = i / 10;
    const x = 22 + t * 56;
    const y = 56 - Math.sin(t * Math.PI) * 30;
    return { x, y };
  });
  return (
    <g fill="none" stroke="var(--color-gold)" strokeWidth={STROKE * 1.2}>
      <path d="M22 88 L22 56 Q50 14 78 56 L78 88" />
      <path d="M27 88 L27 57 Q50 20 73 57 L73 88" strokeOpacity="0.4" />
      <path d="M18 88 L18 55 Q50 10 82 55 L82 88" strokeOpacity="0.25" />
      {scallops.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={s.y} r={2.1} fill="var(--color-champagne)" fillOpacity="0.8" stroke="var(--color-gold-deep)" strokeWidth={STROKE * 0.6} />
          <path d={`M${s.x} ${s.y + 2.1} q 0 4 0 6`} strokeOpacity="0.5" />
          {i % 2 === 0 && <Leaf x={s.x - 4} y={s.y + 9} len={7} rotate={78} />}
        </g>
      ))}
    </g>
  );
}

function Lamps() {
  const rows = [
    { y: 40, count: 3, scale: 1.15 },
    { y: 62, count: 5, scale: 0.9 },
  ];
  return (
    <g>
      {rows.map((row, ri) =>
        Array.from({ length: row.count }, (_, i) => {
          const x = (100 / (row.count + 1)) * (i + 1);
          const s = 7 * row.scale;
          return (
            <g key={`${ri}-${i}`}>
              <path
                d={`M${x - s} ${row.y} Q ${x} ${row.y + s * 0.85} ${x + s} ${row.y} Z`}
                fill="var(--color-champagne)"
                fillOpacity="0.5"
                stroke="var(--color-gold-deep)"
                strokeWidth={STROKE}
              />
              <path
                d={`M${x - s * 0.55} ${row.y - s * 0.28} Q ${x} ${row.y - s * 1.5} ${x + s * 0.55} ${row.y - s * 0.28}`}
                fill="none"
                stroke="var(--color-gold)"
                strokeOpacity="0.45"
                strokeWidth={STROKE}
              />
              <path
                d={`M${x} ${row.y - s * 0.5} q ${s * 0.3} ${-s * 0.5} 0 ${-s * 1.05} q ${-s * 0.3} ${s * 0.55} 0 ${s * 1.05} Z`}
                fill="var(--color-gold)"
                fillOpacity="0.75"
              />
              <circle cx={x} cy={row.y + s * 1.5} r={s * 0.9} fill="none" stroke="var(--color-gold)" strokeOpacity="0.18" strokeWidth={STROKE} />
            </g>
          );
        })
      )}
    </g>
  );
}

function Trellis() {
  const lines = [];
  for (let i = -4; i <= 8; i++) {
    lines.push({ x1: i * 14, y1: 0, x2: i * 14 + 100, y2: 100 });
    lines.push({ x1: i * 14, y1: 100, x2: i * 14 + 100, y2: 0 });
  }
  const blooms = [];
  for (let a = 1; a <= 5; a++) {
    for (let b = 1; b <= 5; b++) {
      blooms.push({ x: a * 16 + b * 4, y: b * 16 + a * 2 });
    }
  }
  return (
    <g>
      <g stroke="var(--color-gold)" strokeOpacity="0.26" strokeWidth={STROKE}>
        {lines.map((l, i) => (
          <line key={i} {...l} />
        ))}
      </g>
      {blooms.map((p, i) => (
        <Flower key={i} x={p.x} y={p.y} r={i % 3 === 0 ? 3 : 2} petals={6} rotate={i * 17} />
      ))}
    </g>
  );
}

function Sunburst() {
  const rays = Array.from({ length: 48 }, (_, i) => (i / 48) * 360);
  return (
    <g>
      {rays.map((a, i) => (
        <line
          key={i}
          x1={50}
          y1={i % 4 === 0 ? 12 : 20}
          x2={50}
          y2={44}
          transform={`rotate(${a} 50 50)`}
          stroke="var(--color-gold)"
          strokeOpacity={i % 4 === 0 ? 0.45 : 0.2}
          strokeWidth={STROKE}
        />
      ))}
      <circle cx={50} cy={50} r={44} fill="none" stroke="var(--color-gold)" strokeOpacity="0.3" strokeWidth={STROKE} />
      <circle cx={50} cy={50} r={36} fill="none" stroke="var(--color-gold-deep)" strokeOpacity="0.22" strokeWidth={STROKE} />
      <Flower x={50} y={50} r={9} petals={10} />
    </g>
  );
}

function Sprigs() {
  const spots = [
    { x: 26, y: 30, r: -25 },
    { x: 68, y: 24, r: 20 },
    { x: 40, y: 62, r: 150 },
    { x: 74, y: 68, r: 200 },
    { x: 18, y: 74, r: 60 },
  ];
  return (
    <g>
      {spots.map((s, i) => (
        <g key={i} transform={`rotate(${s.r} ${s.x} ${s.y})`}>
          <path
            d={`M${s.x} ${s.y} q 6 -8 14 -12`}
            fill="none"
            stroke="var(--color-gold-deep)"
            strokeOpacity="0.5"
            strokeWidth={STROKE * 1.2}
          />
          <Leaf x={s.x + 3} y={s.y - 4} len={7} rotate={-30} />
          <Leaf x={s.x + 8} y={s.y - 8} len={6} rotate={20} />
          <Flower x={s.x + 15} y={s.y - 13} r={3.2} petals={6} />
        </g>
      ))}
    </g>
  );
}

const MOTIFS = {
  mandala: <Mandala />,
  border: <Wreath />,
  wreath: <Wreath />,
  arch: <Arch />,
  lamps: <Lamps />,
  diya: <Lamps />,
  trellis: <Trellis />,
  petals: <Sprigs />,
  sunburst: <Sunburst />,
};

const ORDER = ["mandala", "arch", "lamps", "petals", "trellis", "border", "sunburst", "diya"];

export default function Poster({
  seed = 1,
  variant,
  width = 1200,
  height = 1600,
  alt = "",
  className = "",
}) {
  const name = variant ?? ORDER[seed % ORDER.length];
  const w = 240;
  const h = Math.round((240 * height) / width);

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : "true"}
      focusable="false"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <defs>
        <radialGradient id={`wash-${seed}`} cx="50%" cy="34%" r="78%">
          <stop offset="0%" stopColor="#FDFAF4" />
          <stop offset="52%" stopColor="#F3EADB" />
          <stop offset="100%" stopColor="#E0C9A9" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#wash-${seed})`} />
      <rect
        x="3"
        y="3"
        width="94"
        height="94"
        fill="none"
        stroke="var(--color-gold)"
        strokeOpacity="0.3"
        strokeWidth="0.35"
      />
      <g>{MOTIFS[name] ?? <Mandala />}</g>
      <title>{alt}</title>
    </svg>
  );
}
