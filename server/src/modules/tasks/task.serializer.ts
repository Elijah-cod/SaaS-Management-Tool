import type { Prisma } from "@prisma/client";

export const taskDetailInclude = {
  author: true,
  assignee: true,
  attachments: true,
  comments: true,
} as const;

type TaskRecord = Prisma.TaskGetPayload<{
  include: typeof taskDetailInclude;
}>;

export const serializeTask = (task: TaskRecord) => ({
  id: task.id,
  title: task.title,
  description: task.description,
  status: task.status ?? "Backlog",
  priority: task.priority ?? "Medium",
  projectId: task.projectId,
  assigneeId: task.assignedUserId ? `u${task.assignedUserId}` : null,
  assigneeIds: task.assignedUserId ? [`u${task.assignedUserId}`] : [],
  dueDate: task.dueDate?.toISOString() ?? null,
  type: task.tags ?? "Task",
  ticket: `FE-${String(task.id).padStart(3, "0")}`,
  createdById: `u${task.authorUserId}`,
  attachments: task.attachments.map((attachment: TaskRecord["attachments"][number]) => ({
    id: `attachment-${attachment.id}`,
    name: attachment.fileName ?? attachment.fileUrl,
    sizeLabel: "Uploaded file",
    addedById: `u${attachment.uploadedById}`,
    addedAt: new Date().toISOString(),
  })),
  comments: task.comments.map((comment: TaskRecord["comments"][number]) => ({
    id: `comment-${comment.id}`,
    authorId: `u${comment.userId}`,
    body: comment.text,
    createdAt: new Date().toISOString(),
  })),
});
