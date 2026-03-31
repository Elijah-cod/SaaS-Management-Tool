"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeams = void 0;
const prisma_1 = require("../lib/prisma");
const getTeams = async (_req, res) => {
    try {
        const [teams, users] = await Promise.all([
            prisma_1.prisma.team.findMany({
                orderBy: {
                    id: "asc",
                },
            }),
            prisma_1.prisma.user.findMany(),
        ]);
        const serializedTeams = teams.map((team) => ({
            id: team.id,
            name: team.teamName,
            description: "Cross-functional delivery team",
            memberCount: users.filter((user) => user.teamId === team.id).length,
            productOwnerUserId: team.productOwnerUserId,
            projectManagerUserId: team.projectManagerUserId,
        }));
        res.json(serializedTeams);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching teams", error });
    }
};
exports.getTeams = getTeams;
//# sourceMappingURL=teamController.js.map