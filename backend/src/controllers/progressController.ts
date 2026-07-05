import { Response } from "express";
import { prisma } from "../utils/prisma";
import { AuthRequest } from "../middleware/auth";

const XP_PER_VISUALIZER = 20;
const XP_PER_QUIZ_PASS = 30;
const LEVEL_XP_STEP = 100;

export async function getDashboard(req: AuthRequest, res: Response) {
  const userId = req.userId!;

  const topics = await prisma.topic.findMany({
    orderBy: { order: "asc" },
    include: {
      progress: { where: { userId } },
      quizzes: { select: { id: true } },
    },
  });

  const user = await prisma.user.findUnique({ where: { id: userId } });

  type TopicWithRelations = (typeof topics)[number];
  const topicsWithProgress = topics.map((t: TopicWithRelations) => {
    const p = t.progress[0];
    return {
      id: t.id,
      slug: t.slug,
      title: t.title,
      description: t.description,
      icon: t.icon,
      totalQuizzes: t.quizzes.length,
      visualizerDone: p?.visualizerDone ?? false,
      quizBestScore: p?.quizBestScore ?? 0,
    };
  });

  res.json({
    user: { name: user?.name, avatar: user?.avatar, xp: user?.xp, level: user?.level },
    topics: topicsWithProgress,
  });
}

export async function markVisualizerDone(req: AuthRequest, res: Response) {
  const userId = req.userId!;
  const { topicSlug } = req.params;

  const topic = await prisma.topic.findUnique({ where: { slug: topicSlug } });
  if (!topic) return res.status(404).json({ error: "Topic not found" });

  const existing = await prisma.topicProgress.findUnique({
    where: { userId_topicId: { userId, topicId: topic.id } },
  });

  const alreadyDone = existing?.visualizerDone;

  await prisma.topicProgress.upsert({
    where: { userId_topicId: { userId, topicId: topic.id } },
    update: { visualizerDone: true },
    create: { userId, topicId: topic.id, visualizerDone: true },
  });

  if (!alreadyDone) {
    await addXp(userId, XP_PER_VISUALIZER);
  }

  res.json({ ok: true });
}

async function addXp(userId: string, amount: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;
  const newXp = user.xp + amount;
  const newLevel = Math.floor(newXp / LEVEL_XP_STEP) + 1;
  await prisma.user.update({ where: { id: userId }, data: { xp: newXp, level: newLevel } });
}

export { XP_PER_QUIZ_PASS, addXp };
