import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import ComplexityChip from "../components/ComplexityChip";
import { useCompleteVisualizer } from "../lib/useCompleteVisualizer";
import { useSoundEffects } from "../lib/sound";

const PANCAKE_COLORS = ["#F59E0B", "#EC4899", "#7C3AED", "#3B82F6", "#10B981"];

export default function StackVisualizer() {
  const [stack, setStack] = useState<string[]>(["Pancake 1"]);
  const [count, setCount] = useState(2);
  const { complete, done } = useCompleteVisualizer("stack");
  const { play } = useSoundEffects();

  function push() {
    setStack([...stack, `Pancake ${count}`]);
    setCount(count + 1);
    play("click");
    if (stack.length + 1 >= 4) {
      complete();
      play("complete");
    }
  }

  function pop() {
    if (stack.length === 0) return;
    setStack(stack.slice(0, -1));
    play("click");
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-extrabold text-quest-purple mb-2">🥞 Stack: Pile of Pancakes</h1>
        <p className="text-[var(--text-muted)] mb-3">
          A Stack follows <b className="text-[var(--text)]">LIFO</b> — Last In, First Out. You can only add or
          remove from the <b className="text-[var(--text)]">top</b> of the pile, just like pancakes!
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          <ComplexityChip op="Push" big_o="O(1)" tone="blue" />
          <ComplexityChip op="Pop" big_o="O(1)" tone="pink" />
          <ComplexityChip op="Peek top" big_o="O(1)" tone="green" />
        </div>

        <div className="quest-card rounded-3xl p-6 flex flex-col items-center">
          <div className="flex flex-col-reverse items-center gap-1 min-h-[220px] justify-end mb-6">
            <AnimatePresence>
              {stack.map((item, idx) => (
                <motion.div
                  key={item}
                  initial={{ y: -60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -60, opacity: 0 }}
                  style={{ backgroundColor: PANCAKE_COLORS[idx % PANCAKE_COLORS.length] }}
                  className="w-40 h-10 rounded-full text-white flex items-center justify-center font-bold shadow"
                >
                  {item} {idx === stack.length - 1 && "⬅ top"}
                </motion.div>
              ))}
            </AnimatePresence>
            {stack.length === 0 && <p className="text-[var(--text-faint)]">Empty stack — push a pancake!</p>}
          </div>

          <div className="flex gap-3">
            <button onClick={push} className="btn-quest-primary">Push ⬆️</button>
            <button onClick={pop} className="btn-quest-primary !bg-quest-pink hover:!bg-[#DB2777]">Pop ⬇️</button>
          </div>
        </div>

        <HowItWorks
          steps={[
            "New items always go on top of the pile — that's a push.",
            "You can only ever remove the topmost item — that's a pop.",
            "You never touch items in the middle directly; you'd have to pop everything above first.",
            "Both push and pop only touch the top, so they're O(1) — instant, regardless of pile size.",
          ]}
          realLife="A stack of trays in a canteen — you take the top tray, and new clean trays get placed on top too."
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
