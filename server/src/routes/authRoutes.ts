import { Router } from "express";
import { getCurrentUser, login } from "../controllers/authController";
import { requireAuth } from "../middleware/auth";
import { validateBody, validateLoginBody } from "../middleware/validation";

const router = Router();

router.post("/login", validateBody(validateLoginBody), login);
router.get("/me", requireAuth, getCurrentUser);

export default router;
