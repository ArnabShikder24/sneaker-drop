export interface User {
  id: number;
  username: string;
  created_at: string;
}

export interface ApiError {
  error: string;
  code: string;
  details?: Record<string, string[]>;
}

export interface StockUpdatedPayload {
  dropId: number;
  availableStock: number;
  /** Why the stock changed — 'purchase' means activity feed needs refreshing */
  reason: 'reserve' | 'expire' | 'purchase';
}

export interface ReservationExpiredPayload {
  reservationId: number;
  dropId: number;
}