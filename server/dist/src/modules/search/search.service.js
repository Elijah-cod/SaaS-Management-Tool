"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchWorkspaceResources = void 0;
const prisma_1 = require("../../shared/database/prisma");
const normalizeQuery = (query) => query.trim().slice(0, 120);
const searchWorkspaceResources = async (rawQuery) => {
    const query = normalizeQuery(rawQuery);
    if (!query) {
        return {
            projects: [],
            tasks: [],
            users: [],
            teams: [],
        };
    }
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
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { email: { contains: query, mode: "insensitive" } },
                ],
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
    return { projects, tasks, users, teams };
};
exports.searchWorkspaceResources = searchWorkspaceResources;
//# sourceMappingURL=search.service.js.map