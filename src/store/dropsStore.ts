import { create } from 'zustand';
import type { Drop } from '../features/drops/types/drop.types';
import type { ActiveReservation } from '../features/drops/types/drop.types';
import type { User } from '../types';

interface DropsState {
  // ── Data ──────────────────────────────────────────────────────────────────
  drops: Drop[];
  isLoading: boolean;
  error: string | null;

  // ── Current user ─────────────────────────────────────────────────────────
  currentUser: User | null;

  // ── Active reservations, keyed by drop_id ────────────────────────────────
  activeReservations: Record<number, ActiveReservation>;

  // ── Actions ───────────────────────────────────────────────────────────────
  setDrops: (drops: Drop[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentUser: (user: User) => void;

  /** Patches a single drop's available_stock — called by the socket STOCK_UPDATED event */
  updateStockForDrop: (dropId: number, availableStock: number) => void;

  /** Patches a single drop's recent_purchasers — called after purchase completes */
  updateDropData: (updatedDrop: Partial<Drop> & { id: number }) => void;

  /** Records a newly-created active reservation for the current user */
  addReservation: (dropId: number, reservation: ActiveReservation) => void;

  /** Removes an active reservation (on expiry or completed purchase) */
  removeReservation: (dropId: number) => void;
}

export const useDropsStore = create<DropsState>((set) => ({
  drops: [],
  isLoading: false,
  error: null,
  currentUser: null,
  activeReservations: {},

  setDrops: (drops) => set({ drops }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setCurrentUser: (user) => set({ currentUser: user }),

  updateStockForDrop: (dropId, availableStock) =>
    set((state) => ({
      drops: state.drops.map((d) =>
        d.id === dropId ? { ...d, available_stock: availableStock } : d,
      ),
    })),

  updateDropData: (updatedDrop) =>
    set((state) => ({
      drops: state.drops.map((d) =>
        d.id === updatedDrop.id ? { ...d, ...updatedDrop } : d,
      ),
    })),

  addReservation: (dropId, reservation) =>
    set((state) => ({
      activeReservations: { ...state.activeReservations, [dropId]: reservation },
    })),

  removeReservation: (dropId) =>
    set((state) => {
      const next = { ...state.activeReservations };
      delete next[dropId];
      return { activeReservations: next };
    }),
}));