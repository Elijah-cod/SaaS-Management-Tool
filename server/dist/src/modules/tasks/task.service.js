"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskAttachmentRecord = exports.createTaskCommentRecord = exports.updateTaskAssigneeRecord = exports.updateTaskStatusRecord = exports.createTaskRecord = exports.getSerializedTaskById = exports.listTasks = void 0;
const prisma_1 = require("../../shared/database/prisma");
const app_error_1 = require("../../shared/errors/app-error");
const params_1 = require("../../shared/http/params");
const task_serializer_1 = require("./task.serializer");
const sanitizeAttachmentName = (fileName) => fileName.replace(/[\\/]/g, "_").replace(/\s+/g, " ").trim();
const listTasks = async (projectIdParam) => {
    const projectId = projectIdParam === undefined ? undefined : (0, params_1.parsePositiveInt)(projectIdParam, "projectId");
    const tasks = await prisma_1.prisma.task.findMany({
        include: task_serializer_1.taskDetailInclude,
        where: projectId === undefined ? undefined : { projectId },
        orderBy: {
            id: "asc",
        },
    });
    return tasks.map(task_serializer_1.serializeTask);
};
exports.listTasks = listTasks;
const getSerializedTaskById = async (taskId) => {
    const task = await prisma_1.prisma.task.findUnique({
        where: { id: taskId },
        include: task_serializer_1.taskDetailInclude,
    });
    if (!task) {
        throw new app_error_1.AppError(404, "Task not found", {
            code: "TASK_NOT_FOUND",
        });
    }
    return (0, task_serializer_1.serializeTask)(task);
};
exports.getSerializedTaskById = getSerializedTaskById;
const createTaskRecord = async (input) => {
    const createdTask = await prisma_1.prisma.task.create({
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
    return (0, exports.getSerializedTaskById)(createdTask.id);
};
exports.createTaskRecord = createTaskRecord;
const updateTaskStatusRecord = async (taskIdParam, status) => {
    const taskId = (0, params_1.parsePositiveInt)(taskIdParam, "taskId");
    await prisma_1.prisma.task.update({
        where: { id: taskId },
        data: { status },
    });
    return (0, exports.getSerializedTaskById)(taskId);
};
exports.updateTaskStatusRecord = updateTaskStatusRecord;
const updateTaskAssigneeRecord = async (taskIdParam, assigneeId) => {
    const taskId = (0, params_1.parsePositiveInt)(taskIdParam, "taskId");
    await prisma_1.prisma.task.update({
        where: { id: taskId },
        data: {
            assignedUserId: assigneeId ? Number(String(assigneeId).replace("u", "")) : null,
        },
    });
    return (0, exports.getSerializedTaskById)(taskId);
};
exports.updateTaskAssigneeRecord = updateTaskAssigneeRecord;
const createTaskCommentRecord = async (taskIdParam, body, userId) => {
    const taskId = (0, params_1.parsePositiveInt)(taskIdParam, "taskId");
    await prisma_1.prisma.comment.create({
        data: {
            taskId,
            text: body,
            userId,
        },
    });
    return (0, exports.getSerializedTaskById)(taskId);
};
exports.createTaskCommentRecord = createTaskCommentRecord;
const createTaskAttachmentRecord = async (taskIdParam, fileName, sizeLabel, userId) => {
    const taskId = (0, params_1.parsePositiveInt)(taskIdParam, "taskId");
    const sanitizedFileName = sanitizeAttachmentName(fileName);
    if (!sanitizedFileName) {
        throw new app_error_1.AppError(400, "name is required", {
            code: "INVALID_ATTACHMENT_NAME",
        });
    }
    await prisma_1.prisma.attachment.create({
        data: {
            taskId,
            fileName: sanitizedFileName,
            fileUrl: `uploads/${sanitizedFileName}`,
            uploadedById: userId,
        },
    });
    const serializedTask = await (0, exports.getSerializedTaskById)(taskId);
    return {
        ...serializedTask,
        attachments: serializedTask.attachments.map((attachment, index, allAttachments) => index === allAttachments.length - 1
            ? { ...attachment, sizeLabel: sizeLabel ?? attachment.sizeLabel }
            : attachment),
    };
};
exports.createTaskAttachmentRecord = createTaskAttachmentRecord;
//# sourceMappingURL=task.service.js.map