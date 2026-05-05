import { prisma } from "../../shared/database/prisma";
import { serializeProject } from "./project.serializer";

export const listProjects = async () => {
  const projects = await prisma.project.findMany({
    include: {
      tasks: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return projects.map(serializeProject);
};

export const createProjectRecord = async (input: {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const project = await prisma.project.create({
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

  return serializeProject(project);
};
