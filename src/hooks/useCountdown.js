import { useEffect, useMemo, useState } from "react";

const SECOND = 1000;

function diffFrom(targetMs) {
  const total = Math.max(0, targetMs - Date.now());
  return {
    total,
    days: Math.floor(total / 86400000),
    hours: Math.floor((total / 3600000) % 24),
    minutes: Math.floor((total / 60000) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

export function useCountdown(dateISO) {
  const target = useMemo(() => new Date(dateISO).getTime(), [dateISO]);
  const [remaining, setRemaining] = useState(() => diffFrom(target));

  useEffect(() => {
    if (!Number.isFinite(target)) return;
    const id = setInterval(() => setRemaining(diffFrom(target)), SECOND);
    return () => clearInterval(id);
  }, [target]);

  return { ...remaining, arrived: remaining.total === 0 };
}
