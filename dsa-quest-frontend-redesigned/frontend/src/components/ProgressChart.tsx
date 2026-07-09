import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { TopicSummary } from "../lib/api";

const BAR_COLORS = ["#7C3AED", "#EC4899", "#3B82F6", "#10B981", "#F59E0B"];

export default function ProgressChart({ topics }: { topics: TopicSummary[] }) {
  const data = topics.map((t) => ({
    name: `${t.icon} ${t.title}`,
    Score: t.quizBestScore,
  }));

  return (
    <div className="quest-card rounded-3xl p-5 sm:p-6">
      <h3 className="font-display font-bold text-lg text-quest-purple mb-1">Your Quiz Scores</h3>
      <p className="text-sm text-[var(--text-muted)] mb-4">Best score recorded per topic.</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis dataKey="name" fontSize={12} stroke="var(--text-muted)" tick={{ fill: "var(--text-muted)" }} />
          <YAxis
            domain={[0, 100]}
            fontSize={12}
            stroke="var(--text-muted)"
            tick={{ fill: "var(--text-muted)" }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            formatter={(value: number) => [`${value}%`, "Best score"]}
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              color: "var(--text)",
              fontFamily: "Inter, sans-serif",
            }}
          />
          <Bar dataKey="Score" radius={[8, 8, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
