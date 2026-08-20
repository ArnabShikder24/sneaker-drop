import { useState, useEffect, useRef } from 'react';

/**
 * useCountdown — ticks every second from a given expiry timestamp.
 * Returns { msRemaining, isExpired }.
 *
 * This is a VISUAL aid only — the server's sweep job is the authoritative
 * source of expiry. When the server fires RESERVATION_EXPIRED, the store
 * removes the reservation regardless of what this counter shows.
 */
export function useCountdown(expiresAtMs: number | null): {
  msRemaining: number;
  isExpired: boolean;
} {
  const [msRemaining, setMsRemaining] = useState(() =>
    expiresAtMs ? Math.max(0, expiresAtMs - Date.now()) : 0,
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (expiresAtMs === null) {
      setMsRemaining(0);
      return;
    }

    const tick = () => {
      const remaining = Math.max(0, expiresAtMs - Date.now());
      setMsRemaining(remaining);
      if (remaining === 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    tick(); // immediate update
    intervalRef.current = setInterval(tick, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [expiresAtMs]);

  return { msRemaining, isExpired: msRemaining === 0 };
}