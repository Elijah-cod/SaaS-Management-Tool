import { Router } from "express";
import { getCurrentUser, login } from "./auth.controller";
import { requireAuth } from "../../middleware/auth";
import { validateBody, validateLoginBody } from "../../middleware/validation";
import { createRateLimiter } from "../../shared/security/rate-limit";

const router = Router();

const loginRateLimiter = createRateLimiter({
  windowMs: 1000 * 60 * 5,
  max: 10,
  message: "Too many login attempts. Please wait a few minutes and try again.",
  keyPrefix: "auth-login",
});

router.post("/login", loginRateLimiter, validateBody(validateLoginBody), login);
router.get("/me", requireAuth, getCurrentUser);

export default router;
