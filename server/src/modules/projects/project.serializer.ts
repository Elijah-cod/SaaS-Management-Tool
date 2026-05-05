type ProjectRecord = {
  id: number;
  name: string;
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
  tasks: Array<{
    priority: string | null;
    status: string | null;
  }>;
};

const completedTaskStatuses = new Set(["done", "completed"]);

export const deriveProjectStatus = (
  startDate: Date | null,
  endDate: Date | null
) => {
  const now = new Date();

  if (endDate && endDate < now) {
    return "Completed";
  }

  if (startDate && startDate > now) {
    return "Planning";
  }

  return "In Progress";
};

export const serializeProject = (project: ProjectRecord) => {
  const taskCount = project.tasks.length;
  const completedTasks = project.tasks.filter((task) =>
    completedTaskStatuses.has(task.status?.toLowerCase() ?? "")
  ).length;
  const progress =
    taskCount === 0 ? 0 : Math.round((completedTasks / taskCount) * 100);

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
};
