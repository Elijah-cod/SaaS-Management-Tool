import { prisma } from "../../shared/database/prisma";
import { AppError } from "../../shared/errors/app-error";
import { parsePositiveInt } from "../../shared/http/params";
import { serializeTask, taskDetailInclude } from "./task.serializer";

const sanitizeAttachmentName = (fileName: string) =>
  fileName.replace(/[\\/]/g, "_").replace(/\s+/g, " ").trim();

export const listTasks = async (projectIdParam?: string) => {
  const projectId =
    projectIdParam === undefined ? undefined : parsePositiveInt(projectIdParam, "projectId");

  const tasks = await prisma.task.findMany({
    include: taskDetailInclude,
    where: projectId === undefined ? undefined : { projectId },
    orderBy: {
      id: "asc",
    },
  });

  return tasks.map(serializeTask);
};

export const getSerializedTaskById = async (taskId: number) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: taskDetailInclude,
  });

  if (!task) {
    throw new AppError(404, "Task not found", {
      code: "TASK_NOT_FOUND",
    });
  }

  return serializeTask(task);
};

export const createTaskRecord = async (input: {
  title: string;
  description?: string;
  projectId: number;
  status?: string;
  priority?: string;
  dueDate?: string | null;
  assigneeId?: string | null;
  type?: string;
  authorUserId: number;
}) => {
  const createdTask = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      projectId: input.projectId,
      status: input.status ?? "Backlog",
      priority: input.priority ?? "Medium",
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      tags: input.type ?? "Task",
      authorUserId: input.authorUserId,
      assignedUserId: input.assigneeId
        ? Number(String(input.assigneeId).replace("u", ""))
        : null,
    },
  });

  return getSerializedTaskById(createdTask.id);
};

export const updateTaskStatusRecord = async (taskIdParam: string, status: string) => {
  const taskId = parsePositiveInt(taskIdParam, "taskId");

  await prisma.task.update({
    where: { id: taskId },
    data: { status },
  });

  return getSerializedTaskById(taskId);
};

export const updateTaskAssigneeRecord = async (
  taskIdParam: string,
  assigneeId: string | null
) => {
  const taskId = parsePositiveInt(taskIdParam, "taskId");

  await prisma.task.update({
    where: { id: taskId },
    data: {
      assignedUserId: assigneeId ? Number(String(assigneeId).replace("u", "")) : null,
    },
  });

  return getSerializedTaskById(taskId);
};

export const createTaskCommentRecord = async (
  taskIdParam: string,
  body: string,
  userId: number
) => {
  const taskId = parsePositiveInt(taskIdParam, "taskId");

  await prisma.comment.create({
    data: {
      taskId,
      text: body,
      userId,
    },
  });

  return getSerializedTaskById(taskId);
};

export const createTaskAttachmentRecord = async (
  taskIdParam: string,
  fileName: string,
  sizeLabel: string | undefined,
  userId: number
) => {
  const taskId = parsePositiveInt(taskIdParam, "taskId");
  const sanitizedFileName = sanitizeAttachmentName(fileName);

  if (!sanitizedFileName) {
    throw new AppError(400, "name is required", {
      code: "INVALID_ATTACHMENT_NAME",
    });
  }

  await prisma.attachment.create({
    data: {
      taskId,
      fileName: sanitizedFileName,
      fileUrl: `uploads/${sanitizedFileName}`,
      uploadedById: userId,
    },
  });

  const serializedTask = await getSerializedTaskById(taskId);

  return {
    ...serializedTask,
    attachments: serializedTask.attachments.map(
      (
        attachment: (typeof serializedTask.attachments)[number],
        index: number,
        allAttachments: typeof serializedTask.attachments
      ) =>
        index === allAttachments.length - 1
          ? { ...attachment, sizeLabel: sizeLabel ?? attachment.sizeLabel }
          : attachment
    ),
  };
};
