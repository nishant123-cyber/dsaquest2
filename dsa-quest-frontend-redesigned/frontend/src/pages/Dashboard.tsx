import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, PlayCircle, Circle } from "lucide-react";
import { api, DashboardResponse } from "../lib/api";
import Navbar from "../components/Navbar";
import ProgressChart from "../components/ProgressChart";
import BadgeShelf from "../components/BadgeShelf";
import XPRing from "../components/XPRing";
import { computeBadges } from "../lib/badges";

const TOPIC_ACCENTS: Record<string, { ring: string; button: string; buttonHover: string }> = {
  arrays: { ring: "border-quest-purple", button: "bg-quest-purple", buttonHover: "hover:bg-[#6D28D9]" },
  stack: { ring: "border-quest-pink", button: "bg-quest-pink", buttonHover: "hover:bg-[#DB2777]" },
  queue: { ring: "border-quest-blue", button: "bg-quest-blue", buttonHover: "hover:bg-[#2563EB]" },
};
const DEFAULT_ACCENT = { ring: "border-quest-purple", button: "bg-quest-purple", buttonHover: "hover:bg-[#6D28D9]" };

export default function Dashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    api.get("/progress/dashboard").then((res) => setData(res.data));
  }, []);

  if (!data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3" style={{ background: "var(--bg)" }}>
        <div className="w-10 h-10 rounded-full border-4 border-quest-purple/20 border-t-quest-purple animate-spin" />
        <p className="text-xl font-display text-quest-purple">Loading your adventures... 🧭</p>
      </div>
    );
  }

  const badges = computeBadges(data.topics, data.user.xp);
  const xpInLevel = data.user.xp % 100;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="quest-card rounded-3xl p-6 mb-6 flex flex-col sm:flex-row sm:items-center gap-5"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl">{data.user.avatar}</div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-quest-purple">
                Hey {data.user.name.split(" ")[0]}!
              </h1>
              <p className="text-[var(--text-muted)]">Pick a topic and start your quest.</p>
            </div>
          </div>

          <div className="sm:ml-auto flex items-center gap-4">
            <XPRing xp={data.user.xp} level={data.user.level} size={64} strokeWidth={6} />
            <div>
              <p className="font-data text-sm font-bold text-quest-purple">Level {data.user.level}</p>
              <p className="text-xs text-[var(--text-muted)] font-data">{xpInLevel}/100 XP to next level</p>
            </div>
          </div>
        </motion.div>

        {/* Learning path */}
        <h2 className="font-display font-bold text-lg mb-3 text-[var(--text)]">Your Learning Path</h2>
        <div className="grid sm:grid-cols-3 gap-5 mb-8">
          {data.topics.map((topic, i) => {
            const accent = TOPIC_ACCENTS[topic.slug] ?? DEFAULT_ACCENT;
            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`quest-card rounded-3xl p-5 flex flex-col gap-3 border-t-4 ${accent.ring}`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-4xl">{topic.icon}</div>
                  <span className="chip-data" style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}>
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-quest-purple">{topic.title}</h3>
                <p className="text-sm text-[var(--text-muted)] flex-1">{topic.description}</p>

                <div className="flex items-center gap-2 text-sm">
                  {topic.visualizerDone ? (
                    <span className="flex items-center gap-1 text-quest-green font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> Visualizer done
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[var(--text-faint)]">
                      <Circle className="w-4 h-4" /> Not started
                    </span>
                  )}
                </div>
                <div className="text-sm text-[var(--text-muted)] font-data">
                  Best quiz score: {topic.quizBestScore}%
                </div>

                <div className="flex gap-2 mt-2">
                  <Link
                    to={`/visualizer/${topic.slug}`}
                    className={`flex-1 flex items-center justify-center gap-1 ${accent.button} text-white text-sm font-bold py-2 rounded-xl transition ${accent.buttonHover}`}
                  >
                    <PlayCircle className="w-4 h-4" /> Learn
                  </Link>
                  <Link
                    to={`/quiz/${topic.slug}`}
                    className="flex-1 flex items-center justify-center gap-1 bg-quest-yellow text-white text-sm font-bold py-2 rounded-xl hover:bg-[#D97706] transition"
                  >
                    Quiz 🧠
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <ProgressChart topics={data.topics} />
          <BadgeShelf badges={badges} />
        </div>
      </div>
    </div>
  );
}
