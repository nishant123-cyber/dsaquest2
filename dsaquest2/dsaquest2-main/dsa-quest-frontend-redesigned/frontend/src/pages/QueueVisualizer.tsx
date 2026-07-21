import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import ComplexityChip from "../components/ComplexityChip";
import { useCompleteVisualizer } from "../lib/useCompleteVisualizer";
import { useSoundEffects } from "../lib/sound";

const AVATARS = ["🧑", "👧", "🧒", "👦", "👩", "🧑‍🦱"];

export default function QueueVisualizer() {
  const [queue, setQueue] = useState<string[]>(["🧑"]);
  const { complete, done } = useCompleteVisualizer("queue");
  const { play } = useSoundEffects();

  function enqueue() {
    const emoji = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    setQueue([...queue, emoji]);
    play("click");
    if (queue.length + 1 >= 4) {
      complete();
      play("complete");
    }
  }

  function dequeue() {
    if (queue.length === 0) return;
    setQueue(queue.slice(1));
    play("click");
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-extrabold text-quest-purple mb-2">🚶 Queue: The Canteen Line</h1>
        <p className="text-[var(--text-muted)] mb-3">
          A Queue follows <b className="text-[var(--text)]">FIFO</b> — First In, First Out. New people join at the{" "}
          <b className="text-[var(--text)]">back</b>, and only the person at the{" "}
          <b className="text-[var(--text)]">front</b> gets served.
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          <ComplexityChip op="Enqueue" big_o="O(1)" tone="blue" />
          <ComplexityChip op="Dequeue" big_o="O(1)" tone="pink" />
          <ComplexityChip op="Peek front" big_o="O(1)" tone="green" />
        </div>

        <div className="quest-card rounded-3xl p-6">
          <div className="flex items-center gap-2 min-h-[100px] overflow-x-auto px-2 mb-6 justify-center">
            <span className="text-sm text-[var(--text-faint)] mr-2 font-data">Front</span>
            <AnimatePresence>
              {queue.map((person, idx) => (
                <motion.div
                  key={`${idx}-${person}`}
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -60, opacity: 0 }}
                  className="w-14 h-14 rounded-2xl bg-quest-blue/10 border-2 border-quest-blue flex items-center justify-center text-3xl shrink-0"
                >
                  {person}
                </motion.div>
              ))}
            </AnimatePresence>
            {queue.length === 0 && <p className="text-[var(--text-faint)]">Empty line — enqueue someone!</p>}
            <span className="text-sm text-[var(--text-faint)] ml-2 font-data">Back</span>
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={enqueue} className="btn-quest-primary !bg-quest-blue hover:!bg-[#2563EB]">Enqueue ➕</button>
            <button onClick={dequeue} className="btn-quest-primary !bg-quest-pink hover:!bg-[#DB2777]">Dequeue ➖</button>
          </div>
        </div>

        <HowItWorks
          steps={[
            "New arrivals always join at the back of the line.",
            "Only the person at the front can be served next — that's a dequeue.",
            "Nobody can cut the line or leave from the middle.",
            "Both joining and leaving only touch one end each, so they're O(1).",
          ]}
          realLife="The canteen lunch line — the first person to join is the first person served."
        />

        {done && <p className="text-center text-quest-green font-bold mt-4">✅ Visualizer complete — nice work!</p>}
      </div>
    </div>
  );
}

function HowItWorks({ steps, realLife }: { steps: string[]; realLife: string }) {
  return (
    <div className="quest-card rounded-3xl p-6 mt-6">
      <h2 className="font-display font-bold text-lg text-quest-purple mb-3">How it works</h2>
      <ol className="space-y-2 mb-4">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3 text-sm text-[var(--text)]">
            <span className="chip-data shrink-0 h-fit" style={{ background: "var(--surface-2)", color: "var(--text-muted)" }}>
              {i + 1}
            </span>
            <span className="pt-0.5">{s}</span>
          </li>
        ))}
      </ol>
      <div className="rounded-2xl p-4 text-sm" style={{ background: "var(--surface-2)" }}>
        <span className="font-semibold text-quest-purple">Real-life example: </span>
        <span className="text-[var(--text-muted)]">{realLife}</span>
      </div>
    </div>
  );
}
