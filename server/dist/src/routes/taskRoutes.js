"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.get("/", auth_1.requireAuth, taskController_1.getTasks);
router.patch("/:taskId/status", auth_1.requireAuth, (0, auth_1.requireRole)("Product Manager", "Frontend Engineer", "Designer", "Operations Lead"), (0, validation_1.validateBody)(validation_1.validateTaskStatusBody), taskController_1.updateTaskStatus);
router.patch("/:taskId/assignee", auth_1.requireAuth, (0, auth_1.requireRole)("Product Manager", "Frontend Engineer", "Designer", "Operations Lead"), (0, validation_1.validateBody)(validation_1.validateTaskAssigneeBody), taskController_1.updateTaskAssignee);
router.post("/:taskId/comments", auth_1.requireAuth, (0, auth_1.requireRole)("Product Manager", "Frontend Engineer", "Designer", "Operations Lead"), (0, validation_1.validateBody)(validation_1.validateTaskCommentBody), taskController_1.createTaskComment);
router.post("/:taskId/attachments", auth_1.requireAuth, (0, auth_1.requireRole)("Product Manager", "Frontend Engineer", "Designer", "Operations Lead"), (0, validation_1.validateBody)(validation_1.validateTaskAttachmentBody), taskController_1.createTaskAttachment);
exports.default = router;
//# sourceMappingURL=taskRoutes.js.map