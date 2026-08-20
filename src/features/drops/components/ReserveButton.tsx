import { Button } from '../../../components/Button';
import { useReserve } from '../hooks/useReserve';
import { useCountdown } from '../hooks/useCountdown';
import { formatCountdown } from '../../../lib';
import type { ActiveReservation } from '../types/drop.types';

interface ReserveButtonProps {
  dropId: number;
  availableStock: number;
  activeReservation: ActiveReservation | undefined;
  onOpenPurchase: () => void;
}

export function ReserveButton({
  dropId,
  availableStock,
  activeReservation,
  onOpenPurchase,
}: ReserveButtonProps) {
  const { reserve, isLoading } = useReserve();
  const { msRemaining, isExpired } = useCountdown(
    activeReservation ? activeReservation.expiresAtMs : null,
  );

  if (activeReservation && !isExpired) {
    // Reservation is active — show countdown + "Complete Purchase" button
    const urgency = msRemaining < 10_000 ? 'danger' : 'primary';
    return (
      <div className="flex flex-col gap-2">
        {/* Progress bar */}
        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-1000"
            style={{ width: `${(msRemaining / 60000) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={urgency}
            size="md"
            className="flex-1"
            onClick={onOpenPurchase}
          >
            Complete Purchase
          </Button>
          <div className="text-right flex-shrink-0">
            <span
              className={`font-mono text-sm font-bold tabular-nums ${
                msRemaining < 10_000 ? 'text-red-400' :
                msRemaining < 20_000 ? 'text-amber-400' :
                'text-orange-400'
              }`}
            >
              {formatCountdown(msRemaining)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (availableStock === 0) {
    return (
      <Button variant="secondary" size="md" className="w-full" disabled>
        Sold Out
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      size="md"
      className="w-full"
      isLoading={isLoading}
      onClick={() => reserve(dropId)}
    >
      {isLoading ? 'Reserving...' : 'Reserve Now'}
    </Button>
  );
}