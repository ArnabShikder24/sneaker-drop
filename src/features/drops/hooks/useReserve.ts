import { useState } from 'react';
import { toast } from 'sonner';
import { createReservation } from '../api/drops.api';
import { useDropsStore } from '../../../store/dropsStore';
import { getErrorMessage, getErrorCode } from '../../../lib';

export function useReserve() {
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useDropsStore((s) => s.currentUser);
  const addReservation = useDropsStore((s) => s.addReservation);

  const reserve = async (dropId: number) => {
    if (!currentUser) {
      toast.error('Please enter a username first.');
      return;
    }

    setIsLoading(true);
    try {
      const { reservation, availableStock } = await createReservation(dropId, currentUser.id);

      addReservation(dropId, {
        reservation,
        expiresAtMs: new Date(reservation.expires_at).getTime(),
      });

      toast.success(`Reserved! You have 60 seconds to complete your purchase.`, {
        description: `Stock remaining: ${availableStock}`,
      });
    } catch (err) {
      const code = getErrorCode(err);
      const message = getErrorMessage(err);

      if (code === 'SOLD_OUT') {
        toast.error('Just sold out!', {
          description: 'Someone else grabbed the last one. Better luck on the next drop.',
        });
      } else if (code === 'ALREADY_RESERVED') {
        toast.warning('You already have an active reservation for this drop.');
      } else {
        toast.error('Reservation failed', { description: message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { reserve, isLoading };
}