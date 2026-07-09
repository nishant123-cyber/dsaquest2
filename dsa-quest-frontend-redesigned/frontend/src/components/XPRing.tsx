interface XPRingProps {
  xp: number;
  level: number;
  size?: number;
  strokeWidth?: number;
}

const LEVEL_XP_STEP = 100; // mirrors backend progressController.ts

export default function XPRing({ xp, level, size = 56, strokeWidth = 5 }: XPRingProps) {
  const progressInLevel = xp % LEVEL_XP_STEP;
  const pct = progressInLevel / LEVEL_XP_STEP;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#7C3AED"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-data text-[11px] font-bold leading-none text-quest-purple">{level}</span>
      </div>
    </div>
  );
}
