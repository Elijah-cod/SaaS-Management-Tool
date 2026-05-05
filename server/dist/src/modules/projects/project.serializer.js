"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeProject = exports.deriveProjectStatus = void 0;
const completedTaskStatuses = new Set(["done", "completed"]);
const deriveProjectStatus = (startDate, endDate) => {
    const now = new Date();
    if (endDate && endDate < now) {
        return "Completed";
    }
    if (startDate && startDate > now) {
        return "Planning";
    }
    return "In Progress";
};
exports.deriveProjectStatus = deriveProjectStatus;
const serializeProject = (project) => {
    const taskCount = project.tasks.length;
    const completedTasks = project.tasks.filter((task) => completedTaskStatuses.has(task.status?.toLowerCase() ?? "")).length;
    const progress = taskCount === 0 ? 0 : Math.round((completedTasks / taskCount) * 100);
    return {
        id: project.id,
        name: project.name,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        dueDate: project.endDate,
        status: (0, exports.deriveProjectStatus)(project.startDate, project.endDate),
        priority: project.tasks.find((task) => task.priority)?.priority ?? "Medium",
        progress,
        owner: "Unassigned",
        teamId: null,
        tags: [],
    };
};
exports.serializeProject = serializeProject;
//# sourceMappingURL=project.serializer.js.map