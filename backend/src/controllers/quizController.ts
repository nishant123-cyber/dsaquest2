import { Response } from "express";
import { prisma } from "../utils/prisma";
import { AuthRequest } from "../middleware/auth";
import { addXp, XP_PER_QUIZ_PASS } from "./progressController";

export async function getQuizByTopic(req: AuthRequest, res: Response) {
  const { topicSlug } = req.params;
  const topic = await prisma.topic.findUnique({
    where: { slug: topicSlug },
    include: { quizzes: true },
  });
  if (!topic) return res.status(404).json({ error: "Topic not found" });

  // Never send the answer index to the client
  type QuizItem = (typeof topic.quizzes)[number];
  const quizzes = topic.quizzes.map((q: QuizItem) => ({ id: q.id, question: q.question, options: q.options }));
  res.json({ topicTitle: topic.title, quizzes });
}

export async function submitQuiz(req: AuthRequest, res: Response) {
  const userId = req.userId!;
  const { topicSlug } = req.params;
  const { answers } = req.body as { answers: { quizId: string; selectedIdx: number }[] };

  const topic = await prisma.topic.findUnique({
    where: { slug: topicSlug },
    include: { quizzes: true },
  });
  if (!topic) return res.status(404).json({ error: "Topic not found" });

  type QuizItem = (typeof topic.quizzes)[number];
  let correctCount = 0;
  const results: { quizId: string; correct: boolean; correctIdx: number }[] = [];

  for (const ans of answers) {
    const quiz = topic.quizzes.find((q: QuizItem) => q.id === ans.quizId);
    if (!quiz) continue;
    const correct = quiz.answerIdx === ans.selectedIdx;
    if (correct) correctCount++;
    results.push({ quizId: quiz.id, correct, correctIdx: quiz.answerIdx });

    await prisma.quizAttempt.create({
      data: { userId, quizId: quiz.id, correct },
    });
  }

  const scorePercent = topic.quizzes.length ? Math.round((correctCount / topic.quizzes.length) * 100) : 0;
  const passed = scorePercent >= 75;

  const existing = await prisma.topicProgress.findUnique({
    where: { userId_topicId: { userId, topicId: topic.id } },
  });
  const isNewBest = scorePercent > (existing?.quizBestScore ?? 0);

  await prisma.topicProgress.upsert({
    where: { userId_topicId: { userId, topicId: topic.id } },
    update: isNewBest ? { quizBestScore: scorePercent } : {},
    create: { userId, topicId: topic.id, quizBestScore: scorePercent },
  });

  if (passed && isNewBest) {
    await addXp(userId, XP_PER_QUIZ_PASS);
  }

  res.json({ correctCount, total: topic.quizzes.length, scorePercent, passed, results });
}
