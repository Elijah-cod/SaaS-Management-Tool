import { Router } from "express";
import { searchWorkspace } from "./search.controller";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.get("/", requireAuth, searchWorkspace);

export default router;
