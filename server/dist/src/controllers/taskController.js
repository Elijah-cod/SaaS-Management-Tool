"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasks = void 0;
const prisma_1 = require("../lib/prisma");
const getTasks = async (req, res) => {
    const projectId = Number(req.query.projectId);
    try {
        const tasks = await prisma_1.prisma.task.findMany({
            where: Number.isNaN(projectId) ? undefined : { projectId },
            orderBy: {
                id: "asc",
            },
        });
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error });
    }
};
exports.getTasks = getTasks;
//# sourceMappingURL=taskController.js.map