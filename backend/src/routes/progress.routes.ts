import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getDashboard, markVisualizerDone } from "../controllers/progressController";

const router = Router();

router.get("/dashboard", requireAuth, getDashboard);
router.post("/visualizer/:topicSlug/complete", requireAuth, markVisualizerDone);

export default router;
