"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchWorkspaceResources = void 0;
const prisma_1 = require("../../shared/database/prisma");
const project_serializer_1 = require("../projects/project.serializer");
const task_serializer_1 = require("../tasks/task.serializer");
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
    const [projects, tasks, users, teams, workspaceUsers] = await Promise.all([
        prisma_1.prisma.project.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
            },
            take: 10,
            include: { tasks: true },
        }),
        prisma_1.prisma.task.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
            },
            take: 10,
            include: task_serializer_1.taskDetailInclude,
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
        prisma_1.prisma.user.findMany({
            select: { teamId: true },
        }),
    ]);
    return {
        projects: projects.map(project_serializer_1.serializeProject),
        tasks: tasks.map(task_serializer_1.serializeTask),
        users: users.map((user) => ({
            id: `u${user.userId}`,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.profilePictureUrl,
            teamId: user.teamId,
        })),
        teams: teams.map((team) => ({
            id: team.id,
            name: team.teamName,
            description: "Cross-functional delivery team",
            memberCount: workspaceUsers.filter((user) => user.teamId === team.id).length,
            productOwnerUserId: team.productOwnerUserId,
            projectManagerUserId: team.projectManagerUserId,
        })),
    };
};
exports.searchWorkspaceResources = searchWorkspaceResources;
//# sourceMappingURL=search.service.js.map