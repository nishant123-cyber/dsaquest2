import { TopicSummary } from "./api";

export interface Badge {
  key: string;
  label: string;
  description: string;
  icon: string;
  earned: boolean;
}

/**
 * Badges are computed entirely on the client from data the dashboard
 * endpoint already returns (visualizerDone / quizBestScore per topic,
 * plus xp/level). This is a frontend-only feature — no new API calls,
 * no schema changes.
 */
export function computeBadges(topics: TopicSummary[], xp: number): Badge[] {
  const allVisualizersDone = topics.length > 0 && topics.every((t) => t.visualizerDone);
  const anyPassed = topics.some((t) => t.quizBestScore >= 75);
  const allPassed = topics.length > 0 && topics.every((t) => t.quizBestScore >= 75);
  const perfectScore = topics.some((t) => t.quizBestScore === 100);
  const startedAny = topics.some((t) => t.visualizerDone || t.quizBestScore > 0);

  return [
    {
      key: "first-steps",
      label: "First Steps",
      description: "Start your very first topic",
      icon: "🧭",
      earned: startedAny,
    },
    {
      key: "quiz-passer",
      label: "Quiz Passer",
      description: "Pass a quiz with 75% or higher",
      icon: "🎯",
      earned: anyPassed,
    },
    {
      key: "perfectionist",
      label: "Perfectionist",
      description: "Score 100% on any quiz",
      icon: "💯",
      earned: perfectScore,
    },
    {
      key: "explorer",
      label: "Explorer",
      description: "Finish every visualizer",
      icon: "🗺️",
      earned: allVisualizersDone,
    },
    {
      key: "quest-champion",
      label: "Quest Champion",
      description: "Pass every quiz",
      icon: "🏆",
      earned: allPassed,
    },
    {
      key: "rising-hero",
      label: "Rising Hero",
      description: "Reach 100 XP",
      icon: "⭐",
      earned: xp >= 100,
    },
  ];
}
