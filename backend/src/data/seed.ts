import { prisma } from "../utils/prisma";

async function main() {
  const topics = [
    {
      slug: "arrays",
      title: "Arrays",
      description: "A row of lockers, each with its own number!",
      icon: "🧱",
      order: 1,
      quizzes: [
        { question: "What number does an array START counting from in most languages?", options: ["0", "1", "-1", "10"], answerIdx: 0 },
        { question: "If box[3] = 7, what is stored at position 3?", options: ["3", "7", "box", "It's empty"], answerIdx: 1 },
        { question: "What do we call each box inside an array?", options: ["A node", "An element", "A pointer", "A key"], answerIdx: 1 },
        { question: "Which is FASTEST: finding array[5] directly, or searching one by one?", options: ["Searching one by one", "Finding array[5] directly", "Both the same", "Neither works"], answerIdx: 1 },
      ],
    },
    {
      slug: "stack",
      title: "Stack",
      description: "Like a pile of pancakes — last one on top comes off first!",
      icon: "🥞",
      order: 2,
      quizzes: [
        { question: "In a Stack, which pancake do you eat first?", options: ["The bottom one", "The top one", "A random one", "The middle one"], answerIdx: 1 },
        { question: "What is the rule of a Stack called?", options: ["FIFO", "LIFO", "LILO", "RANDOM"], answerIdx: 1 },
        { question: "Adding an item to a stack is called...", options: ["Pop", "Push", "Pull", "Peek"], answerIdx: 1 },
        { question: "Removing the top item from a stack is called...", options: ["Push", "Insert", "Pop", "Add"], answerIdx: 2 },
      ],
    },
    {
      slug: "queue",
      title: "Queue",
      description: "Like a line at the canteen — first in line, first served!",
      icon: "🚶",
      order: 3,
      quizzes: [
        { question: "In a Queue, who gets served first?", options: ["The last person in line", "The first person in line", "Whoever shouts loudest", "Nobody"], answerIdx: 1 },
        { question: "What is the rule of a Queue called?", options: ["LIFO", "FIFO", "LILO", "FIFI"], answerIdx: 1 },
        { question: "Adding someone to the back of the line is called...", options: ["Dequeue", "Enqueue", "Delete", "Pop"], answerIdx: 1 },
        { question: "Removing the person from the FRONT of the line is called...", options: ["Enqueue", "Push", "Dequeue", "Peek"], answerIdx: 2 },
      ],
    },
  ];

  for (const t of topics) {
    const topic = await prisma.topic.upsert({
      where: { slug: t.slug },
      update: { title: t.title, description: t.description, icon: t.icon, order: t.order },
      create: { slug: t.slug, title: t.title, description: t.description, icon: t.icon, order: t.order },
    });

    const existingQuizzes = await prisma.quiz.findMany({ where: { topicId: topic.id } });
    if (existingQuizzes.length === 0) {
      await prisma.quiz.createMany({
        data: t.quizzes.map((q) => ({ ...q, topicId: topic.id })),
      });
    }
  }

  console.log("✅ Seed complete: 3 topics + quizzes created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
