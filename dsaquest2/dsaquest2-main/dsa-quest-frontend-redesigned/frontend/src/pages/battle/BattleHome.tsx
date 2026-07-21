import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swords, Plus, LogIn, Wifi, WifiOff, Shield } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useBattle } from '../../context/BattleContext';

export default function BattleHome() {
  const navigate = useNavigate();
  const { connected, createRoom, joinRoom } = useBattle();

  const [roomIdInput, setRoomIdInput] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  async function handleCreate() {
    setCreating(true);
    setError('');
    const res = await createRoom();
    if (res.error) {
      setError(res.error);
    } else {
      // room is set in context; navigate to the lobby
      navigate('/battle/lobby');
    }
    setCreating(false);
  }

  async function handleJoin() {
    const id = roomIdInput.trim().toUpperCase();
    if (!id) return setError('Please enter a Room ID');
    setJoining(true);
    setError('');
    const res = await joinRoom(id);
    if (res.error) {
      setError(res.error);
    } else {
      navigate('/battle/lobby');
    }
    setJoining(false);
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 to-pink-500 shadow-lg mb-5">
            <Swords className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-display font-extrabold text-quest-purple mb-2">
            Battle Arena
          </h1>
          <p className="text-[var(--text-muted)] text-lg">
            Challenge a friend to a 1v1 coding duel. Same problem. Best solution wins.
          </p>

          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-xs font-semibold"
               style={{ background: connected ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                         color: connected ? '#059669' : '#DC2626' }}>
            {connected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {connected ? 'Connected to Arena' : 'Connecting…'}
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {/* Create Room */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="quest-card rounded-3xl p-6 flex flex-col gap-4"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-quest-purple/10 flex items-center justify-center">
                <Plus className="w-5 h-5 text-quest-purple" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-quest-purple">Create Room</h2>
                <p className="text-xs text-[var(--text-muted)]">Host a private battle</p>
              </div>
            </div>

            <p className="text-sm text-[var(--text-muted)] flex-1">
              Start a new private room and share the Room ID with your opponent. You'll both receive the same coding challenge.
            </p>

            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] bg-[var(--surface-2)] rounded-xl p-3">
              <Shield className="w-4 h-4 text-quest-purple shrink-0" />
              <span>Only players with your Room ID can join</span>
            </div>

            <button
              onClick={handleCreate}
              disabled={creating || !connected}
              className="btn-quest-primary w-full disabled:opacity-50"
            >
              {creating ? (
                <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Creating…</>
              ) : (
                <><Plus className="w-4 h-4" /> Create Room</>
              )}
            </button>
          </motion.div>

          {/* Join Room */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="quest-card rounded-3xl p-6 flex flex-col gap-4"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-quest-pink/10 flex items-center justify-center">
                <LogIn className="w-5 h-5 text-quest-pink" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-quest-pink">Join Room</h2>
                <p className="text-xs text-[var(--text-muted)]">Enter an opponent's room</p>
              </div>
            </div>

            <p className="text-sm text-[var(--text-muted)] flex-1">
              Have a Room ID from your opponent? Enter it below to join their battle room.
            </p>

            <input
              type="text"
              value={roomIdInput}
              onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              placeholder="Room ID (e.g. A3F7C2)"
              className="input-quest font-data tracking-widest uppercase text-center text-lg"
              maxLength={8}
            />

            <button
              onClick={handleJoin}
              disabled={joining || !connected || !roomIdInput.trim()}
              className="btn-quest-primary w-full !bg-quest-pink hover:!bg-[#DB2777] disabled:opacity-50"
            >
              {joining ? (
                <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Joining…</>
              ) : (
                <><LogIn className="w-4 h-4" /> Join Room</>
              )}
            </button>
          </motion.div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 p-4 rounded-2xl text-sm font-medium text-center"
            style={{ background: 'rgba(239,68,68,0.08)', color: '#DC2626', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            {error}
          </motion.div>
        )}

        {/* Rules */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-8 quest-card rounded-3xl p-6"
        >
          <h3 className="font-display font-bold text-base mb-4 text-[var(--text)]">⚔️ Battle Rules</h3>
          <ul className="space-y-2.5">
            {[
              { icon: '🔗', text: 'Share your Room ID — only invited players can join' },
              { icon: '✅', text: 'Both players must press Ready to start' },
              { icon: '⏱️', text: 'Timer starts simultaneously for both players' },
              { icon: '💻', text: 'Solve the same DSA problem using JavaScript' },
              { icon: '🏆', text: 'Most test cases passed wins; ties broken by submission time' },
              { icon: '📊', text: 'See runtime, score, and elapsed time in results' },
            ].map(({ icon, text }) => (
              <li key={text} className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]">
                <span className="text-base leading-none">{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
