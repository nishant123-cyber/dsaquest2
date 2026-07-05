import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TopicSummary } from "../lib/api";

export default function ProgressChart({ topics }: { topics: TopicSummary[] }) {
  const data = topics.map((t) => ({
    name: `${t.icon} ${t.title}`,
    Score: t.quizBestScore,
  }));

  return (
    <div className="bg-white rounded-3xl shadow p-4 sm:p-6">
      <h3 className="font-display font-bold text-lg text-quest-purple mb-4">Your Quiz Scores 📊</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis domain={[0, 100]} fontSize={12} />
          <Tooltip />
          <Bar dataKey="Score" fill="#7C3AED" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
