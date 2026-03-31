"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskAttachment = exports.createTaskComment = exports.updateTaskAssignee = exports.updateTaskStatus = exports.getTasks = void 0;
const prisma_1 = require("../lib/prisma");
const serializeTask = async (taskId) => {
    const task = await prisma_1.prisma.task.findUnique({
        where: { id: taskId },
        include: {
            author: true,
            assignee: true,
            attachments: true,
            comments: true,
        },
    });
    if (!task) {
        return null;
    }
    return {
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
    };
};
const getTasks = async (req, res) => {
    const projectId = req.query.projectId === undefined
        ? undefined
        : Number(req.query.projectId);
    try {
        const tasks = await prisma_1.prisma.task.findMany({
            include: {
                author: true,
                assignee: true,
                attachments: true,
                comments: true,
            },
            where: projectId === undefined || Number.isNaN(projectId)
                ? undefined
                : { projectId },
            orderBy: {
                id: "asc",
            },
        });
        res.json(tasks.map((task) => ({
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
        })));
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error });
    }
};
exports.getTasks = getTasks;
const updateTaskStatus = async (req, res) => {
    const taskId = Number(req.params.taskId);
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ message: "Task status is required" });
    }
    try {
        await prisma_1.prisma.task.update({
            where: { id: taskId },
            data: { status },
        });
        const serializedTask = await serializeTask(taskId);
        return res.json(serializedTask);
    }
    catch (error) {
        return res.status(500).json({ message: "Error updating task status", error });
    }
};
exports.updateTaskStatus = updateTaskStatus;
const updateTaskAssignee = async (req, res) => {
    const taskId = Number(req.params.taskId);
    const { assigneeId } = req.body;
    try {
        await prisma_1.prisma.task.update({
            where: { id: taskId },
            data: {
                assignedUserId: assigneeId ? Number(String(assigneeId).replace("u", "")) : null,
            },
        });
        const serializedTask = await serializeTask(taskId);
        return res.json(serializedTask);
    }
    catch (error) {
        return res.status(500).json({ message: "Error updating task assignee", error });
    }
};
exports.updateTaskAssignee = updateTaskAssignee;
const createTaskComment = async (req, res) => {
    const taskId = Number(req.params.taskId);
    const { authorId, body } = req.body;
    if (!authorId || !body) {
        return res.status(400).json({ message: "authorId and body are required" });
    }
    try {
        await prisma_1.prisma.comment.create({
            data: {
                taskId,
                text: body,
                userId: Number(authorId.replace("u", "")),
            },
        });
        const serializedTask = await serializeTask(taskId);
        return res.status(201).json(serializedTask);
    }
    catch (error) {
        return res.status(500).json({ message: "Error creating comment", error });
    }
};
exports.createTaskComment = createTaskComment;
const createTaskAttachment = async (req, res) => {
    const taskId = Number(req.params.taskId);
    const { addedById, name, sizeLabel, } = req.body;
    if (!addedById || !name) {
        return res.status(400).json({ message: "addedById and name are required" });
    }
    try {
        await prisma_1.prisma.attachment.create({
            data: {
                taskId,
                fileName: name,
                fileUrl: `uploads/${name}`,
                uploadedById: Number(addedById.replace("u", "")),
            },
        });
        const serializedTask = await serializeTask(taskId);
        return res.status(201).json({
            ...serializedTask,
            attachments: serializedTask?.attachments.map((attachment, index, array) => index === array.length - 1 ? { ...attachment, sizeLabel: sizeLabel ?? attachment.sizeLabel } : attachment) ?? [],
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Error creating attachment", error });
    }
};
exports.createTaskAttachment = createTaskAttachment;
//# sourceMappingURL=taskController.js.map