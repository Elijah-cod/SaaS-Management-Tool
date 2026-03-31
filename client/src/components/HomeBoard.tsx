"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";
import { mockTasks, mockUsers } from "@/lib/mock-data";
import TaskDetailsSheet from "@/components/TaskDetailsSheet";
import {
  useCreateTaskAttachmentMutation,
  useCreateTaskCommentMutation,
  useGetTasksQuery,
  useGetUsersQuery,
  useUpdateTaskAssigneeMutation,
  useUpdateTaskStatusMutation,
} from "@/app/state/api";
import type { Task, User } from "@/types";

const columns = [
  { id: "Backlog", title: "Backlog", accent: "text-slate-950 dark:text-white" },
  { id: "In Progress", title: "In Progress", accent: "text-sky-500 dark:text-sky-300" },
  { id: "Review", title: "Review", accent: "text-amber-500 dark:text-amber-300" },
  { id: "Completed", title: "Completed", accent: "text-emerald-500 dark:text-emerald-300" },
] as const;

type ColumnId = (typeof columns)[number]["id"];
type BoardState = Record<ColumnId, Task[]>;

const validColumnIds = new Set<ColumnId>(columns.map((column) => column.id));

const typeColors: Record<string, string> = {
  Feature: "bg-sky-400",
  Infrastructure: "bg-fuchsia-500",
  Bugfix: "bg-rose-500",
  "Design System": "bg-amber-400",
};

