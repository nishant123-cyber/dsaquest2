import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import {
  Clock,
  Send,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  AlertCircle,
  Trophy,
  Loader2,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useBattle, BattleQuestionFrontend } from '../../context/BattleContext';
import { useAuth } from '../../context/AuthContext';

const BATTLE_DURATION = 30 * 60; // 30 minutes in seconds

export default function BattleArena() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { room, submitSolution, opponentDisconnected } = useBattle();

  const [code, setCode] = useState('');
  const [language] = useState('javascript');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [elapsed, setElapsed] = useState(0); // seconds since battle start
  const [descExpanded, setDescExpanded] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Redirect if no room, or if it's in a state this screen doesn't handle.
  // 'finished' IS handled by this screen (shows the ending overlay, then
  // navigates via the timed effect below) — don't redirect immediately here,
  // or the overlay never gets a chance to render.
  useEffect(() => {
    if (!room) { navigate('/battle'); return; }
    if (room.status !== 'active' && room.status !== 'finished') { navigate('/battle/lobby'); return; }
  }, [room?.status]);

  // Init code from question starter
  useEffect(() => {
    if (room?.question?.starterCode && !code) {
      setCode(room.question.starterCode);
    }
  }, [room?.question?.starterCode]);

  // Timer
  useEffect(() => {
    if (!room?.startTime) return;
    const tick = () => {
      const s = Math.floor((Date.now() - room.startTime!) / 1000);
      setElapsed(Math.min(s, BATTLE_DURATION));
    };
    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [room?.startTime]);

  // Navigate to results when battle ends
  useEffect(() => {
    if (room?.status === 'finished') {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => navigate('/battle/results'), 1500);
    }
  }, [room?.status]);

  if (!room || (room.status !== 'active' && room.status !== 'finished')) return null;

  const question = room.question!;
  const remaining = Math.max(0, BATTLE_DURATION - elapsed);
  const myPlayer = user?.id === room.playerA.userId ? room.playerA : room.playerB;
  const opponent = user?.id === room.playerA.userId ? room.playerB : room.playerA;
  const iAmSubmitted = myPlayer?.status === 'submitted';
  const opponentSubmitted = opponent?.status === 'submitted';

  async function handleSubmit() {
    if (submitting || submitted) return;
    setSubmitting(true);
    setSubmitError('');
    const res = await submitSolution(code, language);
    if (res.error) {
      setSubmitError(res.error);
    } else {
      setSubmitted(true);
    }
    setSubmitting(false);
  }

  const timerPercent = ((BATTLE_DURATION - elapsed) / BATTLE_DURATION) * 100;
  const timerColor = remaining < 300 ? '#EC4899' : remaining < 600 ? '#F59E0B' : '#10B981';

  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b gap-3"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        {/* Problem title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <DifficultyBadge difficulty={question.difficulty} />
          <span className="font-display font-bold text-[var(--text)] truncate">{question.title}</span>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-data font-bold text-sm"
            style={{ background: `${timerColor}18`, color: timerColor }}
          >
            <Clock className="w-4 h-4" />
            {formatTime(remaining)}
          </div>
        </div>

        {/* Player status */}
        <div className="flex items-center gap-3">
          <PlayerStatus name={user?.name ?? ''} avatar={user?.avatar ?? '🦸'} submitted={iAmSubmitted ?? false} />
          <span className="text-[var(--text-faint)] text-xs font-bold">VS</span>
          {opponent ? (
            <PlayerStatus name={opponent.username} avatar={opponent.avatar} submitted={opponentSubmitted ?? false} />
          ) : (
            <span className="text-xs text-[var(--text-faint)]">No opponent</span>
          )}
        </div>
      </div>

      {/* Timer progress bar */}
      <div className="h-1 w-full" style={{ background: 'var(--surface-2)' }}>
        <motion.div
          className="h-1 transition-all duration-1000"
          style={{ width: `${timerPercent}%`, background: timerColor }}
        />
      </div>

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Problem description */}
        <div
          className="w-[380px] shrink-0 flex flex-col border-r overflow-y-auto"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
        >
          {/* Description header */}
          <button
            onClick={() => setDescExpanded((v) => !v)}
            className="flex items-center justify-between px-5 py-3 border-b"
            style={{ borderColor: 'var(--border)' }}
          >
            <span className="font-semibold text-sm text-[var(--text)]">Problem Description</span>
            {descExpanded ? <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />}
          </button>

          {descExpanded && (
            <div className="px-5 py-4 space-y-5 text-sm text-[var(--text)]">
              {/* Description */}
              <div className="leading-relaxed whitespace-pre-wrap">{question.description}</div>

              {/* Examples */}
              <div>
                <p className="font-bold mb-2.5 text-[var(--text)]">Examples</p>
                {question.examples.map((ex, i) => (
                  <div key={i} className="rounded-xl p-3 mb-2.5 font-data text-xs" style={{ background: 'var(--surface-2)' }}>
                    <p><span className="text-[var(--text-muted)]">Input:</span> <span className="text-quest-blue">{ex.input}</span></p>
                    <p><span className="text-[var(--text-muted)]">Output:</span> <span className="text-quest-green">{ex.output}</span></p>
                    {ex.explanation && <p className="mt-1 text-[var(--text-muted)]">{ex.explanation}</p>}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div>
                <p className="font-bold mb-2 text-[var(--text)]">Constraints</p>
                <ul className="space-y-1">
                  {question.constraints.map((c, i) => (
                    <li key={i} className="text-xs text-[var(--text-muted)] flex items-start gap-1.5">
                      <span className="text-quest-purple mt-0.5">•</span> {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Test cases note */}
              <div className="p-3 rounded-xl text-xs" style={{ background: 'rgba(124,58,237,0.06)' }}>
                <span className="text-quest-purple font-semibold">
                  {question.totalTestCases} hidden test cases
                </span>
                <span className="text-[var(--text-muted)]"> — your solution will be evaluated against all of them on submission.</span>
              </div>
            </div>
          )}

          {/* Opponent status panel */}
          <div className="mt-auto border-t p-4 space-y-2" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">Live Status</p>
            {opponent && (
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl" style={{ background: 'var(--surface-2)' }}>
                <span className="text-2xl">{opponent.avatar}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[var(--text)] truncate">{opponent.username}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {opponentSubmitted
                      ? `✓ Submitted · ${opponent.submission?.testsPassed ?? 0}/${opponent.submission?.totalTests ?? 0} tests`
                      : 'Coding…'}
                  </p>
                </div>
                {opponentSubmitted ? (
                  <CheckCircle2 className="w-4 h-4 text-quest-green shrink-0" />
                ) : (
                  <span className="w-3 h-3 rounded-full border-2 border-quest-purple/30 border-t-quest-purple animate-spin shrink-0" />
                )}
              </div>
            )}
            {opponentDisconnected && (
              <p className="text-xs text-quest-yellow font-medium p-2">⚠️ Opponent disconnected</p>
            )}
          </div>
        </div>

        {/* Right: Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor toolbar */}
          <div
            className="flex items-center justify-between px-4 py-2 border-b"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-md font-data"
                style={{ background: 'rgba(245,158,11,0.12)', color: '#92400E' }}
              >
                JavaScript
              </span>
            </div>

            {submitError && (
              <div className="flex items-center gap-1.5 text-xs text-red-500">
                <AlertCircle className="w-3.5 h-3.5" /> {submitError}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting || iAmSubmitted}
              className="btn-quest-primary !bg-quest-green hover:!bg-[#059669] !py-2 !px-4 text-sm disabled:opacity-50"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Judging…</>
              ) : iAmSubmitted ? (
                <><CheckCircle2 className="w-4 h-4" /> Submitted!</>
              ) : (
                <><Send className="w-4 h-4" /> Submit Solution</>
              )}
            </button>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              language="javascript"
              value={code}
              onChange={(val) => setCode(val ?? '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                lineNumbers: 'on',
                renderWhitespace: 'none',
                tabSize: 2,
                wordWrap: 'on',
                readOnly: iAmSubmitted ?? false,
              }}
            />
          </div>
        </div>
      </div>

      {/* Submitted overlay */}
      <AnimatePresence>
        {iAmSubmitted && !room.winner && room.status !== 'finished' && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl font-semibold text-sm text-white"
                 style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
              <CheckCircle2 className="w-5 h-5" />
              Solution submitted! Waiting for opponent…
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Battle ending overlay */}
      <AnimatePresence>
        {room.status === 'finished' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(10,8,30,0.85)', backdropFilter: 'blur(12px)' }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <Trophy className="w-20 h-20 text-quest-yellow mx-auto mb-4" />
              <p className="text-3xl font-display font-extrabold text-white">Battle Over!</p>
              <p className="text-white/60 mt-2">Loading results…</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    Easy: { bg: 'rgba(16,185,129,0.12)', color: '#059669' },
    Medium: { bg: 'rgba(245,158,11,0.12)', color: '#92400E' },
    Hard: { bg: 'rgba(239,68,68,0.12)', color: '#DC2626' },
  };
  const c = colors[difficulty] ?? colors.Easy;
  return (
    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0" style={c}>
      {difficulty}
    </span>
  );
}

function PlayerStatus({ name, avatar, submitted }: { name: string; avatar: string; submitted: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-base leading-none">{avatar}</span>
      <span className="text-xs font-semibold text-[var(--text)] hidden sm:block">{name}</span>
      {submitted ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-quest-green" />
      ) : (
        <span className="w-3 h-3 rounded-full border-2 border-quest-purple/30 border-t-quest-purple animate-spin" />
      )}
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
