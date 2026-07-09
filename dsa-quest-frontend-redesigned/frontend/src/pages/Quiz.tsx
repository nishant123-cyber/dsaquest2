import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle2, XCircle } from "lucide-react";
import { api, QuizQuestion, QuizSubmitResponse } from "../lib/api";
import Navbar from "../components/Navbar";
import { useSoundEffects } from "../lib/sound";

export default function Quiz() {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<QuizSubmitResponse | null>(null);
  const [showReview, setShowReview] = useState(false);
  const { play } = useSoundEffects();

  useEffect(() => {
    api.get(`/quiz/${topicSlug}`).then((res) => {
      setTitle(res.data.topicTitle);
      setQuestions(res.data.quizzes);
    });
  }, [topicSlug]);

  function choose(qId: string, idx: number) {
    if (submitted) return;
    setSelected({ ...selected, [qId]: idx });
    play("click");
  }

  async function submit() {
    const answers = questions.map((q) => ({ quizId: q.id, selectedIdx: selected[q.id] ?? -1 }));
    const res = await api.post<QuizSubmitResponse>(`/quiz/${topicSlug}/submit`, { answers });
    setSubmitted(res.data);
    if (res.data.passed) {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
      play("levelup");
    } else {
      play("incorrect");
    }
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg)" }}>
        <Navbar />
        <p className="text-center py-10 text-quest-purple font-display">Loading quiz...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg)" }}>
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl mb-4">
            {submitted.passed ? "🏆" : "💪"}
          </motion.div>
          <h1 className="text-2xl font-display font-extrabold text-quest-purple mb-2">
            You scored {submitted.scorePercent}%!
          </h1>
          <p className="font-data text-sm text-[var(--text-muted)] mb-1">
            {submitted.correctCount} / {submitted.total} correct
          </p>
          <p className="text-[var(--text-muted)] mb-6">
            {submitted.passed ? "Awesome! You passed and earned XP! 🌟" : "So close! Try again to level up."}
          </p>
          <div className="flex gap-3 justify-center flex-wrap mb-6">
            <button onClick={() => setShowReview((v) => !v)} className="btn-quest-secondary">
              {showReview ? "Hide review" : "Review answers"}
            </button>
            <button
              onClick={() => {
                setSubmitted(null);
                setSelected({});
                setCurrent(0);
                setShowReview(false);
              }}
              className="btn-quest-primary !bg-quest-yellow hover:!bg-[#D97706]"
            >
              Retry Quiz
            </button>
            <Link to="/dashboard" className="btn-quest-primary">
              Back to Dashboard
            </Link>
          </div>

          {showReview && (
            <div className="space-y-3 text-left">
              {questions.map((q) => {
                const result = submitted.results.find((r) => r.quizId === q.id);
                const yourIdx = selected[q.id];
                return (
                  <div key={q.id} className="quest-card rounded-2xl p-4">
                    <p className="font-semibold text-sm mb-2">{q.question}</p>
                    <div className="flex items-center gap-2 text-sm">
                      {result?.correct ? (
                        <CheckCircle2 className="w-4 h-4 text-quest-green shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-quest-pink shrink-0" />
                      )}
                      <span className="text-[var(--text-muted)]">
                        Your answer: <b className="text-[var(--text)]">{q.options[yourIdx] ?? "No answer"}</b>
                      </span>
                    </div>
                    {!result?.correct && result && (
                      <p className="text-sm text-quest-green mt-1 ml-6">
                        Correct answer: <b>{q.options[result.correctIdx]}</b>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-display font-extrabold text-quest-purple">{title} Quiz 🧠</h1>
          <span className="font-data text-xs text-[var(--text-muted)]">
            {current + 1} / {questions.length}
          </span>
        </div>
        <div className="w-full rounded-full h-2 mb-6" style={{ background: "var(--surface-2)" }}>
          <div className="bg-quest-purple h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>

        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="quest-card rounded-3xl p-6"
        >
          <p className="font-semibold text-lg mb-5">{q.question}</p>
          <div className="space-y-3">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => choose(q.id, idx)}
                className="w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition"
                style={
                  selected[q.id] === idx
                    ? { borderColor: "#7C3AED", background: "rgba(124,58,237,0.1)" }
                    : { borderColor: "var(--border)" }
                }
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              disabled={current === 0}
              onClick={() => setCurrent(current - 1)}
              className="btn-quest-ghost disabled:opacity-30"
            >
              Back
            </button>
            {current < questions.length - 1 ? (
              <button
                disabled={selected[q.id] === undefined}
                onClick={() => setCurrent(current + 1)}
                className="btn-quest-primary !bg-quest-blue hover:!bg-[#2563EB] disabled:opacity-40"
              >
                Next
              </button>
            ) : (
              <button
                disabled={selected[q.id] === undefined}
                onClick={submit}
                className="btn-quest-primary !bg-quest-green hover:!bg-[#059669] disabled:opacity-40"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
