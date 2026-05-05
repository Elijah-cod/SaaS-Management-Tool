"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskAttachment = exports.createTaskComment = exports.updateTaskAssignee = exports.updateTaskStatus = exports.createTask = exports.getTasks = void 0;
const async_handler_1 = require("../../shared/http/async-handler");
const app_error_1 = require("../../shared/errors/app-error");
const task_service_1 = require("./task.service");
const getTaskIdParam = (taskId) => Array.isArray(taskId) ? taskId[0] ?? "" : taskId ?? "";
exports.getTasks = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const tasks = await (0, task_service_1.listTasks)(typeof req.query.projectId === "string" ? req.query.projectId : undefined);
    res.json(tasks);
});
exports.createTask = (0, async_handler_1.asyncHandler)(async (req, res) => {
    if (!req.authUser) {
        throw new app_error_1.AppError(401, "Authentication required", {
            code: "AUTH_REQUIRED",
        });
    }
    const task = await (0, task_service_1.createTaskRecord)({
        ...req.body,
        authorUserId: req.authUser.userId,
    });
    res.status(201).json(task);
});
exports.updateTaskStatus = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { status } = req.body;
    const task = await (0, task_service_1.updateTaskStatusRecord)(getTaskIdParam(req.params.taskId), status);
    res.json(task);
});
exports.updateTaskAssignee = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { assigneeId } = req.body;
    const task = await (0, task_service_1.updateTaskAssigneeRecord)(getTaskIdParam(req.params.taskId), assigneeId);
    res.json(task);
});
exports.createTaskComment = (0, async_handler_1.asyncHandler)(async (req, res) => {
    if (!req.authUser) {
        throw new app_error_1.AppError(401, "Authentication required", {
            code: "AUTH_REQUIRED",
        });
    }
    const { body } = req.body;
    const task = await (0, task_service_1.createTaskCommentRecord)(getTaskIdParam(req.params.taskId), body, req.authUser.userId);
    res.status(201).json(task);
});
exports.createTaskAttachment = (0, async_handler_1.asyncHandler)(async (req, res) => {
    if (!req.authUser) {
        throw new app_error_1.AppError(401, "Authentication required", {
            code: "AUTH_REQUIRED",
        });
    }
    const { name, sizeLabel } = req.body;
    const task = await (0, task_service_1.createTaskAttachmentRecord)(getTaskIdParam(req.params.taskId), name, sizeLabel, req.authUser.userId);
    res.status(201).json(task);
});
//# sourceMappingURL=task.controller.js.map