import { motion } from "framer-motion";
import { Badge } from "../lib/badges";

export default function BadgeShelf({ badges }: { badges: Badge[] }) {
  return (
    <div className="quest-card rounded-3xl p-5 sm:p-6">
      <h3 className="font-display font-bold text-lg text-quest-purple mb-1">Badges</h3>
      <p className="text-sm text-[var(--text-muted)] mb-4">Earn these by exploring and passing quizzes.</p>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {badges.map((b, i) => (
          <motion.div
            key={b.key}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            title={`${b.label} — ${b.description}`}
            className={`flex flex-col items-center gap-1.5 rounded-2xl p-3 text-center border transition-opacity ${
              b.earned ? "" : "opacity-35 grayscale"
            }`}
            style={{ background: "var(--surface-2)" }}
          >
            <span className="text-2xl">{b.icon}</span>
            <span className="text-[11px] font-semibold leading-tight">{b.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
