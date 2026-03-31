import { Router } from "express";
import {
  createTask,
  createTaskAttachment,
  createTaskComment,
  getTasks,
  updateTaskAssignee,
  updateTaskStatus,
} from "../controllers/taskController";
import { requireAuth, requireRole } from "../middleware/auth";
import {
  validateBody,
  validateCreateTaskBody,
  validateTaskAssigneeBody,
  validateTaskAttachmentBody,
  validateTaskCommentBody,
  validateTaskStatusBody,
} from "../middleware/validation";

const router = Router();

router.get("/", requireAuth, getTasks);
router.post(
  "/",
  requireAuth,
  requireRole(
    "Product Manager",
    "Frontend Engineer",
    "Designer",
    "Operations Lead"
  ),
  validateBody(validateCreateTaskBody),
  createTask
);
router.patch(
  "/:taskId/status",
  requireAuth,
  requireRole(
    "Product Manager",
    "Frontend Engineer",
    "Designer",
    "Operations Lead"
  ),
  validateBody(validateTaskStatusBody),
  updateTaskStatus
);
router.patch(
  "/:taskId/assignee",
  requireAuth,
  requireRole(
    "Product Manager",
    "Frontend Engineer",
    "Designer",
    "Operations Lead"
  ),
  validateBody(validateTaskAssigneeBody),
  updateTaskAssignee
);
router.post(
  "/:taskId/comments",
  requireAuth,
  requireRole(
    "Product Manager",
    "Frontend Engineer",
    "Designer",
    "Operations Lead"
  ),
  validateBody(validateTaskCommentBody),
  createTaskComment
);
router.post(
  "/:taskId/attachments",
  requireAuth,
  requireRole(
    "Product Manager",
    "Frontend Engineer",
    "Designer",
    "Operations Lead"
  ),
  validateBody(validateTaskAttachmentBody),
  createTaskAttachment
);

export default router;
