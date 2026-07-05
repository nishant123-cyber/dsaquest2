import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { api, QuizQuestion } from "../lib/api";
import Navbar from "../components/Navbar";

export default function Quiz() {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<{ scorePercent: number; passed: boolean } | null>(null);

  useEffect(() => {
    api.get(`/quiz/${topicSlug}`).then((res) => {
      setTitle(res.data.topicTitle);
      setQuestions(res.data.quizzes);
    });
  }, [topicSlug]);

  function choose(qId: string, idx: number) {
    if (submitted) return;
    setSelected({ ...selected, [qId]: idx });
  }

  async function submit() {
    const answers = questions.map((q) => ({ quizId: q.id, selectedIdx: selected[q.id] ?? -1 }));
    const res = await api.post(`/quiz/${topicSlug}/submit`, { answers });
    setSubmitted(res.data);
    if (res.data.passed) {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
    }
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <p className="text-center py-10 text-quest-purple font-display">Loading quiz...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl mb-4">
            {submitted.passed ? "🏆" : "💪"}
          </motion.div>
          <h1 className="text-2xl font-display font-extrabold text-quest-purple mb-2">
            You scored {submitted.scorePercent}%!
          </h1>
          <p className="text-gray-500 mb-6">
            {submitted.passed ? "Awesome! You passed and earned XP! 🌟" : "So close! Try again to level up."}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setSubmitted(null);
                setSelected({});
                setCurrent(0);
              }}
              className="bg-quest-yellow text-white font-bold px-5 py-2 rounded-xl hover:bg-quest-yellow/90"
            >
              Retry Quiz
            </button>
            <Link to="/dashboard" className="bg-quest-purple text-white font-bold px-5 py-2 rounded-xl hover:bg-quest-purple/90">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-display font-extrabold text-quest-purple mb-1">{title} Quiz 🧠</h1>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div className="bg-quest-purple h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>

        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow p-6"
        >
          <p className="font-semibold text-lg mb-5">{q.question}</p>
          <div className="space-y-3">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => choose(q.id, idx)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition ${
                  selected[q.id] === idx
                    ? "border-quest-purple bg-quest-purple/10"
                    : "border-gray-200 hover:border-quest-purple/40"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              disabled={current === 0}
              onClick={() => setCurrent(current - 1)}
              className="px-4 py-2 rounded-xl font-bold text-gray-500 disabled:opacity-30"
            >
              Back
            </button>
            {current < questions.length - 1 ? (
              <button
                disabled={selected[q.id] === undefined}
                onClick={() => setCurrent(current + 1)}
                className="bg-quest-blue text-white font-bold px-5 py-2 rounded-xl hover:bg-quest-blue/90 disabled:opacity-40"
              >
                Next
              </button>
            ) : (
              <button
                disabled={selected[q.id] === undefined}
                onClick={submit}
                className="bg-quest-green text-white font-bold px-5 py-2 rounded-xl hover:bg-quest-green/90 disabled:opacity-40"
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
