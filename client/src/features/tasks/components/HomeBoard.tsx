"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { GripVertical, Plus } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useGetProjectsQuery } from "@/features/projects/api/projectsApi";
import TaskDetailsSheet from "@/features/tasks/components/TaskDetailsSheet";
import {
  useCreateTaskAttachmentMutation,
  useCreateTaskCommentMutation,
  useCreateTaskMutation,
  useGetTasksQuery,
  useUpdateTaskAssigneeMutation,
  useUpdateTaskStatusMutation,
} from "@/features/tasks/api/tasksApi";
import {
  boardColumns,
  createBoard,
  emptyBoard,
  flattenBoard,
  getUserInitials,
  normalizeTaskStatus,
  roleStyles,
  type BoardState,
  type ColumnId,
  typeColors,
} from "@/features/tasks/lib/task-board";
import { useGetUsersQuery } from "@/features/workspace/api/workspaceApi";
import type { Task, User } from "@/types";

export default function HomeBoard() {
  const { data: session, status } = useSession();
  const sessionReady =
    status === "authenticated" && Boolean(session?.accessToken);
  const { data: taskData } = useGetTasksQuery(undefined, {
    skip: !sessionReady,
  });
  const { data: usersData } = useGetUsersQuery(undefined, {
    skip: !sessionReady,
  });
  const { data: projectsData } = useGetProjectsQuery(undefined, {
    skip: !sessionReady,
  });
  const users = useMemo(() => usersData ?? [], [usersData]);
  const projects = useMemo(() => projectsData ?? [], [projectsData]);
  const [createTask] = useCreateTaskMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [updateTaskAssignee] = useUpdateTaskAssigneeMutation();
  const [createTaskComment] = useCreateTaskCommentMutation();
  const [createTaskAttachment] = useCreateTaskAttachmentMutation();

  const [board, setBoard] = useState<BoardState>(emptyBoard);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [createTaskError, setCreateTaskError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    projectId: 0,
    priority: "Medium",
    assigneeId: "",
    dueDate: "",
    type: "Feature",
  });

  useEffect(() => {
    if (taskData) {
      setBoard(createBoard(taskData));
    }
  }, [taskData]);

  useEffect(() => {
    if (projects.length > 0 && newTask.projectId === 0) {
      setNewTask((current) => ({
        ...current,
        projectId: projects[0].id,
      }));
    }
  }, [newTask.projectId, projects]);

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

  const updateTaskInBoard = (updatedTask: Task) => {
    setBoard((currentBoard) => {
      for (const colId of Object.keys(currentBoard) as ColumnId[]) {
        const taskIndex = currentBoard[colId].findIndex((task) => task.id === updatedTask.id);

        if (taskIndex !== -1) {
          const updatedColumn = [...currentBoard[colId]];
          updatedColumn[taskIndex] = { ...updatedTask, status: colId };

          return { ...currentBoard, [colId]: updatedColumn };
        }
      }

      const targetColumnId = normalizeTaskStatus(updatedTask.status);

      return {
        ...currentBoard,
        [targetColumnId]: [
          ...currentBoard[targetColumnId],
          { ...updatedTask, status: targetColumnId },
        ],
      };
    });
    setSelectedTaskId(updatedTask.id);
  };

  const handleDragEnd = async ({ source, destination }: DropResult) => {
    if (!sessionReady || !taskData || !destination) {
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
      destinationItems.splice(destination.index, 0, {
        ...movedTask,
        status: destinationColumnId,
      });

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

      updateTaskInBoard(updatedTask);
    } catch (error) {
      console.error("Failed to persist task status", error);
      setBoard(createBoard(taskData));
    }
  };

  const handleTaskChange = async (updatedTask: Task) => {
    if (!sessionReady || !taskData) {
      return;
    }

    const previousTask =
      flattenBoard(board).find((task) => task.id === updatedTask.id) ?? updatedTask;

    try {
      if (updatedTask.status !== previousTask.status) {
        syncTaskIntoBoard(updatedTask);
        const persistedTask = await updateTaskStatus({
          taskId: updatedTask.id,
          status: updatedTask.status,
        }).unwrap();
        syncTaskIntoBoard(persistedTask);
        return;
      }

      if ((updatedTask.assigneeId ?? null) !== (previousTask.assigneeId ?? null)) {
        updateTaskInBoard(updatedTask);
        const persistedTask = await updateTaskAssignee({
          taskId: updatedTask.id,
          assigneeId: updatedTask.assigneeId ?? null,
        }).unwrap();
        updateTaskInBoard(persistedTask);
        return;
      }

      if ((updatedTask.comments?.length ?? 0) > (previousTask.comments?.length ?? 0)) {
        updateTaskInBoard(updatedTask);
        const nextComment = updatedTask.comments?.at(-1);

        if (nextComment) {
          const persistedTask = await createTaskComment({
            taskId: updatedTask.id,
            authorId: nextComment.authorId,
            body: nextComment.body,
          }).unwrap();
          updateTaskInBoard(persistedTask);
        }
        return;
      }

      if (
        (updatedTask.attachments?.length ?? 0) >
        (previousTask.attachments?.length ?? 0)
      ) {
        updateTaskInBoard(updatedTask);
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
          updateTaskInBoard(persistedTask);
        }
      }
    } catch (error) {
      console.error("Failed to persist task change", error);
      setBoard(createBoard(taskData));
    }
  };

  const handleCreateTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!sessionReady || !newTask.title.trim() || !newTask.projectId) {
      return;
    }

    setIsCreatingTask(true);
    setCreateTaskError(null);

    try {
      const createdTask = await createTask({
        title: newTask.title.trim(),
        description: newTask.description.trim() || undefined,
        projectId: newTask.projectId,
        priority: newTask.priority,
        assigneeId: newTask.assigneeId || null,
        dueDate: newTask.dueDate
          ? new Date(`${newTask.dueDate}T00:00:00.000Z`).toISOString()
          : null,
        status: "Backlog",
        type: newTask.type,
      }).unwrap();

      syncTaskIntoBoard(createdTask);
      setIsComposerOpen(false);
      setNewTask((current) => ({
        ...current,
        title: "",
        description: "",
        assigneeId: "",
        dueDate: "",
        type: "Feature",
      }));
    } catch (error) {
      console.error("Failed to create task", error);
      setCreateTaskError("We couldn't create that task. Please try again.");
    } finally {
      setIsCreatingTask(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="rounded-[2rem] border border-white/60 bg-white/70 p-8 text-sm text-slate-500 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.25)] backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/75 dark:text-slate-300">
        Syncing your workspace session...
      </div>
    );
  }

  if (status === "authenticated" && !session?.accessToken) {
    return (
      <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 text-sm text-amber-900 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.25)] dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
        Your dashboard session is active, but the API token has not finished syncing yet. Refresh once, or sign in again if task updates stay locked.
      </div>
    );
  }

  if (!sessionReady) {
    return (
      <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 text-sm text-amber-900 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.25)] dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
        Sign in to load live projects and move tasks across the board.
      </div>
    );
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 rounded-[2rem] border border-white/60 bg-white/70 p-4 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.2)] backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/75 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Weekly execution
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Move work forward and add new tasks without leaving the board.
          </h3>
        </div>
        <button
          type="button"
          disabled={projects.length === 0}
          onClick={() => setIsComposerOpen((current) => !current)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <Plus size={16} />
          New task
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="mb-6 rounded-[2rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-semibold">Create a project before adding tasks.</p>
          <p className="mt-1">
            This workspace does not have any projects yet, so new tasks do not
            have a valid destination.
          </p>
          <Link
            href="/projects"
            className="mt-3 inline-flex items-center rounded-full border border-amber-300 px-4 py-2 font-semibold transition hover:bg-amber-100 dark:border-amber-800 dark:hover:bg-amber-900/40"
          >
            Go to Projects
          </Link>
        </div>
      ) : null}

      {isComposerOpen && projects.length > 0 ? (
        <form
          onSubmit={handleCreateTask}
          className="mb-6 grid gap-4 rounded-[2rem] border border-white/60 bg-white/80 p-5 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.25)] backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/75 md:grid-cols-2"
        >
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Task title
            </span>
            <input
              value={newTask.title}
              onChange={(event) =>
                setNewTask((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              className="w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              placeholder="Add a clear task title"
              required
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Description
            </span>
            <textarea
              value={newTask.description}
              onChange={(event) =>
                setNewTask((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className="min-h-28 w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              placeholder="Capture the outcome, context, or handoff notes"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Project
            </span>
            <select
              value={newTask.projectId}
              onChange={(event) =>
                setNewTask((current) => ({
                  ...current,
                  projectId: Number(event.target.value),
                }))
              }
              className="w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Assignee
            </span>
            <select
              value={newTask.assigneeId}
              onChange={(event) =>
                setNewTask((current) => ({
                  ...current,
                  assigneeId: event.target.value,
                }))
              }
              className="w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name ?? user.email}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Priority
            </span>
            <select
              value={newTask.priority}
              onChange={(event) =>
                setNewTask((current) => ({
                  ...current,
                  priority: event.target.value,
                }))
              }
              className="w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Type
            </span>
            <select
              value={newTask.type}
              onChange={(event) =>
                setNewTask((current) => ({
                  ...current,
                  type: event.target.value,
                }))
              }
              className="w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option>Feature</option>
              <option>Bugfix</option>
              <option>Design System</option>
              <option>Infrastructure</option>
            </select>
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Due date
            </span>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(event) =>
                setNewTask((current) => ({
                  ...current,
                  dueDate: event.target.value,
                }))
              }
              className="w-full rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          {createTaskError ? (
            <p className="text-sm font-medium text-rose-600 dark:text-rose-300 md:col-span-2">
              {createTaskError}
            </p>
          ) : null}
          <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:justify-end">
            <button
              type="button"
              onClick={() => setIsComposerOpen(false)}
              className="rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingTask}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              {isCreatingTask ? "Creating..." : "Create task"}
            </button>
          </div>
        </form>
      ) : null}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="-mx-1 overflow-x-auto pb-2">
          <div className="grid auto-cols-[minmax(18rem,1fr)] grid-flow-col gap-4 px-1 md:grid-flow-row md:auto-cols-auto md:grid-cols-2 xl:grid-cols-4">
            {boardColumns.map((column) => (
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
                          .map((assigneeId) => users.find((user) => user.id === assigneeId))
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
                                      {creator ? (
                                        <span
                                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                            roleStyles[creator.role ?? "default"] ??
                                            roleStyles.default
                                          }`}
                                        >
                                          Added by {creator.role}
                                        </span>
                                      ) : null}
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
        </div>
      </DragDropContext>

      <TaskDetailsSheet
        isOpen={Boolean(selectedTask)}
        task={selectedTask}
        currentUserId={session?.user.id ?? null}
        onClose={() => setSelectedTaskId(null)}
        onTaskChange={handleTaskChange}
      />
    </>
  );
}
