"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectController_1 = require("../controllers/projectController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.requireAuth, projectController_1.getProjects);
router.post("/", auth_1.requireAuth, (0, auth_1.requireRole)("Product Manager", "Operations Lead"), projectController_1.createProject);
exports.default = router;
//# sourceMappingURL=projectRoutes.js.map