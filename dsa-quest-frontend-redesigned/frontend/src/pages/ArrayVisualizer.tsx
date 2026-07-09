import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import ComplexityChip from "../components/ComplexityChip";
import { useCompleteVisualizer } from "../lib/useCompleteVisualizer";
import { useSoundEffects } from "../lib/sound";

export default function ArrayVisualizer() {
  const [arr, setArr] = useState<number[]>([12, 5, 8, 3]);
  const [input, setInput] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [foundIdx, setFoundIdx] = useState<number | null>(null);
  const [searching, setSearching] = useState(false);
  const { complete, done } = useCompleteVisualizer("arrays");
  const { play } = useSoundEffects();

  function addBox() {
    const num = Number(input);
    if (isNaN(num) || input.trim() === "") return;
    setArr([...arr, num]);
    setInput("");
    play("click");
    if (arr.length + 1 >= 5) {
      complete();
      play("complete");
    }
  }

  function removeLast() {
    if (arr.length === 0) return;
    setArr(arr.slice(0, -1));
    play("click");
  }

  async function runSearch() {
    const target = Number(searchVal);
    if (isNaN(target)) return;
    setSearching(true);
    setFoundIdx(null);
    for (let i = 0; i < arr.length; i++) {
      await new Promise((r) => setTimeout(r, 400));
      if (arr[i] === target) {
        setFoundIdx(i);
        setSearching(false);
        play("correct");
        complete();
        return;
      }
    }
    setSearching(false);
    play("incorrect");
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-extrabold text-quest-purple mb-2">🧱 Arrays: Lockers in a Row</h1>
        <p className="text-[var(--text-muted)] mb-3 max-w-xl">
          Think of an array as a row of numbered lockers. Each locker (box) has a position, called its{" "}
          <b className="text-[var(--text)]">index</b>, starting from 0!
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          <ComplexityChip op="Access by index" big_o="O(1)" tone="green" />
          <ComplexityChip op="Search value" big_o="O(n)" tone="yellow" />
          <ComplexityChip op="Add / remove end" big_o="O(1)" tone="blue" />
        </div>

        <div className="quest-card rounded-3xl p-6 mb-6">
          <div className="flex flex-wrap gap-3 mb-6 justify-center min-h-[100px] items-center">
            <AnimatePresence>
              {arr.map((val, idx) => (
                <motion.div
                  key={`${idx}-${val}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    backgroundColor: foundIdx === idx ? "#10B981" : "#7C3AED",
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-2xl text-white flex items-center justify-center text-xl font-bold shadow-md">
                    {val}
                  </div>
                  <span className="text-xs text-[var(--text-faint)] font-data mt-1">index {idx}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {arr.length === 0 && <p className="text-[var(--text-faint)]">Empty array — add a locker!</p>}
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addBox()}
              placeholder="Number"
              className="input-quest w-28"
            />
            <button onClick={addBox} className="btn-quest-primary">Add Locker</button>
            <button onClick={removeLast} className="btn-quest-secondary">Remove Last</button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <input
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSearch()}
              placeholder="Search value"
              className="input-quest w-28"
            />
            <button
              onClick={runSearch}
              disabled={searching}
              className="btn-quest-primary !bg-quest-blue hover:!bg-[#2563EB]"
            >
              {searching ? "Searching..." : "Search 🔍"}
            </button>
          </div>
          {foundIdx !== null && (
            <p className="text-center text-quest-green font-bold mt-3">Found at index {foundIdx}! 🎉</p>
          )}
        </div>

        <HowItWorks
          steps={[
            "Every value sits in a numbered slot called an index, starting at 0.",
            "Reading array[3] jumps straight to that slot — no searching needed, that's O(1).",
            "Finding a value you don't know the index of means checking slots one by one — O(n).",
            "Adding to the end is fast; adding in the middle means shifting everything after it.",
          ]}
          realLife="Think of a street of numbered houses — you can walk straight to house #7 without checking #1 through #6 first."
        />

        {done && <p className="text-center text-quest-green font-bold mt-4">✅ Visualizer complete — nice work!</p>}
      </div>
    </div>
  );
}

function HowItWorks({ steps, realLife }: { steps: string[]; realLife: string }) {
  return (
    <div className="quest-card rounded-3xl p-6 mb-6">
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
