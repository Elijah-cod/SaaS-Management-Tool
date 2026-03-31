import { Router } from "express";
import {
  createTaskAttachment,
  createTaskComment,
  getTasks,
  updateTaskAssignee,
  updateTaskStatus,
} from "../controllers/taskController";

const router = Router();

router.get("/", getTasks);
router.patch("/:taskId/status", updateTaskStatus);
router.patch("/:taskId/assignee", updateTaskAssignee);
router.post("/:taskId/comments", createTaskComment);
router.post("/:taskId/attachments", createTaskAttachment);

export default router;
