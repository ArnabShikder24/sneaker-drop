import { useState } from 'react';
import { motion } from 'framer-motion';
import { StockBadge } from './StockBadge';
import { ReserveButton } from './ReserveButton';
import { ActivityFeed } from './ActivityFeed';
import { PurchaseModal } from './PurchaseModal';
import { formatCurrency } from '../../../lib';
import type { Drop } from '../types/drop.types';
import type { ActiveReservation } from '../types/drop.types';

interface DropCardProps {
  drop: Drop;
  activeReservation: ActiveReservation | undefined;
}

export function DropCard({ drop, activeReservation }: DropCardProps) {
  const [purchaseOpen, setPurchaseOpen] = useState(false);

  const dropDate = new Date(drop.starts_at);
  const isUpcoming = dropDate > new Date();

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -3, transition: { duration: 0.15 } }}
        className="relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm p-6 gap-4 overflow-hidden group"
      >
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-lg leading-tight truncate">
              {drop.name}
            </h3>
            {isUpcoming && (
              <p className="text-xs text-zinc-500 mt-0.5">
                Drops {dropDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            )}
          </div>
          <StockBadge availableStock={drop.available_stock} totalStock={drop.total_stock} />
        </div>

        {/* Price — the "big number" */}
        <div>
          <p className="text-3xl font-extrabold text-white tracking-tight">
            {formatCurrency(drop.price)}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">
            {drop.total_stock} total units released
          </p>
        </div>

        {/* Stock progress bar */}
        <div>
          <div className="flex justify-between text-[10px] text-zinc-600 mb-1.5">
            <span>Availability</span>
            <span>{drop.available_stock}/{drop.total_stock}</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-orange-500 rounded-full"
              animate={{
                width: `${drop.total_stock > 0 ? (drop.available_stock / drop.total_stock) * 100 : 0}%`,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Activity feed */}
        <ActivityFeed purchasers={drop.recent_purchasers} />

        {/* Action */}
        <div className="mt-auto pt-4 border-t border-zinc-800/70">
          <ReserveButton
            dropId={drop.id}
            availableStock={drop.available_stock}
            activeReservation={activeReservation}
            onOpenPurchase={() => setPurchaseOpen(true)}
          />
        </div>
      </motion.article>

      {/* Purchase modal — rendered at DropCard level so it can read the full drop */}
      {activeReservation && (
        <PurchaseModal
          isOpen={purchaseOpen}
          onClose={() => setPurchaseOpen(false)}
          drop={drop}
          activeReservation={activeReservation}
        />
      )}
    </>
  );
}