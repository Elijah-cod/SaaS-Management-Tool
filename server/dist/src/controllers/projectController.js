"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = exports.getProjects = void 0;
const prisma_1 = require("../lib/prisma");
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
const getProjects = async (_req, res) => {
    try {
        const projects = await prisma_1.prisma.project.findMany({
            include: {
                tasks: true,
            },
            orderBy: {
                id: "asc",
            },
        });
        const serializedProjects = projects.map((project) => {
            const taskCount = project.tasks.length;
            const completedTasks = project.tasks.filter((task) => task.status?.toLowerCase() === "done").length;
            const progress = taskCount === 0 ? 0 : Math.round((completedTasks / taskCount) * 100);
            return {
                id: project.id,
                name: project.name,
                description: project.description,
                startDate: project.startDate,
                endDate: project.endDate,
                dueDate: project.endDate,
                status: deriveProjectStatus(project.startDate, project.endDate),
                priority: project.tasks.find((task) => task.priority)?.priority ?? "Medium",
                progress,
                owner: "Unassigned",
                teamId: null,
                tags: [],
            };
        });
        res.json(serializedProjects);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching projects", error });
    }
};
exports.getProjects = getProjects;
const createProject = async (req, res) => {
    const { name, description, startDate, endDate } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Project name is required" });
    }
    try {
        const project = await prisma_1.prisma.project.create({
            data: {
                name,
                description,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
            },
        });
        return res.status(201).json({
            id: project.id,
            name: project.name,
            description: project.description,
            startDate: project.startDate,
            endDate: project.endDate,
            dueDate: project.endDate,
            status: deriveProjectStatus(project.startDate, project.endDate),
            priority: "Medium",
            progress: 0,
            owner: "Unassigned",
            teamId: null,
            tags: [],
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Error creating project", error });
    }
};
exports.createProject = createProject;
//# sourceMappingURL=projectController.js.map