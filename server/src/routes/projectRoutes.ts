import { Router } from "express";
import { createProject, getProjects } from "../controllers/projectController";
import { requireAuth, requireRole } from "../middleware/auth";
import { validateBody, validateProjectBody } from "../middleware/validation";

const router = Router();

router.get("/", requireAuth, getProjects);
router.post(
  "/",
  requireAuth,
  requireRole("Product Manager", "Operations Lead"),
  validateBody(validateProjectBody),
  createProject
);

export default router;
