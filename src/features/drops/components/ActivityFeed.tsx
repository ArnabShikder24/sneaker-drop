import type { RecentPurchaser } from '../types/drop.types';

interface ActivityFeedProps {
  purchasers: RecentPurchaser[];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function ActivityFeed({ purchasers }: ActivityFeedProps) {
  if (purchasers.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-zinc-800/70">
      <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold mb-2">
        Recently claimed
      </p>
      <div className="flex flex-col gap-1.5">
        {purchasers.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            {/* Avatar initials */}
            <div className="h-5 w-5 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[9px] font-bold text-orange-400 uppercase">
                {p.username[0]}
              </span>
            </div>
            <span className="text-xs text-zinc-400 truncate font-medium">{p.username}</span>
            <span className="text-[10px] text-zinc-600 ml-auto flex-shrink-0">{timeAgo(p.purchased_at)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}