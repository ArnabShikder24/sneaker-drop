/** Socket event names — must match backend's sockets/events.ts exactly */
export const SOCKET_EVENTS = {
  STOCK_UPDATED: 'STOCK_UPDATED',
  RESERVATION_EXPIRED: 'RESERVATION_EXPIRED',
  JOIN_DROP: 'JOIN_DROP',
} as const;

export const RESERVATION_DURATION_MS = 60 * 1000; // 60 seconds