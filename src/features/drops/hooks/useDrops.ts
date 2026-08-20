import { useEffect } from 'react';
import { useDropsStore } from '../../../store/dropsStore';
import { fetchDrops } from '../api/drops.api';

/**
 * useDrops — fetches all drops on mount, stores them in the zustand store.
 * Components read from the store directly; this hook only manages the fetch lifecycle.
 */
export function useDrops() {
  const setDrops = useDropsStore((s) => s.setDrops);
  const setLoading = useDropsStore((s) => s.setLoading);
  const setError = useDropsStore((s) => s.setError);
  const drops = useDropsStore((s) => s.drops);
  const isLoading = useDropsStore((s) => s.isLoading);
  const error = useDropsStore((s) => s.error);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDrops();
        if (!cancelled) setDrops(data);
      } catch {
        if (!cancelled) setError('Failed to load drops. Is the backend running?');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [setDrops, setLoading, setError]);

  return { drops, isLoading, error };
}