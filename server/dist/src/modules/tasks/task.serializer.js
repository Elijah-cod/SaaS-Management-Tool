"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeTask = exports.taskDetailInclude = void 0;
exports.taskDetailInclude = {
    author: true,
    assignee: true,
    attachments: true,
    comments: true,
};
const serializeTask = (task) => ({
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
    attachments: task.attachments.map((attachment) => ({
        id: `attachment-${attachment.id}`,
        name: attachment.fileName ?? attachment.fileUrl,
        sizeLabel: "Uploaded file",
        addedById: `u${attachment.uploadedById}`,
        addedAt: new Date().toISOString(),
    })),
    comments: task.comments.map((comment) => ({
        id: `comment-${comment.id}`,
        authorId: `u${comment.userId}`,
        body: comment.text,
        createdAt: new Date().toISOString(),
    })),
});
exports.serializeTask = serializeTask;
//# sourceMappingURL=task.serializer.js.map