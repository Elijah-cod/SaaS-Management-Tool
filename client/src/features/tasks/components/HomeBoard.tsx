"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { AlertCircle, GripVertical, Plus, X } from "lucide-react";
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
  type BoardState,
  type ColumnId,
  typeColors,
} from "@/features/tasks/lib/task-board";
import { useGetUsersQuery } from "@/features/workspace/api/workspaceApi";
import type { Task, User } from "@/types";
import { DataState, LoadingRows, StatusChip } from "@/shared/ui/primitives";

export default function HomeBoard() {
  const { data: session, status } = useSession();
  const sessionReady =
    status === "authenticated" && Boolean(session?.accessToken);
  const tasksQuery = useGetTasksQuery(undefined, {
    skip: !sessionReady,
  });
  const usersQuery = useGetUsersQuery(undefined, {
    skip: !sessionReady,
  });
  const projectsQuery = useGetProjectsQuery(undefined, {
    skip: !sessionReady,
  });
  const taskData = tasksQuery.data;
  const usersData = usersQuery.data;
  const projectsData = projectsQuery.data;
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
      setCreateTaskError("The task could not be created. Check the API connection and try again.");
    } finally {
      setIsCreatingTask(false);
    }
  };

  if (status === "loading") {
    return <LoadingRows count={4} />;
  }

  if (status === "authenticated" && !session?.accessToken) {
    return (
      <DataState
        icon={AlertCircle}
        tone="warning"
        title="Workspace session is not ready"
        description="Your account is signed in, but its API token is missing. Sign out and sign in again to restore task access."
      />
    );
  }

  if (!sessionReady) {
    return (
      <DataState
        icon={AlertCircle}
        tone="warning"
        title="Sign-in required"
        description="Sign in to load live projects and move tasks across the board."
      />
    );
  }

  if (tasksQuery.isLoading || usersQuery.isLoading || projectsQuery.isLoading) {
    return <LoadingRows count={5} />;
  }

  if (tasksQuery.isError || usersQuery.isError || projectsQuery.isError) {
    return (
      <DataState
        icon={AlertCircle}
        tone="danger"
        title="The delivery board is unavailable"
        description="The workspace API did not return all required board data. Check the service connection and retry."
        action={
          <button
            type="button"
            onClick={() => {
              tasksQuery.refetch();
              usersQuery.refetch();
              projectsQuery.refetch();
            }}
            className="ui-button-secondary"
          >
            Retry
          </button>
        }
      />
    );
  }

  return (
    <>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Task board
          </h3>
          <p className="mt-1 text-xs text-[var(--muted)]">Drag tasks between lanes to update delivery status.</p>
        </div>
        <button
          type="button"
          disabled={projects.length === 0}
          onClick={() => setIsComposerOpen((current) => !current)}
          className={isComposerOpen ? "ui-button-secondary" : "ui-button-primary"}
        >
          {isComposerOpen ? <X size={15} /> : <Plus size={15} />}
          {isComposerOpen ? "Close" : "New task"}
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          <p className="font-semibold">Create a project before adding tasks.</p>
          <p className="mt-1">
            This workspace does not have any projects yet, so new tasks do not
            have a valid destination.
          </p>
          <Link
            href="/projects"
            className="ui-button-secondary mt-3"
          >
            Go to Projects
          </Link>
        </div>
      ) : null}

      {isComposerOpen && projects.length > 0 ? (
        <form
          onSubmit={handleCreateTask}
          className="ui-panel mb-4 grid gap-4 p-4 md:grid-cols-2"
        >
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-sm font-semibold">
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
              className="ui-field"
              placeholder="Add a clear task title"
              required
            />
          </label>
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-sm font-semibold">
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
              className="ui-field min-h-24 resize-y"
              placeholder="Capture the outcome, context, or handoff notes"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-semibold">
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
              className="ui-field"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-semibold">
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
              className="ui-field"
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name ?? user.email}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-semibold">
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
              className="ui-field"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-semibold">
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
              className="ui-field"
            >
              <option>Feature</option>
              <option>Bugfix</option>
              <option>Design System</option>
              <option>Infrastructure</option>
            </select>
          </label>
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-sm font-semibold">
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
              className="ui-field"
            />
          </label>
          {createTaskError ? (
            <p className="text-sm font-medium text-[var(--danger)] md:col-span-2" role="alert">
              {createTaskError}
            </p>
          ) : null}
          <div className="flex flex-col gap-2 md:col-span-2 md:flex-row md:justify-end">
            <button
              type="button"
              onClick={() => setIsComposerOpen(false)}
              className="ui-button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingTask}
              className="ui-button-primary"
            >
              {isCreatingTask ? "Creating..." : "Create task"}
            </button>
          </div>
        </form>
      ) : null}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="-mx-1 overflow-x-auto pb-2" aria-label="Task status board">
          <div className="grid auto-cols-[minmax(17rem,1fr)] grid-flow-col gap-3 px-1 md:grid-flow-row md:auto-cols-auto md:grid-cols-2 xl:grid-cols-4">
            {boardColumns.map((column) => (
              <div
                key={column.id}
                className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-2"
              >
                <div className="flex items-center justify-between px-1.5 py-1.5">
                  <h3 className="text-xs font-semibold text-[var(--muted-strong)]">
                    {column.title}
                  </h3>
                  <span className="min-w-6 rounded-md bg-[var(--surface-strong)] px-1.5 py-0.5 text-center text-[11px] font-semibold tabular-nums text-[var(--muted)]">
                    {board[column.id].length}
                  </span>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-28 space-y-2 rounded-lg p-1 ${
                        snapshot.isDraggingOver
                          ? "bg-[var(--accent-soft)]"
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
                                className={`rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 ${
                                  dragSnapshot.isDragging
                                    ? "border-[var(--accent)] shadow-[0_16px_36px_-20px_rgb(15_23_42_/_0.45)]"
                                    : ""
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedTaskId(task.id)}
                                    className="min-w-0 flex-1 text-left"
                                  >
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span
                                        className={`h-2 w-2 rounded-sm ${
                                          typeColors[task.type ?? ""] ?? "bg-slate-400"
                                        }`}
                                        aria-hidden="true"
                                      />
                                      <span className="text-[11px] font-medium text-[var(--muted)]">
                                        {task.ticket ?? `TASK-${task.id}`}
                                      </span>
                                      <StatusChip
                                        label={task.priority ?? "Medium"}
                                        tone={task.priority?.toLowerCase() === "high" ? "warning" : "neutral"}
                                      />
                                    </div>
                                    <h4 className="mt-2 text-sm font-semibold leading-5 text-[var(--foreground)]">
                                      {task.title}
                                    </h4>
                                    {task.description ? (
                                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--muted)]">
                                        {task.description}
                                      </p>
                                    ) : null}
                                  </button>

                                  <button
                                    type="button"
                                    {...dragProvided.dragHandleProps}
                                    className="rounded-md p-1.5 text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
                                    aria-label={`Drag ${task.title}`}
                                  >
                                    <GripVertical size={18} />
                                  </button>
                                </div>

                                <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-2.5">
                                  <span className="truncate text-[11px] text-[var(--muted)]">
                                    {creator ? `Added by ${creator.name ?? creator.email}` : task.type ?? "Task"}
                                  </span>
                                  <div className="flex -space-x-1">
                                      {assignees.map((user) => (
                                        <span
                                          key={`${task.id}-${user.id}`}
                                          className="flex h-6 w-6 items-center justify-center rounded-md border border-[var(--surface)] bg-[var(--surface-strong)] text-[9px] font-bold text-[var(--muted-strong)]"
                                          title={user.name ?? user.email}
                                        >
                                          {getUserInitials(user)}
                                        </span>
                                      ))}
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
