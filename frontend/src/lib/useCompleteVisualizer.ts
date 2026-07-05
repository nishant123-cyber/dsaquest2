import { useState } from "react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { api } from "./api";

export function useCompleteVisualizer(topicSlug: string) {
  const [done, setDone] = useState(false);

  async function complete() {
    if (done) return;
    setDone(true);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    toast.success("Great job! +20 XP earned 🌟");
    try {
      await api.post(`/progress/visualizer/${topicSlug}/complete`);
    } catch {
      // XP sync failure shouldn't block the fun
    }
  }

  return { done, complete };
}
