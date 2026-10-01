import { useEffect, useRef, useState } from "react";

export function useFrameSequence({ frames, fps = 12 }) {
  const total = frames.length;
  const last = Math.max(0, total - 1);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(index);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (total < 2) return undefined;

    let raf = 0;
    let start = performance.now();
    let base = indexRef.current;

    const tick = (now) => {
      const next = Math.min(base + Math.floor(((now - start) / 1000) * fps), last);
      if (next !== indexRef.current) {
        indexRef.current = next;
        setIndex(next);
      }
      if (next < last) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        base = indexRef.current;
        start = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [total, last, fps]);

  return { index, isDone: total < 2 || index >= last };
}
