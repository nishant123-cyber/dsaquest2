import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { recordVisitAndGetStreak } from "../lib/streak";

export default function StreakWidget() {
  const [streak, setStreak] = useState<number | null>(null);

  useEffect(() => {
    setStreak(recordVisitAndGetStreak());
  }, []);

  if (streak === null) return null;

  return (
    <div
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-data text-sm font-bold"
      style={{ background: "rgba(245, 158, 11, 0.12)", color: "#B45309" }}
      title="Days in a row you've opened DSA Quest on this device"
    >
      <Flame className="w-4 h-4 text-quest-yellow fill-quest-yellow" />
      {streak}
    </div>
  );
}
