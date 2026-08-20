import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface StockBadgeProps {
  availableStock: number;
  totalStock: number;
}

function getStockVariant(available: number, total: number) {
  const pct = total > 0 ? available / total : 0;
  if (available === 0) return { label: 'SOLD OUT', color: 'text-red-500', bg: 'bg-red-500/10 ring-red-500/30', dot: 'bg-red-500' };
  if (pct <= 0.15 || available <= 3) return { label: `${available} LEFT`, color: 'text-amber-400', bg: 'bg-amber-500/10 ring-amber-500/30', dot: 'bg-amber-400' };
  return { label: `${available} IN STOCK`, color: 'text-emerald-400', bg: 'bg-emerald-500/10 ring-emerald-500/30', dot: 'bg-emerald-400' };
}

export function StockBadge({ availableStock, totalStock }: StockBadgeProps) {
  const prevRef = useRef(availableStock);
  const [pulse, setPulse] = useState(false);
  const variant = getStockVariant(availableStock, totalStock);

  useEffect(() => {
    if (prevRef.current !== availableStock) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 700);
      prevRef.current = availableStock;
      return () => clearTimeout(t);
    }
  }, [availableStock]);

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-1 ${variant.bg} transition-all duration-300`}>
      {/* Live dot — pulses when soldout approaches */}
      {availableStock > 0 && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${variant.dot} opacity-60`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${variant.dot}`} />
        </span>
      )}

      <AnimatePresence mode="popLayout">
        <motion.span
          key={availableStock}
          initial={{ opacity: 0, y: -8, scale: 0.85 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: pulse ? [1, 1.25, 1] : 1,
            color: pulse ? ['#f97316', variant.color.replace('text-', '')] : undefined,
          }}
          exit={{ opacity: 0, y: 8, scale: 0.85 }}
          transition={{ duration: 0.25 }}
          className={`text-xs font-bold tracking-widest uppercase ${variant.color}`}
        >
          {variant.label}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}