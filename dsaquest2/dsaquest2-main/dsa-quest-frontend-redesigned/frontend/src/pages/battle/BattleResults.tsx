import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Clock, Zap, CheckCircle2, XCircle, BarChart2, Swords, Home } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useBattle, PlayerInfo } from '../../context/BattleContext';
import { useAuth } from '../../context/AuthContext';

export default function BattleResults() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { room, leaveRoom } = useBattle();

  useEffect(() => {
    if (!room) { navigate('/battle'); return; }
  }, []);

  useEffect(() => {
    if (!room) return;
    const iWon = room.winner === user?.id;
    if (iWon) {
      confetti({ particleCount: 180, spread: 120, origin: { y: 0.55 } });
      setTimeout(() => confetti({ particleCount: 80, spread: 80, origin: { y: 0.4 }, angle: 60 }), 400);
      setTimeout(() => confetti({ particleCount: 80, spread: 80, origin: { y: 0.4 }, angle: 120 }), 600);
    }
  }, []);

  if (!room) return null;

  const myPlayer = user?.id === room.playerA.userId ? room.playerA : room.playerB;
  const opponent = user?.id === room.playerA.userId ? room.playerB : room.playerA;
  const iWon = room.winner === user?.id;
  const isDraw = room.winner === null;
  const opponentWon = room.winner !== null && room.winner !== user?.id;

  function handlePlayAgain() {
    leaveRoom();
    navigate('/battle');
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Result header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className="text-8xl mb-3">
            {iWon ? '🏆' : isDraw ? '🤝' : '💪'}
          </div>
          <h1
            className="text-4xl font-display font-extrabold mb-1"
            style={{
              color: iWon ? '#F59E0B' : isDraw ? '#7C3AED' : '#EC4899',
            }}
          >
            {iWon ? 'You Win!' : isDraw ? "It's a Draw!" : 'Good Effort!'}
          </h1>
          <p className="text-[var(--text-muted)]">
            {iWon
              ? 'Outstanding performance — you outdueled your opponent!'
              : isDraw
              ? 'Both players performed equally — impressive!'
              : 'Keep practising — the next victory is yours!'}
          </p>
        </motion.div>

        {/* VS card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="quest-card rounded-3xl p-6 mb-5"
        >
          <div className="flex items-stretch gap-4">
            {myPlayer && (
              <ResultPlayerCard
                player={myPlayer}
                isWinner={room.winner === myPlayer.userId}
                isDraw={isDraw}
                label="You"
              />
            )}
            <div className="flex items-center justify-center px-2">
              <div className="text-xl font-display font-extrabold text-[var(--text-faint)]">VS</div>
            </div>
            {opponent && (
              <ResultPlayerCard
                player={opponent}
                isWinner={room.winner === opponent.userId}
                isDraw={isDraw}
                label="Opponent"
              />
            )}
          </div>
        </motion.div>

        {/* Stats comparison */}
        {myPlayer?.submission && opponent?.submission && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="quest-card rounded-3xl p-6 mb-5"
          >
            <h2 className="font-display font-bold text-base mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-quest-purple" /> Performance Breakdown
            </h2>

            <div className="grid grid-cols-3 gap-2 text-center mb-4">
              <div />
              <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">You</div>
              <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{opponent.username}</div>
            </div>

            {[
              {
                label: 'Tests Passed',
                icon: <CheckCircle2 className="w-4 h-4 text-quest-green" />,
                myVal: `${myPlayer.submission.testsPassed}/${myPlayer.submission.totalTests}`,
                oppVal: `${opponent.submission.testsPassed}/${opponent.submission.totalTests}`,
                myBetter: myPlayer.submission.testsPassed >= opponent.submission.testsPassed,
              },
              {
                label: 'Score',
                icon: <Trophy className="w-4 h-4 text-quest-yellow" />,
                myVal: `${myPlayer.submission.score}%`,
                oppVal: `${opponent.submission.score}%`,
                myBetter: myPlayer.submission.score >= opponent.submission.score,
              },
              {
                label: 'Time Taken',
                icon: <Clock className="w-4 h-4 text-quest-blue" />,
                myVal: formatTime(myPlayer.submission.elapsedSeconds),
                oppVal: formatTime(opponent.submission.elapsedSeconds),
                myBetter: myPlayer.submission.elapsedSeconds <= opponent.submission.elapsedSeconds,
              },
              {
                label: 'Runtime',
                icon: <Zap className="w-4 h-4 text-quest-pink" />,
                myVal: `${myPlayer.submission.runtime}ms`,
                oppVal: `${opponent.submission.runtime}ms`,
                myBetter: myPlayer.submission.runtime <= opponent.submission.runtime,
              },
            ].map(({ label, icon, myVal, oppVal, myBetter }) => (
              <div
                key={label}
                className="grid grid-cols-3 gap-2 items-center py-2.5 px-1 rounded-xl"
                style={{ background: 'var(--surface-2)' }}
              >
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                  {icon} {label}
                </div>
                <div
                  className="text-sm font-bold font-data text-center"
                  style={{ color: myBetter ? '#10B981' : 'var(--text-muted)' }}
                >
                  {myVal}
                </div>
                <div
                  className="text-sm font-bold font-data text-center"
                  style={{ color: !myBetter ? '#10B981' : 'var(--text-muted)' }}
                >
                  {oppVal}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Missing submission note */}
        {(!myPlayer?.submission || !opponent?.submission) && (
          <div className="quest-card rounded-3xl p-5 mb-5 text-sm text-center text-[var(--text-muted)]">
            {room.winner ? (
              opponentWon ? '⚠️ Opponent disconnected or submitted — results may be incomplete.' : '⚠️ Opponent disconnected — you won by default.'
            ) : (
              '⚠️ Battle ended early — detailed stats unavailable.'
            )}
          </div>
        )}

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <button onClick={handlePlayAgain} className="btn-quest-primary gap-2">
            <Swords className="w-5 h-5" /> Play Again
          </button>
          <Link to="/dashboard" onClick={() => leaveRoom()} className="btn-quest-secondary gap-2">
            <Home className="w-5 h-5" /> Back to Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ResultPlayerCard({
  player,
  isWinner,
  isDraw,
  label,
}: {
  player: PlayerInfo;
  isWinner: boolean;
  isDraw: boolean;
  label: string;
}) {
  const sub = player.submission;
  const highlight = isWinner ? 'rgba(245,158,11,0.12)' : isDraw ? 'rgba(124,58,237,0.08)' : 'var(--surface-2)';
  const border = isWinner ? 'rgba(245,158,11,0.4)' : 'var(--border)';

  return (
    <div
      className="flex-1 rounded-2xl p-4 flex flex-col items-center gap-2 text-center"
      style={{ background: highlight, border: `2px solid ${border}` }}
    >
      {isWinner && <span className="text-xs font-bold text-quest-yellow">👑 WINNER</span>}
      {isDraw && <span className="text-xs font-bold text-quest-purple">🤝 DRAW</span>}
      <span className="text-4xl">{player.avatar}</span>
      <p className="font-bold text-sm text-[var(--text)]">{player.username}</p>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      {sub ? (
        <>
          <span
            className="font-data text-2xl font-extrabold"
            style={{ color: isWinner ? '#F59E0B' : 'var(--text)' }}
          >
            {sub.score}%
          </span>
          <span className="text-xs text-[var(--text-muted)]">
            {sub.testsPassed}/{sub.totalTests} tests
          </span>
          <span className="text-xs text-[var(--text-faint)]">{formatTime(sub.elapsedSeconds)}</span>
        </>
      ) : (
        <>
          <XCircle className="w-6 h-6 text-[var(--text-faint)]" />
          <span className="text-xs text-[var(--text-muted)]">No submission</span>
        </>
      )}
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
