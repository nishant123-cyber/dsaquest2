import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, PlayCircle } from "lucide-react";
import { api, DashboardResponse } from "../lib/api";
import Navbar from "../components/Navbar";
import ProgressChart from "../components/ProgressChart";

export default function Dashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    api.get("/progress/dashboard").then((res) => setData(res.data));
  }, []);

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-display text-quest-purple">
        Loading your adventures... 🧭
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-display font-extrabold text-quest-purple mb-1"
        >
          Hey {data.user.name.split(" ")[0]}! {data.user.avatar}
        </motion.h1>
        <p className="text-gray-500 mb-6">Pick a topic and start your quest.</p>

        <div className="grid sm:grid-cols-3 gap-5 mb-8">
          {data.topics.map((topic, i) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl shadow p-5 flex flex-col gap-3"
            >
              <div className="text-4xl">{topic.icon}</div>
              <h2 className="font-display font-bold text-xl text-quest-purple">{topic.title}</h2>
              <p className="text-sm text-gray-500 flex-1">{topic.description}</p>

              <div className="flex items-center gap-2 text-sm">
                {topic.visualizerDone ? (
                  <span className="flex items-center gap-1 text-quest-green font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Visualizer done
                  </span>
                ) : (
                  <span className="text-gray-400">Visualizer not started</span>
                )}
              </div>
              <div className="text-sm text-gray-500">Best quiz score: {topic.quizBestScore}%</div>

              <div className="flex gap-2 mt-2">
                <Link
                  to={`/visualizer/${topic.slug}`}
                  className="flex-1 flex items-center justify-center gap-1 bg-quest-blue text-white text-sm font-bold py-2 rounded-xl hover:bg-quest-blue/90 transition"
                >
                  <PlayCircle className="w-4 h-4" /> Learn
                </Link>
                <Link
                  to={`/quiz/${topic.slug}`}
                  className="flex-1 flex items-center justify-center gap-1 bg-quest-yellow text-white text-sm font-bold py-2 rounded-xl hover:bg-quest-yellow/90 transition"
                >
                  Quiz 🧠
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <ProgressChart topics={data.topics} />
      </div>
    </div>
  );
}
