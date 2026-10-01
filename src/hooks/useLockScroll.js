import { useEffect } from "react";

export function useLockScroll(locked) {
  useEffect(() => {
    if (!locked) return;
    const { scrollY } = window;
    const previous = {
      position: document.documentElement.style.position,
      top: document.documentElement.style.top,
      left: document.documentElement.style.left,
      right: document.documentElement.style.right,
      width: document.documentElement.style.width,
      overflow: document.documentElement.style.overflow,
    };

    Object.assign(document.documentElement.style, {
      position: "fixed",
      top: `-${scrollY}px`,
      left: "0",
      right: "0",
      width: "100%",
      overflow: "hidden",
    });

    return () => {
      Object.assign(document.documentElement.style, previous);
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}
