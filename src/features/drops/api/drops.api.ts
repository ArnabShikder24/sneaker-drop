import apiClient from '../../../services/api';
import type { Drop } from '../types/drop.types';
import type { User } from '../../../types';

// ── Drops ─────────────────────────────────────────────────────────────────────

export async function fetchDrops(): Promise<Drop[]> {
  const res = await apiClient.get<{ drops: Drop[] }>('/api/drops');
  return res.data.drops;
}

// ── Users ─────────────────────────────────────────────────────────────────────

export async function findOrCreateUser(username: string): Promise<User> {
  const res = await apiClient.post<{ user: User }>('/api/users', { username });
  return res.data.user;
}

// ── Reservations ──────────────────────────────────────────────────────────────

export async function createReservation(
  dropId: number,
  userId: number,
): Promise<{ reservation: import('../types/drop.types').Reservation; availableStock: number }> {
  const res = await apiClient.post('/api/reservations', {
    drop_id: dropId,
    user_id: userId,
  });
  return res.data;
}

export async function completePurchase(
  reservationId: number,
  userId: number,
): Promise<{ purchase: import('../types/drop.types').Purchase }> {
  const res = await apiClient.post(`/api/reservations/${reservationId}/purchase`, {
    user_id: userId,
  });
  return res.data;
}