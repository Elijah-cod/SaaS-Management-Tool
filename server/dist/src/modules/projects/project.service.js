"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProjectRecord = exports.listProjects = void 0;
const prisma_1 = require("../../shared/database/prisma");
const project_serializer_1 = require("./project.serializer");
const listProjects = async () => {
    const projects = await prisma_1.prisma.project.findMany({
        include: {
            tasks: true,
        },
        orderBy: {
            id: "asc",
        },
    });
    return projects.map(project_serializer_1.serializeProject);
};
exports.listProjects = listProjects;
const createProjectRecord = async (input) => {
    const project = await prisma_1.prisma.project.create({
        data: {
            name: input.name,
            description: input.description,
            startDate: input.startDate ? new Date(input.startDate) : null,
            endDate: input.endDate ? new Date(input.endDate) : null,
        },
        include: {
            tasks: true,
        },
    });
    return (0, project_serializer_1.serializeProject)(project);
};
exports.createProjectRecord = createProjectRecord;
//# sourceMappingURL=project.service.js.map