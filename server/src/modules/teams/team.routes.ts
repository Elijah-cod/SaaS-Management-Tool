import { Router } from "express";
import { getTeams } from "./team.controller";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.get("/", requireAuth, getTeams);

export default router;
