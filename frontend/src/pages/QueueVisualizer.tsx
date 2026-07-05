import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { useCompleteVisualizer } from "../lib/useCompleteVisualizer";

const AVATARS = ["🧑", "👧", "🧒", "👦", "👩", "🧑‍🦱"];

export default function QueueVisualizer() {
  const [queue, setQueue] = useState<string[]>(["🧑"]);
  const { complete, done } = useCompleteVisualizer("queue");

  function enqueue() {
    const emoji = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    setQueue([...queue, emoji]);
    if (queue.length + 1 >= 4) complete();
  }

  function dequeue() {
    if (queue.length === 0) return;
    setQueue(queue.slice(1));
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-extrabold text-quest-purple mb-2">🚶 Queue: The Canteen Line</h1>
        <p className="text-gray-500 mb-6">
          A Queue follows <b>FIFO</b> — First In, First Out. New people join at the{" "}
          <b>back</b>, and only the person at the <b>front</b> gets served.
        </p>

        <div className="bg-white rounded-3xl shadow p-6">
          <div className="flex items-center gap-2 min-h-[100px] overflow-x-auto px-2 mb-6 justify-center">
            <span className="text-sm text-gray-400 mr-2">Front</span>
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
            {queue.length === 0 && <p className="text-gray-400">Empty line — enqueue someone!</p>}
            <span className="text-sm text-gray-400 ml-2">Back</span>
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={enqueue} className="bg-quest-blue text-white font-bold px-5 py-2 rounded-xl hover:bg-quest-blue/90">
              Enqueue ➕
            </button>
            <button onClick={dequeue} className="bg-quest-pink text-white font-bold px-5 py-2 rounded-xl hover:bg-quest-pink/90">
              Dequeue ➖
            </button>
          </div>
        </div>

        {done && <p className="text-center text-quest-green font-bold mt-4">✅ Visualizer complete — nice work!</p>}
      </div>
    </div>
  );
}
