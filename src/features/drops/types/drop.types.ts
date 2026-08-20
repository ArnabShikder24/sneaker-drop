export interface RecentPurchaser {
  username: string;
  purchased_at: string;
}

export interface Drop {
  id: number;
  name: string;
  price: number;
  total_stock: number;
  available_stock: number;
  starts_at: string;
  created_at: string;
  recent_purchasers: RecentPurchaser[];
}

export interface Reservation {
  id: number;
  drop_id: number;
  user_id: number;
  status: 'active' | 'expired' | 'completed';
  expires_at: string;
  created_at: string;
}

export interface Purchase {
  id: number;
  drop_id: number;
  user_id: number;
  reservation_id: number;
  created_at: string;
}

/** Shape of an active reservation held by the current user, keyed by drop_id */
export interface ActiveReservation {
  reservation: Reservation;
  /** local expiry timestamp in ms (Date.now() + 60000) */
  expiresAtMs: number;
}