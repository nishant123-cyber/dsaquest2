import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Clock, Zap, ArrowLeft, Wifi, WifiOff, Shield, Users } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useBattle } from '../../context/BattleContext';
import { useAuth } from '../../context/AuthContext';

export default function BattleLobby() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { room, connected, countdownSeconds, setReady, leaveRoom, opponentDisconnected } = useBattle();
  const [copied, setCopied] = useState(false);
  const [readying, setReadying] = useState(false);
  const [error, setError] = useState('');

  // If no room, redirect home
  useEffect(() => {
    if (!room) navigate('/battle');
  }, [room, navigate]);

  // Redirect to arena once battle starts
  useEffect(() => {
    if (room?.status === 'active') navigate('/battle/arena');
    if (room?.status === 'finished') navigate('/battle/results');
  }, [room?.status, navigate]);

  if (!room) return null;

  const myPlayer =
    user?.id === room.playerA.userId ? room.playerA : room.playerB;
  const opponent =
    user?.id === room.playerA.userId ? room.playerB : room.playerA;
  const iAmReady = myPlayer?.status === 'ready';
  const opponentReady = opponent?.status === 'ready';
  const bothReady = iAmReady && opponentReady;

  function copyRoomId() {
    navigator.clipboard.writeText(room!.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleReady() {
    setReadying(true);
    setError('');
    const res = await setReady();
    if (res.error) setError(res.error);
    setReadying(false);
  }

  function handleLeave() {
    leaveRoom();
    navigate('/battle');
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* Countdown overlay */}
      <AnimatePresence>
        {countdownSeconds !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: 'rgba(10,8,30,0.85)', backdropFilter: 'blur(12px)' }}
          >
            <motion.p className="text-2xl font-display font-bold text-white/60 mb-2">
              Battle starts in…
            </motion.p>
            <motion.div
              key={countdownSeconds}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="text-[10rem] font-display font-extrabold leading-none"
              style={{ color: countdownSeconds <= 2 ? '#EC4899' : '#7C3AED' }}
            >
              {countdownSeconds}
            </motion.div>
            <p className="text-white/40 text-sm mt-4 font-data">Get ready to code!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Back */}
        <button onClick={handleLeave} className="btn-quest-ghost mb-6 -ml-2">
          <ArrowLeft className="w-4 h-4" /> Back to Battle Home
        </button>

        {/* Room ID card */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="quest-card rounded-3xl p-6 mb-6 flex items-center justify-between gap-4"
        >
          <div>
            <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-widest mb-1">Room ID</p>
            <p className="font-data text-3xl font-bold tracking-widest text-quest-purple">{room.id}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Share this with your opponent</p>
          </div>
          <button
            onClick={copyRoomId}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition"
            style={{ background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(124,58,237,0.1)',
                     color: copied ? '#059669' : '#7C3AED' }}
          >
            {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy ID</>}
          </button>
        </motion.div>

        {/* Players */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="quest-card rounded-3xl p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Users className="w-5 h-5 text-quest-purple" />
            <h2 className="font-display font-bold text-lg text-[var(--text)]">Players</h2>
          </div>

          <div className="flex items-stretch gap-4">
            {/* Player A */}
            <PlayerCard
              player={room.playerA}
              isMe={user?.id === room.playerA.userId}
              label="Host"
            />

            <div className="flex items-center justify-center px-2">
              <div className="text-2xl font-display font-extrabold text-[var(--text-faint)]">VS</div>
            </div>

            {/* Player B */}
            {room.playerB ? (
              <PlayerCard
                player={room.playerB}
                isMe={user?.id === room.playerB.userId}
                label="Challenger"
              />
            ) : (
              <div className="flex-1 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 gap-2"
                   style={{ borderColor: 'var(--border)' }}>
                <span className="text-3xl">⏳</span>
                <p className="text-sm text-[var(--text-muted)] font-medium text-center">
                  Waiting for<br />opponent…
                </p>
                <span className="w-4 h-4 rounded-full border-2 border-quest-purple/30 border-t-quest-purple animate-spin mt-1" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Opponent disconnected warning */}
        {opponentDisconnected && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-4 rounded-2xl text-sm font-medium"
            style={{ background: 'rgba(245,158,11,0.08)', color: '#92400E', border: '1px solid rgba(245,158,11,0.25)' }}
          >
            ⚠️ Your opponent disconnected. Waiting for them to reconnect…
          </motion.div>
        )}

        {/* Status + Ready button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="quest-card rounded-3xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-quest-green" />
            <h2 className="font-display font-bold text-lg text-[var(--text)]">Battle Status</h2>
          </div>

          <div className="space-y-2 mb-6">
            <StatusRow label={room.playerA.username} ready={room.playerA.status === 'ready'} />
            <StatusRow
              label={room.playerB?.username ?? 'Waiting for player…'}
              ready={room.playerB?.status === 'ready'}
              dimmed={!room.playerB}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm text-center"
                 style={{ background: 'rgba(239,68,68,0.08)', color: '#DC2626' }}>
              {error}
            </div>
          )}

          <button
            onClick={handleReady}
            disabled={readying || iAmReady || !room.playerB}
            className="btn-quest-primary w-full !bg-quest-green hover:!bg-[#059669] disabled:opacity-50 text-lg py-4"
          >
            {readying ? (
              <><span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Setting ready…</>
            ) : iAmReady ? (
              <><Check className="w-5 h-5" /> You're Ready! Waiting for opponent…</>
            ) : (
              <><Zap className="w-5 h-5" /> I'm Ready!</>
            )}
          </button>

          {!room.playerB && (
            <p className="text-xs text-center text-[var(--text-faint)] mt-3">
              Share the Room ID above to invite your opponent first
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function PlayerCard({
  player,
  isMe,
  label,
}: {
  player: { username: string; avatar: string; status: string; userId: string };
  isMe: boolean;
  label: string;
}) {
  const ready = player.status === 'ready';
  return (
    <div
      className="flex-1 rounded-2xl p-4 flex flex-col items-center gap-2 transition"
      style={{
        background: ready ? 'rgba(16,185,129,0.08)' : 'var(--surface-2)',
        border: `2px solid ${ready ? 'rgba(16,185,129,0.4)' : 'var(--border)'}`,
      }}
    >
      <span className="text-4xl">{player.avatar}</span>
      <p className="font-bold text-sm text-center text-[var(--text)]">
        {player.username}
        {isMe && <span className="ml-1 text-xs text-quest-purple">(you)</span>}
      </p>
      <span className="text-xs text-[var(--text-muted)]">{label}</span>
      <span
        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
        style={{
          background: ready ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.1)',
          color: ready ? '#059669' : '#7C3AED',
        }}
      >
        {ready ? '✓ Ready' : 'Waiting…'}
      </span>
    </div>
  );
}

function StatusRow({
  label,
  ready,
  dimmed,
}: {
  label: string;
  ready?: boolean;
  dimmed?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 px-4 rounded-xl"
         style={{ background: 'var(--surface-2)', opacity: dimmed ? 0.5 : 1 }}>
      <span className="text-sm font-medium text-[var(--text)]">{label}</span>
      <span
        className="text-xs font-bold px-2.5 py-0.5 rounded-full"
        style={{
          background: ready ? 'rgba(16,185,129,0.15)' : 'rgba(107,107,128,0.15)',
          color: ready ? '#059669' : 'var(--text-muted)',
        }}
      >
        {ready ? '✓ Ready' : 'Not ready'}
      </span>
    </div>
  );
}
