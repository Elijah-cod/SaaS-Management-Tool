import { Router } from "express";
import { createProject, getProjects } from "../controllers/projectController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, getProjects);
router.post(
  "/",
  requireAuth,
  requireRole("Product Manager", "Operations Lead"),
  createProject
);

export default router;
