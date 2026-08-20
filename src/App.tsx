import { useState } from 'react';
import { motion } from 'framer-motion';
import { Toast } from './components/Toast';
import { DropCard } from './features/drops/components/DropCard';
import { DropCardSkeleton } from './components/Skeleton';
import { Button } from './components/Button';
import { useDrops } from './features/drops/hooks/useDrops';
import { useSocket } from './hooks/useSocket';
import { useDropsStore } from './store/dropsStore';
import { findOrCreateUser } from './features/drops/api/drops.api';
import { toast } from 'sonner';

function UserSetup({ onReady }: { onReady: () => void }) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setCurrentUser = useDropsStore((s) => s.setCurrentUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;

    setIsLoading(true);
    try {
      const user = await findOrCreateUser(trimmed);
      setCurrentUser(user);
      toast.success(`Welcome, ${user.username}!`);
      onReady();
    } catch {
      toast.error('Failed to create user. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-center justify-center p-6"
    >
      <div className="w-full max-w-sm">
        {/* Logo / Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-4">
            <span className="text-3xl">👟</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Sneaker Drop</h1>
          <p className="text-zinc-500 text-sm mt-1">Limited edition. Real-time. One shot.</p>
        </div>

        {/* Username form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label htmlFor="username" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Choose a username
            </label>
            <input
              id="username"
              type="text"
              className="w-full"
              placeholder="e.g. sneakerhead_42"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={50}
              autoFocus
            />
          </div>
          <Button type="submit" isLoading={isLoading} disabled={!username.trim()} size="lg" className="w-full">
            Enter the Drop →
          </Button>
        </form>

        <p className="text-center text-zinc-600 text-xs mt-6">
          No password required — just a name to claim your pair.
        </p>
      </div>
    </motion.div>
  );
}

function Dashboard() {
  const { drops, isLoading, error } = useDrops();
  const activeReservations = useDropsStore((s) => s.activeReservations);
  const currentUser = useDropsStore((s) => s.currentUser);

  // Connect socket when dashboard mounts
  useSocket();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-800/70 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">👟</span>
            <span className="font-bold text-white tracking-tight">Sneaker Drop</span>
            <span className="hidden sm:inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <span className="text-[10px] font-bold text-orange-400 uppercase">
                {currentUser?.username[0]}
              </span>
            </div>
            <span className="text-zinc-400 text-sm hidden sm:block">{currentUser?.username}</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Page title */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Active Drops</h2>
          <p className="text-zinc-500 text-sm mt-1">
            Stock updates in real-time. Reserve now before they're gone.
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
            <p className="text-red-400 font-medium">{error}</p>
            <p className="text-zinc-500 text-sm mt-1">Check that the backend is running on port 4000.</p>
          </div>
        )}

        {/* Loading skeleton grid */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => <DropCardSkeleton key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && drops.length === 0 && (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-zinc-400 font-medium">No drops yet.</p>
            <p className="text-zinc-600 text-sm mt-1">
              Create one via <code className="text-orange-400">POST /api/drops</code>
            </p>
          </div>
        )}

        {/* Drop cards grid */}
        {!isLoading && !error && drops.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {drops.map((drop) => (
              <DropCard
                key={drop.id}
                drop={drop}
                activeReservation={activeReservations[drop.id]}
              />
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);

  return (
    <>
      <Toast />
      {ready ? <Dashboard /> : <UserSetup onReady={() => setReady(true)} />}
    </>
  );
}