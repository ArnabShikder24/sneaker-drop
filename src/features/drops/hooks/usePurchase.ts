import { useState } from 'react';
import { toast } from 'sonner';
import { completePurchase, fetchDrops } from '../api/drops.api';
import { useDropsStore } from '../../../store/dropsStore';
import { getErrorMessage } from '../../../lib';

export function usePurchase() {
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useDropsStore((s) => s.currentUser);
  const removeReservation = useDropsStore((s) => s.removeReservation);
  const setDrops = useDropsStore((s) => s.setDrops);

  const purchase = async (reservationId: number, dropId: number): Promise<boolean> => {
    if (!currentUser) return false;

    setIsLoading(true);
    try {
      await completePurchase(reservationId, currentUser.id);
      removeReservation(dropId);

      // Refetch drops to get updated activity feed (recent_purchasers)
      const freshDrops = await fetchDrops();
      setDrops(freshDrops);

      toast.success('🎉 Purchase complete! The sneakers are yours.', {
        duration: 5000,
      });
      return true;
    } catch (err) {
      const message = getErrorMessage(err);
      toast.error('Purchase failed', {
        description: message,
      });
      removeReservation(dropId);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { purchase, isLoading };
}