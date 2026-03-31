"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const router = (0, express_1.Router)();
router.get("/", taskController_1.getTasks);
router.patch("/:taskId/status", taskController_1.updateTaskStatus);
router.patch("/:taskId/assignee", taskController_1.updateTaskAssignee);
router.post("/:taskId/comments", taskController_1.createTaskComment);
router.post("/:taskId/attachments", taskController_1.createTaskAttachment);
exports.default = router;
//# sourceMappingURL=taskRoutes.js.map