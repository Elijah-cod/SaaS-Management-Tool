"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchWorkspace = void 0;
const prisma_1 = require("../lib/prisma");
const searchWorkspace = async (req, res) => {
    const query = String(req.query.q ?? "").trim();
    if (!query) {
        return res.json({
            projects: [],
            tasks: [],
            users: [],
            teams: [],
        });
    }
    try {
        const [projects, tasks, users, teams] = await Promise.all([
            prisma_1.prisma.project.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { description: { contains: query, mode: "insensitive" } },
                    ],
                },
                take: 10,
            }),
            prisma_1.prisma.task.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: "insensitive" } },
                        { description: { contains: query, mode: "insensitive" } },
                    ],
                },
                take: 10,
            }),
            prisma_1.prisma.user.findMany({
                where: {
                    username: { contains: query, mode: "insensitive" },
                },
                take: 10,
            }),
            prisma_1.prisma.team.findMany({
                where: {
                    teamName: { contains: query, mode: "insensitive" },
                },
                take: 10,
            }),
        ]);
        return res.json({ projects, tasks, users, teams });
    }
    catch (error) {
        return res.status(500).json({ message: "Error running search", error });
    }
};
exports.searchWorkspace = searchWorkspace;
//# sourceMappingURL=searchController.js.map