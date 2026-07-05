import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { useCompleteVisualizer } from "../lib/useCompleteVisualizer";

const PANCAKE_COLORS = ["#F59E0B", "#EC4899", "#7C3AED", "#3B82F6", "#10B981"];

export default function StackVisualizer() {
  const [stack, setStack] = useState<string[]>(["Pancake 1"]);
  const [count, setCount] = useState(2);
  const { complete, done } = useCompleteVisualizer("stack");

  function push() {
    setStack([...stack, `Pancake ${count}`]);
    setCount(count + 1);
    if (stack.length + 1 >= 4) complete();
  }

  function pop() {
    if (stack.length === 0) return;
    setStack(stack.slice(0, -1));
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-extrabold text-quest-purple mb-2">🥞 Stack: Pile of Pancakes</h1>
        <p className="text-gray-500 mb-6">
          A Stack follows <b>LIFO</b> — Last In, First Out. You can only add or remove from the{" "}
          <b>top</b> of the pile, just like pancakes!
        </p>

        <div className="bg-white rounded-3xl shadow p-6 flex flex-col items-center">
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
            {stack.length === 0 && <p className="text-gray-400">Empty stack — push a pancake!</p>}
          </div>

          <div className="flex gap-3">
            <button onClick={push} className="bg-quest-purple text-white font-bold px-5 py-2 rounded-xl hover:bg-quest-purple/90">
              Push ⬆️
            </button>
            <button onClick={pop} className="bg-quest-pink text-white font-bold px-5 py-2 rounded-xl hover:bg-quest-pink/90">
              Pop ⬇️
            </button>
          </div>
        </div>

        {done && <p className="text-center text-quest-green font-bold mt-4">✅ Visualizer complete — nice work!</p>}
      </div>
    </div>
  );
}
