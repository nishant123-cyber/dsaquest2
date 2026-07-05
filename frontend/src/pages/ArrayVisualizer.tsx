import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { useCompleteVisualizer } from "../lib/useCompleteVisualizer";

export default function ArrayVisualizer() {
  const [arr, setArr] = useState<number[]>([12, 5, 8, 3]);
  const [input, setInput] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [foundIdx, setFoundIdx] = useState<number | null>(null);
  const [searching, setSearching] = useState(false);
  const { complete, done } = useCompleteVisualizer("arrays");

  function addBox() {
    const num = Number(input);
    if (isNaN(num) || input.trim() === "") return;
    setArr([...arr, num]);
    setInput("");
    if (arr.length + 1 >= 5) complete();
  }

  function removeLast() {
    setArr(arr.slice(0, -1));
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
        complete();
        return;
      }
    }
    setSearching(false);
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-extrabold text-quest-purple mb-2">🧱 Arrays: Lockers in a Row</h1>
        <p className="text-gray-500 mb-6">
          Think of an array as a row of numbered lockers. Each locker (box) has a position, called its{" "}
          <b>index</b>, starting from 0!
        </p>

        <div className="bg-white rounded-3xl shadow p-6 mb-6">
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
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
                  <span className="text-xs text-gray-400 mt-1">index {idx}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Number"
              className="border-2 border-quest-purple/20 rounded-xl px-3 py-2 w-28 focus:outline-none focus:border-quest-purple"
            />
            <button onClick={addBox} className="bg-quest-purple text-white font-bold px-4 py-2 rounded-xl hover:bg-quest-purple/90">
              Add Locker
            </button>
            <button onClick={removeLast} className="bg-gray-200 font-bold px-4 py-2 rounded-xl hover:bg-gray-300">
              Remove Last
            </button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <input
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search value"
              className="border-2 border-quest-blue/20 rounded-xl px-3 py-2 w-28 focus:outline-none focus:border-quest-blue"
            />
            <button
              onClick={runSearch}
              disabled={searching}
              className="bg-quest-blue text-white font-bold px-4 py-2 rounded-xl hover:bg-quest-blue/90 disabled:opacity-50"
            >
              {searching ? "Searching..." : "Search 🔍"}
            </button>
          </div>
          {foundIdx !== null && (
            <p className="text-center text-quest-green font-bold mt-3">Found at index {foundIdx}! 🎉</p>
          )}
        </div>

        {done && <p className="text-center text-quest-green font-bold">✅ Visualizer complete — nice work!</p>}
      </div>
    </div>
  );
}
