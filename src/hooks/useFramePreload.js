import { useEffect, useState } from "react";

// Warms the browser's decode cache so the gate can start the instant it is
// clicked, and reports whether the frame set is unusable.
export function useFramePreload(frames, { maxFailures = 3 } = {}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!frames.length) {
      setFailed(true);
      return undefined;
    }

    let alive = true;
    let failures = 0;

    const images = frames.map((src, i) => {
      const img = new Image();
      img.decoding = "async";
      if (i === 0) img.fetchPriority = "high";
      img.onerror = () => {
        failures += 1;
        if (alive && failures >= maxFailures) setFailed(true);
      };
      img.src = src;
      return img;
    });

    Promise.all(images.map((img) => (img.decode ? img.decode().catch(() => null) : null)));

    return () => {
      alive = false;
      images.forEach((img) => {
        img.onerror = null;
      });
    };
  }, [frames, maxFailures]);

  return { failed };
}
