"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTeams = void 0;
const prisma_1 = require("../../shared/database/prisma");
const listTeams = async () => {
    const [teams, users] = await Promise.all([
        prisma_1.prisma.team.findMany({
            orderBy: {
                id: "asc",
            },
        }),
        prisma_1.prisma.user.findMany(),
    ]);
    return teams.map((team) => ({
        id: team.id,
        name: team.teamName,
        description: "Cross-functional delivery team",
        memberCount: users.filter((user) => user.teamId === team.id).length,
        productOwnerUserId: team.productOwnerUserId,
        projectManagerUserId: team.projectManagerUserId,
    }));
};
exports.listTeams = listTeams;
//# sourceMappingURL=team.service.js.map