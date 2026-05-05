"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const team_controller_1 = require("./team.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.requireAuth, team_controller_1.getTeams);
exports.default = router;
//# sourceMappingURL=team.routes.js.map