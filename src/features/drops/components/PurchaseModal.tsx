import { useState } from 'react';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/Button';
import { usePurchase } from '../hooks/usePurchase';
import { useCountdown } from '../hooks/useCountdown';
import { formatCurrency, formatCountdown } from '../../../lib';
import type { Drop } from '../types/drop.types';
import type { ActiveReservation } from '../types/drop.types';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  drop: Drop;
  activeReservation: ActiveReservation;
}

export function PurchaseModal({ isOpen, onClose, drop, activeReservation }: PurchaseModalProps) {
  const { purchase, isLoading } = usePurchase();
  const { msRemaining, isExpired } = useCountdown(activeReservation.expiresAtMs);
  const [done, setDone] = useState(false);

  const handlePurchase = async () => {
    const success = await purchase(activeReservation.reservation.id, drop.id);
    if (success) {
      setDone(true);
      setTimeout(onClose, 1500);
    } else {
      onClose();
    }
  };

  // Countdown urgency color
  const countdownColor =
    msRemaining < 10_000 ? 'text-red-400' :
    msRemaining < 20_000 ? 'text-amber-400' :
    'text-orange-400';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Your Purchase">
      {done ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">🎉</div>
          <p className="text-white font-bold text-lg">Purchase complete!</p>
          <p className="text-zinc-400 text-sm mt-1">The sneakers are yours.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Product info */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Reserved item</p>
              <p className="text-white font-bold text-lg leading-tight">{drop.name}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-zinc-500 mb-1">Price</p>
              <p className="text-orange-400 font-bold text-xl">{formatCurrency(drop.price)}</p>
            </div>
          </div>

          {/* Countdown */}
          <div className="text-center">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Time remaining</p>
            {isExpired ? (
              <p className="text-red-400 font-bold text-2xl">Expired</p>
            ) : (
              <p className={`font-mono font-bold text-4xl tabular-nums ${countdownColor}`}>
                {formatCountdown(msRemaining)}
              </p>
            )}
            <p className="text-zinc-600 text-xs mt-2">
              The server will expire your reservation when time runs out
            </p>
          </div>

          {/* Countdown progress bar */}
          <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-1000"
              style={{ width: `${(msRemaining / 60000) * 100}%` }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handlePurchase}
              isLoading={isLoading}
              disabled={isExpired}
            >
              {isLoading ? 'Processing...' : `Pay ${formatCurrency(drop.price)}`}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}