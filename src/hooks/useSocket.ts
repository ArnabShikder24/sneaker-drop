import { useEffect } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket';
import { SOCKET_EVENTS } from '../constants';
import { useDropsStore } from '../store/dropsStore';
import type { StockUpdatedPayload, ReservationExpiredPayload } from '../types';
import { fetchDrops } from '../features/drops/api/drops.api';

/**
 * useSocket — connects the Socket.io client once at app mount.
 *
 * Listens for:
 * - STOCK_UPDATED → patches the matching drop's available_stock in the zustand store
 *   so every mounted DropCard re-renders automatically without a refetch.
 * - RESERVATION_EXPIRED → removes the expired reservation from local state.
 */
export function useSocket() {
  const updateStockForDrop = useDropsStore((s) => s.updateStockForDrop);
  const removeReservation = useDropsStore((s) => s.removeReservation);
  const setDrops = useDropsStore((s) => s.setDrops);

  useEffect(() => {
    const socket = getSocket();
    connectSocket();

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
    });

    // Core real-time handler: stock changed → always patch store immediately (instant UI update)
    // On 'purchase': also refetch drops to update the activity feed on every tab
    socket.on(SOCKET_EVENTS.STOCK_UPDATED, (payload: StockUpdatedPayload) => {
      updateStockForDrop(payload.dropId, payload.availableStock);

      if (payload.reason === 'purchase') {
        // A purchase just completed somewhere — refresh drops so the activity feed
        // (recent_purchasers) is up to date on every connected tab
        fetchDrops().then(setDrops).catch(console.error);
      }
    });

    // Reservation expired on the server → remove from client state + refetch to
    // get fresh activity feed data
    socket.on(SOCKET_EVENTS.RESERVATION_EXPIRED, (payload: ReservationExpiredPayload) => {
      removeReservation(payload.dropId);
      // Refetch drops to get fresh purchaser data
      fetchDrops().then(setDrops).catch(console.error);
    });

    return () => {
      socket.off(SOCKET_EVENTS.STOCK_UPDATED);
      socket.off(SOCKET_EVENTS.RESERVATION_EXPIRED);
      disconnectSocket();
    };
  }, [updateStockForDrop, removeReservation, setDrops]);
}