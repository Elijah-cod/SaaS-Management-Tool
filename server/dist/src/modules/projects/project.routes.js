"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("./project.controller");
const auth_1 = require("../../middleware/auth");
const validation_1 = require("../../middleware/validation");
const router = (0, express_1.Router)();
router.get("/", auth_1.requireAuth, project_controller_1.getProjects);
router.post("/", auth_1.requireAuth, (0, auth_1.requireRole)("Product Manager", "Operations Lead"), (0, validation_1.validateBody)(validation_1.validateProjectBody), project_controller_1.createProject);
exports.default = router;
//# sourceMappingURL=project.routes.js.map