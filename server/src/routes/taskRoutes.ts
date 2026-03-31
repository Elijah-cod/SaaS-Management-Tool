import { Router } from "express";
import {
  createTaskAttachment,
  createTaskComment,
  getTasks,
  updateTaskAssignee,
  updateTaskStatus,
} from "../controllers/taskController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, getTasks);
router.patch(
  "/:taskId/status",
  requireAuth,
  requireRole(
    "Product Manager",
    "Frontend Engineer",
    "Designer",
    "Operations Lead"
  ),
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
  createTaskAttachment
);

export default router;
