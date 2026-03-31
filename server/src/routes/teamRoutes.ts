import { Router } from "express";
import { getTeams } from "../controllers/teamController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, getTeams);

export default router;
