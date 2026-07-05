import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getQuizByTopic, submitQuiz } from "../controllers/quizController";

const router = Router();

router.get("/:topicSlug", requireAuth, getQuizByTopic);
router.post("/:topicSlug/submit", requireAuth, submitQuiz);

export default router;
