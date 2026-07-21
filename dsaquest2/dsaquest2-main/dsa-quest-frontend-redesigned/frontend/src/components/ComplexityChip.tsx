interface ComplexityChipProps {
  op: string;
  big_o: string;
  tone?: "green" | "yellow" | "pink" | "blue";
}

const TONES: Record<string, { bg: string; text: string }> = {
  green: { bg: "rgba(16, 185, 129, 0.12)", text: "#047857" },
  yellow: { bg: "rgba(245, 158, 11, 0.14)", text: "#92400E" },
  pink: { bg: "rgba(236, 72, 153, 0.12)", text: "#9D174D" },
  blue: { bg: "rgba(59, 130, 246, 0.12)", text: "#1D4ED8" },
};

export default function ComplexityChip({ op, big_o, tone = "blue" }: ComplexityChipProps) {
  const c = TONES[tone];
  return (
    <span className="chip-data" style={{ background: c.bg, color: c.text }}>
      {op} <span className="opacity-70">·</span> {big_o}
    </span>
  );
}
