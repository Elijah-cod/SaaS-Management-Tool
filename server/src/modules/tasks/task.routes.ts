import { Router } from "express";
import {
  createTask,
  createTaskAttachment,
  createTaskComment,
  getTasks,
  updateTaskAssignee,
  updateTaskStatus,
} from "./task.controller";
import { requireAuth, requireRole } from "../../middleware/auth";
import {
  validateBody,
  validateCreateTaskBody,
  validateTaskAssigneeBody,
  validateTaskAttachmentBody,
  validateTaskCommentBody,
  validateTaskStatusBody,
} from "../../middleware/validation";

const router = Router();

const editableRoles = [
  "Product Manager",
  "Frontend Engineer",
  "Designer",
  "Operations Lead",
] as const;

router.get("/", requireAuth, getTasks);
router.post(
  "/",
  requireAuth,
  requireRole(...editableRoles),
  validateBody(validateCreateTaskBody),
  createTask
);
router.patch(
  "/:taskId/status",
  requireAuth,
  requireRole(...editableRoles),
  validateBody(validateTaskStatusBody),
  updateTaskStatus
);
router.patch(
  "/:taskId/assignee",
  requireAuth,
  requireRole(...editableRoles),
  validateBody(validateTaskAssigneeBody),
  updateTaskAssignee
);
router.post(
  "/:taskId/comments",
  requireAuth,
  requireRole(...editableRoles),
  validateBody(validateTaskCommentBody),
  createTaskComment
);
router.post(
  "/:taskId/attachments",
  requireAuth,
  requireRole(...editableRoles),
  validateBody(validateTaskAttachmentBody),
  createTaskAttachment
);

export default router;
