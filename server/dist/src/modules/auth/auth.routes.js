"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_1 = require("../../middleware/auth");
const validation_1 = require("../../middleware/validation");
const rate_limit_1 = require("../../shared/security/rate-limit");
const router = (0, express_1.Router)();
const loginRateLimiter = (0, rate_limit_1.createRateLimiter)({
    windowMs: 1000 * 60 * 5,
    max: 10,
    message: "Too many login attempts. Please wait a few minutes and try again.",
    keyPrefix: "auth-login",
});
router.post("/login", loginRateLimiter, (0, validation_1.validateBody)(validation_1.validateLoginBody), auth_controller_1.login);
router.get("/me", auth_1.requireAuth, auth_controller_1.getCurrentUser);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map