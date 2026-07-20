import { Router } from "express";
import { getCurrentUser, login, refresh } from "./auth.controller";
import { requireAuth } from "../../middleware/auth";
import {
  validateBody,
  validateLoginBody,
  validateRefreshBody,
} from "../../middleware/validation";
import { createRateLimiter } from "../../shared/security/rate-limit";

const router = Router();

const loginRateLimiter = createRateLimiter({
  windowMs: 1000 * 60 * 5,
  max: 10,
  message: "Too many login attempts. Please wait a few minutes and try again.",
  keyPrefix: "auth-login",
});

const refreshRateLimiter = createRateLimiter({
  windowMs: 1000 * 60 * 5,
  max: 60,
  message: "Too many session refresh attempts. Please try again shortly.",
  keyPrefix: "auth-refresh",
});

router.post("/login", loginRateLimiter, validateBody(validateLoginBody), login);
router.post(
  "/refresh",
  refreshRateLimiter,
  validateBody(validateRefreshBody),
  refresh
);
router.get("/me", requireAuth, getCurrentUser);

export default router;
