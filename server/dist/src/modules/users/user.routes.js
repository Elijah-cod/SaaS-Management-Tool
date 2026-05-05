"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.requireAuth, user_controller_1.getUsers);
exports.default = router;
//# sourceMappingURL=user.routes.js.map