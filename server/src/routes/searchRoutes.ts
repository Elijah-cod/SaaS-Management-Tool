import { Router } from "express";
import { searchWorkspace } from "../controllers/searchController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, searchWorkspace);

export default router;
