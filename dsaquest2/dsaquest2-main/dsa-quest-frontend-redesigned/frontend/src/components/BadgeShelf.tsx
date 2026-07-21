import { Badge } from "../lib/badges";

export default function BadgeShelf({ badges }: { badges: Badge[] }) {
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="lc-card p-4">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Achievements</h3>
        <span className="text-xs font-data" style={{ color: "var(--text-muted)" }}>
          {earnedCount}/{badges.length}
        </span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {badges.map((b) => (
          <div
            key={b.key}
            title={`${b.label} — ${b.description}`}
            className={`flex flex-col items-center gap-1 rounded-md p-2 text-center border transition-opacity duration-150 ${
              b.earned ? "" : "opacity-35 grayscale"
            }`}
            style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
          >
            <span className="text-lg leading-none">{b.icon}</span>
            <span className="text-[10px] font-medium leading-tight" style={{ color: "var(--text-muted)" }}>
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
