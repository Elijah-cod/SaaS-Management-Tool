import type { Task, User } from "@/types";

export const boardColumns = [
  { id: "Backlog", title: "Backlog", accent: "text-slate-950 dark:text-white" },
  {
    id: "In Progress",
    title: "In Progress",
    accent: "text-sky-500 dark:text-sky-300",
  },
  { id: "Review", title: "Review", accent: "text-amber-500 dark:text-amber-300" },
  {
    id: "Completed",
    title: "Completed",
    accent: "text-emerald-500 dark:text-emerald-300",
  },
] as const;

export type ColumnId = (typeof boardColumns)[number]["id"];
export type BoardState = Record<ColumnId, Task[]>;

const validColumnIds = new Set<ColumnId>(
  boardColumns.map((column) => column.id)
);

export const typeColors: Record<string, string> = {
  Feature: "bg-sky-400",
  Infrastructure: "bg-fuchsia-500",
  Bugfix: "bg-rose-500",
  "Design System": "bg-amber-400",
};

export const roleStyles: Record<string, string> = {
  "Product Manager": "bg-sky-100 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300",
  "Frontend Engineer":
    "bg-violet-100 text-violet-700 dark:bg-violet-950/70 dark:text-violet-300",
  Designer: "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300",
  "Operations Lead":
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300",
  default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export const emptyBoard = (): BoardState => ({
  Backlog: [],
  "In Progress": [],
  Review: [],
  Completed: [],
});

export const normalizeTaskStatus = (status?: string): ColumnId => {
  if (status === "Done") {
    return "Completed";
  }

  if (status && validColumnIds.has(status as ColumnId)) {
    return status as ColumnId;
  }

  return "Backlog";
};

export const createBoard = (tasks: Task[]): BoardState => {
  const initialBoard = emptyBoard();

  tasks.forEach((task) => {
    const normalizedStatus = normalizeTaskStatus(task.status);

    initialBoard[normalizedStatus].push({
      ...task,
      status: normalizedStatus,
    });
  });

  return initialBoard;
};

export const flattenBoard = (board: BoardState) => [
  ...board.Backlog,
  ...board["In Progress"],
  ...board.Review,
  ...board.Completed,
];

export const getUserInitials = (user?: User) =>
  user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "NA";
