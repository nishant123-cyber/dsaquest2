import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { TopicSummary } from "../lib/api";

// Grayscale bars with a single orange highlight on the best score —
// consistent with "color used for meaning, not decoration."
const BASE_COLOR = "#B8B8B8";
const HIGHLIGHT_COLOR = "#E8790C";

export default function ProgressChart({ topics }: { topics: TopicSummary[] }) {
  const data = topics.map((t) => ({
    name: t.title,
    Score: t.quizBestScore,
  }));
  const maxScore = Math.max(0, ...data.map((d) => d.Score));

  return (
    <div className="lc-card p-4">
      <h3 className="text-sm font-semibold mb-0.5" style={{ color: "var(--text)" }}>Quiz Scores</h3>
      <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Best score recorded per topic.</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis dataKey="name" fontSize={11} stroke="var(--text-muted)" tick={{ fill: "var(--text-muted)" }} />
          <YAxis
            domain={[0, 100]}
            fontSize={11}
            stroke="var(--text-muted)"
            tick={{ fill: "var(--text-muted)" }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            formatter={(value: number) => [`${value}%`, "Best score"]}
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text)",
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
            }}
          />
          <Bar dataKey="Score" radius={[3, 3, 0, 0]} maxBarSize={40}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.Score === maxScore && maxScore > 0 ? HIGHLIGHT_COLOR : BASE_COLOR} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
