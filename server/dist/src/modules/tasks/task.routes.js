"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("./task.controller");
const auth_1 = require("../../middleware/auth");
const validation_1 = require("../../middleware/validation");
const router = (0, express_1.Router)();
const editableRoles = [
    "Product Manager",
    "Frontend Engineer",
    "Designer",
    "Operations Lead",
];
router.get("/", auth_1.requireAuth, task_controller_1.getTasks);
router.post("/", auth_1.requireAuth, (0, auth_1.requireRole)(...editableRoles), (0, validation_1.validateBody)(validation_1.validateCreateTaskBody), task_controller_1.createTask);
router.patch("/:taskId/status", auth_1.requireAuth, (0, auth_1.requireRole)(...editableRoles), (0, validation_1.validateBody)(validation_1.validateTaskStatusBody), task_controller_1.updateTaskStatus);
router.patch("/:taskId/assignee", auth_1.requireAuth, (0, auth_1.requireRole)(...editableRoles), (0, validation_1.validateBody)(validation_1.validateTaskAssigneeBody), task_controller_1.updateTaskAssignee);
router.post("/:taskId/comments", auth_1.requireAuth, (0, auth_1.requireRole)(...editableRoles), (0, validation_1.validateBody)(validation_1.validateTaskCommentBody), task_controller_1.createTaskComment);
router.post("/:taskId/attachments", auth_1.requireAuth, (0, auth_1.requireRole)(...editableRoles), (0, validation_1.validateBody)(validation_1.validateTaskAttachmentBody), task_controller_1.createTaskAttachment);
exports.default = router;
//# sourceMappingURL=task.routes.js.map