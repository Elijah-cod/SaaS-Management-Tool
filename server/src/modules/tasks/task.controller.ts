import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/http/async-handler";
import { AppError } from "../../shared/errors/app-error";
import type { AuthenticatedRequest } from "../../middleware/auth";
import {
  createTaskAttachmentRecord,
  createTaskCommentRecord,
  createTaskRecord,
  listTasks,
  updateTaskAssigneeRecord,
  updateTaskStatusRecord,
} from "./task.service";

const getTaskIdParam = (taskId: string | string[] | undefined) =>
  Array.isArray(taskId) ? taskId[0] ?? "" : taskId ?? "";

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const tasks = await listTasks(
    typeof req.query.projectId === "string" ? req.query.projectId : undefined
  );
  res.json(tasks);
});

export const createTask = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.authUser) {
      throw new AppError(401, "Authentication required", {
        code: "AUTH_REQUIRED",
      });
    }

    const task = await createTaskRecord({
      ...(req.body as {
        title: string;
        description?: string;
        projectId: number;
        status?: string;
        priority?: string;
        dueDate?: string | null;
        assigneeId?: string | null;
        type?: string;
      }),
      authorUserId: req.authUser.userId,
    });

    res.status(201).json(task);
  }
);

export const updateTaskStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body as { status: string };
  const task = await updateTaskStatusRecord(getTaskIdParam(req.params.taskId), status);
  res.json(task);
});

export const updateTaskAssignee = asyncHandler(
  async (req: Request, res: Response) => {
    const { assigneeId } = req.body as { assigneeId: string | null };
    const task = await updateTaskAssigneeRecord(
      getTaskIdParam(req.params.taskId),
      assigneeId
    );
    res.json(task);
  }
);

export const createTaskComment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.authUser) {
      throw new AppError(401, "Authentication required", {
        code: "AUTH_REQUIRED",
      });
    }

    const { body } = req.body as { body: string };
    const task = await createTaskCommentRecord(
      getTaskIdParam(req.params.taskId),
      body,
      req.authUser.userId
    );
    res.status(201).json(task);
  }
);

export const createTaskAttachment = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.authUser) {
      throw new AppError(401, "Authentication required", {
        code: "AUTH_REQUIRED",
      });
    }

    const { name, sizeLabel } = req.body as {
      name: string;
      sizeLabel?: string;
    };
    const task = await createTaskAttachmentRecord(
      getTaskIdParam(req.params.taskId),
      name,
      sizeLabel,
      req.authUser.userId
    );
    res.status(201).json(task);
  }
);
