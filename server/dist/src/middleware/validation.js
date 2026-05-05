"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTaskAttachmentBody = exports.validateTaskCommentBody = exports.validateTaskAssigneeBody = exports.validateCreateTaskBody = exports.validateTaskStatusBody = exports.validateProjectBody = exports.validateLoginBody = exports.validateBody = void 0;
const isRecord = (value) => typeof value === "object" && value !== null;
const isIsoDate = (value) => !Number.isNaN(Date.parse(value));
const isTaskStatus = (value) => ["Backlog", "In Progress", "Review", "Completed"].includes(value);
const validateBody = (validator) => (req, res, next) => {
    const result = validator(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: "Invalid request body",
            errors: result.errors,
        });
    }
    req.body = result.data;
    return next();
};
exports.validateBody = validateBody;
const validateLoginBody = (value) => {
    if (!isRecord(value)) {
        return { success: false, errors: ["Request body must be an object"] };
    }
    const email = typeof value.email === "string" ? value.email.trim() : "";
    const password = typeof value.password === "string" ? value.password.trim() : "";
    const errors = [];
    if (!email) {
        errors.push("Email is required");
    }
    else if (!email.includes("@")) {
        errors.push("Email must be valid");
    }
    if (!password) {
        errors.push("Password is required");
    }
    if (errors.length > 0) {
        return { success: false, errors };
    }
    return {
        success: true,
        data: {
            email: email.toLowerCase(),
            password,
        },
    };
};
exports.validateLoginBody = validateLoginBody;
const validateProjectBody = (value) => {
    if (!isRecord(value)) {
        return { success: false, errors: ["Request body must be an object"] };
    }
    const name = typeof value.name === "string" ? value.name.trim() : "";
    const description = typeof value.description === "string" ? value.description.trim() : undefined;
    const startDate = typeof value.startDate === "string" ? value.startDate.trim() : undefined;
    const endDate = typeof value.endDate === "string" ? value.endDate.trim() : undefined;
    const errors = [];
    if (!name) {
        errors.push("Project name is required");
    }
    if (startDate && !isIsoDate(startDate)) {
        errors.push("startDate must be a valid ISO date");
    }
    if (endDate && !isIsoDate(endDate)) {
        errors.push("endDate must be a valid ISO date");
    }
    if (errors.length > 0) {
        return { success: false, errors };
    }
    return {
        success: true,
        data: {
            name,
            description,
            startDate,
            endDate,
        },
    };
};
exports.validateProjectBody = validateProjectBody;
const validateTaskStatusBody = (value) => {
    if (!isRecord(value)) {
        return { success: false, errors: ["Request body must be an object"] };
    }
    const status = typeof value.status === "string" ? value.status.trim() : "";
    if (!status) {
        return { success: false, errors: ["Task status is required"] };
    }
    if (!isTaskStatus(status)) {
        return {
            success: false,
            errors: ["Task status must be Backlog, In Progress, Review, or Completed"],
        };
    }
    return {
        success: true,
        data: { status },
    };
};
exports.validateTaskStatusBody = validateTaskStatusBody;
const validateCreateTaskBody = (value) => {
    if (!isRecord(value)) {
        return { success: false, errors: ["Request body must be an object"] };
    }
    const title = typeof value.title === "string" ? value.title.trim() : "";
    const description = typeof value.description === "string" ? value.description.trim() : undefined;
    const projectId = typeof value.projectId === "number"
        ? value.projectId
        : Number(value.projectId);
    const status = typeof value.status === "string" ? value.status.trim() : undefined;
    const priority = typeof value.priority === "string" ? value.priority.trim() : undefined;
    const dueDate = value.dueDate === null
        ? null
        : typeof value.dueDate === "string"
            ? value.dueDate.trim()
            : undefined;
    const assigneeId = value.assigneeId === null
        ? null
        : typeof value.assigneeId === "string"
            ? value.assigneeId.trim()
            : undefined;
    const type = typeof value.type === "string" ? value.type.trim() : undefined;
    const errors = [];
    if (!title) {
        errors.push("title is required");
    }
    if (!Number.isInteger(projectId) || projectId <= 0) {
        errors.push("projectId must be a positive integer");
    }
    if (status && !isTaskStatus(status)) {
        errors.push("status must be Backlog, In Progress, Review, or Completed");
    }
    if (dueDate && !isIsoDate(dueDate)) {
        errors.push("dueDate must be a valid ISO date");
    }
    if (assigneeId !== undefined && assigneeId !== null && !/^u\d+$/.test(assigneeId)) {
        errors.push("assigneeId must be null or a user id like u12");
    }
    if (errors.length > 0) {
        return { success: false, errors };
    }
    return {
        success: true,
        data: {
            title,
            description,
            projectId,
            status,
            priority,
            dueDate,
            assigneeId,
            type,
        },
    };
};
exports.validateCreateTaskBody = validateCreateTaskBody;
const validateTaskAssigneeBody = (value) => {
    if (!isRecord(value)) {
        return { success: false, errors: ["Request body must be an object"] };
    }
    const assigneeId = value.assigneeId;
    if (assigneeId === null) {
        return { success: true, data: { assigneeId: null } };
    }
    if (typeof assigneeId !== "string" || !/^u\d+$/.test(assigneeId)) {
        return {
            success: false,
            errors: ["assigneeId must be null or a user id like u12"],
        };
    }
    return {
        success: true,
        data: { assigneeId },
    };
};
exports.validateTaskAssigneeBody = validateTaskAssigneeBody;
const validateTaskCommentBody = (value) => {
    if (!isRecord(value)) {
        return { success: false, errors: ["Request body must be an object"] };
    }
    const body = typeof value.body === "string" ? value.body.trim() : "";
    if (!body) {
        return { success: false, errors: ["body is required"] };
    }
    if (body.length > 2000) {
        return {
            success: false,
            errors: ["body must be 2000 characters or fewer"],
        };
    }
    return {
        success: true,
        data: { body },
    };
};
exports.validateTaskCommentBody = validateTaskCommentBody;
const validateTaskAttachmentBody = (value) => {
    if (!isRecord(value)) {
        return { success: false, errors: ["Request body must be an object"] };
    }
    const name = typeof value.name === "string" ? value.name.trim() : "";
    const sizeLabel = typeof value.sizeLabel === "string" ? value.sizeLabel.trim() : undefined;
    const errors = [];
    if (!name) {
        errors.push("name is required");
    }
    if (name.length > 255) {
        errors.push("name must be 255 characters or fewer");
    }
    if (sizeLabel && sizeLabel.length > 120) {
        errors.push("sizeLabel must be 120 characters or fewer");
    }
    if (errors.length > 0) {
        return { success: false, errors };
    }
    return {
        success: true,
        data: { name, sizeLabel },
    };
};
exports.validateTaskAttachmentBody = validateTaskAttachmentBody;
//# sourceMappingURL=validation.js.map