const roleStyles: Record<string, string> = {
  "Product Manager": "bg-sky-100 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300",
  "Frontend Engineer":
    "bg-violet-100 text-violet-700 dark:bg-violet-950/70 dark:text-violet-300",
  Designer: "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300",
  "Operations Lead":
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300",
  default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

const emptyBoard = (): BoardState => ({
  Backlog: [],
  "In Progress": [],
  Review: [],
  Completed: [],
});

const normalizeTaskStatus = (status?: string): ColumnId => {
  if (status === "Done") {
    return "Completed";
  }

  if (status && validColumnIds.has(status as ColumnId)) {
    return status as ColumnId;
  }

  return "Backlog";
};

const createBoard = (tasks: Task[]): BoardState => {
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

const flattenBoard = (board: BoardState) => [
  ...board.Backlog,
  ...board["In Progress"],
  ...board.Review,
  ...board.Completed,
];

const getUserInitials = (user?: User) =>
  user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "NA";

export default function HomeBoard() {
  const { data: taskData = mockTasks } = useGetTasksQuery();
  const { data: users = mockUsers } = useGetUsersQuery();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [updateTaskAssignee] = useUpdateTaskAssigneeMutation();
  const [createTaskComment] = useCreateTaskCommentMutation();
  const [createTaskAttachment] = useCreateTaskAttachmentMutation();

  const [board, setBoard] = useState<BoardState>(() => createBoard(taskData));
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  useEffect(() => {
    setBoard(createBoard(taskData));
  }, [taskData]);

  const selectedTask = useMemo(
    () => flattenBoard(board).find((task) => task.id === selectedTaskId) ?? null,
    [board, selectedTaskId]
  );

  const syncTaskIntoBoard = (updatedTask: Task) => {
    setBoard((currentBoard) => {
      const nextBoard = emptyBoard();

      flattenBoard(currentBoard)
        .filter((task) => task.id !== updatedTask.id)
        .forEach((task) => {
          nextBoard[normalizeTaskStatus(task.status)].push(task);
        });

      nextBoard[normalizeTaskStatus(updatedTask.status)].push({
        ...updatedTask,
        status: normalizeTaskStatus(updatedTask.status),
      });

      return nextBoard;
    });
    setSelectedTaskId(updatedTask.id);
  };

  const handleDragEnd = async ({ source, destination }: DropResult) => {
    if (!destination) {
      return;
    }

    const sourceColumnId = normalizeTaskStatus(source.droppableId);
    const destinationColumnId = normalizeTaskStatus(destination.droppableId);

    if (
      sourceColumnId === destinationColumnId &&
      source.index === destination.index
    ) {
      return;
    }

    let movedTaskId: number | null = null;

    setBoard((currentBoard) => {
      const sourceItems = [...currentBoard[sourceColumnId]];
      const destinationItems =
        sourceColumnId === destinationColumnId
          ? sourceItems
          : [...currentBoard[destinationColumnId]];

      const [movedTask] = sourceItems.splice(source.index, 1);

      if (!movedTask) {
        return currentBoard;
      }

      movedTaskId = movedTask.id;
      const updatedTask = { ...movedTask, status: destinationColumnId };
      destinationItems.splice(destination.index, 0, updatedTask);

      return {
        ...currentBoard,
        [sourceColumnId]: sourceItems,
        [destinationColumnId]: destinationItems,
      };
    });

    if (movedTaskId == null) {
      return;
    }

    try {
      const updatedTask = await updateTaskStatus({
        taskId: movedTaskId,
        status: destinationColumnId,
      }).unwrap();
      syncTaskIntoBoard(updatedTask);
    } catch (error) {
      console.error("Failed to persist task status", error);
      setBoard(createBoard(taskData));
    }
  };

  const handleTaskChange = async (updatedTask: Task) => {
    const previousTask =
      flattenBoard(board).find((task) => task.id === updatedTask.id) ?? updatedTask;

    syncTaskIntoBoard(updatedTask);

    try {
      if (updatedTask.status !== previousTask.status) {
        const persistedTask = await updateTaskStatus({
          taskId: updatedTask.id,
          status: updatedTask.status,
        }).unwrap();
        syncTaskIntoBoard(persistedTask);
        return;
      }

      if ((updatedTask.assigneeId ?? null) !== (previousTask.assigneeId ?? null)) {
        const persistedTask = await updateTaskAssignee({
          taskId: updatedTask.id,
          assigneeId: updatedTask.assigneeId ?? null,
        }).unwrap();
        syncTaskIntoBoard(persistedTask);
        return;
      }

      if ((updatedTask.comments?.length ?? 0) > (previousTask.comments?.length ?? 0)) {
        const nextComment = updatedTask.comments?.at(-1);
        if (nextComment) {
          const persistedTask = await createTaskComment({
            taskId: updatedTask.id,
            authorId: nextComment.authorId,
            body: nextComment.body,
          }).unwrap();
          syncTaskIntoBoard(persistedTask);
        }
        return;
      }

      if (
        (updatedTask.attachments?.length ?? 0) >
        (previousTask.attachments?.length ?? 0)
      ) {
        const nextAttachment = updatedTask.attachments?.at(-1);
        if (nextAttachment) {
          const persistedTask = await createTaskAttachment({
            taskId: updatedTask.id,
            attachment: {
              name: nextAttachment.name,
              sizeLabel: nextAttachment.sizeLabel,
              addedById: nextAttachment.addedById,
            },
          }).unwrap();
          syncTaskIntoBoard(persistedTask);
        }
      }
    } catch (error) {
      console.error("Failed to persist task change", error);
      setBoard(createBoard(taskData));
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {columns.map((column) => (
            <div
              key={column.id}
              className="min-w-0 rounded-[2rem] border border-white/60 bg-white/70 p-4 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.25)] backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/75 md:p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className={`text-2xl font-bold tracking-tight ${column.accent}`}>
                  {column.title}
                </h3>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                  {board[column.id].length}
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-24 space-y-4 rounded-[1.75rem] p-1 transition ${
                      snapshot.isDraggingOver
                        ? "bg-sky-50/80 dark:bg-sky-950/30"
                        : "bg-transparent"
                    }`}
                  >
                    {board[column.id].map((task, index) => {
                      const assignees = (task.assigneeIds ?? [])
                        .map((id) => users.find((user) => user.id === id))
                        .filter((user): user is User => Boolean(user));
                      const creator = users.find((user) => user.id === task.createdById);

                      return (
                        <Draggable
                          key={task.id}
                          draggableId={String(task.id)}
                          index={index}
                        >
                          {(dragProvided, dragSnapshot) => (
                            <article
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              className={`rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_36px_-20px_rgba(15,23,42,0.28)] transition dark:border-slate-800 dark:bg-slate-950/90 ${
                                dragSnapshot.isDragging
                                  ? "rotate-[1.5deg] shadow-[0_24px_50px_-18px_rgba(14,165,233,0.45)]"
                                  : ""
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <button
                                  type="button"
                                  onClick={() => setSelectedTaskId(task.id)}
                                  className="flex-1 space-y-4 text-left"
                                >
                                  <div className="flex flex-wrap items-center gap-3">
                                    <span
                                      className={`h-5 w-5 rounded-md ${
                                        typeColors[task.type ?? ""] ?? "bg-slate-400"
                                      }`}
                                    />
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                      {task.type ?? "Task"}
                                    </span>
                                    {creator && (
                                      <span
                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                          roleStyles[creator.role ?? "default"] ??
                                          roleStyles.default
                                        }`}
                                      >
                                        Added by {creator.role}
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="text-lg font-semibold leading-tight text-slate-950 dark:text-white sm:text-xl">
                                    {task.title}
                                  </h4>
                                  <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    {task.description}
                                  </p>
                                </button>

                                <button
                                  type="button"
                                  {...dragProvided.dragHandleProps}
                                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                  aria-label={`Drag ${task.title}`}
                                >
                                  <GripVertical size={18} />
                                </button>
                              </div>

                              <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
                                <div className="mb-3 flex flex-wrap gap-2">
                                  {assignees.map((user) => (
                                    <span
                                      key={`${task.id}-${user.id}-role`}
                                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                        roleStyles[user.role ?? "default"] ??
                                        roleStyles.default
                                      }`}
                                    >
                                      {user.role}
                                    </span>
                                  ))}
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-sm font-semibold tracking-wide text-slate-400 dark:text-slate-500">
                                    {task.ticket ?? `TASK-${task.id}`}
                                  </span>
                                  <div className="flex -space-x-2">
                                    {assignees.map((user, avatarIndex) => (
                                      <span
                                        key={`${task.id}-${user.id}`}
                                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-sm font-bold text-slate-900 dark:border-slate-950 ${
                                          avatarIndex % 3 === 0
                                            ? "bg-amber-300"
                                            : avatarIndex % 3 === 1
                                              ? "bg-sky-400"
                                              : "bg-fuchsia-400"
                                        }`}
                                        title={user.name ?? user.email}
                                      >
                                        {getUserInitials(user)}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </article>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <TaskDetailsSheet
        isOpen={Boolean(selectedTask)}
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
        onTaskChange={handleTaskChange}
      />
    </>
  );
}
