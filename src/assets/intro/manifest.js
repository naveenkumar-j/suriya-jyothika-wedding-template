const globbed = import.meta.glob("./frames/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

// Zero-padded %03d filenames sort lexicographically in extraction order.
const frames = Object.keys(globbed)
  .sort()
  .map((key) => globbed[key]);

export function resolveFrames({ stride = 1, keep = null } = {}) {
  const picked = keep && keep.length ? keep.map((i) => frames[i]).filter(Boolean) : frames;
  return stride > 1 ? picked.filter((_, i) => i % stride === 0) : picked;
}
