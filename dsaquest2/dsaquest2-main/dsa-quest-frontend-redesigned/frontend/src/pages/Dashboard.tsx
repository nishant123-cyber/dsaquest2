import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, PlayCircle, Circle, Swords, Trophy, Flame, Coins, BarChart3 } from "lucide-react";
import { api, DashboardResponse, TopicSummary } from "../lib/api";
import Navbar from "../components/Navbar";
import ProgressChart from "../components/ProgressChart";
import BadgeShelf from "../components/BadgeShelf";
import { computeBadges } from "../lib/badges";
import { recordVisitAndGetStreak } from "../lib/streak";
import { getRankTitle, getCoins } from "../lib/rank";

function topicStatus(topic: TopicSummary): { label: string; color: string } {
  if (topic.visualizerDone && topic.quizBestScore >= 75) return { label: "Completed", color: "#1AA260" };
  if (topic.visualizerDone || topic.quizBestScore > 0) return { label: "In progress", color: "#E8790C" };
  return { label: "Not started", color: "var(--text-faint)" };
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    api.get("/progress/dashboard").then((res) => setData(res.data));
    setStreak(recordVisitAndGetStreak());
  }, []);

  if (!data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-2" style={{ background: "var(--bg)" }}>
        <div
          className="w-6 h-6 rounded-full border-2 animate-spin"
          style={{ borderColor: "var(--border)", borderTopColor: "#E8790C" }}
        />
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Loading dashboard…</p>
      </div>
    );
  }

  const badges = computeBadges(data.topics, data.user.xp);
  const solvedCount = data.topics.filter((t) => t.quizBestScore >= 75).length;
  const dailyTopic = data.topics.find((t) => !t.visualizerDone || t.quizBestScore < 75) ?? data.topics[0];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />
      <div className="max-w-[1280px] mx-auto px-4 py-4">
        <div className="grid lg:grid-cols-[1fr_296px] gap-4 items-start">
          {/* ───────── Main column ───────── */}
          <div className="flex flex-col gap-4 min-w-0">
            {/* Daily challenge */}
            {dailyTopic && (
              <div className="lc-card p-4 flex items-center gap-4" style={{ borderLeft: "3px solid #E8790C" }}>
                <div className="text-2xl shrink-0">{dailyTopic.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="lc-tag" style={{ background: "#FCEEDD", color: "#9A5309" }}>
                      Daily Challenge
                    </span>
                  </div>
                  <h2 className="text-[15px] font-semibold truncate" style={{ color: "var(--text)" }}>
                    {dailyTopic.title}
                  </h2>
                  <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{dailyTopic.description}</p>
                </div>
                <Link to={`/visualizer/${dailyTopic.slug}`} className="lc-btn-primary shrink-0">
                  Solve
                </Link>
              </div>
            )}

            {/* Continue learning */}
            <div className="lc-card overflow-hidden">
              <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                <h2 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Continue Learning</h2>
              </div>
              <div>
                {data.topics.map((topic, i) => {
                  const status = topicStatus(topic);
                  return (
                    <div
                      key={topic.id}
                      className="lc-row flex items-center gap-3 px-4 py-3"
                      style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
                    >
                      <span className="text-lg w-6 text-center shrink-0">{topic.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{topic.title}</p>
                        <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{topic.description}</p>
                      </div>

                      <span
                        className="hidden sm:flex items-center gap-1 text-xs font-medium shrink-0"
                        style={{ color: status.color }}
                      >
                        {topic.visualizerDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                        {status.label}
                      </span>

                      <span className="hidden md:block text-xs font-data w-16 text-right shrink-0" style={{ color: "var(--text-muted)" }}>
                        {topic.quizBestScore}%
                      </span>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Link to={`/visualizer/${topic.slug}`} className="lc-btn-secondary !px-2.5 !py-1 text-xs">
                          <PlayCircle className="w-3.5 h-3.5" /> Learn
                        </Link>
                        <Link to={`/quiz/${topic.slug}`} className="lc-btn-secondary !px-2.5 !py-1 text-xs">
                          Quiz
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <ProgressChart topics={data.topics} />
              <BadgeShelf badges={badges} />
            </div>
          </div>

          {/* ───────── Sidebar ───────── */}
          <aside className="flex flex-col gap-4">
            <div className="lc-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                  style={{ background: "var(--surface-2)" }}
                >
                  {data.user.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{data.user.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{getRankTitle(data.user.level)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded-md py-2" style={{ background: "var(--surface-2)" }}>
                  <p className="text-sm font-data font-semibold" style={{ color: "var(--text)" }}>{data.user.xp}</p>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>XP</p>
                </div>
                <div className="rounded-md py-2" style={{ background: "var(--surface-2)" }}>
                  <p className="text-sm font-data font-semibold" style={{ color: "var(--text)" }}>Lv {data.user.level}</p>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Level</p>
                </div>
                <div className="rounded-md py-2 flex flex-col items-center" style={{ background: "var(--surface-2)" }}>
                  <p className="text-sm font-data font-semibold flex items-center gap-1" style={{ color: "var(--text)" }}>
                    <Flame className="w-3 h-3" style={{ color: "#E8790C" }} /> {streak ?? "–"}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Day streak</p>
                </div>
                <div className="rounded-md py-2 flex flex-col items-center" style={{ background: "var(--surface-2)" }}>
                  <p className="text-sm font-data font-semibold flex items-center gap-1" style={{ color: "var(--text)" }}>
                    <Coins className="w-3 h-3" style={{ color: "#E8790C" }} /> {getCoins(data.user.xp)}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Coins</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                <span className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                  <BarChart3 className="w-3.5 h-3.5" /> Topics solved
                </span>
                <span className="text-xs font-data font-semibold" style={{ color: "var(--text)" }}>
                  {solvedCount}/{data.topics.length}
                </span>
              </div>
            </div>

            {/* Battle Arena */}
            <div className="lc-card p-4">
              <div className="flex items-center gap-2 mb-1">
                <Swords className="w-4 h-4" style={{ color: "var(--text)" }} />
                <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Battle Arena</h3>
              </div>
              <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                1v1 real-time coding duel. Same problem, best solution wins.
              </p>
              <Link to="/battle" className="lc-btn-primary w-full">
                <Swords className="w-3.5 h-3.5" /> Enter Arena
              </Link>
            </div>

            {/* Contests — not built yet, shown honestly as coming soon */}
            <div className="lc-card p-4" style={{ opacity: 0.6 }}>
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>Upcoming Contests</h3>
              </div>
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>Coming soon.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
